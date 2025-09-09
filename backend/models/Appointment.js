const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID is required']
  },
  practitionerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Practitioner',
    required: [true, 'Practitioner ID is required']
  },
  therapyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Therapy',
    required: [true, 'Therapy ID is required']
  },
  dateTime: {
    type: Date,
    required: [true, 'Appointment date and time is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Appointment time must be in the future'
    }
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    min: [15, 'Minimum duration is 15 minutes']
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show', 'rescheduled'],
    default: 'scheduled'
  },
  sessionNumber: {
    type: Number,
    default: 1,
    min: [1, 'Session number must be at least 1']
  },
  totalSessions: {
    type: Number,
    default: 1,
    min: [1, 'Total sessions must be at least 1']
  },
  notes: {
    practitioner: {
      type: String,
      trim: true
    },
    patient: {
      type: String,
      trim: true
    },
    admin: {
      type: String,
      trim: true
    }
  },
  pricing: {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR'
    },
    discountApplied: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative']
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  remindersSent: {
    email24h: { type: Boolean, default: false },
    email2h: { type: Boolean, default: false },
    sms1h: { type: Boolean, default: false }
  },
  feedback: {
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, 'Feedback cannot exceed 500 characters']
    },
    submittedAt: {
      type: Date
    }
  },
  reschedulingHistory: [{
    originalDateTime: Date,
    newDateTime: Date,
    reason: String,
    rescheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rescheduledAt: Date
  }],
  cancellationReason: {
    type: String,
    trim: true
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes
appointmentSchema.index({ patientId: 1, dateTime: -1 });
appointmentSchema.index({ practitionerId: 1, dateTime: 1 });
appointmentSchema.index({ therapyId: 1 });
appointmentSchema.index({ dateTime: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ paymentStatus: 1 });

// Compound index for conflict checking
appointmentSchema.index({ practitionerId: 1, dateTime: 1, status: 1 });

// Virtual for end time
appointmentSchema.virtual('endTime').get(function() {
  return new Date(this.dateTime.getTime() + this.duration * 60000);
});

// Virtual for formatted date time
appointmentSchema.virtual('formattedDateTime').get(function() {
  return this.dateTime.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Virtual for time until appointment
appointmentSchema.virtual('timeUntilAppointment').get(function() {
  const now = new Date();
  const diffMs = this.dateTime.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 0) return 'Past';
  if (diffHours === 0) return 'Now';
  if (diffHours < 24) return `${diffHours} hours`;
  
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} days`;
});

// Pre-save middleware for validation
appointmentSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('dateTime') || this.isModified('practitionerId')) {
    // Check for practitioner conflicts
    const conflicts = await this.constructor.find({
      _id: { $ne: this._id },
      practitionerId: this.practitionerId,
      status: { $in: ['scheduled', 'confirmed', 'in-progress'] },
      $or: [
        {
          dateTime: {
            $lt: new Date(this.dateTime.getTime() + this.duration * 60000),
            $gte: this.dateTime
          }
        },
        {
          $expr: {
            $and: [
              { $lte: ['$dateTime', this.dateTime] },
              { $gt: [{ $add: ['$dateTime', { $multiply: ['$duration', 60000] }] }, this.dateTime] }
            ]
          }
        }
      ]
    });

    if (conflicts.length > 0) {
      return next(new Error('Practitioner has a conflicting appointment at this time'));
    }
  }
  
  next();
});

// Static method to find appointments by date range
appointmentSchema.statics.findByDateRange = function(startDate, endDate, filters = {}) {
  const query = {
    dateTime: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    },
    ...filters
  };
  
  return this.find(query)
    .populate('patientId', 'firstName lastName phone')
    .populate('practitionerId', 'firstName lastName specializations')
    .populate('therapyId', 'name duration')
    .sort({ dateTime: 1 });
};

// Static method to check practitioner availability
appointmentSchema.statics.checkPractitionerAvailability = function(practitionerId, dateTime, duration) {
  const endTime = new Date(dateTime.getTime() + duration * 60000);
  
  return this.find({
    practitionerId,
    status: { $in: ['scheduled', 'confirmed', 'in-progress'] },
    $or: [
      {
        dateTime: { $lt: endTime, $gte: dateTime }
      },
      {
        $expr: {
          $and: [
            { $lte: ['$dateTime', dateTime] },
            { $gt: [{ $add: ['$dateTime', { $multiply: ['$duration', 60000] }] }, dateTime] }
          ]
        }
      }
    ]
  });
};

// Instance method to reschedule appointment
appointmentSchema.methods.reschedule = function(newDateTime, reason, rescheduledBy) {
  // Add to rescheduling history
  this.reschedulingHistory.push({
    originalDateTime: this.dateTime,
    newDateTime: newDateTime,
    reason: reason,
    rescheduledBy: rescheduledBy,
    rescheduledAt: new Date()
  });
  
  // Update the appointment
  this.dateTime = newDateTime;
  this.status = 'scheduled';
  
  // Reset reminders
  this.remindersSent = {
    email24h: false,
    email2h: false,
    sms1h: false
  };
  
  return this.save();
};

// Instance method to cancel appointment
appointmentSchema.methods.cancel = function(reason, cancelledBy) {
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancelledBy = cancelledBy;
  this.cancelledAt = new Date();
  
  return this.save();
};

// Instance method to complete appointment
appointmentSchema.methods.complete = function(practitionerNotes) {
  this.status = 'completed';
  if (practitionerNotes) {
    this.notes.practitioner = practitionerNotes;
  }
  
  return this.save();
};

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;

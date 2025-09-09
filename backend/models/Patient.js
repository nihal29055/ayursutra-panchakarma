const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required'],
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'Date of birth cannot be in the future'
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
    required: [true, 'Gender is required']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  alternatePhone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'India'
    }
  },
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required'],
      trim: true
    },
    relationship: {
      type: String,
      required: [true, 'Relationship to emergency contact is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
      trim: true,
      match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
    }
  },
  medicalHistory: {
    allergies: [{
      allergen: {
        type: String,
        required: true,
        trim: true
      },
      severity: {
        type: String,
        enum: ['mild', 'moderate', 'severe'],
        default: 'moderate'
      },
      notes: {
        type: String,
        trim: true
      }
    }],
    currentConditions: [{
      condition: {
        type: String,
        required: true,
        trim: true
      },
      diagnosedDate: {
        type: Date
      },
      status: {
        type: String,
        enum: ['active', 'resolved', 'managed'],
        default: 'active'
      },
      notes: {
        type: String,
        trim: true
      }
    }],
    medications: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      dosage: {
        type: String,
        trim: true
      },
      frequency: {
        type: String,
        trim: true
      },
      startDate: {
        type: Date
      },
      endDate: {
        type: Date
      },
      prescribedBy: {
        type: String,
        trim: true
      },
      notes: {
        type: String,
        trim: true
      }
    }],
    surgicalHistory: [{
      procedure: {
        type: String,
        required: true,
        trim: true
      },
      date: {
        type: Date,
        required: true
      },
      hospital: {
        type: String,
        trim: true
      },
      notes: {
        type: String,
        trim: true
      }
    }],
    familyHistory: [{
      condition: {
        type: String,
        required: true,
        trim: true
      },
      relationship: {
        type: String,
        required: true,
        trim: true
      },
      notes: {
        type: String,
        trim: true
      }
    }]
  },
  ayurvedicProfile: {
    constitution: {
      vata: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      pitta: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      kapha: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      }
    },
    currentImbalance: {
      type: String,
      enum: ['vata', 'pitta', 'kapha', 'mixed', 'balanced'],
      default: 'balanced'
    },
    pulseReading: {
      type: String,
      trim: true
    },
    tongueExamination: {
      type: String,
      trim: true
    },
    lastAssessmentDate: {
      type: Date
    },
    assessedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Practitioner'
    }
  },
  preferences: {
    preferredPractitioner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Practitioner'
    },
    preferredTimeSlots: [{
      type: String,
      enum: ['morning', 'afternoon', 'evening']
    }],
    languagePreference: {
      type: String,
      default: 'english'
    },
    communicationMethod: {
      type: String,
      enum: ['email', 'sms', 'phone', 'in-app'],
      default: 'email'
    },
    dietaryRestrictions: [{
      type: String,
      trim: true
    }]
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  notes: {
    type: String,
    trim: true
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
patientSchema.index({ userId: 1 });
patientSchema.index({ firstName: 1, lastName: 1 });
patientSchema.index({ phone: 1 });
patientSchema.index({ status: 1 });
patientSchema.index({ createdAt: -1 });

// Virtual for full name
patientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
patientSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for dominant constitution
patientSchema.virtual('dominantConstitution').get(function() {
  const { vata, pitta, kapha } = this.ayurvedicProfile.constitution;
  
  if (vata >= pitta && vata >= kapha) return 'vata';
  if (pitta >= vata && pitta >= kapha) return 'pitta';
  return 'kapha';
});

// Pre-save middleware to validate constitution percentages
patientSchema.pre('save', function(next) {
  const { vata, pitta, kapha } = this.ayurvedicProfile.constitution;
  const total = vata + pitta + kapha;
  
  if (total > 0 && Math.abs(total - 100) > 5) {
    return next(new Error('Constitution percentages should sum to approximately 100%'));
  }
  
  next();
});

// Static method to find patients by practitioner
patientSchema.statics.findByPractitioner = function(practitionerId) {
  return this.find({
    'preferences.preferredPractitioner': practitionerId,
    status: 'active'
  }).populate('userId', 'email lastLogin');
};

// Instance method to get upcoming appointments
patientSchema.methods.getUpcomingAppointments = function() {
  const Appointment = mongoose.model('Appointment');
  return Appointment.find({
    patientId: this._id,
    dateTime: { $gte: new Date() },
    status: { $in: ['scheduled', 'confirmed'] }
  }).sort({ dateTime: 1 }).populate('therapyId practitionerId');
};

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;

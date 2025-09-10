const mongoose = require('mongoose');

const practitionerSchema = new mongoose.Schema({
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
  title: {
    type: String,
    enum: ['Dr.', 'Vaidya', 'Therapist', 'Consultant', 'Specialist'],
    default: 'Therapist'
  },
  specializations: [{
    type: String,
    enum: [
      'panchakarma',
      'abhyanga',
      'shirodhara',
      'basti',
      'vamana',
      'virechana',
      'nasya',
      'raktamokshana',
      'kayachikitsa',
      'bahyachikitsa',
      'general_consultation',
      'pulse_diagnosis',
      'constitution_analysis'
    ],
    required: true
  }],
  qualifications: [{
    degree: {
      type: String,
      required: true,
      trim: true
    },
    institution: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: Number,
      required: true,
      min: [1950, 'Year must be realistic'],
      max: [new Date().getFullYear(), 'Year cannot be in the future']
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  experience: {
    years: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative'],
      max: [50, 'Experience seems unrealistic']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Experience description cannot exceed 500 characters']
    }
  },
  contact: {
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
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
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
    }
  },
  availability: {
    monday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' },
      breakStart: { type: String, default: '13:00' },
      breakEnd: { type: String, default: '14:00' }
    },
    tuesday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' },
      breakStart: { type: String, default: '13:00' },
      breakEnd: { type: String, default: '14:00' }
    },
    wednesday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' },
      breakStart: { type: String, default: '13:00' },
      breakEnd: { type: String, default: '14:00' }
    },
    thursday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' },
      breakStart: { type: String, default: '13:00' },
      breakEnd: { type: String, default: '14:00' }
    },
    friday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '18:00' },
      breakStart: { type: String, default: '13:00' },
      breakEnd: { type: String, default: '14:00' }
    },
    saturday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '15:00' },
      breakStart: { type: String, default: '12:00' },
      breakEnd: { type: String, default: '13:00' }
    },
    sunday: {
      available: { type: Boolean, default: false },
      startTime: { type: String, default: '09:00' },
      endTime: { type: String, default: '15:00' },
      breakStart: { type: String, default: '12:00' },
      breakEnd: { type: String, default: '13:00' }
    }
  },
  sessionSettings: {
    defaultDuration: {
      type: Number,
      default: 60,
      min: [15, 'Minimum session duration is 15 minutes'],
      max: [180, 'Maximum session duration is 3 hours']
    },
    bufferTime: {
      type: Number,
      default: 15,
      min: [0, 'Buffer time cannot be negative'],
      max: [60, 'Buffer time cannot exceed 60 minutes']
    },
    maxPatientsPerDay: {
      type: Number,
      default: 8,
      min: [1, 'Must allow at least 1 patient per day'],
      max: [20, 'Maximum 20 patients per day']
    }
  },
  ratings: {
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative']
    },
    breakdown: {
      professionalism: { type: Number, default: 0 },
      expertise: { type: Number, default: 0 },
      communication: { type: Number, default: 0 },
      punctuality: { type: Number, default: 0 }
    }
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  },
  languages: [{
    type: String,
    enum: ['hindi', 'english', 'sanskrit', 'tamil', 'telugu', 'bengali', 'gujarati', 'marathi', 'punjabi', 'other'],
    default: 'english'
  }],
  certifications: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    issuingAuthority: {
      type: String,
      required: true,
      trim: true
    },
    issueDate: {
      type: Date,
      required: true
    },
    expiryDate: {
      type: Date
    },
    certificateNumber: {
      type: String,
      trim: true
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'on-leave'],
    default: 'active'
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
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
practitionerSchema.index({ userId: 1 });
practitionerSchema.index({ firstName: 1, lastName: 1 });
practitionerSchema.index({ specializations: 1 });
practitionerSchema.index({ status: 1 });
practitionerSchema.index({ 'ratings.averageRating': -1 });
practitionerSchema.index({ joinDate: -1 });

// Text search index
practitionerSchema.index({
  firstName: 'text',
  lastName: 'text',
  bio: 'text',
  specializations: 'text'
});

// Virtual for full name
practitionerSchema.virtual('fullName').get(function() {
  return `${this.title} ${this.firstName} ${this.lastName}`;
});

// Virtual for years of experience
practitionerSchema.virtual('experienceYears').get(function() {
  if (!this.joinDate) return this.experience.years;
  
  const now = new Date();
  const yearsSinceJoin = Math.floor((now - this.joinDate) / (365.25 * 24 * 60 * 60 * 1000));
  
  return Math.max(this.experience.years, yearsSinceJoin);
});

// Virtual for availability status
practitionerSchema.virtual('isAvailable').get(function() {
  return this.status === 'active' && this.lastActive > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Active within last 7 days
});

// Pre-save middleware to update lastActive
practitionerSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastActive = new Date();
  }
  next();
});

// Static method to find practitioners by specialization
practitionerSchema.statics.findBySpecialization = function(specialization, activeOnly = true) {
  const filter = { specializations: specialization };
  if (activeOnly) {
    filter.status = 'active';
  }
  return this.find(filter).sort({ 'ratings.averageRating': -1, experience: -1 });
};

// Static method to find available practitioners
practitionerSchema.statics.findAvailable = function(date, time) {
  const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
  
  return this.find({
    status: 'active',
    [`availability.${dayOfWeek}.available`]: true,
    [`availability.${dayOfWeek}.startTime`]: { $lte: time },
    [`availability.${dayOfWeek}.endTime`]: { $gte: time }
  }).sort({ 'ratings.averageRating': -1 });
};

// Instance method to check availability for specific time
practitionerSchema.methods.isAvailableAt = function(dateTime) {
  const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dateTime.getDay()];
  const time = dateTime.toTimeString().slice(0, 5); // HH:MM format
  
  const daySchedule = this.availability[dayOfWeek];
  
  if (!daySchedule.available) return false;
  
  const startTime = daySchedule.startTime;
  const endTime = daySchedule.endTime;
  const breakStart = daySchedule.breakStart;
  const breakEnd = daySchedule.breakEnd;
  
  // Check if time is within working hours
  if (time < startTime || time > endTime) return false;
  
  // Check if time is during break
  if (breakStart && breakEnd && time >= breakStart && time < breakEnd) return false;
  
  return true;
};

// Instance method to get upcoming appointments
practitionerSchema.methods.getUpcomingAppointments = function() {
  const Appointment = mongoose.model('Appointment');
  return Appointment.find({
    practitionerId: this._id,
    dateTime: { $gte: new Date() },
    status: { $in: ['scheduled', 'confirmed'] }
  }).sort({ dateTime: 1 }).populate('patientId therapyId');
};

// Instance method to update rating
practitionerSchema.methods.updateRating = function(newRating, breakdown = {}) {
  const totalReviews = this.ratings.totalReviews + 1;
  const currentTotal = this.ratings.averageRating * this.ratings.totalReviews;
  const newAverage = (currentTotal + newRating) / totalReviews;
  
  this.ratings.averageRating = Math.round(newAverage * 10) / 10; // Round to 1 decimal
  this.ratings.totalReviews = totalReviews;
  
  // Update breakdown ratings
  if (breakdown.professionalism) {
    this.ratings.breakdown.professionalism = 
      (this.ratings.breakdown.professionalism * (totalReviews - 1) + breakdown.professionalism) / totalReviews;
  }
  if (breakdown.expertise) {
    this.ratings.breakdown.expertise = 
      (this.ratings.breakdown.expertise * (totalReviews - 1) + breakdown.expertise) / totalReviews;
  }
  if (breakdown.communication) {
    this.ratings.breakdown.communication = 
      (this.ratings.breakdown.communication * (totalReviews - 1) + breakdown.communication) / totalReviews;
  }
  if (breakdown.punctuality) {
    this.ratings.breakdown.punctuality = 
      (this.ratings.breakdown.punctuality * (totalReviews - 1) + breakdown.punctuality) / totalReviews;
  }
  
  return this.save();
};

const Practitioner = mongoose.model('Practitioner', practitionerSchema);

module.exports = Practitioner;

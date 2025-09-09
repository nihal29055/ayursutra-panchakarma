const mongoose = require('mongoose');

const therapySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Therapy name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Therapy name cannot exceed 100 characters']
  },
  sanskritName: {
    type: String,
    trim: true,
    maxlength: [100, 'Sanskrit name cannot exceed 100 characters']
  },
  category: {
    type: String,
    enum: [
      'purvakarma', // Preparatory procedures
      'pradhanakarma', // Main Panchakarma procedures
      'paschatkarma', // Post-therapy procedures
      'kayachikitsa', // Internal medicine treatments
      'bahyachikitsa' // External treatments
    ],
    required: [true, 'Therapy category is required']
  },
  type: {
    type: String,
    enum: [
      'vamana', // Therapeutic vomiting
      'virechana', // Purgation therapy
      'basti', // Medicated enema
      'nasya', // Nasal administration
      'raktamokshana', // Bloodletting
      'abhyanga', // Oil massage
      'shirodhara', // Oil pouring on head
      'pizhichil', // Oil bath
      'udvartana', // Herbal powder massage
      'kizhi', // Herbal poultice massage
      'steam', // Steam therapy
      'consultation', // Doctor consultation
      'other'
    ],
    required: [true, 'Therapy type is required']
  },
  description: {
    type: String,
    required: [true, 'Therapy description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  benefits: [{
    type: String,
    trim: true,
    maxlength: [200, 'Each benefit cannot exceed 200 characters']
  }],
  indications: [{
    type: String,
    trim: true,
    maxlength: [200, 'Each indication cannot exceed 200 characters']
  }],
  contraindications: [{
    type: String,
    trim: true,
    maxlength: [200, 'Each contraindication cannot exceed 200 characters']
  }],
  duration: {
    type: Number,
    required: [true, 'Therapy duration is required'],
    min: [15, 'Duration must be at least 15 minutes'],
    max: [480, 'Duration cannot exceed 8 hours'] // in minutes
  },
  sessions: {
    recommended: {
      type: Number,
      default: 1,
      min: [1, 'Minimum 1 session required']
    },
    maximum: {
      type: Number,
      default: 21,
      min: [1, 'Maximum sessions must be at least 1']
    },
    frequency: {
      type: String,
      enum: ['daily', 'alternate-days', 'twice-weekly', 'weekly', 'as-needed'],
      default: 'daily'
    }
  },
  preparation: {
    preProcedureInstructions: [{
      instruction: {
        type: String,
        required: true,
        trim: true
      },
      timeframe: {
        type: String, // e.g., "24 hours before", "morning of procedure"
        required: true
      },
      importance: {
        type: String,
        enum: ['mandatory', 'recommended', 'optional'],
        default: 'recommended'
      }
    }],
    postProcedureInstructions: [{
      instruction: {
        type: String,
        required: true,
        trim: true
      },
      timeframe: {
        type: String, // e.g., "immediately after", "for 3 days"
        required: true
      },
      importance: {
        type: String,
        enum: ['mandatory', 'recommended', 'optional'],
        default: 'recommended'
      }
    }]
  },
  materials: {
    oils: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      quantity: {
        type: String,
        trim: true
      },
      optional: {
        type: Boolean,
        default: false
      }
    }],
    herbs: [{
      name: {
        type: String,
        required: true,
        trim: true
      },
      quantity: {
        type: String,
        trim: true
      },
      optional: {
        type: Boolean,
        default: false
      }
    }],
    equipment: [{
      type: String,
      trim: true
    }]
  },
  pricing: {
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR'
    },
    packageDiscount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [50, 'Discount cannot exceed 50%']
    }
  },
  practitionerRequirements: {
    minimumExperience: {
      type: Number,
      default: 0,
      min: [0, 'Experience cannot be negative']
    },
    specializations: [{
      type: String,
      trim: true
    }],
    certifications: [{
      type: String,
      trim: true
    }]
  },
  seasonality: {
    preferredSeasons: [{
      type: String,
      enum: ['spring', 'summer', 'monsoon', 'autumn', 'winter'],
    }],
    avoidSeasons: [{
      type: String,
      enum: ['spring', 'summer', 'monsoon', 'autumn', 'winter'],
    }]
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'seasonal', 'discontinued'],
    default: 'active'
  },
  popularity: {
    type: Number,
    default: 0,
    min: [0, 'Popularity score cannot be negative']
  },
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
  images: [{
    url: {
      type: String,
      trim: true
    },
    alt: {
      type: String,
      trim: true
    },
    caption: {
      type: String,
      trim: true
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
therapySchema.index({ name: 1 });
therapySchema.index({ category: 1, type: 1 });
therapySchema.index({ status: 1 });
therapySchema.index({ popularity: -1 });
therapySchema.index({ averageRating: -1 });
therapySchema.index({ 'pricing.basePrice': 1 });

// Text search index
therapySchema.index({
  name: 'text',
  sanskritName: 'text',
  description: 'text',
  benefits: 'text',
  indications: 'text'
});

// Virtual for formatted duration
therapySchema.virtual('formattedDuration').get(function() {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  
  if (hours === 0) {
    return `${minutes} minutes`;
  } else if (minutes === 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  } else {
    return `${hours}h ${minutes}m`;
  }
});

// Virtual for effective price (with package discount)
therapySchema.virtual('effectivePrice').get(function() {
  const discount = this.pricing.packageDiscount || 0;
  return this.pricing.basePrice * (1 - discount / 100);
});

// Pre-save middleware to validate session configuration
therapySchema.pre('save', function(next) {
  if (this.sessions.maximum < this.sessions.recommended) {
    return next(new Error('Maximum sessions cannot be less than recommended sessions'));
  }
  next();
});

// Static method to find therapies by category
therapySchema.statics.findByCategory = function(category, activeOnly = true) {
  const filter = { category };
  if (activeOnly) {
    filter.status = 'active';
  }
  return this.find(filter).sort({ popularity: -1, averageRating: -1 });
};

// Static method to find popular therapies
therapySchema.statics.findPopular = function(limit = 10) {
  return this.find({ status: 'active' })
    .sort({ popularity: -1, averageRating: -1 })
    .limit(limit);
};

// Static method to search therapies
therapySchema.statics.searchTherapies = function(searchTerm, filters = {}) {
  const query = {
    $and: [
      { status: 'active' },
      {
        $or: [
          { $text: { $search: searchTerm } },
          { name: new RegExp(searchTerm, 'i') },
          { sanskritName: new RegExp(searchTerm, 'i') }
        ]
      }
    ]
  };

  // Apply additional filters
  if (filters.category) query.$and.push({ category: filters.category });
  if (filters.type) query.$and.push({ type: filters.type });
  if (filters.maxPrice) query.$and.push({ 'pricing.basePrice': { $lte: filters.maxPrice } });
  if (filters.maxDuration) query.$and.push({ duration: { $lte: filters.maxDuration } });

  return this.find(query).sort({ score: { $meta: 'textScore' }, popularity: -1 });
};

// Instance method to update popularity score
therapySchema.methods.updatePopularity = function() {
  // Simple popularity algorithm based on bookings and ratings
  const Appointment = mongoose.model('Appointment');
  
  return Appointment.countDocuments({
    therapyId: this._id,
    status: { $in: ['completed', 'scheduled', 'confirmed'] }
  }).then(bookingCount => {
    const ratingWeight = this.averageRating * this.totalReviews;
    const bookingWeight = bookingCount * 2;
    
    this.popularity = ratingWeight + bookingWeight;
    return this.save();
  });
};

const Therapy = mongoose.model('Therapy', therapySchema);

module.exports = Therapy;

const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  type: {
    type: String,
    enum: ['predefined', 'custom'],
    default: 'predefined'
  },
  destinations: [{
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: true
    },
    duration: Number, // days
    order: Number
  }],
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    originalPrice: Number,
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  inclusions: [String],
  exclusions: [String],
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    activities: [String],
    meals: {
      breakfast: { type: Boolean, default: false },
      lunch: { type: Boolean, default: false },
      dinner: { type: Boolean, default: false }
    },
    accommodation: String,
    transportation: String
  }],
  images: [{
    url: String,
    alt: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  maxGroupSize: {
    type: Number,
    default: 20
  },
  minGroupSize: {
    type: Number,
    default: 1
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'challenging', 'expert'],
    default: 'moderate'
  },
  category: {
    type: String,
    enum: ['adventure', 'cultural', 'relaxation', 'luxury', 'budget', 'family'],
    required: true
  },
  tags: [String],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  validFrom: {
    type: Date,
    default: Date.now
  },
  validTo: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  meta: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Index for search functionality
packageSchema.index({ 
  name: 'text', 
  description: 'text',
  category: 'text'
});

module.exports = mongoose.model('Package', packageSchema);
const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
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
    enum: ['local', 'international'],
    required: true
  },
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
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
  priceRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  highlights: [String],
  activities: [String],
  bestTimeToVisit: {
    from: String,
    to: String
  },
  weather: {
    temperature: {
      min: Number,
      max: Number
    },
    description: String
  },
  location: {
    latitude: Number,
    longitude: Number
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
  meta: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Index for search functionality
destinationSchema.index({ 
  name: 'text', 
  description: 'text', 
  country: 'text', 
  city: 'text' 
});

module.exports = mongoose.model('Destination', destinationSchema);
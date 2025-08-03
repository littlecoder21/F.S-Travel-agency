const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  website: {
    name: {
      type: String,
      default: 'Travel Agency'
    },
    description: String,
    logo: String,
    favicon: String,
    contactEmail: String,
    contactPhone: String,
    address: String,
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
      youtube: String
    }
  },
  features: {
    flightSearch: {
      enabled: {
        type: Boolean,
        default: true
      },
      showRoundTrip: {
        type: Boolean,
        default: true
      },
      showSingleTrip: {
        type: Boolean,
        default: true
      },
      showMultiCity: {
        type: Boolean,
        default: false
      }
    },
    hotelSearch: {
      enabled: {
        type: Boolean,
        default: true
      },
      showRoomTypes: {
        type: Boolean,
        default: true
      },
      showAmenities: {
        type: Boolean,
        default: true
      }
    },
    destinationSearch: {
      enabled: {
        type: Boolean,
        default: true
      },
      showLocalDestinations: {
        type: Boolean,
        default: true
      },
      showInternationalDestinations: {
        type: Boolean,
        default: true
      }
    },
    packages: {
      enabled: {
        type: Boolean,
        default: true
      },
      allowCustomPackages: {
        type: Boolean,
        default: true
      },
      showFeaturedPackages: {
        type: Boolean,
        default: true
      }
    },
    discounts: {
      enabled: {
        type: Boolean,
        default: true
      },
      showSlider: {
        type: Boolean,
        default: true
      }
    },
    reviews: {
      enabled: {
        type: Boolean,
        default: true
      },
      requireApproval: {
        type: Boolean,
        default: true
      }
    },
    booking: {
      enabled: {
        type: Boolean,
        default: true
      },
      requirePayment: {
        type: Boolean,
        default: true
      },
      allowPartialPayment: {
        type: Boolean,
        default: false
      }
    }
  },
  languages: {
    default: {
      type: String,
      default: 'en'
    },
    supported: [{
      code: String,
      name: String,
      flag: String,
      enabled: {
        type: Boolean,
        default: true
      }
    }]
  },
  currencies: {
    default: {
      type: String,
      default: 'USD'
    },
    supported: [{
      code: String,
      symbol: String,
      name: String,
      enabled: {
        type: Boolean,
        default: true
      }
    }]
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    googleAnalytics: String,
    facebookPixel: String
  },
  email: {
    smtp: {
      host: String,
      port: Number,
      secure: Boolean,
      user: String,
      pass: String
    },
    fromEmail: String,
    fromName: String
  },
  payment: {
    stripe: {
      publishableKey: String,
      secretKey: String,
      enabled: {
        type: Boolean,
        default: false
      }
    },
    paypal: {
      clientId: String,
      clientSecret: String,
      enabled: {
        type: Boolean,
        default: false
      }
    }
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getInstance = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
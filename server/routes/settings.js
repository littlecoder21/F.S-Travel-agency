const express = require('express');
const { optionalAuth } = require('../middleware/auth');
const Settings = require('../models/Settings');

const router = express.Router();

// Get public settings (no authentication required)
router.get('/public', async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    
    // Only return public settings
    const publicSettings = {
      website: {
        name: settings.website.name,
        description: settings.website.description,
        logo: settings.website.logo,
        contactEmail: settings.website.contactEmail,
        contactPhone: settings.website.contactPhone,
        address: settings.website.address,
        socialMedia: settings.website.socialMedia
      },
      features: settings.features,
      languages: settings.languages,
      currencies: settings.currencies
    };

    res.json(publicSettings);
  } catch (error) {
    console.error('Get public settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all settings (admin only)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific setting section
router.get('/:section', optionalAuth, async (req, res) => {
  try {
    const { section } = req.params;
    const settings = await Settings.getInstance();
    
    if (!settings[section]) {
      return res.status(404).json({ message: 'Setting section not found' });
    }

    res.json(settings[section]);
  } catch (error) {
    console.error('Get setting section error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get supported languages
router.get('/languages/supported', optionalAuth, async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    const supportedLanguages = settings.languages.supported.filter(lang => lang.enabled);
    res.json(supportedLanguages);
  } catch (error) {
    console.error('Get supported languages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get supported currencies
router.get('/currencies/supported', optionalAuth, async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    const supportedCurrencies = settings.currencies.supported.filter(curr => curr.enabled);
    res.json(supportedCurrencies);
  } catch (error) {
    console.error('Get supported currencies error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get feature status
router.get('/features/status', optionalAuth, async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    res.json(settings.features);
  } catch (error) {
    console.error('Get feature status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if feature is enabled
router.get('/features/:feature/status', optionalAuth, async (req, res) => {
  try {
    const { feature } = req.params;
    const settings = await Settings.getInstance();
    
    const featurePath = feature.split('.');
    let current = settings;
    
    for (const path of featurePath) {
      if (current[path] === undefined) {
        return res.status(404).json({ message: 'Feature not found' });
      }
      current = current[path];
    }
    
    res.json({ enabled: current });
  } catch (error) {
    console.error('Check feature status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get website information
router.get('/website/info', optionalAuth, async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    res.json(settings.website);
  } catch (error) {
    console.error('Get website info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get SEO settings
router.get('/seo/info', optionalAuth, async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    res.json(settings.seo);
  } catch (error) {
    console.error('Get SEO info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment settings (admin only)
router.get('/payment/info', optionalAuth, async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    
    // Only return enabled payment methods
    const paymentInfo = {
      stripe: {
        enabled: settings.payment.stripe.enabled,
        publishableKey: settings.payment.stripe.enabled ? settings.payment.stripe.publishableKey : null
      },
      paypal: {
        enabled: settings.payment.paypal.enabled,
        clientId: settings.payment.paypal.enabled ? settings.payment.paypal.clientId : null
      }
    };
    
    res.json(paymentInfo);
  } catch (error) {
    console.error('Get payment info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get email settings (admin only)
router.get('/email/info', optionalAuth, async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    
    // Don't return sensitive information like passwords
    const emailInfo = {
      fromEmail: settings.email.fromEmail,
      fromName: settings.email.fromName,
      smtp: {
        host: settings.email.smtp.host,
        port: settings.email.smtp.port,
        secure: settings.email.smtp.secure
      }
    };
    
    res.json(emailInfo);
  } catch (error) {
    console.error('Get email info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check for settings
router.get('/health/check', async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      settings: {
        website: !!settings.website.name,
        features: !!settings.features,
        languages: !!settings.languages.supported.length,
        currencies: !!settings.currencies.supported.length
      }
    };
    
    res.json(healthStatus);
  } catch (error) {
    console.error('Settings health check error:', error);
    res.status(500).json({ 
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router;
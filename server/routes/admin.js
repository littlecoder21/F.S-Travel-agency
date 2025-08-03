const express = require('express');
const { body, validationResult } = require('express-validator');
const { adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Settings = require('../models/Settings');
const Destination = require('../models/Destination');
const Package = require('../models/Package');

const router = express.Router();

// Apply admin authentication to all routes
router.use(adminAuth);

// Get admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const stats = {
      totalUsers: await User.countDocuments(),
      totalDestinations: await Destination.countDocuments(),
      totalPackages: await Package.countDocuments(),
      activeUsers: await User.countDocuments({ isActive: true }),
      featuredDestinations: await Destination.countDocuments({ isFeatured: true }),
      featuredPackages: await Package.countDocuments({ isFeatured: true })
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get website settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await Settings.getInstance();
    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update website settings
router.put('/settings', [
  body('website').optional().isObject(),
  body('features').optional().isObject(),
  body('languages').optional().isObject(),
  body('currencies').optional().isObject(),
  body('seo').optional().isObject(),
  body('email').optional().isObject(),
  body('payment').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const settings = await Settings.getInstance();
    
    // Update settings
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        settings[key] = { ...settings[key], ...req.body[key] };
      }
    });

    await settings.save();

    res.json({
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/users/:id', [
  body('name').optional().trim().isLength({ min: 2 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('role').optional().isIn(['user', 'admin']),
  body('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, email, role, isActive } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last admin user' });
      }
    }

    await User.findByIdAndDelete(id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle feature
router.post('/toggle-feature', [
  body('feature').isString().withMessage('Feature is required'),
  body('enabled').isBoolean().withMessage('Enabled status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { feature, enabled } = req.body;
    const settings = await Settings.getInstance();

    // Update the specific feature
    const featurePath = feature.split('.');
    let current = settings;
    
    for (let i = 0; i < featurePath.length - 1; i++) {
      current = current[featurePath[i]];
    }
    
    current[featurePath[featurePath.length - 1]] = enabled;
    
    await settings.save();

    res.json({
      message: `Feature ${feature} ${enabled ? 'enabled' : 'disabled'} successfully`,
      settings
    });
  } catch (error) {
    console.error('Toggle feature error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get system logs (mock implementation)
router.get('/logs', async (req, res) => {
  try {
    // Mock logs - in production, you'd implement proper logging
    const logs = [
      {
        id: 1,
        level: 'info',
        message: 'User login successful',
        timestamp: new Date().toISOString(),
        user: 'admin@example.com'
      },
      {
        id: 2,
        level: 'warning',
        message: 'Failed login attempt',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        user: 'unknown@example.com'
      }
    ];

    res.json(logs);
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
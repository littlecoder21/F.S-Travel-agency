const express = require('express');
const { body, validationResult } = require('express-validator');
const { optionalAuth } = require('../middleware/auth');
const Destination = require('../models/Destination');

const router = express.Router();

// Get all destinations with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      country,
      city,
      search,
      featured,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isActive: true };
    
    if (type) query.type = type;
    if (country) query.country = { $regex: country, $options: 'i' };
    if (city) query.city = { $regex: city, $options: 'i' };
    if (featured === 'true') query.isFeatured = true;
    
    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const destinations = await Destination.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Destination.countDocuments(query);

    res.json({
      destinations,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get destination by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    
    if (!destination || !destination.isActive) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    res.json(destination);
  } catch (error) {
    console.error('Get destination error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured destinations
router.get('/featured/list', optionalAuth, async (req, res) => {
  try {
    const { limit = 6, type } = req.query;
    
    const query = { isFeatured: true, isActive: true };
    if (type) query.type = type;

    const destinations = await Destination.find(query)
      .sort({ rating: -1, reviewCount: -1 })
      .limit(parseInt(limit));

    res.json(destinations);
  } catch (error) {
    console.error('Get featured destinations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get top destinations
router.get('/top/list', optionalAuth, async (req, res) => {
  try {
    const { limit = 8, type } = req.query;
    
    const query = { isActive: true };
    if (type) query.type = type;

    const destinations = await Destination.find(query)
      .sort({ rating: -1, reviewCount: -1 })
      .limit(parseInt(limit));

    res.json(destinations);
  } catch (error) {
    console.error('Get top destinations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search destinations
router.get('/search/query', optionalAuth, async (req, res) => {
  try {
    const { q, type, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const query = { 
      isActive: true,
      $text: { $search: q }
    };
    
    if (type) query.type = type;

    const destinations = await Destination.find(query)
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit));

    res.json(destinations);
  } catch (error) {
    console.error('Search destinations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get countries list
router.get('/countries/list', optionalAuth, async (req, res) => {
  try {
    const { type } = req.query;
    
    const query = { isActive: true };
    if (type) query.type = type;

    const countries = await Destination.distinct('country', query);
    res.json(countries.sort());
  } catch (error) {
    console.error('Get countries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get cities by country
router.get('/cities/:country', optionalAuth, async (req, res) => {
  try {
    const { country } = req.params;
    const { type } = req.query;
    
    const query = { 
      country: { $regex: country, $options: 'i' },
      isActive: true 
    };
    if (type) query.type = type;

    const cities = await Destination.distinct('city', query);
    res.json(cities.sort());
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes (protected)
const { adminAuth } = require('../middleware/auth');

// Create destination (admin only)
router.post('/', adminAuth, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('shortDescription').notEmpty().withMessage('Short description is required'),
  body('type').isIn(['local', 'international']).withMessage('Type must be local or international'),
  body('country').notEmpty().withMessage('Country is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('images').isArray().withMessage('Images must be an array'),
  body('highlights').isArray().withMessage('Highlights must be an array'),
  body('activities').isArray().withMessage('Activities must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const destination = new Destination({
      ...req.body,
      createdBy: req.user._id
    });

    await destination.save();

    res.status(201).json({
      message: 'Destination created successfully',
      destination
    });
  } catch (error) {
    console.error('Create destination error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update destination (admin only)
router.put('/:id', adminAuth, [
  body('name').optional().trim().notEmpty(),
  body('description').optional().notEmpty(),
  body('shortDescription').optional().notEmpty(),
  body('type').optional().isIn(['local', 'international']),
  body('country').optional().notEmpty(),
  body('city').optional().notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        destination[key] = req.body[key];
      }
    });

    await destination.save();

    res.json({
      message: 'Destination updated successfully',
      destination
    });
  } catch (error) {
    console.error('Update destination error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete destination (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    await Destination.findByIdAndDelete(req.params.id);

    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('Delete destination error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle destination featured status (admin only)
router.patch('/:id/featured', adminAuth, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    destination.isFeatured = !destination.isFeatured;
    await destination.save();

    res.json({
      message: `Destination ${destination.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      destination
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
const express = require('express');
const { body, validationResult } = require('express-validator');
const { optionalAuth, auth } = require('../middleware/auth');
const Package = require('../models/Package');
const Destination = require('../models/Destination');

const router = express.Router();

// Get all packages with filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      type,
      search,
      featured,
      minPrice,
      maxPrice,
      duration,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isActive: true };
    
    if (category) query.category = category;
    if (type) query.type = type;
    if (featured === 'true') query.isFeatured = true;
    if (search) {
      query.$text = { $search: search };
    }
    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) query['price.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) query['price.amount'].$lte = parseFloat(maxPrice);
    }
    if (duration) {
      query.duration = { $lte: parseInt(duration) };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const packages = await Package.find(query)
      .populate('destinations.destination', 'name city country images')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Package.countDocuments(query);

    res.json({
      packages,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get package by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const package = await Package.findById(req.params.id)
      .populate('destinations.destination', 'name city country images description highlights activities');
    
    if (!package || !package.isActive) {
      return res.status(404).json({ message: 'Package not found' });
    }

    res.json(package);
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured packages
router.get('/featured/list', optionalAuth, async (req, res) => {
  try {
    const { limit = 6, category } = req.query;
    
    const query = { isFeatured: true, isActive: true };
    if (category) query.category = category;

    const packages = await Package.find(query)
      .populate('destinations.destination', 'name city country images')
      .sort({ rating: -1, reviewCount: -1 })
      .limit(parseInt(limit));

    res.json(packages);
  } catch (error) {
    console.error('Get featured packages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get packages by category
router.get('/category/:category', optionalAuth, async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 8 } = req.query;

    const packages = await Package.find({
      category,
      isActive: true
    })
    .populate('destinations.destination', 'name city country images')
    .sort({ rating: -1, reviewCount: -1 })
    .limit(parseInt(limit));

    res.json(packages);
  } catch (error) {
    console.error('Get packages by category error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search packages
router.get('/search/query', optionalAuth, async (req, res) => {
  try {
    const { q, category, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const query = { 
      isActive: true,
      $text: { $search: q }
    };
    
    if (category) query.category = category;

    const packages = await Package.find(query)
      .populate('destinations.destination', 'name city country images')
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit));

    res.json(packages);
  } catch (error) {
    console.error('Search packages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get package categories
router.get('/categories/list', optionalAuth, async (req, res) => {
  try {
    const categories = await Package.distinct('category', { isActive: true });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create custom package (authenticated users)
router.post('/custom', auth, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('destinations').isArray({ min: 1 }).withMessage('At least one destination is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
  body('category').isIn(['adventure', 'cultural', 'relaxation', 'luxury', 'budget', 'family']).withMessage('Invalid category'),
  body('preferences').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { destinations, preferences, ...packageData } = req.body;

    // Validate destinations exist
    const destinationIds = destinations.map(d => d.destination);
    const existingDestinations = await Destination.find({
      _id: { $in: destinationIds },
      isActive: true
    });

    if (existingDestinations.length !== destinationIds.length) {
      return res.status(400).json({ message: 'One or more destinations not found' });
    }

    const customPackage = new Package({
      ...packageData,
      type: 'custom',
      destinations: destinations.map((dest, index) => ({
        destination: dest.destination,
        duration: dest.duration || 1,
        order: index + 1
      })),
      createdBy: req.user._id,
      price: {
        amount: 0, // Will be calculated based on preferences
        currency: 'USD'
      }
    });

    await customPackage.save();

    res.status(201).json({
      message: 'Custom package created successfully',
      package: customPackage
    });
  } catch (error) {
    console.error('Create custom package error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes (protected)
const { adminAuth } = require('../middleware/auth');

// Create package (admin only)
router.post('/', adminAuth, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('shortDescription').notEmpty().withMessage('Short description is required'),
  body('destinations').isArray({ min: 1 }).withMessage('At least one destination is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
  body('category').isIn(['adventure', 'cultural', 'relaxation', 'luxury', 'budget', 'family']).withMessage('Invalid category'),
  body('price.amount').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('inclusions').isArray().withMessage('Inclusions must be an array'),
  body('exclusions').isArray().withMessage('Exclusions must be an array'),
  body('itinerary').isArray().withMessage('Itinerary must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { destinations, ...packageData } = req.body;

    // Validate destinations exist
    const destinationIds = destinations.map(d => d.destination);
    const existingDestinations = await Destination.find({
      _id: { $in: destinationIds },
      isActive: true
    });

    if (existingDestinations.length !== destinationIds.length) {
      return res.status(400).json({ message: 'One or more destinations not found' });
    }

    const package = new Package({
      ...packageData,
      destinations: destinations.map((dest, index) => ({
        destination: dest.destination,
        duration: dest.duration || 1,
        order: index + 1
      })),
      createdBy: req.user._id
    });

    await package.save();

    res.status(201).json({
      message: 'Package created successfully',
      package
    });
  } catch (error) {
    console.error('Create package error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update package (admin only)
router.put('/:id', adminAuth, [
  body('name').optional().trim().notEmpty(),
  body('description').optional().notEmpty(),
  body('shortDescription').optional().notEmpty(),
  body('category').optional().isIn(['adventure', 'cultural', 'relaxation', 'luxury', 'budget', 'family']),
  body('duration').optional().isInt({ min: 1 }),
  body('price.amount').optional().isFloat({ min: 0 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        package[key] = req.body[key];
      }
    });

    await package.save();

    res.json({
      message: 'Package updated successfully',
      package
    });
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete package (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    await Package.findByIdAndDelete(req.params.id);

    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle package featured status (admin only)
router.patch('/:id/featured', adminAuth, async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    package.isFeatured = !package.isFeatured;
    await package.save();

    res.json({
      message: `Package ${package.isFeatured ? 'featured' : 'unfeatured'} successfully`,
      package
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Mock booking data
const mockBookings = [
  {
    id: '1',
    userId: 'user1',
    type: 'flight',
    itemId: 'flight1',
    itemDetails: {
      airline: 'Emirates',
      flightNumber: 'EK123',
      from: 'New York',
      to: 'Dubai',
      departureTime: '2024-01-15T10:00:00Z',
      arrivalTime: '2024-01-16T08:00:00Z'
    },
    passengers: [
      {
        firstName: 'John',
        lastName: 'Doe',
        passport: 'AB123456',
        dateOfBirth: '1990-01-01'
      }
    ],
    totalAmount: 1200,
    currency: 'USD',
    status: 'confirmed',
    bookingDate: '2024-01-10T10:00:00Z',
    paymentStatus: 'paid'
  },
  {
    id: '2',
    userId: 'user1',
    type: 'hotel',
    itemId: 'hotel1',
    itemDetails: {
      name: 'Grand Hyatt Dubai',
      location: 'Dubai, UAE',
      checkIn: '2024-01-15',
      checkOut: '2024-01-18'
    },
    guests: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      }
    ],
    totalAmount: 1050,
    currency: 'USD',
    status: 'confirmed',
    bookingDate: '2024-01-10T10:00:00Z',
    paymentStatus: 'paid'
  }
];

// Get user bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let filteredBookings = mockBookings.filter(booking => booking.userId === req.user._id);
    
    if (status) {
      filteredBookings = filteredBookings.filter(booking => booking.status === status);
    }

    const total = filteredBookings.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

    res.json({
      bookings: paginatedBookings,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = mockBookings.find(b => b.id === req.params.id && b.userId === req.user._id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create flight booking
router.post('/flight', auth, [
  body('flightId').notEmpty().withMessage('Flight ID is required'),
  body('passengers').isArray({ min: 1 }).withMessage('At least one passenger is required'),
  body('passengers.*.firstName').notEmpty().withMessage('First name is required'),
  body('passengers.*.lastName').notEmpty().withMessage('Last name is required'),
  body('passengers.*.passport').notEmpty().withMessage('Passport number is required'),
  body('passengers.*.dateOfBirth').isISO8601().withMessage('Valid date of birth is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { flightId, passengers, specialRequests } = req.body;

    // Mock flight booking creation
    const newBooking = {
      id: `booking_${Date.now()}`,
      userId: req.user._id,
      type: 'flight',
      itemId: flightId,
      itemDetails: {
        airline: 'Emirates',
        flightNumber: 'EK123',
        from: 'New York',
        to: 'Dubai',
        departureTime: '2024-01-15T10:00:00Z',
        arrivalTime: '2024-01-16T08:00:00Z'
      },
      passengers,
      specialRequests,
      totalAmount: 1200 * passengers.length,
      currency: 'USD',
      status: 'pending',
      bookingDate: new Date().toISOString(),
      paymentStatus: 'pending'
    };

    // In a real application, you would save this to the database
    mockBookings.push(newBooking);

    res.status(201).json({
      message: 'Flight booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    console.error('Create flight booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create hotel booking
router.post('/hotel', auth, [
  body('hotelId').notEmpty().withMessage('Hotel ID is required'),
  body('checkIn').isISO8601().withMessage('Valid check-in date is required'),
  body('checkOut').isISO8601().withMessage('Valid check-out date is required'),
  body('guests').isArray({ min: 1 }).withMessage('At least one guest is required'),
  body('guests.*.firstName').notEmpty().withMessage('First name is required'),
  body('guests.*.lastName').notEmpty().withMessage('Last name is required'),
  body('guests.*.email').isEmail().withMessage('Valid email is required'),
  body('rooms').isInt({ min: 1 }).withMessage('Number of rooms is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { hotelId, checkIn, checkOut, guests, rooms, specialRequests } = req.body;

    // Calculate number of nights
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    // Mock hotel booking creation
    const newBooking = {
      id: `booking_${Date.now()}`,
      userId: req.user._id,
      type: 'hotel',
      itemId: hotelId,
      itemDetails: {
        name: 'Grand Hyatt Dubai',
        location: 'Dubai, UAE',
        checkIn,
        checkOut,
        nights
      },
      guests,
      rooms: parseInt(rooms),
      specialRequests,
      totalAmount: 350 * nights * parseInt(rooms),
      currency: 'USD',
      status: 'pending',
      bookingDate: new Date().toISOString(),
      paymentStatus: 'pending'
    };

    // In a real application, you would save this to the database
    mockBookings.push(newBooking);

    res.status(201).json({
      message: 'Hotel booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    console.error('Create hotel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create package booking
router.post('/package', auth, [
  body('packageId').notEmpty().withMessage('Package ID is required'),
  body('travelers').isArray({ min: 1 }).withMessage('At least one traveler is required'),
  body('travelers.*.firstName').notEmpty().withMessage('First name is required'),
  body('travelers.*.lastName').notEmpty().withMessage('Last name is required'),
  body('travelers.*.passport').notEmpty().withMessage('Passport number is required'),
  body('travelers.*.dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('departureDate').isISO8601().withMessage('Valid departure date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { packageId, travelers, departureDate, specialRequests } = req.body;

    // Mock package booking creation
    const newBooking = {
      id: `booking_${Date.now()}`,
      userId: req.user._id,
      type: 'package',
      itemId: packageId,
      itemDetails: {
        name: 'Dubai Adventure Package',
        duration: 7,
        destinations: ['Dubai', 'Abu Dhabi'],
        departureDate
      },
      travelers,
      specialRequests,
      totalAmount: 2500 * travelers.length,
      currency: 'USD',
      status: 'pending',
      bookingDate: new Date().toISOString(),
      paymentStatus: 'pending'
    };

    // In a real application, you would save this to the database
    mockBookings.push(newBooking);

    res.status(201).json({
      message: 'Package booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    console.error('Create package booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const booking = mockBookings.find(b => b.id === req.params.id && b.userId === req.user._id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed booking' });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date().toISOString();

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking
router.put('/:id', auth, [
  body('specialRequests').optional().isString(),
  body('contactInfo').optional().isObject()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = mockBookings.find(b => b.id === req.params.id && b.userId === req.user._id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot update cancelled or completed booking' });
    }

    const { specialRequests, contactInfo } = req.body;

    if (specialRequests) booking.specialRequests = specialRequests;
    if (contactInfo) booking.contactInfo = contactInfo;

    res.json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
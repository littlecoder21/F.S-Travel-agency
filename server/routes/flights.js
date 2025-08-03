const express = require('express');
const { body, validationResult } = require('express-validator');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Mock flight data
const mockFlights = [
  {
    id: '1',
    airline: 'Emirates',
    flightNumber: 'EK123',
    from: 'New York',
    to: 'Dubai',
    departureTime: '2024-01-15T10:00:00Z',
    arrivalTime: '2024-01-16T08:00:00Z',
    duration: '22h 0m',
    price: 1200,
    currency: 'USD',
    class: 'Economy',
    stops: 0,
    aircraft: 'Boeing 777',
    availableSeats: 45
  },
  {
    id: '2',
    airline: 'Qatar Airways',
    flightNumber: 'QR456',
    from: 'London',
    to: 'Doha',
    departureTime: '2024-01-15T14:30:00Z',
    arrivalTime: '2024-01-15T23:45:00Z',
    duration: '9h 15m',
    price: 850,
    currency: 'USD',
    class: 'Business',
    stops: 0,
    aircraft: 'Airbus A350',
    availableSeats: 12
  },
  {
    id: '3',
    airline: 'Singapore Airlines',
    flightNumber: 'SQ789',
    from: 'Singapore',
    to: 'Tokyo',
    departureTime: '2024-01-15T08:15:00Z',
    arrivalTime: '2024-01-15T16:30:00Z',
    duration: '8h 15m',
    price: 650,
    currency: 'USD',
    class: 'Economy',
    stops: 0,
    aircraft: 'Boeing 787',
    availableSeats: 78
  },
  {
    id: '4',
    airline: 'Lufthansa',
    flightNumber: 'LH234',
    from: 'Frankfurt',
    to: 'New York',
    departureTime: '2024-01-15T11:45:00Z',
    arrivalTime: '2024-01-15T14:20:00Z',
    duration: '8h 35m',
    price: 950,
    currency: 'USD',
    class: 'Economy',
    stops: 0,
    aircraft: 'Airbus A380',
    availableSeats: 32
  },
  {
    id: '5',
    airline: 'British Airways',
    flightNumber: 'BA567',
    from: 'London',
    to: 'Paris',
    departureTime: '2024-01-15T09:00:00Z',
    arrivalTime: '2024-01-15T11:30:00Z',
    duration: '2h 30m',
    price: 280,
    currency: 'USD',
    class: 'Economy',
    stops: 0,
    aircraft: 'Airbus A320',
    availableSeats: 89
  }
];

// Search flights
router.get('/search', optionalAuth, [
  body('from').notEmpty().withMessage('Departure city is required'),
  body('to').notEmpty().withMessage('Arrival city is required'),
  body('departureDate').isISO8601().withMessage('Valid departure date is required'),
  body('returnDate').optional().isISO8601().withMessage('Valid return date is required'),
  body('passengers').isInt({ min: 1, max: 9 }).withMessage('Passengers must be between 1 and 9'),
  body('class').optional().isIn(['Economy', 'Business', 'First']).withMessage('Invalid class'),
  body('tripType').isIn(['oneway', 'roundtrip']).withMessage('Trip type must be oneway or roundtrip')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      from,
      to,
      departureDate,
      returnDate,
      passengers = 1,
      class: flightClass = 'Economy',
      tripType = 'oneway'
    } = req.query;

    // Filter flights based on search criteria
    let filteredFlights = mockFlights.filter(flight => {
      const matchesRoute = flight.from.toLowerCase().includes(from.toLowerCase()) &&
                          flight.to.toLowerCase().includes(to.toLowerCase());
      const matchesClass = flight.class === flightClass;
      const hasEnoughSeats = flight.availableSeats >= passengers;
      
      return matchesRoute && matchesClass && hasEnoughSeats;
    });

    // Add return flights for round trip
    let returnFlights = [];
    if (tripType === 'roundtrip' && returnDate) {
      returnFlights = mockFlights.filter(flight => {
        const matchesRoute = flight.from.toLowerCase().includes(to.toLowerCase()) &&
                            flight.to.toLowerCase().includes(from.toLowerCase());
        const matchesClass = flight.class === flightClass;
        const hasEnoughSeats = flight.availableSeats >= passengers;
        
        return matchesRoute && matchesClass && hasEnoughSeats;
      });
    }

    // Sort by price
    filteredFlights.sort((a, b) => a.price - b.price);
    returnFlights.sort((a, b) => a.price - b.price);

    res.json({
      outbound: filteredFlights,
      return: returnFlights,
      searchCriteria: {
        from,
        to,
        departureDate,
        returnDate,
        passengers,
        class: flightClass,
        tripType
      }
    });
  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get flight by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const flight = mockFlights.find(f => f.id === req.params.id);
    
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    res.json(flight);
  } catch (error) {
    console.error('Get flight error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular routes
router.get('/popular/routes', optionalAuth, async (req, res) => {
  try {
    const popularRoutes = [
      { from: 'New York', to: 'London', avgPrice: 850 },
      { from: 'London', to: 'Paris', avgPrice: 280 },
      { from: 'Tokyo', to: 'Singapore', avgPrice: 650 },
      { from: 'Dubai', to: 'London', avgPrice: 750 },
      { from: 'Sydney', to: 'Singapore', avgPrice: 580 }
    ];

    res.json(popularRoutes);
  } catch (error) {
    console.error('Get popular routes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get airlines
router.get('/airlines/list', optionalAuth, async (req, res) => {
  try {
    const airlines = [...new Set(mockFlights.map(flight => flight.airline))];
    res.json(airlines.sort());
  } catch (error) {
    console.error('Get airlines error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get airports
router.get('/airports/list', optionalAuth, async (req, res) => {
  try {
    const airports = [...new Set([
      ...mockFlights.map(flight => flight.from),
      ...mockFlights.map(flight => flight.to)
    ])];
    res.json(airports.sort());
  } catch (error) {
    console.error('Get airports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
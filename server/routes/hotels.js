const express = require('express');
const { body, validationResult } = require('express-validator');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Mock hotel data
const mockHotels = [
  {
    id: '1',
    name: 'Grand Hyatt Dubai',
    location: 'Dubai, UAE',
    address: 'Sheikh Rashid Road, Dubai',
    rating: 4.8,
    reviewCount: 1247,
    price: 350,
    currency: 'USD',
    originalPrice: 420,
    discount: 17,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'
    ],
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar'],
    roomTypes: ['Standard', 'Deluxe', 'Suite'],
    description: 'Luxury hotel in the heart of Dubai with stunning city views',
    checkIn: '15:00',
    checkOut: '12:00',
    availableRooms: 45
  },
  {
    id: '2',
    name: 'The Ritz-Carlton London',
    location: 'London, UK',
    address: '150 Piccadilly, London',
    rating: 4.9,
    reviewCount: 892,
    price: 580,
    currency: 'USD',
    originalPrice: 650,
    discount: 11,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'
    ],
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Concierge'],
    roomTypes: ['Deluxe', 'Executive', 'Presidential Suite'],
    description: 'Historic luxury hotel in the heart of London',
    checkIn: '15:00',
    checkOut: '12:00',
    availableRooms: 23
  },
  {
    id: '3',
    name: 'Marina Bay Sands',
    location: 'Singapore',
    address: '10 Bayfront Avenue, Singapore',
    rating: 4.7,
    reviewCount: 2156,
    price: 420,
    currency: 'USD',
    originalPrice: 480,
    discount: 13,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'
    ],
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Casino'],
    roomTypes: ['Garden View', 'Harbour View', 'Suite'],
    description: 'Iconic hotel with the world\'s largest rooftop infinity pool',
    checkIn: '15:00',
    checkOut: '12:00',
    availableRooms: 67
  },
  {
    id: '4',
    name: 'Park Hyatt Tokyo',
    location: 'Tokyo, Japan',
    address: '3-7-1-2 Nishi-Shinjuku, Tokyo',
    rating: 4.6,
    reviewCount: 743,
    price: 380,
    currency: 'USD',
    originalPrice: 450,
    discount: 16,
    images: [
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'
    ],
    amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar'],
    roomTypes: ['Standard', 'Deluxe', 'Suite'],
    description: 'Luxury hotel with stunning views of Tokyo',
    checkIn: '15:00',
    checkOut: '12:00',
    availableRooms: 34
  },
  {
    id: '5',
    name: 'The Plaza New York',
    location: 'New York, USA',
    address: '768 5th Avenue, New York',
    rating: 4.5,
    reviewCount: 1567,
    price: 520,
    currency: 'USD',
    originalPrice: 580,
    discount: 10,
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800'
    ],
    amenities: ['WiFi', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Concierge'],
    roomTypes: ['Standard', 'Deluxe', 'Suite'],
    description: 'Historic luxury hotel in the heart of Manhattan',
    checkIn: '15:00',
    checkOut: '12:00',
    availableRooms: 28
  }
];

// Search hotels
router.get('/search', optionalAuth, [
  body('location').notEmpty().withMessage('Location is required'),
  body('checkIn').isISO8601().withMessage('Valid check-in date is required'),
  body('checkOut').isISO8601().withMessage('Valid check-out date is required'),
  body('guests').isInt({ min: 1, max: 10 }).withMessage('Guests must be between 1 and 10'),
  body('rooms').isInt({ min: 1, max: 5 }).withMessage('Rooms must be between 1 and 5'),
  body('minPrice').optional().isFloat({ min: 0 }),
  body('maxPrice').optional().isFloat({ min: 0 }),
  body('rating').optional().isFloat({ min: 0, max: 5 }),
  body('amenities').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      location,
      checkIn,
      checkOut,
      guests = 2,
      rooms = 1,
      minPrice,
      maxPrice,
      rating,
      amenities = []
    } = req.query;

    // Filter hotels based on search criteria
    let filteredHotels = mockHotels.filter(hotel => {
      const matchesLocation = hotel.location.toLowerCase().includes(location.toLowerCase());
      const matchesPrice = (!minPrice || hotel.price >= parseFloat(minPrice)) &&
                          (!maxPrice || hotel.price <= parseFloat(maxPrice));
      const matchesRating = !rating || hotel.rating >= parseFloat(rating);
      const matchesAmenities = amenities.length === 0 || 
                              amenities.every(amenity => hotel.amenities.includes(amenity));
      const hasEnoughRooms = hotel.availableRooms >= parseInt(rooms);
      
      return matchesLocation && matchesPrice && matchesRating && matchesAmenities && hasEnoughRooms;
    });

    // Sort by rating and price
    filteredHotels.sort((a, b) => {
      if (a.rating !== b.rating) {
        return b.rating - a.rating;
      }
      return a.price - b.price;
    });

    res.json({
      hotels: filteredHotels,
      searchCriteria: {
        location,
        checkIn,
        checkOut,
        guests: parseInt(guests),
        rooms: parseInt(rooms),
        minPrice: minPrice ? parseFloat(minPrice) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        rating: rating ? parseFloat(rating) : null,
        amenities
      }
    });
  } catch (error) {
    console.error('Hotel search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get hotel by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const hotel = mockHotels.find(h => h.id === req.params.id);
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    res.json(hotel);
  } catch (error) {
    console.error('Get hotel error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular destinations
router.get('/popular/destinations', optionalAuth, async (req, res) => {
  try {
    const popularDestinations = [
      { location: 'Dubai, UAE', avgPrice: 350, hotelCount: 45 },
      { location: 'London, UK', avgPrice: 420, hotelCount: 67 },
      { location: 'Singapore', avgPrice: 380, hotelCount: 34 },
      { location: 'Tokyo, Japan', avgPrice: 320, hotelCount: 56 },
      { location: 'New York, USA', avgPrice: 480, hotelCount: 78 }
    ];

    res.json(popularDestinations);
  } catch (error) {
    console.error('Get popular destinations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get hotel amenities
router.get('/amenities/list', optionalAuth, async (req, res) => {
  try {
    const amenities = [...new Set(mockHotels.flatMap(hotel => hotel.amenities))];
    res.json(amenities.sort());
  } catch (error) {
    console.error('Get amenities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get room types
router.get('/room-types/list', optionalAuth, async (req, res) => {
  try {
    const roomTypes = [...new Set(mockHotels.flatMap(hotel => hotel.roomTypes))];
    res.json(roomTypes.sort());
  } catch (error) {
    console.error('Get room types error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get locations
router.get('/locations/list', optionalAuth, async (req, res) => {
  try {
    const locations = [...new Set(mockHotels.map(hotel => hotel.location))];
    res.json(locations.sort());
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
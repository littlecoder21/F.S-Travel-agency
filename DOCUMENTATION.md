# Travel Agency Website - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [Installation & Setup](#installation--setup)
6. [API Documentation](#api-documentation)
7. [Database Schema](#database-schema)
8. [Frontend Components](#frontend-components)
9. [Admin Panel](#admin-panel)
10. [Internationalization](#internationalization)
11. [Security](#security)
12. [Deployment](#deployment)
13. [Testing](#testing)
14. [Troubleshooting](#troubleshooting)

## Project Overview

The Travel Agency Website is a comprehensive, modern web application designed for travel and tourism agencies. It provides a complete solution for managing travel bookings, destinations, packages, and customer interactions.

### Key Features
- **Multi-language Support**: 6 languages (English, Spanish, French, German, Arabic, Chinese)
- **Responsive Design**: Works seamlessly on all devices
- **Real-time Search**: Advanced search functionality for flights, hotels, and destinations
- **Admin Panel**: Full-featured administration interface
- **Booking System**: Complete booking management for flights, hotels, and packages
- **Custom Packages**: Allow users to create personalized travel packages
- **Feature Toggles**: Enable/disable features through admin panel

## Architecture

### Frontend Architecture
```
client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Common components (buttons, forms, etc.)
│   │   ├── layout/         # Layout components (navbar, footer, etc.)
│   │   └── forms/          # Form components
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin panel pages
│   │   └── public/         # Public pages
│   ├── contexts/           # React contexts (Auth, Settings)
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── styles/             # CSS and styled components
│   ├── locales/            # Translation files
│   └── utils/              # Utility functions
```

### Backend Architecture
```
server/
├── models/                 # MongoDB models
├── routes/                 # API route handlers
├── middleware/             # Express middleware
├── mock-data/              # Mock data for testing
├── config/                 # Configuration files
└── utils/                  # Utility functions
```

## Features

### 1. Hero Section with Video
- Full-screen video background
- Welcome message and call-to-action buttons
- Contact button for immediate customer support

### 2. Search Forms
- **Flight Search**: Round-trip, one-way, multi-city options
- **Hotel Search**: Location, dates, guests, rooms
- **Destination Search**: Local and international destinations
- Breadcrumb navigation for form switching

### 3. Discount Slider
- Full-width, slim height slider
- Special offers and promotional deals
- Auto-scrolling with manual controls

### 4. Destination Sections
- **Top Destinations**: Most popular places
- **Local Destinations**: Nearby tourist spots
- **International Destinations**: Global travel options
- "Show More" buttons for navigation

### 5. Package Management
- **Featured Packages**: Curated travel experiences
- **Custom Package Creation**: User-defined packages
- **Package Categories**: Adventure, cultural, luxury, etc.

### 6. Admin Panel
- **Dashboard**: Statistics and overview
- **User Management**: CRUD operations for users
- **Content Management**: Destinations and packages
- **Settings**: Website configuration
- **Feature Toggles**: Enable/disable functionality

## Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **React Router DOM**: Client-side routing
- **React Hook Form**: Form handling and validation
- **React Query**: Server state management
- **React I18next**: Internationalization
- **Styled Components**: CSS-in-JS styling
- **Framer Motion**: Animations and transitions
- **React Hot Toast**: Notifications
- **React Select**: Advanced select components
- **React Datepicker**: Date selection
- **React Slick**: Carousel/slider components

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **Express Validator**: Input validation
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Morgan**: HTTP request logging
- **Compression**: Response compression

### Development Tools
- **Concurrently**: Run multiple commands
- **Nodemon**: Auto-restart server
- **React Scripts**: Create React App scripts

## Installation & Setup

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- MongoDB (local or Atlas)

### Quick Setup
```bash
# Clone repository
git clone <repository-url>
cd travel-agency-website

# Run automated setup
chmod +x setup.sh
./setup.sh

# Configure environment variables
# Edit server/.env and client/.env

# Seed database (optional)
cd server && node seed.js && cd ..

# Start development servers
./start-dev.sh
```

### Manual Setup
```bash
# Install dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

# Create environment files
# Copy .env.example to .env in both server/ and client/

# Start servers
npm run dev  # Runs both server and client
```

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Destination Endpoints

#### Get All Destinations
```http
GET /api/destinations?page=1&limit=12&type=international&featured=true
```

#### Get Destination by ID
```http
GET /api/destinations/:id
```

#### Search Destinations
```http
GET /api/destinations/search/query?q=dubai&type=international
```

### Package Endpoints

#### Get All Packages
```http
GET /api/packages?category=luxury&featured=true&minPrice=1000&maxPrice=5000
```

#### Create Custom Package
```http
POST /api/packages/custom
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Custom Package",
  "description": "Personalized travel experience",
  "destinations": [
    {
      "destination": "destination_id",
      "duration": 3
    }
  ],
  "duration": 7,
  "category": "adventure"
}
```

### Flight Search
```http
GET /api/flights/search?from=New York&to=London&departureDate=2024-01-15&returnDate=2024-01-22&passengers=2&class=Economy&tripType=roundtrip
```

### Hotel Search
```http
GET /api/hotels/search?location=Dubai&checkIn=2024-01-15&checkOut=2024-01-18&guests=2&rooms=1&minPrice=100&maxPrice=500
```

### Booking Endpoints

#### Create Flight Booking
```http
POST /api/bookings/flight
Authorization: Bearer <token>
Content-Type: application/json

{
  "flightId": "flight_123",
  "passengers": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "passport": "AB123456",
      "dateOfBirth": "1990-01-01"
    }
  ]
}
```

### Admin Endpoints

#### Get Dashboard Stats
```http
GET /api/admin/dashboard
Authorization: Bearer <admin_token>
```

#### Toggle Feature
```http
POST /api/admin/toggle-feature
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "feature": "flightSearch.enabled",
  "enabled": false
}
```

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  preferences: {
    language: String,
    currency: String
  },
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Destination Model
```javascript
{
  name: String,
  description: String,
  shortDescription: String,
  type: String (enum: ['local', 'international']),
  country: String,
  city: String,
  images: [{
    url: String,
    alt: String,
    isMain: Boolean
  }],
  rating: Number,
  reviewCount: Number,
  priceRange: {
    min: Number,
    max: Number,
    currency: String
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
  isFeatured: Boolean,
  isActive: Boolean
}
```

### Package Model
```javascript
{
  name: String,
  description: String,
  shortDescription: String,
  type: String (enum: ['predefined', 'custom']),
  destinations: [{
    destination: ObjectId (ref: 'Destination'),
    duration: Number,
    order: Number
  }],
  duration: Number,
  price: {
    amount: Number,
    currency: String,
    originalPrice: Number,
    discount: Number
  },
  inclusions: [String],
  exclusions: [String],
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    activities: [String],
    meals: {
      breakfast: Boolean,
      lunch: Boolean,
      dinner: Boolean
    },
    accommodation: String,
    transportation: String
  }],
  category: String,
  difficulty: String,
  maxGroupSize: Number,
  minGroupSize: Number,
  isFeatured: Boolean,
  isActive: Boolean
}
```

### Settings Model
```javascript
{
  website: {
    name: String,
    description: String,
    logo: String,
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
      enabled: Boolean,
      showRoundTrip: Boolean,
      showSingleTrip: Boolean,
      showMultiCity: Boolean
    },
    hotelSearch: {
      enabled: Boolean,
      showRoomTypes: Boolean,
      showAmenities: Boolean
    },
    destinationSearch: {
      enabled: Boolean,
      showLocalDestinations: Boolean,
      showInternationalDestinations: Boolean
    },
    packages: {
      enabled: Boolean,
      allowCustomPackages: Boolean,
      showFeaturedPackages: Boolean
    },
    discounts: {
      enabled: Boolean,
      showSlider: Boolean
    },
    reviews: {
      enabled: Boolean,
      requireApproval: Boolean
    },
    booking: {
      enabled: Boolean,
      requirePayment: Boolean,
      allowPartialPayment: Boolean
    }
  },
  languages: {
    default: String,
    supported: [{
      code: String,
      name: String,
      flag: String,
      enabled: Boolean
    }]
  },
  currencies: {
    default: String,
    supported: [{
      code: String,
      symbol: String,
      name: String,
      enabled: Boolean
    }]
  }
}
```

## Frontend Components

### Core Components

#### Navbar
- Logo and navigation links
- Language selector
- User authentication status
- Admin panel access
- Mobile responsive menu

#### Hero Section
- Video background
- Welcome message
- Call-to-action buttons
- Search form integration

#### Search Forms
- Tabbed interface for different search types
- Form validation
- Responsive design
- Breadcrumb navigation

#### Destination Cards
- Image gallery
- Rating and reviews
- Price information
- Quick actions (book, wishlist)

#### Package Cards
- Package details
- Category badges
- Duration and difficulty
- Pricing with discounts

### Form Components

#### Flight Search Form
- Trip type selection (round-trip, one-way)
- Origin and destination inputs
- Date pickers
- Passenger count
- Class selection

#### Hotel Search Form
- Location input
- Check-in/check-out dates
- Guest and room count
- Price range filter

#### Booking Forms
- Passenger information
- Contact details
- Payment integration
- Confirmation steps

## Admin Panel

### Dashboard
- **Statistics Overview**
  - Total users
  - Total destinations
  - Total packages
  - Total bookings
  - Revenue metrics

- **Recent Activity**
  - Latest bookings
  - New user registrations
  - System logs

### User Management
- **User List**
  - Search and filter users
  - Pagination
  - Bulk actions

- **User Details**
  - Profile information
  - Booking history
  - Role management

### Content Management

#### Destination Management
- **CRUD Operations**
  - Create new destinations
  - Edit existing destinations
  - Delete destinations
  - Feature/unfeature destinations

- **Media Management**
  - Image upload
  - Gallery management
  - Alt text and descriptions

#### Package Management
- **Package Creation**
  - Basic information
  - Destination selection
  - Itinerary planning
  - Pricing configuration

- **Package Customization**
  - Inclusions/exclusions
  - Activity selection
  - Accommodation options

### Settings Management

#### Website Settings
- **General Information**
  - Company name and description
  - Contact information
  - Social media links

- **Feature Configuration**
  - Enable/disable features
  - Search options
  - Booking settings

#### Language & Currency
- **Language Management**
  - Add/remove languages
  - Set default language
  - Translation management

- **Currency Management**
  - Supported currencies
  - Exchange rates
  - Default currency

## Internationalization

### Supported Languages
1. **English (en)** - Default language
2. **Spanish (es)** - Español
3. **French (fr)** - Français
4. **German (de)** - Deutsch
5. **Arabic (ar)** - العربية
6. **Chinese (zh)** - 中文

### Translation Structure
```javascript
{
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "success": "Success!"
  },
  "navigation": {
    "home": "Home",
    "destinations": "Destinations",
    "packages": "Packages"
  },
  "home": {
    "hero": {
      "title": "Discover Your Next Adventure",
      "subtitle": "Explore the world with our curated travel experiences"
    }
  }
}
```

### Language Switching
- Automatic language detection
- Manual language selection
- Persistent language preference
- RTL support for Arabic

## Security

### Authentication
- **JWT Tokens**
  - Secure token generation
  - Token expiration
  - Refresh token mechanism

- **Password Security**
  - bcrypt hashing
  - Password strength requirements
  - Account lockout protection

### Authorization
- **Role-based Access Control**
  - User roles (user, admin)
  - Route protection
  - Feature-level permissions

### Data Protection
- **Input Validation**
  - Server-side validation
  - SQL injection prevention
  - XSS protection

- **API Security**
  - Rate limiting
  - CORS configuration
  - Helmet security headers

### Environment Variables
- **Sensitive Data**
  - Database credentials
  - API keys
  - JWT secrets
  - Payment credentials

## Deployment

### Development Environment
```bash
# Start development servers
./start-dev.sh

# Access URLs
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# API: http://localhost:5000/api
```

### Production Environment

#### Frontend Deployment
```bash
# Build for production
cd client
npm run build

# Deploy to static hosting (Netlify, Vercel, etc.)
```

#### Backend Deployment
```bash
# Set production environment variables
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret

# Start production server
cd server
npm start
```

### Docker Deployment
```dockerfile
# Dockerfile for backend
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Configuration
```env
# Production .env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travel-agency
JWT_SECRET=your-super-secret-production-key
CLIENT_URL=https://your-domain.com
```

## Testing

### Frontend Testing
```bash
# Run tests
cd client
npm test

# Run tests with coverage
npm test -- --coverage
```

### Backend Testing
```bash
# Run tests
cd server
npm test

# Run tests with coverage
npm test -- --coverage
```

### API Testing
- **Postman Collections**
  - Authentication endpoints
  - CRUD operations
  - Admin endpoints

- **Integration Tests**
  - Database operations
  - Authentication flow
  - Booking process

## Troubleshooting

### Common Issues

#### MongoDB Connection
```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check connection string
echo $MONGODB_URI
```

#### Port Conflicts
```bash
# Check port usage
lsof -i :3000
lsof -i :5000

# Kill process using port
kill -9 <PID>
```

#### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Environment Variables
```bash
# Check environment variables
echo $NODE_ENV
echo $MONGODB_URI

# Load environment variables
source .env
```

### Performance Optimization

#### Frontend
- **Code Splitting**
  - Route-based splitting
  - Component lazy loading
  - Bundle analysis

- **Image Optimization**
  - WebP format
  - Responsive images
  - Lazy loading

#### Backend
- **Database Optimization**
  - Index creation
  - Query optimization
  - Connection pooling

- **Caching**
  - Redis integration
  - Response caching
  - Static asset caching

### Monitoring

#### Application Monitoring
- **Error Tracking**
  - Sentry integration
  - Error logging
  - Performance monitoring

- **Health Checks**
  - API health endpoints
  - Database connectivity
  - Service status

#### Logging
- **Request Logging**
  - Morgan middleware
  - Request/response logging
  - Error logging

- **Audit Logging**
  - User actions
  - Admin operations
  - Security events

## Support & Maintenance

### Regular Maintenance
- **Database Backups**
  - Automated backups
  - Backup verification
  - Recovery testing

- **Security Updates**
  - Dependency updates
  - Security patches
  - Vulnerability scanning

### Documentation Updates
- **API Documentation**
  - Endpoint updates
  - Parameter changes
  - Response format updates

- **User Guides**
  - Feature documentation
  - Troubleshooting guides
  - FAQ updates

### Community Support
- **Issue Tracking**
  - GitHub issues
  - Bug reports
  - Feature requests

- **Contributions**
  - Pull requests
  - Code reviews
  - Documentation contributions

---

This documentation provides a comprehensive guide to the Travel Agency Website project. For additional support or questions, please refer to the project's README file or create an issue in the repository.
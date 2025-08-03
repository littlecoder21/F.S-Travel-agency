#!/bin/bash

# Travel Agency Website Setup Script
# This script sets up the complete travel agency website with React frontend and Express backend

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -ge 16 ]; then
            print_success "Node.js version $(node -v) is compatible"
        else
            print_error "Node.js version $(node -v) is too old. Please install Node.js 16 or higher."
            exit 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 16 or higher."
        exit 1
    fi
}

# Function to check npm version
check_npm_version() {
    if command_exists npm; then
        print_success "npm version $(npm -v) is available"
    else
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
}

# Function to check MongoDB
check_mongodb() {
    if command_exists mongod; then
        print_success "MongoDB is installed"
    else
        print_warning "MongoDB is not installed. Please install MongoDB or use MongoDB Atlas."
        print_status "You can install MongoDB from: https://docs.mongodb.com/manual/installation/"
    fi
}

# Function to create environment files
create_env_files() {
    print_status "Creating environment files..."
    
    # Create .env file for server
    if [ ! -f "server/.env" ]; then
        cat > server/.env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/travel-agency

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Configuration
CLIENT_URL=http://localhost:3000

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Payment Configuration (optional)
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
EOF
        print_success "Created server/.env file"
    else
        print_warning "server/.env file already exists"
    fi
    
    # Create .env file for client
    if [ ! -f "client/.env" ]; then
        cat > client/.env << EOF
# React App Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Travel Agency
REACT_APP_VERSION=1.0.0
EOF
        print_success "Created client/.env file"
    else
        print_warning "client/.env file already exists"
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    print_status "Installing root dependencies..."
    npm install
    
    # Install server dependencies
    print_status "Installing server dependencies..."
    cd server
    npm install
    cd ..
    
    # Install client dependencies
    print_status "Installing client dependencies..."
    cd client
    npm install
    cd ..
    
    print_success "All dependencies installed successfully"
}

# Function to create mock data
create_mock_data() {
    print_status "Creating mock data..."
    
    # Create mock data directory
    mkdir -p server/mock-data
    
    # Create mock destinations data
    cat > server/mock-data/destinations.js << 'EOF'
const destinations = [
  {
    name: "Dubai, UAE",
    description: "Experience the luxury and grandeur of Dubai with its iconic skyscrapers, pristine beaches, and world-class shopping.",
    shortDescription: "Luxury and grandeur in the desert",
    type: "international",
    country: "UAE",
    city: "Dubai",
    images: [
      {
        url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
        alt: "Dubai Skyline",
        isMain: true
      }
    ],
    rating: 4.8,
    reviewCount: 1247,
    priceRange: {
      min: 500,
      max: 2000,
      currency: "USD"
    },
    highlights: ["Burj Khalifa", "Palm Jumeirah", "Dubai Mall", "Desert Safari"],
    activities: ["Shopping", "Desert Tours", "Water Sports", "Cultural Tours"],
    bestTimeToVisit: {
      from: "November",
      to: "March"
    },
    weather: {
      temperature: {
        min: 20,
        max: 35
      },
      description: "Hot desert climate"
    },
    location: {
      latitude: 25.2048,
      longitude: 55.2708
    },
    tags: ["luxury", "shopping", "desert", "modern"],
    isFeatured: true,
    isActive: true
  },
  {
    name: "Bali, Indonesia",
    description: "Discover the spiritual and cultural heart of Indonesia with its beautiful temples, rice terraces, and pristine beaches.",
    shortDescription: "Spiritual paradise with stunning nature",
    type: "international",
    country: "Indonesia",
    city: "Bali",
    images: [
      {
        url: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800",
        alt: "Bali Temple",
        isMain: true
      }
    ],
    rating: 4.7,
    reviewCount: 2156,
    priceRange: {
      min: 300,
      max: 1500,
      currency: "USD"
    },
    highlights: ["Ubud", "Tanah Lot Temple", "Rice Terraces", "Beaches"],
    activities: ["Temple Visits", "Rice Terrace Tours", "Beach Activities", "Spa"],
    bestTimeToVisit: {
      from: "April",
      to: "October"
    },
    weather: {
      temperature: {
        min: 25,
        max: 32
      },
      description: "Tropical climate"
    },
    location: {
      latitude: -8.3405,
      longitude: 115.0920
    },
    tags: ["culture", "nature", "spiritual", "beach"],
    isFeatured: true,
    isActive: true
  }
];

module.exports = destinations;
EOF

    # Create mock packages data
    cat > server/mock-data/packages.js << 'EOF'
const packages = [
  {
    name: "Dubai Luxury Adventure",
    description: "Experience the best of Dubai with luxury accommodations, desert adventures, and city tours.",
    shortDescription: "Luxury Dubai experience with desert adventures",
    type: "predefined",
    duration: 7,
    price: {
      amount: 2500,
      currency: "USD",
      originalPrice: 3000,
      discount: 17
    },
    category: "luxury",
    difficulty: "easy",
    maxGroupSize: 12,
    minGroupSize: 2,
    inclusions: [
      "Luxury hotel accommodation",
      "Daily breakfast",
      "Desert safari with dinner",
      "City tour with guide",
      "Airport transfers",
      "All entrance fees"
    ],
    exclusions: [
      "International flights",
      "Personal expenses",
      "Travel insurance",
      "Tips and gratuities"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Dubai",
        description: "Welcome to Dubai! Transfer to your luxury hotel and evening at leisure.",
        activities: ["Airport pickup", "Hotel check-in", "Welcome dinner"],
        meals: {
          breakfast: false,
          lunch: false,
          dinner: true
        },
        accommodation: "5-star hotel",
        transportation: "Private transfer"
      },
      {
        day: 2,
        title: "Dubai City Tour",
        description: "Explore the iconic landmarks of Dubai including Burj Khalifa and Dubai Mall.",
        activities: ["Burj Khalifa visit", "Dubai Mall shopping", "Dubai Fountain show"],
        meals: {
          breakfast: true,
          lunch: true,
          dinner: false
        },
        accommodation: "5-star hotel",
        transportation: "Air-conditioned coach"
      }
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
        alt: "Dubai Package",
        isMain: true
      }
    ],
    rating: 4.9,
    reviewCount: 89,
    tags: ["luxury", "dubai", "desert", "adventure"],
    isFeatured: true,
    isActive: true
  }
];

module.exports = packages;
EOF

    print_success "Mock data created successfully"
}

# Function to create seed script
create_seed_script() {
    print_status "Creating database seed script..."
    
    cat > server/seed.js << 'EOF'
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Destination = require('./models/Destination');
const Package = require('./models/Package');
const Settings = require('./models/Settings');

// Import mock data
const destinations = require('./mock-data/destinations');
const packages = require('./mock-data/packages');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-agency');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Destination.deleteMany({});
    await Package.deleteMany({});
    await Settings.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@travelagency.com',
      password: adminPassword,
      role: 'admin',
      phone: '+1234567890',
      isActive: true
    });
    await adminUser.save();
    console.log('Created admin user');

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const regularUser = new User({
      name: 'John Doe',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
      phone: '+1234567891',
      isActive: true
    });
    await regularUser.save();
    console.log('Created regular user');

    // Create destinations
    for (const destinationData of destinations) {
      const destination = new Destination({
        ...destinationData,
        createdBy: adminUser._id
      });
      await destination.save();
    }
    console.log(`Created ${destinations.length} destinations`);

    // Create packages
    for (const packageData of packages) {
      const package = new Package({
        ...packageData,
        createdBy: adminUser._id
      });
      await package.save();
    }
    console.log(`Created ${packages.length} packages`);

    // Create default settings
    const settings = new Settings({
      website: {
        name: 'Travel Agency',
        description: 'Your trusted partner for amazing travel experiences',
        contactEmail: 'info@travelagency.com',
        contactPhone: '+1234567890',
        address: '123 Travel Street, Tourism City, TC 12345',
        socialMedia: {
          facebook: 'https://facebook.com/travelagency',
          twitter: 'https://twitter.com/travelagency',
          instagram: 'https://instagram.com/travelagency',
          linkedin: 'https://linkedin.com/company/travelagency',
          youtube: 'https://youtube.com/travelagency'
        }
      },
      features: {
        flightSearch: {
          enabled: true,
          showRoundTrip: true,
          showSingleTrip: true,
          showMultiCity: false
        },
        hotelSearch: {
          enabled: true,
          showRoomTypes: true,
          showAmenities: true
        },
        destinationSearch: {
          enabled: true,
          showLocalDestinations: true,
          showInternationalDestinations: true
        },
        packages: {
          enabled: true,
          allowCustomPackages: true,
          showFeaturedPackages: true
        },
        discounts: {
          enabled: true,
          showSlider: true
        },
        reviews: {
          enabled: true,
          requireApproval: true
        },
        booking: {
          enabled: true,
          requirePayment: true,
          allowPartialPayment: false
        }
      },
      languages: {
        default: 'en',
        supported: [
          { code: 'en', name: 'English', flag: '🇺🇸', enabled: true },
          { code: 'es', name: 'Español', flag: '🇪🇸', enabled: true },
          { code: 'fr', name: 'Français', flag: '🇫🇷', enabled: true },
          { code: 'de', name: 'Deutsch', flag: '🇩🇪', enabled: true },
          { code: 'ar', name: 'العربية', flag: '🇸🇦', enabled: true },
          { code: 'zh', name: '中文', flag: '🇨🇳', enabled: true }
        ]
      },
      currencies: {
        default: 'USD',
        supported: [
          { code: 'USD', symbol: '$', name: 'US Dollar', enabled: true },
          { code: 'EUR', symbol: '€', name: 'Euro', enabled: true },
          { code: 'GBP', symbol: '£', name: 'British Pound', enabled: true },
          { code: 'JPY', symbol: '¥', name: 'Japanese Yen', enabled: true },
          { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', enabled: true },
          { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', enabled: true }
        ]
      }
    });
    await settings.save();
    console.log('Created default settings');

    console.log('Database seeded successfully!');
    console.log('\nDefault credentials:');
    console.log('Admin: admin@travelagency.com / admin123');
    console.log('User: user@example.com / user123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();
EOF

    print_success "Seed script created successfully"
}

# Function to create start scripts
create_start_scripts() {
    print_status "Creating start scripts..."
    
    # Create start script for development
    cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "Starting Travel Agency Website in development mode..."
echo "Starting server..."
cd server && npm run dev &
SERVER_PID=$!

echo "Starting client..."
cd client && npm start &
CLIENT_PID=$!

echo "Server PID: $SERVER_PID"
echo "Client PID: $CLIENT_PID"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $SERVER_PID
    kill $CLIENT_PID
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
EOF

    chmod +x start-dev.sh
    
    # Create start script for production
    cat > start-prod.sh << 'EOF'
#!/bin/bash
echo "Starting Travel Agency Website in production mode..."

# Build client
echo "Building client..."
cd client && npm run build && cd ..

# Start server
echo "Starting server..."
cd server && npm start
EOF

    chmod +x start-prod.sh
    
    print_success "Start scripts created successfully"
}

# Function to create README
create_readme() {
    print_status "Creating README file..."
    
    cat > README.md << 'EOF'
# Travel Agency Website

A modern, responsive travel and tourism agency website built with React, Express, and MongoDB.

## Features

- 🌍 **Multi-language Support** - English, Spanish, French, German, Arabic, Chinese
- ✈️ **Flight Search** - Search and book flights with round-trip, one-way options
- 🏨 **Hotel Search** - Find and book hotels with detailed amenities
- 🗺️ **Destination Management** - Local and international destinations
- 📦 **Travel Packages** - Pre-defined and custom travel packages
- 💰 **Special Offers** - Discount slider with promotional deals
- 🔐 **Secure Authentication** - JWT-based user authentication
- 👨‍💼 **Admin Panel** - Full-featured admin dashboard
- 📱 **Responsive Design** - Works on all devices
- ⚙️ **Feature Toggles** - Enable/disable features via admin panel

## Tech Stack

### Frontend
- React 18
- React Router DOM
- React Hook Form
- React Query
- React I18next
- Styled Components
- Framer Motion
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Express Validator
- Helmet for security
- CORS support

## Quick Start

### Prerequisites
- Node.js 16 or higher
- npm
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travel-agency-website
   ```

2. **Run the setup script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Configure environment variables**
   - Edit `server/.env` for backend configuration
   - Edit `client/.env` for frontend configuration

4. **Seed the database (optional)**
   ```bash
   cd server
   node seed.js
   cd ..
   ```

5. **Start the development servers**
   ```bash
   ./start-dev.sh
   ```

### Default Credentials

After running the seed script:
- **Admin**: admin@travelagency.com / admin123
- **User**: user@example.com / user123

## Project Structure

```
travel-agency-website/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── styles/        # CSS files
│   │   └── locales/       # Translation files
│   └── package.json
├── server/                 # Express backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── mock-data/         # Mock data for testing
│   └── package.json
├── setup.sh               # Automated setup script
├── start-dev.sh           # Development start script
├── start-prod.sh          # Production start script
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get destination by ID
- `GET /api/destinations/featured/list` - Get featured destinations
- `POST /api/destinations` - Create destination (admin)

### Packages
- `GET /api/packages` - Get all packages
- `GET /api/packages/:id` - Get package by ID
- `POST /api/packages/custom` - Create custom package
- `POST /api/packages` - Create package (admin)

### Flights
- `GET /api/flights/search` - Search flights
- `GET /api/flights/popular/routes` - Get popular routes

### Hotels
- `GET /api/hotels/search` - Search hotels
- `GET /api/hotels/popular/destinations` - Get popular destinations

### Bookings
- `GET /api/bookings/my-bookings` - Get user bookings
- `POST /api/bookings/flight` - Create flight booking
- `POST /api/bookings/hotel` - Create hotel booking
- `POST /api/bookings/package` - Create package booking

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/settings` - Update website settings
- `POST /api/admin/toggle-feature` - Toggle feature

## Environment Variables

### Server (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/travel-agency
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:3000
```

### Client (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=Travel Agency
```

## Development

### Running in Development Mode
```bash
./start-dev.sh
```

### Running in Production Mode
```bash
./start-prod.sh
```

### Building for Production
```bash
cd client
npm run build
```

## Admin Panel Features

- **Dashboard** - Overview of website statistics
- **User Management** - Manage users and their roles
- **Destination Management** - Add, edit, delete destinations
- **Package Management** - Create and manage travel packages
- **Settings** - Configure website features and appearance
- **Feature Toggles** - Enable/disable specific features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@travelagency.com or create an issue in the repository.
EOF

    print_success "README file created successfully"
}

# Main setup function
main() {
    print_status "Starting Travel Agency Website Setup..."
    echo ""
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    check_node_version
    check_npm_version
    check_mongodb
    echo ""
    
    # Create environment files
    create_env_files
    echo ""
    
    # Install dependencies
    install_dependencies
    echo ""
    
    # Create mock data
    create_mock_data
    echo ""
    
    # Create seed script
    create_seed_script
    echo ""
    
    # Create start scripts
    create_start_scripts
    echo ""
    
    # Create README
    create_readme
    echo ""
    
    print_success "Setup completed successfully!"
    echo ""
    print_status "Next steps:"
    echo "1. Configure your environment variables in server/.env and client/.env"
    echo "2. Start MongoDB (if using local installation)"
    echo "3. Run 'cd server && node seed.js' to seed the database"
    echo "4. Run './start-dev.sh' to start the development servers"
    echo ""
    print_status "Default admin credentials: admin@travelagency.com / admin123"
    print_status "Default user credentials: user@example.com / user123"
    echo ""
    print_status "Happy coding! 🚀"
}

# Run main function
main "$@"
import React from 'react';

const TailwindExample = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="text-gradient">Discover</span> Your Next Adventure
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-slide-up">
            Explore the world with our curated travel experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <button className="btn btn-primary btn-lg">
              <i className="fas fa-search mr-2"></i>
              Start Exploring
            </button>
            <button className="btn btn-outline btn-lg">
              <i className="fas fa-play mr-2"></i>
              Watch Video
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide exceptional travel experiences with personalized service and competitive prices.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="card p-8 text-center group">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors duration-300">
                <i className="fas fa-globe text-2xl text-primary-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Global Destinations
              </h3>
              <p className="text-gray-600">
                Explore hundreds of destinations worldwide with our extensive network of partners.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="card p-8 text-center group">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary-200 transition-colors duration-300">
                <i className="fas fa-shield-alt text-2xl text-secondary-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Safe & Secure
              </h3>
              <p className="text-gray-600">
                Your safety is our priority with comprehensive travel insurance and 24/7 support.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="card p-8 text-center group">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-200 transition-colors duration-300">
                <i className="fas fa-dollar-sign text-2xl text-accent-600"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Best Prices
              </h3>
              <p className="text-gray-600">
                Get the best deals with our price match guarantee and exclusive member discounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Destination Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-xl text-gray-600">
              Discover our most loved travel destinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Destination Card 1 */}
            <div className="destination-card">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Santorini"
                className="destination-image"
              />
              <div className="destination-overlay"></div>
              <div className="destination-content">
                <h3 className="text-2xl font-bold mb-2">Santorini, Greece</h3>
                <p className="text-gray-200 mb-4">Experience the magic of the Mediterranean</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">$1,299</span>
                  <button className="btn btn-primary btn-sm">
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            {/* Destination Card 2 */}
            <div className="destination-card">
              <img 
                src="https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80" 
                alt="Bali"
                className="destination-image"
              />
              <div className="destination-overlay"></div>
              <div className="destination-content">
                <h3 className="text-2xl font-bold mb-2">Bali, Indonesia</h3>
                <p className="text-gray-200 mb-4">Tropical paradise awaits you</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">$899</span>
                  <button className="btn btn-primary btn-sm">
                    Book Now
                  </button>
                </div>
              </div>
            </div>

            {/* Destination Card 3 */}
            <div className="destination-card">
              <img 
                src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2036&q=80" 
                alt="Swiss Alps"
                className="destination-image"
              />
              <div className="destination-overlay"></div>
              <div className="destination-content">
                <h3 className="text-2xl font-bold mb-2">Swiss Alps</h3>
                <p className="text-gray-200 mb-4">Mountain adventures and scenic beauty</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">$1,599</span>
                  <button className="btn btn-primary btn-sm">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Form */}
      <section className="py-20 bg-gradient-primary">
        <div className="container-custom">
          <div className="search-form">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Find Your Perfect Trip
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="form-group">
                <label className="form-label">Destination</label>
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Where do you want to go?"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Check-in</label>
                <input 
                  type="date" 
                  className="search-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Check-out</label>
                <input 
                  type="date" 
                  className="search-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Travelers</label>
                <select className="search-input">
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>3 Adults</option>
                  <option>4+ Adults</option>
                </select>
              </div>
            </div>
            <div className="text-center mt-8">
              <button className="btn btn-primary btn-lg">
                <i className="fas fa-search mr-2"></i>
                Search Flights & Hotels
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Real experiences from real travelers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="testimonial-card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-user text-primary-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Johnson</h4>
                  <p className="text-gray-600 text-sm">Traveler</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Amazing experience! The booking process was smooth and our trip to Bali was absolutely perfect. Highly recommend!"
              </p>
              <div className="flex text-yellow-400 mt-4">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="testimonial-card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-user text-secondary-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Michael Chen</h4>
                  <p className="text-gray-600 text-sm">Business Traveler</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Professional service and great prices. The customer support team was incredibly helpful throughout our journey."
              </p>
              <div className="flex text-yellow-400 mt-4">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="testimonial-card">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-user text-accent-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Emily Rodriguez</h4>
                  <p className="text-gray-600 text-sm">Adventure Seeker</p>
                </div>
              </div>
              <p className="text-gray-700">
                "Our hiking trip in the Swiss Alps was unforgettable. The guides were knowledgeable and the accommodations were perfect."
              </p>
              <div className="flex text-yellow-400 mt-4">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TailwindExample;
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

export const destinationsAPI = {
  getAll: (params) => api.get('/destinations', { params }),
  getById: (id) => api.get(`/destinations/${id}`),
  getFeatured: (params) => api.get('/destinations/featured/list', { params }),
  getTop: (params) => api.get('/destinations/top/list', { params }),
  search: (params) => api.get('/destinations/search/query', { params }),
  getCountries: (params) => api.get('/destinations/countries/list', { params }),
  getCities: (country, params) => api.get(`/destinations/cities/${country}`, { params }),
  create: (data) => api.post('/destinations', data),
  update: (id, data) => api.put(`/destinations/${id}`, data),
  delete: (id) => api.delete(`/destinations/${id}`),
  toggleFeatured: (id) => api.patch(`/destinations/${id}/featured`),
};

export const packagesAPI = {
  getAll: (params) => api.get('/packages', { params }),
  getById: (id) => api.get(`/packages/${id}`),
  getFeatured: (params) => api.get('/packages/featured/list', { params }),
  getByCategory: (category, params) => api.get(`/packages/category/${category}`, { params }),
  search: (params) => api.get('/packages/search/query', { params }),
  getCategories: () => api.get('/packages/categories/list'),
  createCustom: (data) => api.post('/packages/custom', data),
  create: (data) => api.post('/packages', data),
  update: (id, data) => api.put(`/packages/${id}`, data),
  delete: (id) => api.delete(`/packages/${id}`),
  toggleFeatured: (id) => api.patch(`/packages/${id}/featured`),
};

export const flightsAPI = {
  search: (params) => api.get('/flights/search', { params }),
  getById: (id) => api.get(`/flights/${id}`),
  getPopularRoutes: () => api.get('/flights/popular/routes'),
  getAirlines: () => api.get('/flights/airlines/list'),
  getAirports: () => api.get('/flights/airports/list'),
};

export const hotelsAPI = {
  search: (params) => api.get('/hotels/search', { params }),
  getById: (id) => api.get(`/hotels/${id}`),
  getPopularDestinations: () => api.get('/hotels/popular/destinations'),
  getAmenities: () => api.get('/hotels/amenities/list'),
  getRoomTypes: () => api.get('/hotels/room-types/list'),
  getLocations: () => api.get('/hotels/locations/list'),
};

export const bookingsAPI = {
  getMyBookings: (params) => api.get('/bookings/my-bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  createFlightBooking: (data) => api.post('/bookings/flight', data),
  createHotelBooking: (data) => api.post('/bookings/hotel', data),
  createPackageBooking: (data) => api.post('/bookings/package', data),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
  update: (id, data) => api.put(`/bookings/${id}`, data),
};

export const settingsAPI = {
  getPublic: () => api.get('/settings/public'),
  getAll: () => api.get('/settings'),
  getSection: (section) => api.get(`/settings/${section}`),
  getSupportedLanguages: () => api.get('/settings/languages/supported'),
  getSupportedCurrencies: () => api.get('/settings/currencies/supported'),
  getFeatureStatus: () => api.get('/settings/features/status'),
  checkFeature: (feature) => api.get(`/settings/features/${feature}/status`),
  getWebsiteInfo: () => api.get('/settings/website/info'),
  getSEOInfo: () => api.get('/settings/seo/info'),
  getPaymentInfo: () => api.get('/settings/payment/info'),
  getEmailInfo: () => api.get('/settings/email/info'),
  getHealth: () => api.get('/settings/health/check'),
  update: (data) => api.put('/admin/settings', data),
  toggleFeature: (feature, enabled) => api.post('/admin/toggle-feature', { feature, enabled }),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getLogs: () => api.get('/admin/logs'),
};

export default api;
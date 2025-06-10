// src/services/apiConfig.js
export const API_CONFIG = {
  BASE_URL: 'http://backend.travuu-project.et.r.appspot.com',
  ENDPOINTS: {
    // Health Check
    HEALTH: '/health',
    TEST_DB: '/api/auth/test-db',

    // Authentication
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',

    // User Profile
    PROFILE: '/api/user/profile',
    TEST_AUTH: '/api/user/test-auth',

    // Recommendations
    RECOMMENDATIONS: '/api/recommendations',
    RECOMMENDATIONS_BY_CATEGORY: '/api/recommendations/category',
    RECOMMENDATIONS_FILTERED: '/api/recommendations/filtered',
    RECOMMENDATIONS_BY_USER: '/api/recommend'
  }
};

// ApiClient class
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Method untuk sanitasi error message sebelum di-throw
  sanitizeErrorMessage(error, response) {
    // Jangan tampilkan URL atau informasi teknis yang sensitif
    if (error.message) {
      // Remove URL dari error message
      let sanitizedMessage = error.message
        .replace(/http[s]?:\/\/[^\s]+/g, '[API_ENDPOINT]')
        .replace(/GET|POST|PUT|DELETE/g, '[HTTP_METHOD]')
        .replace(/\d{3}\s\([^)]+\)/g, '[HTTP_STATUS]');

      return sanitizedMessage;
    }

    if (response && !response.ok) {
      return `Request failed with status ${response.status}`;
    }

    return 'Network request failed';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      // Coba parse JSON response
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // Jika gagal parse JSON, buat response object sederhana
        data = { 
          success: false, 
          message: `Invalid response format (Status: ${response.status})` 
        };
      }

      if (!response.ok) {
        // Gunakan message dari API jika ada, atau buat generic message
        const errorMessage = data.message || data.error || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      // Log error untuk debugging (hanya di development)
      if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'){
        console.error('API request failed:', {
          endpoint,
          error: error.message,
          // Jangan log full URL untuk keamanan
        });
      }
      
      // Sanitasi error message sebelum di-throw
      const sanitizedMessage = this.sanitizeErrorMessage(error);
      throw new Error(sanitizedMessage);
    }
  }

  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    return this.request(url, {
      method: 'GET'
    });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }
}

// Export instance
export const apiClient = new ApiClient(API_CONFIG.BASE_URL);
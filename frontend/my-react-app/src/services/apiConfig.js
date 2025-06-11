// src/services/apiConfig.js
export const API_CONFIG = {
  BASE_URL: 'https://backend-dot-travuu-project.et.r.appspot.com',
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
        .replace(/http[s]?:\/\/[^\s\)\,]+/g, '[HIDDEN_URL]')
        .replace(/GET|POST|PUT|DELETE\s+/g, '')
        .replace(/\d{3}\s\([^)]+\)/g, '[HTTP_STATUS]')
        .replace(/fetch\(\)/g, 'network request')
        .replace(/Failed to fetch/gi, 'Connection failed')
        .replace(/NetworkError/gi, 'Connection failed')
        .replace(/at\s+http[s]?:\/\/[^\s]+/g, '');

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
        
        // Buat custom error tanpa URL
        const sanitizedError = new Error(this.sanitizeErrorMessage(new Error(errorMessage)));
        
        // Override stack trace untuk menghilangkan URL
        if (sanitizedError.stack) {
          sanitizedError.stack = sanitizedError.stack.replace(/http[s]?:\/\/[^\s\)]+/g, '[HIDDEN_URL]');
        }
        
        throw sanitizedError;
      }

      return data;
    } catch (error) {
      // Buat error baru tanpa informasi URL
      const cleanError = new Error(this.sanitizeErrorMessage(error));
      
      // Override stack trace untuk menghilangkan URL
      if (cleanError.stack) {
        cleanError.stack = cleanError.stack.replace(/http[s]?:\/\/[^\s\)]+/g, '[HIDDEN_URL]');
      }
      
      // Override name dan message error untuk menghilangkan URL
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        cleanError.name = 'NetworkError';
        cleanError.message = 'Unable to connect to server';
      }
      
      // Log error untuk debugging (hanya di development) - TANPA URL
      if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development'){
        console.error('API request failed:', {
          endpoint: endpoint.replace(/\?.*$/, ''), // Remove query params juga
          method: options.method || 'GET',
          status: 'Connection Failed'
        });
      }
      
      throw cleanError;
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
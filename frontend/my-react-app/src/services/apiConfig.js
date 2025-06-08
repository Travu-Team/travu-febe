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

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
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
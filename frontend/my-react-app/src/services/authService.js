// src/services/authService.js
import { apiClient, API_CONFIG } from './apiConfig';

class AuthService {
  async register(userData) {
    try {
      // Sesuaikan dengan struktur API backend
      const requestData = {
        email: userData.email,
        password: userData.password,
        name: userData.nama, // Backend menggunakan 'name', frontend menggunakan 'nama'
        rememberMe: userData.rememberMe || false
      };

      const response = await apiClient.post(API_CONFIG.ENDPOINTS.REGISTER, requestData);
      
      if (response.success && response.data?.token) {
        this.saveToken(response.data.token, userData.rememberMe);
        return response.data;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async login(credentials) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
      
      if (response.success && response.data?.token) {
        this.saveToken(response.data.token, credentials.rememberMe);
        return response.data;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async logout() {
    try {
      await apiClient.post(API_CONFIG.ENDPOINTS.LOGOUT);
    } catch (error) {
      console.warn('Logout request failed:', error);
      // Continue with local cleanup even if server request fails
    } finally {
      this.clearToken();
    }
  }

  saveToken(token, rememberMe = false) {
    if (rememberMe) {
      localStorage.setItem('token', token);
      sessionStorage.removeItem('token');
    } else {
      sessionStorage.setItem('token', token);
      localStorage.removeItem('token');
    }
  }

  getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  clearToken() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  async testAuth() {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.TEST_AUTH);
      return response.success;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService();
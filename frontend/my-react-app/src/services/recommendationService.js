// src/services/recommendationService.js
import { apiClient, API_CONFIG } from './apiConfig';

class RecommendationService {
  async getRecommendations() {
    try {
      console.log('Fetching recommendations...');
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.RECOMMENDATIONS);
      
      console.log('Raw API Response:', response);
      
      // Handle response sesuai struktur backend: { success: true, data: { recommendations: [...] } }
      if (response && response.success && response.data) {
        // Cek apakah ada property recommendations di dalam data
        if (response.data.recommendations && Array.isArray(response.data.recommendations)) {
          return response.data.recommendations;
        }
        
        // Fallback jika data langsung berupa array
        if (Array.isArray(response.data)) {
          return response.data;
        }
      }
      
      // Fallback untuk format response lainnya
      if (response) {
        // Jika response langsung berupa array
        if (Array.isArray(response)) {
          return response;
        }
        
        // Jika response memiliki property recommendations langsung
        if (response.recommendations && Array.isArray(response.recommendations)) {
          return response.recommendations;
        }
        
        // Jika response memiliki property results
        if (response.results && Array.isArray(response.results)) {
          return response.results;
        }
        
        // Jika response adalah object tunggal, wrap dalam array
        if (typeof response === 'object' && !Array.isArray(response)) {
          return [response];
        }
      }
      
      // Fallback: return empty array
      console.warn('Unexpected response format, returning empty array');
      return [];
      
    } catch (error) {
      console.error('Error getting recommendations:', error);
      
      // Berikan pesan error yang lebih spesifik
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        throw new Error('Anda harus login untuk melihat rekomendasi');
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        throw new Error('Akses ditolak. Pastikan profil Anda sudah lengkap');
      } else if (error.message.includes('404')) {
        throw new Error('Endpoint rekomendasi tidak ditemukan');
      } else if (error.message.includes('500')) {
        throw new Error('Server error. Silakan coba lagi nanti');
      } else if (error.message.includes('fetch')) {
        throw new Error('Gagal terhubung ke server. Periksa koneksi internet Anda');
      }
      
      throw new Error(error.message || 'Gagal memuat rekomendasi');
    }
  }

  async getRecommendationsByCategory(category, address) {
    try {
      const params = address ? { address } : {};
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.RECOMMENDATIONS_BY_CATEGORY}/${category}`,
        params
      );
      
      console.log('Category recommendations response:', response);
      
      // Handle response format yang sama
      if (response && response.success && response.data) {
        if (response.data.recommendations && Array.isArray(response.data.recommendations)) {
          return response.data.recommendations;
        }
        if (Array.isArray(response.data)) {
          return response.data;
        }
      }
      
      // Fallback untuk format lainnya
      if (response) {
        if (Array.isArray(response)) {
          return response;
        }
        if (response.recommendations && Array.isArray(response.recommendations)) {
          return response.recommendations;
        }
      }
      
      return [];
      
    } catch (error) {
      console.error('Error getting recommendations by category:', error);
      throw new Error(error.message || 'Gagal memuat rekomendasi berdasarkan kategori');
    }
  }

  async getFilteredRecommendations(filters) {
    try {
      const response = await apiClient.get(
        API_CONFIG.ENDPOINTS.RECOMMENDATIONS_FILTERED,
        filters
      );
      
      console.log('Filtered recommendations response:', response);
      
      // Handle response format yang sama
      if (response && response.success && response.data) {
        if (response.data.recommendations && Array.isArray(response.data.recommendations)) {
          return response.data.recommendations;
        }
        if (Array.isArray(response.data)) {
          return response.data;
        }
      }
      
      // Fallback untuk format lainnya
      if (response) {
        if (Array.isArray(response)) {
          return response;
        }
        if (response.recommendations && Array.isArray(response.recommendations)) {
          return response.recommendations;
        }
      }
      
      return [];
      
    } catch (error) {
      console.error('Error getting filtered recommendations:', error);
      throw new Error(error.message || 'Gagal memuat rekomendasi terfilter');
    }
  }

  async getUserRecommendations(userId) {
    try {
      const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.RECOMMENDATIONS_BY_USER}/${userId}`);
      
      console.log('User recommendations response:', response);
      
      // Handle response format yang sama
      if (response && response.success && response.data) {
        if (response.data.recommendations && Array.isArray(response.data.recommendations)) {
          return response.data.recommendations;
        }
        if (Array.isArray(response.data)) {
          return response.data;
        }
      }
      
      // Fallback untuk format lainnya
      if (response) {
        if (Array.isArray(response)) {
          return response;
        }
        if (response.recommendations && Array.isArray(response.recommendations)) {
          return response.recommendations;
        }
      }
      
      return [];
      
    } catch (error) {
      console.error('Error getting user recommendations:', error);
      throw new Error(error.message || 'Gagal memuat rekomendasi user');
    }
  }
}

export const recommendationService = new RecommendationService();
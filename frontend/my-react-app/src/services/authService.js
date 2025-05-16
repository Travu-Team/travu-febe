import { fetchApi } from './api';

export const authService = {
    // untuk mendaftarkan user baru
    register: async (userData) => {
        return await fetchApi('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    // untuk proses login user
    login: async (credentials) => {
        const response = await fetchApi('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
        
        if (response.token) {
            authService.saveToken(response.token, credentials.rememberMe);
        }
        
        return response;
    },

    // untuk menyimpan token autentikasi di localStorage atau sessionStorage
    saveToken: (token, rememberMe) => {
        if (rememberMe) {
            localStorage.setItem('token', token);
        } else {
            sessionStorage.setItem('token', token);
        }
    },

    // untuk mendapatkan token yang tersimpan
    getToken: () => {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    },

    // untuk menghapus token dari localStorage atau sessionStorage saat user logout
    removeToken: () => {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
    }
};

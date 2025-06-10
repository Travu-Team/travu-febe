// Konfigurasi dasar API
export const BASE_URL = 'http://localhost:5000/api';

// Function helper untuk fetch dengan error handling
export const fetchApi = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Terjadi kesalahan');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

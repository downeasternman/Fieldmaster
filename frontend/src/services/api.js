import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for session authentication
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// API endpoints
export const appointments = {
    getAll: () => api.get('/appointments/'),
    getById: (id) => api.get(`/appointments/${id}/`),
    create: (data) => api.post('/appointments/', data),
    update: (id, data) => api.put(`/appointments/${id}/`, data),
    delete: (id) => api.delete(`/appointments/${id}/`),
    uploadPhoto: (id, photo) => {
        const formData = new FormData();
        formData.append('photo', photo);
        return api.post(`/appointments/${id}/upload_photo/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export const customers = {
    getAll: () => api.get('/customers/'),
    getById: (id) => api.get(`/customers/${id}/`),
    create: (data) => api.post('/customers/', data),
    update: (id, data) => api.put(`/customers/${id}/`, data),
    delete: (id) => api.delete(`/customers/${id}/`),
};

export const technicians = {
    getAll: () => api.get('/technicians/'),
    getById: (id) => api.get(`/technicians/${id}/`),
    create: (data) => api.post('/technicians/', data),
    update: (id, data) => api.put(`/technicians/${id}/`, data),
    delete: (id) => api.delete(`/technicians/${id}/`),
};

export const auth = {
    login: (credentials) => api.post('/auth/login/', credentials),
    logout: () => api.post('/auth/logout/'),
    getCurrentUser: () => api.get('/auth/user/'),
};

export default api; 
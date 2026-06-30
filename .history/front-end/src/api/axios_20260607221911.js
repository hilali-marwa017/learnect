// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// AJOUTE CES EXPORTS (c'est ce qui manque)
export const obtenirStatistiques = async () => {
    const response = await api.get('/admin/stats');
    return response.data;
};

export const obtenirEnseignantsEnAttente = async () => {
    const response = await api.get('/admin/enseignants/attente');
    return response.data;
};

export const obtenirSignalements = async () => {
    const response = await api.get('/admin/signalements');
    return response.data;
};

export const obtenirUtilisateurs = async () => {
    const response = await api.get('/admin/users');
    return response.data;
};

export default api;
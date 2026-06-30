// src/services/api.js
import axios from 'axios';

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Ajouter le token automatiquement a chaque requesr
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('learnect_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
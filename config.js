// API Configuration
export const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : 'https://foodwheel-api.onrender.com/api';

export const API_ENDPOINTS = {
  recipes: `${API_URL}/recipes`,
  countries: `${API_URL}/countries`,
  categories: `${API_URL}/categories`
};

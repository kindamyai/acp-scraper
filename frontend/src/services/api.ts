import axios from 'axios'; const API_BASE_URL 
= import.meta.env.VITE_API_BASE_URL || 
'http://localhost:5000/api'; const api = 
axios.create({
  baseURL: API_BASE_URL, headers: { 
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookie-based 
  authentication
});
// Request interceptor for adding auth token
api.interceptors.request.use( (config) => {
    // Get token from localStorage if needed
    const token = 
    localStorage.getItem('token'); if (token) 
    {
      config.headers.Authorization = `Bearer 
      ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error) );
// Response interceptor for handling errors
api.interceptors.response.use( (response) => 
  response, (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && 
    error.response.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
); export default api;

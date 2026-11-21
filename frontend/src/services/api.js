import axios from 'axios';

// Base API URL pointing to the Spring Boot backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request Interceptor: Attach JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('interviewprep_jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 401 Unauthorized: token expired or invalid
      if (error.response.status === 401) {
        console.warn('[API] 401 Unauthorized received. Clearing stored auth session.');
        localStorage.removeItem('token');
        localStorage.removeItem('interviewprep_jwt');
        localStorage.removeItem('interviewprep_user');
      }
      
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error: ${error.response.status}`;
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Backend server is unreachable or offline
      return Promise.reject(new Error('Backend server is unreachable. Please verify Spring Boot is running on port 8080.'));
    } else {
      return Promise.reject(new Error(error.message || 'An unexpected network error occurred.'));
    }
  }
);

export default api;
export { API_BASE_URL };

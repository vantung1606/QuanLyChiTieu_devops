import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== '/api') {
    return import.meta.env.VITE_API_URL;
  }
  
  // Auto-detect for local vs production
  const { hostname, protocol } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8081/api';
  }
  
  // Production (Railway or others)
  // Nếu bạn có Domain riêng, hãy đảm bảo VITE_API_URL được set trong Railway Dashboard
  if (hostname.includes('railway.app')) {
    return '/api';
  }
  
  return `${protocol}//${hostname}/api`;
};

const instance = axios.create({
  baseURL: getBaseURL()
});

console.log('🚀 API Base URL:', instance.defaults.baseURL);

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 Unauthorized
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;

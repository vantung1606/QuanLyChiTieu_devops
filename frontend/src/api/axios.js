import axios from 'axios';

const getBaseURL = () => {
  const { hostname, protocol } = window.location;

  // Local development can override API URL.
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return import.meta.env.VITE_API_URL || 'http://localhost:8081/api';
  }

  if (hostname.includes('railway.app')) {
    return 'https://quanlychitieudevops-production.up.railway.app/api';
  }

  return `${protocol}//${hostname}/api`;
};

const instance = axios.create({
  baseURL: getBaseURL()
});

console.log('API Base URL:', instance.defaults.baseURL);

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;

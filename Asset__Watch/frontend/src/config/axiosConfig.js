// axiosConfig.js

import axios from 'axios';

// Use an environment variable for the base URL or, if not set, default to the current host
const BASE_URL = process.env.REACT_APP_BASE_URL || '';

// Create an instance of Axios with default configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // You may also want to set withCredentials to true if your backend relies on sending cookies
  // withCredentials: true,
});

// Add an interceptor to include the token in the request headers
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get the token from your storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
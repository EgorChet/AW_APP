// axiosConfig.js

import axios from "axios";

const BASE_URL = "http://localhost:3001";

// Create an instance of Axios with default configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Add an interceptor to include the token in the request headers
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Get the token from your storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

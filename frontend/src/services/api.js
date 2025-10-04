import axios from 'axios';
import { toast } from 'react-toastify';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // For login, we need basic auth. This will be handled in the login function.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unknown error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

export const loginUser = async (username, password) => {
  try {
    // Spring Security's /login endpoint handles basic auth and returns a token
    // This is a common pattern, but let's assume for now the backend generates a token on any authenticated request
    // A better approach would be a dedicated /login endpoint
    const response = await API.get('/users/me/role', {
      auth: {
        username,
        password,
      },
    });

    // Let's assume the backend sends back a token in the headers or body.
    // For this project, we'll create a "mock" token from basic auth credentials.
    const token = btoa(`${username}:${password}`);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', response.data.role);

    // Set the token for subsequent requests
    API.defaults.headers.common['Authorization'] = `Basic ${token}`;


    return response.data;
  } catch (error) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userRole');
  delete API.defaults.headers.common['Authorization'];
  toast.info("You have been logged out.");
};

export default API;
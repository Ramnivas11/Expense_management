import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

API.interceptors.request.use(config => {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');

  if (username && password) {
    config.auth = { username, password };
  }
  return config;
});

export const setAuth = (user, pass) => {
  if (user) {
    localStorage.setItem('username', user);
    localStorage.setItem('password', pass);
  } else {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
  }
};

export default API;

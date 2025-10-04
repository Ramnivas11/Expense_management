import axios from 'axios';

let username = '';
let password = '';

export const setAuth = (user, pass) => {
  username = user;
  password = pass;
};

export const clearAuth = () => {
  username = '';
  password = '';
};

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});

API.interceptors.request.use(config => {
  if (username && password) {
    config.auth = { username, password };
  }
  return config;
});

export default API;

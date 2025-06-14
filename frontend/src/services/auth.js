import axios from 'axios';

const API = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // to include cookies
});

export const registerUser = (data) => API.post('/users/register', data);
export const loginUser = (data) => API.post('/users/login', data);

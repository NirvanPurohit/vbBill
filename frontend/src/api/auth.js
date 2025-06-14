import api from './axiosInstnance.js';

export const login = (data) => api.post('/user/login', data);
export const register = (data) => api.post('/user/register', data);
export const getProfile = () => api.get('/user/profile');
export const logout = () => api.post('/user/logout');

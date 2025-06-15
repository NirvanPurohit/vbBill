import api from './axiosInstnance.js';

export const login = (data) => api.post('/user/login', data);
export const register = (data) => api.post('/user/register', data);
export const getProfile = () => api.get('/user/profile');
export const logout = () => api.post('/user/logout');
//item api:
export const createItem = (data) =>api.post('/item/items', data);
export const getAllItems = () => api.get('/item/items');
export const getItemById = (id) => api.get(`/item/items/${id}`);
export const updateItem = (id, data) => api.put(`/item/items/${id}`, data);
export const deleteItem = (id) => api.delete(`/item/items/${id}`);
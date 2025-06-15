import api from './axiosInstnance.js';

export const login = (data) => api.post('/user/login', data);
export const register = (data) => api.post('/user/register', data);
export const getProfile = () => api.get('/user/profile');
export const logout = () => api.post('/user/logout');

//item api:
   export const createItem = (data) => api.post('/items', data);
   export const getAllItems = () => api.get('/items');
   export const getItemById = (id) => api.get(`/items/${id}`);
   export const updateItem = (id, data) => api.put(`/items/${id}`, data);
   export const deleteItem = (id) => api.delete(`/items/${id}`);

// Business APIs
export const createBusiness = (data) => api.post('/business', data);
export const getAllBusinesses = () => api.get('/business');
export const getBusinessById = (id) => api.get(`/business/${id}`);
export const updateBusiness = (id, data) => api.put(`/business/${id}`, data);
export const deleteBusiness = (id) => api.delete(`/business/${id}`);

// Lorry APIs
export const createLorry = (data) => api.post('/lorry', data);
export const getAllLorries = () => api.get('/lorry');
export const getLorryById = (id) => api.get(`/lorry/${id}`);
export const updateLorry = (id, data) => api.put(`/lorry/${id}`, data);
export const deleteLorry = (id) => api.delete(`/lorry/${id}`);

// Site APIs
export const createSite = (data) => api.post('/site', data);
export const getAllSites = () => api.get('/site');
export const getSiteById = (id) => api.get(`/site/${id}`);
export const updateSite = (id, data) => api.put(`/site/${id}`, data);
export const deleteSite = (id) => api.delete(`/site/${id}`);

// Supplier APIs
export const createSupplier = (data) => api.post('/supplier', data);
export const getAllSuppliers = () => api.get('/supplier');
export const getSupplierById = (id) => api.get(`/supplier/${id}`);
export const updateSupplier = (id, data) => api.put(`/supplier/${id}`, data);
export const deleteSupplier = (id) => api.delete(`/supplier/${id}`);
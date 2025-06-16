import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // to include cookies
});
export default api;
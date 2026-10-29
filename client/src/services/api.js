import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api', withCredentials: true });
export const getError = (error) => error.response?.data?.error?.message || 'Something went wrong';
export const authApi = { signup: (data) => api.post('/auth/signup', data), login: (data) => api.post('/auth/login', data), logout: () => api.post('/auth/logout'), me: () => api.get('/auth/me') };
export const incidentApi = { list: (params) => api.get('/incidents', { params }), get: (id) => api.get(`/incidents/${id}`), create: (data) => api.post('/incidents', data), update: (id, data) => api.patch(`/incidents/${id}`, data), remove: (id) => api.delete(`/incidents/${id}`), analyze: (id) => api.post(`/incidents/${id}/analyze`), messages: (id) => api.get(`/incidents/${id}/messages`), ask: (data) => api.post('/ask', data) };

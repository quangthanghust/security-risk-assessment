import api from './api';

export const getThreats = () => api.get('/threats');
export const getThreatById = (id) => api.get(`/threats/${id}`);
export const createThreat = (data) => api.post('/threats', data);
export const updateThreat = (id, data) => api.put(`/threats/${id}`, data);
export const deleteThreat = (id) => api.delete(`/threats/${id}`);
import api from './api';

export const getRiskSources = () => api.get('/risk-sources');
export const getRiskSourceById = (id) => api.get(`/risk-sources/${id}`);
export const createRiskSource = (data) => api.post('/risk-sources', data);
export const updateRiskSource = (id, data) => api.put(`/risk-sources/${id}`, data);
export const deleteRiskSource = (id) => api.delete(`/risk-sources/${id}`);
import api from './api';

export const getRiskScenarios = () => api.get('/risk-scenarios');
export const getRiskScenarioById = (id) => api.get(`/risk-scenarios/${id}`);
export const createRiskScenario = (data) => api.post('/risk-scenarios', data);
export const updateRiskScenario = (id, data) => api.put(`/risk-scenarios/${id}`, data);
export const deleteRiskScenario = (id) => api.delete(`/risk-scenarios/${id}`);
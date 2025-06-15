import api from './api';

export const getOperationScenarios = () => api.get('/operation-scenarios');
export const getOperationScenarioById = (id) => api.get(`/operation-scenarios/${id}`);
export const createOperationScenario = (data) => api.post('/operation-scenarios', data);
export const updateOperationScenario = (id, data) => api.put(`/operation-scenarios/${id}`, data);
export const deleteOperationScenario = (id) => api.delete(`/operation-scenarios/${id}`);
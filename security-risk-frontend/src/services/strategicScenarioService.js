import api from './api';

export const getStrategicScenarios = () => api.get('/strategic-scenarios');
export const getStrategicScenarioById = (id) => api.get(`/strategic-scenarios/${id}`);
export const createStrategicScenario = (data) => api.post('/strategic-scenarios', data);
export const updateStrategicScenario = (id, data) => api.put(`/strategic-scenarios/${id}`, data);
export const deleteStrategicScenario = (id) => api.delete(`/strategic-scenarios/${id}`);
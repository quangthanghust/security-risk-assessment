import api from './api';

export const getRiskAcceptanceCriteria = () => api.get('/risk-acceptance-criteria');
export const getRiskAcceptanceCriteriaById = (id) => api.get(`/risk-acceptance-criteria/${id}`);
export const createRiskAcceptanceCriteria = (data) => api.post('/risk-acceptance-criteria', data);
export const updateRiskAcceptanceCriteria = (id, data) => api.put(`/risk-acceptance-criteria/${id}`, data);
export const deleteRiskAcceptanceCriteria = (id) => api.delete(`/risk-acceptance-criteria/${id}`);
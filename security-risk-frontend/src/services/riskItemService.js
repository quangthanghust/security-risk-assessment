import api from './api';

export const getRiskItems = () => api.get('/risk-items');
export const getRiskItemById = (id) => api.get(`/risk-items/${id}`);
export const deleteRiskItem = (id) => api.delete(`/risk-items/${id}`);

// Tạo phiên đánh giá rủi ro 
export const getAssessmentSessions = () => api.get('/risk-items/sessions');
export const getRiskItemsBySession = (sessionId) => api.get(`/risk-items/session/${sessionId}`);
export const getLatestRiskItems = () => api.get('/risk-items/latest');
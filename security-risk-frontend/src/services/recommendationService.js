import api from './api';

export const getRecommendations = () => api.get('/recommendations');
export const getRecommendationById = (id) => api.get(`/recommendations/${id}`);
export const createRecommendation = (data) => api.post('/recommendations', data);
export const updateRecommendation = (id, data) => api.put(`/recommendations/${id}`, data);
export const deleteRecommendation = (id) => api.delete(`/recommendations/${id}`);
import api from './api';

export const getInterestedParties = () => api.get('/interested-parties');
export const getInterestedPartyById = (id) => api.get(`/interested-parties/${id}`);
export const createInterestedParty = (data) => api.post('/interested-parties', data);
export const updateInterestedParty = (id, data) => api.put(`/interested-parties/${id}`, data);
export const deleteInterestedParty = (id) => api.delete(`/interested-parties/${id}`);
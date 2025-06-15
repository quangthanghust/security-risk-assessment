import api from './api';

export const getSystemProfiles = () => api.get('/system-profiles');
export const getSystemProfileById = (id) => api.get(`/system-profiles/${id}`);
export const createSystemProfile = (data) => api.post('/system-profiles', data);
export const updateSystemProfile = (id, data) => api.put(`/system-profiles/${id}`, data);
export const deleteSystemProfile = (id) => api.delete(`/system-profiles/${id}`);
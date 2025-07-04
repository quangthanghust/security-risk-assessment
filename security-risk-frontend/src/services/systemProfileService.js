import api from './api';

export const getSystemProfiles = () => api.get('/system-profiles');
export const getSystemProfileById = (id) => api.get(`/system-profiles/${id}`);
export const createSystemProfile = (data) => api.post('/system-profiles', data);
export const updateSystemProfile = (id, data) => api.put(`/system-profiles/${id}`, data);
export const deleteSystemProfile = (id) => api.delete(`/system-profiles/${id}`);

export const exportSystemProfilesExcel = () =>
    api.get('/system-profiles/export-excel', { responseType: 'blob' });

export const importSystemProfilesExcel = formData =>
    api.post('/system-profiles/import-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
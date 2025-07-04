import api from './api';

export const getThreats = () => api.get('/threats');
export const getThreatById = (id) => api.get(`/threats/${id}`);
export const createThreat = (data) => api.post('/threats', data);
export const updateThreat = (id, data) => api.put(`/threats/${id}`, data);
export const deleteThreat = (id) => api.delete(`/threats/${id}`);

export const exportThreatsExcel = () =>
    api.get('/threats/export-excel', { responseType: 'blob' });

export const importThreatsExcel = formData =>
    api.post('/threats/import-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
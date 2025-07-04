import api from './api';

export const getAssets = () => api.get('/assets');
export const getAssetById = (id) => api.get(`/assets/${id}`);
export const createAsset = (data) => api.post('/assets', data);
export const updateAsset = (id, data) => api.put(`/assets/${id}`, data);
export const deleteAsset = (id) => api.delete(`/assets/${id}`);

export const exportAssetsExcel = () =>
    api.get('/assets/export-excel', { responseType: 'blob' });

export const importAssetsExcel = formData =>
    api.post('/assets/import-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
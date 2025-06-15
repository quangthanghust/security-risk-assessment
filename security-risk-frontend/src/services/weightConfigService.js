import api from './api';

export const getWeightConfigs = () => api.get('/weight-configs');
export const updateWeightConfig = (id, data) => api.put(`/weight-configs/${id}`, data);
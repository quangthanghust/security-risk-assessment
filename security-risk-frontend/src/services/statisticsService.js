import api from './api';

export const getOverview = () => api.get('/statistics/overview');
export const getRiskLevels = () => api.get('/statistics/risk-levels');
export const getAssetTypes = () => api.get('/statistics/asset-types');

// Tạo hàm để lấy sơ đồ các mức rủi ro theo từng phiên trong lịch sử đánh giá
export const getRiskLevelTrend = () => api.get('/statistics/risk-level-trend');
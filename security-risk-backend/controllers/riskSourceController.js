const riskSourceService = require('../services/riskSourceService');
const mongoose = require('mongoose');

const getRiskSources = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.$or = [
        { createdBy: new mongoose.Types.ObjectId(req.user.userId) },
        { createdBy: { $exists: false } }, // Cho phép nguồn rủi ro dùng chung
      ];
    }
    const riskSources = await riskSourceService.getAllRiskSources(filter);
    res.json(riskSources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRiskSourceById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const riskSource = await riskSourceService.getRiskSourceById(req.params.id);
    if (!riskSource) return res.status(404).json({ message: 'Risk source not found' });
    if (req.user.role !== 'admin' && riskSource.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xem nguồn rủi ro này' });
    }
    res.json(riskSource);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createRiskSource = async (req, res) => {
  try {
    const riskSource = await riskSourceService.createRiskSource({
      ...req.body,
      createdBy: req.user.userId
    });
    res.status(201).json(riskSource);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateRiskSource = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const riskSource = await riskSourceService.updateRiskSource(req.params.id, req.body);
    if (!riskSource) return res.status(404).json({ message: 'Risk source not found' });
    if (req.user.role !== 'admin' && riskSource.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền sửa đổi nguồn rủi ro này' });
    }
    const updated = await riskSourceService.updateRiskSource(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteRiskSource = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const riskSource = await riskSourceService.deleteRiskSource(req.params.id);
    if (!riskSource) return res.status(404).json({ message: 'Risk source not found' });
    if (req.user.role !== 'admin' && riskSource.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa nguồn rủi ro này' });
    }
    await riskSourceService.deleteRiskSource(req.params.id);
    res.json({ message: 'Đã xóa nguồn rủi ro' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getRiskSources,
  getRiskSourceById,
  createRiskSource,
  updateRiskSource,
  deleteRiskSource,
};
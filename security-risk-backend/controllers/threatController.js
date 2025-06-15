const threatService = require('../services/threatService');
const mongoose = require('mongoose');
const { isValidThreat } = require('../utils/threatOptions');

const getThreats = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    }
    const threats = await threatService.getAllThreats(filter);
    res.json(threats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getThreatById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }
  try {
    const threat = await threatService.getThreatById(req.params.id);
    if (!threat) return res.status(404).json({ message: 'Không tìm thấy mối đe dọa' });
    if (req.user.role !== 'admin' && threat.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xem mối đe dọa này' });
    }
    res.json(threat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createThreat = async (req, res) => {
  try {
    const { category, code, description } = req.body;
    if (!isValidThreat(category, code, description)) {
      return res.status(400).json({ message: 'Mã hoặc mô tả mối đe dọa không hợp lệ với loại đã chọn' });
    }
    const threat = await threatService.createThreat(
      {
        ...req.body,
        createdBy: req.user.userId
      });
    res.status(201).json(threat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateThreat = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }
  try {
    const { category, code, description } = req.body;
    if (!isValidThreat(category, code, description)) {
      return res.status(400).json({ message: 'Mã hoặc mô tả mối đe dọa không hợp lệ với loại đã chọn' });
    }
    const threat = await threatService.updateThreat(req.params.id, req.body);
    if (!threat) return res.status(404).json({ message: 'Không tìm thấy mối đe dọa' });
    if (req.user.role !== 'admin' && threat.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền sửa mối đe dọa này' });
    }
    const updated = await threatService.updateThreat(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteThreat = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }
  try {
    const threat = await threatService.deleteThreat(req.params.id);
    if (!threat) return res.status(404).json({ message: 'Không tìm thấy mối đe dọa' });
    if (req.user.role !== 'admin' && threat.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa mối đe dọa này' });
    }
    await threatService.deleteThreat(req.params.id);
    res.json({ message: 'Đã xóa mối đe doạ thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getThreats,
  getThreatById,
  createThreat,
  updateThreat,
  deleteThreat,
};
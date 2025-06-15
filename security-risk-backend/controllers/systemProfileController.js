const systemProfileService = require('../services/systemProfileService');
const mongoose = require('mongoose');

const getSystemProfiles = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    }
    const profiles = await systemProfileService.getAllSystemProfiles(filter);
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSystemProfileById = async (req, res) => {
  try {
    const profile = await systemProfileService.getSystemProfileById(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Không tìm thấy hồ sơ hệ thống' });
    if (req.user.role !== 'admin' && profile.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập hồ sơ này' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createSystemProfile = async (req, res) => {
  try {
    const profile = await systemProfileService.createSystemProfile(
      {
        ...req.body,
        createdBy: req.user.userId
      });
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateSystemProfile = async (req, res) => {
  try {
    const profile = await systemProfileService.updateSystemProfile(req.params.id, req.body);
    if (!profile) return res.status(404).json({ message: 'Không tìm thấy hồ sơ hệ thống' });
    if (req.user.role !== 'admin' && profile.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền sửa hồ sơ này' });
    }
    const updated = await systemProfileService.updateSystemProfile(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteSystemProfile = async (req, res) => {
  try {
    const profile = await systemProfileService.deleteSystemProfile(req.params.id);
    if (!profile) return res.status(404).json({ message: 'Không tìm thấy hồ sơ hệ thống' });
    if (req.user.role !== 'admin' && profile.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa hồ sơ này' });
    }
    await systemProfileService.deleteSystemProfile(req.params.id);
    res.json({ message: 'Đã xóa thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getSystemProfiles,
  getSystemProfileById,
  createSystemProfile,
  updateSystemProfile,
  deleteSystemProfile,
};
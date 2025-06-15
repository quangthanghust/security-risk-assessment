const assetService = require('../services/assetService');
const mongoose = require('mongoose');

const getAssets = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    }
    const assets = await assetService.getAllAssets(filter);
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAssetById = async (req, res) => {
  try {
    const asset = await assetService.getAssetById(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    if (req.user.role !== 'admin' && asset.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập tài sản này' });
    }
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createAsset = async (req, res) => {
  try {
    const asset = await assetService.createAsset({
      ...req.body,
      createdBy: req.user.userId
    });
    res.status(201).json(asset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateAsset = async (req, res) => {
  try {
    const asset = await assetService.updateAsset(req.params.id, req.body);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    if (req.user.role !== 'admin' && asset.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền sửa tài sản này' });
    }
    const updated = await assetService.updateAsset(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteAsset = async (req, res) => {
  try {
    const asset = await assetService.deleteAsset(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });
    if (req.user.role !== 'admin' && asset.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa tài sản này' });
    }
    await assetService.deleteAsset(req.params.id);
    res.json({ message: 'Đã xóa tài sản thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
};
const assetService = require('../services/assetService');
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const fs = require('fs');
const Asset = require('../models/Asset');
const SystemProfile = require('../models/SystemProfile');

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

// EXPORT
const exportExcel = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      if (!req.user.userId || !mongoose.Types.ObjectId.isValid(req.user.userId)) {
        return res.status(400).json({ message: 'ID không hợp lệ' });
      }
      filter.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    }
    const data = await Asset.find(filter).populate('system').lean();
    const rows = data.map(a => ({
      "Tên": a.name,
      "Mã": a.code,
      "Mô tả": a.description,
      "Loại": a.assetType,
      "Giá trị": a.value,
      "Loại tác động": (a.impactTypes || []).join(', '),
      "Mức độ tác động": a.impactTypeLevel,
      "Mức độ phụ thuộc": a.dependency,
      "Mức độ tổn thất": a.lossMagnitude,
      "Hệ thống": a.system?.name || ''
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Assets');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename="tai_san.xlsx"');
    res.type('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buf);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// IMPORT
const importExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    for (const row of rows) {
      let system = null;
      if (row["Hệ thống"]) {
        system = await SystemProfile.findOne({ name: row["Hệ thống"] });
      }
      await Asset.create({
        name: row["Tên"],
        code: row["Mã"],
        description: row["Mô tả"],
        assetType: row["Loại"],
        value: Number(row["Giá trị"]),
        impactTypes: typeof row["Loại tác động"] === 'string' ? row["Loại tác động"].split(',').map(s => s.trim()) : [],
        impactTypeLevel: Number(row["Mức độ tác động"]),
        dependency: Number(row["Mức độ phụ thuộc"]),
        lossMagnitude: Number(row["Mức độ tổn thất"]),
        system: system?._id,
        createdBy: req.user.userId
      });
    }
    fs.unlinkSync(filePath);
    res.json({ message: 'Import thành công!' });
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
  exportExcel,
  importExcel
};
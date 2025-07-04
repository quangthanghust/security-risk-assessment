const systemProfileService = require('../services/systemProfileService');
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const fs = require('fs');
const SystemProfile = require('../models/SystemProfile');

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
    const data = await SystemProfile.find(filter).lean();
    const rows = data.map(p => ({
      "Tên hệ thống": p.name,
      "Người quản lý": p.manager,
      "Liên hệ": p.contact,
      "Đơn vị phụ trách": p.organizationUnit,
      "Mục đích": p.purpose,
      "Phạm vi": p.scope,
      "Mức độ quan trọng": p.criticality,
      "Mô tả": p.description,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SystemProfiles');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename="ho_so_he_thong.xlsx"');
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
      await SystemProfile.create({
        name: row["Tên hệ thống"],
        manager: row["Người quản lý"],
        contact: row["Liên hệ"],
        organizationUnit: row["Đơn vị phụ trách"],
        purpose: row["Mục đích"],
        scope: row["Phạm vi"],
        criticality: row["Mức độ quan trọng"],
        description: row["Mô tả"],
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
  getSystemProfiles,
  getSystemProfileById,
  createSystemProfile,
  updateSystemProfile,
  deleteSystemProfile,
  exportExcel,
  importExcel
};
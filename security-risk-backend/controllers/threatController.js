const threatService = require('../services/threatService');
const mongoose = require('mongoose');
const { isValidThreat } = require('../utils/threatOptions');
const XLSX = require('xlsx');
const fs = require('fs');
const Threat = require('../models/Threat');

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
    const data = await Threat.find(filter).populate('asset').lean();
    const rows = data.map(t => ({
      "Loại": t.category,
      "Mã": t.code,
      "Mô tả": t.description,
      "Mức độ": t.threatLevel,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Threats');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename="moi_de_doa.xlsx"');
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
      await Threat.create({
        category: row["Loại"],
        code: row["Mã"],
        description: row["Mô tả"],
        threatLevel: Number(row["Mức độ"]),
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
  getThreats,
  getThreatById,
  createThreat,
  updateThreat,
  deleteThreat,
  exportExcel,
  importExcel,
};
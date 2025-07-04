const interestedPartyService = require('../services/interestedPartyService');
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const fs = require('fs');
const InterestedParty = require('../models/InterestedParty');

const getInterestedParties = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    }
    const parties = await interestedPartyService.getAllInterestedParties(filter);
    res.json(parties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getInterestedPartyById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const party = await interestedPartyService.getInterestedPartyById(req.params.id);
    if (!party) return res.status(404).json({ message: 'Interested party not found' });
    if (req.user.role !== 'admin' && party.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xem bên liên quan này' });
    }
    res.json(party);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createInterestedParty = async (req, res) => {
  try {
    const party = await interestedPartyService.createInterestedParty(
      {
        ...req.body,
        createdBy: req.user.userId
      });
    res.status(201).json(party);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateInterestedParty = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const party = await interestedPartyService.updateInterestedParty(req.params.id, req.body);
    if (!party) return res.status(404).json({ message: 'Interested party not found' });
    if (req.user.role !== 'admin' && party.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền sửa bên liên quan này' });
    }
    const updated = await interestedPartyService.updateInterestedParty(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteInterestedParty = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const party = await interestedPartyService.deleteInterestedParty(req.params.id);
    if (!party) return res.status(404).json({ message: 'Interested party not found' });
    if (req.user.role !== 'admin' && party.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa bên liên quan này' });
    }
    await interestedPartyService.deleteInterestedParty(req.params.id);
    res.json({ message: 'Đã xoá bên liên quan thành công' });
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
    const data = await InterestedParty.find(filter).lean();
    const rows = data.map(p => ({
      "Tên": p.name,
      "Tổ chức": p.organization,
      "Chức vụ": p.position,
      "Địa chỉ": p.address,
      "Số điện thoại": p.phone
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'InterestedParties');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename="cac_ben_lien_quan.xlsx"');
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
      await InterestedParty.create({
        name: row["Tên"],
        organization: row["Tổ chức"],
        position: row["Chức vụ"],
        address: row["Địa chỉ"],
        phone: row["Số điện thoại"],
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
  getInterestedParties,
  getInterestedPartyById,
  createInterestedParty,
  updateInterestedParty,
  deleteInterestedParty,
  exportExcel,
  importExcel,
};
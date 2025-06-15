const reportService = require('../services/reportService');
const mongoose = require('mongoose');

const getReports = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    }
    const reports = await reportService.getAllReports(filter);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getReportById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const report = await reportService.getReportById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    if (req.user.role !== 'admin' && report.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xem báo cáo này' });
    }
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createReport = async (req, res) => {
  try {
    const report = await reportService.createReport(
      {
        ...req.body,
        createdBy: req.user.userId
      });
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateReport = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const report = await reportService.updateReport(req.params.id, req.body);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    if (req.user.role !== 'admin' && report.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền cập nhật báo cáo này' });
    }
    const updated = await reportService.updateReport(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteReport = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const report = await reportService.deleteReport(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    if (req.user.role !== 'admin' && report.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa báo cáo này' });
    }
    await reportService.deleteReport(req.params.id);
    res.json({ message: 'Đã xóa báo cáo thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
};
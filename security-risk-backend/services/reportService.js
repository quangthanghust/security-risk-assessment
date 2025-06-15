const mongoose = require('mongoose');
const Report = require('../models/Report');
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAllReports = async (filter = {}) =>
  Report.find(filter)
    .populate('createdBy')
    .populate('riskItems')
    .populate('recommendations');

const getReportById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return Report.findById(id)
    .populate('createdBy')
    .populate('riskItems')
    .populate('recommendations');
};

const createReport = async (data) => {
  if (!isValidObjectId(data.createdBy)) throw new Error('Invalid createdBy');
  const report = new Report(data);
  return report.save();
};

const updateReport = async (id, data) => {
  if (!isValidObjectId(id)) return null;
  return Report.findByIdAndUpdate(id, data, { new: true });
};

const deleteReport = async (id) => {
  if (!isValidObjectId(id)) return null;
  return Report.findByIdAndDelete(id);
};

module.exports = {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
};
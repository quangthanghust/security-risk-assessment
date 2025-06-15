const mongoose = require('mongoose');
const Threat = require('../models/Threat');

// Kiểm tra ObjectId hợp lệ để tránh lỗi và bảo mật
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAllThreats = async (filter = {}) => Threat.find(filter);

const getThreatById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return Threat.findById(id);
};

const createThreat = async (data) => {
  const threat = new Threat(data);
  return threat.save();
};

const updateThreat = async (id, data) => {
  if (!isValidObjectId(id)) return null;
  return Threat.findByIdAndUpdate(id, data, { new: true });
};

const deleteThreat = async (id) => {
  if (!isValidObjectId(id)) return null;
  return Threat.findByIdAndDelete(id);
};

module.exports = {
  getAllThreats,
  getThreatById,
  createThreat,
  updateThreat,
  deleteThreat,
};

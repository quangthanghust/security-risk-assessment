const mongoose = require('mongoose');
const RiskSource = require('../models/RiskSource');

// Không có ObjectId liên kết, chỉ kiểm tra id khi truy vấn
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAllRiskSources = async (filter = {}) => RiskSource.find(filter);

const getRiskSourceById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return RiskSource.findById(id);
};

const createRiskSource = async (data) => {
  const riskSource = new RiskSource(data);
  return riskSource.save();
};

const updateRiskSource = async (id, data) => {
  if (!isValidObjectId(id)) return null;
  return RiskSource.findByIdAndUpdate(id, data, { new: true });
};

const deleteRiskSource = async (id) => {
  if (!isValidObjectId(id)) return null;
  return RiskSource.findByIdAndDelete(id);
};

module.exports = {
  getAllRiskSources,
  getRiskSourceById,
  createRiskSource,
  updateRiskSource,
  deleteRiskSource,
};
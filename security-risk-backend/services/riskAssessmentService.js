const mongoose = require('mongoose');
const RiskAssessment = require('../models/RiskAssessment');
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAllRiskAssessments = async (filter = {}) =>
  RiskAssessment.find(filter).populate('createdBy');

const getRiskAssessmentById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return RiskAssessment.findById(id)
    .populate('createdBy')
    .populate('threats')
    .populate('vulnerabilities')
    .populate('strategicScenarios')
    .populate('operationScenarios')
    .populate('interestedParties');
};

const createRiskAssessment = async (data) => {
  if (!isValidObjectId(data.createdBy)) throw new Error('Invalid createdBy');
  const assessment = new RiskAssessment(data);
  return assessment.save();
};

const updateRiskAssessment = async (id, data) => {
  if (!isValidObjectId(id)) return null;
  return RiskAssessment.findByIdAndUpdate(id, data, { new: true });
};

const deleteRiskAssessment = async (id) => {
  if (!isValidObjectId(id)) return null;
  return RiskAssessment.findByIdAndDelete(id);
};

module.exports = {
  getAllRiskAssessments,
  getRiskAssessmentById,
  createRiskAssessment,
  updateRiskAssessment,
  deleteRiskAssessment,
};
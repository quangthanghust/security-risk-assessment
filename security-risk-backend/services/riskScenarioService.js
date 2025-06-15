const mongoose = require('mongoose');
const RiskScenario = require('../models/RiskScenario');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAllRiskScenarios = async (filter = {}) =>
  RiskScenario.find(filter)
    .populate('strategicScenarioId')
    .populate('operationScenarioId');

const getRiskScenarioById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return RiskScenario.findById(id)
    .populate('strategicScenarioId')
    .populate('operationScenarioId');
};

const createRiskScenario = async (data) => {
  if (!isValidObjectId(data.strategicScenarioId)) throw new Error('Invalid strategicScenarioId');
  if (!isValidObjectId(data.operationScenarioId)) throw new Error('Invalid operationScenarioId');
  const scenario = new RiskScenario(data);
  return scenario.save();
};

const updateRiskScenario = async (id, data) => {
  if (!isValidObjectId(id)) return null;
  if (data.strategicScenarioId && !isValidObjectId(data.strategicScenarioId)) throw new Error('Invalid strategicScenarioId');
  if (data.operationScenarioId && !isValidObjectId(data.operationScenarioId)) throw new Error('Invalid operationScenarioId');
  return RiskScenario.findByIdAndUpdate(id, data, { new: true });
};

const deleteRiskScenario = async (id) => {
  if (!isValidObjectId(id)) return null;
  return RiskScenario.findByIdAndDelete(id);
};

module.exports = {
  getAllRiskScenarios,
  getRiskScenarioById,
  createRiskScenario,
  updateRiskScenario,
  deleteRiskScenario,
};
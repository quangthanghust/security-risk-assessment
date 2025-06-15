const mongoose = require('mongoose');
const OperationScenario = require('../models/OperationScenario');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAllOperationScenarios = async (filter = {}) =>
  OperationScenario.find(filter)
    .populate('strategicScenarioId')
    .populate('asset')
    .populate('threat')
    .populate('vulnerability')
    .populate('createdBy');

const getOperationScenarioById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return OperationScenario.findById(id)
    .populate('strategicScenarioId')
    .populate('asset')
    .populate('threat')
    .populate('vulnerability')
    .populate('createdBy');
};

const createOperationScenario = async (data) => {
  if (!isValidObjectId(data.strategicScenarioId)) throw new Error('Invalid strategicScenarioId');
  if (!isValidObjectId(data.asset)) throw new Error('Invalid assetId');
  if (!isValidObjectId(data.threat)) throw new Error('Invalid threatId');
  if (!isValidObjectId(data.vulnerability)) throw new Error('Invalid vulnerabilityId');
  const scenario = new OperationScenario(data);
  return scenario.save();
};

const updateOperationScenario = async (id, data) => {
  if (!isValidObjectId(id)) return null;
  if (data.strategicScenarioId && !isValidObjectId(data.strategicScenarioId)) throw new Error('Invalid strategicScenarioId');
  if (data.asset && !isValidObjectId(data.asset)) throw new Error('Invalid assetId');
  if (data.threat && !isValidObjectId(data.threat)) throw new Error('Invalid threatId');
  if (data.vulnerability && !isValidObjectId(data.vulnerability)) throw new Error('Invalid vulnerabilityId');
  return OperationScenario.findByIdAndUpdate(id, data, { new: true });
};

const deleteOperationScenario = async (id) => {
  if (!isValidObjectId(id)) return null;
  return OperationScenario.findByIdAndDelete(id);
};

module.exports = {
  getAllOperationScenarios,
  getOperationScenarioById,
  createOperationScenario,
  updateOperationScenario,
  deleteOperationScenario,
};
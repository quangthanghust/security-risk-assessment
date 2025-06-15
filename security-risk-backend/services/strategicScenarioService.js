const mongoose = require('mongoose');
const StrategicScenario = require('../models/StrategicScenario');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAllStrategicScenarios = async (filter = {}) =>
  StrategicScenario.find(filter)
    .populate('asset')
    .populate('createdBy');

const getStrategicScenarioById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return StrategicScenario.findById(id)
    .populate('asset')
    .populate('createdBy');

};

const createStrategicScenario = async (data) => {
  if (!isValidObjectId(data.asset)) throw new Error('Invalid assetId');
  const scenario = new StrategicScenario(data);
  return scenario.save();
};

const updateStrategicScenario = async (id, data) => {
  if (!isValidObjectId(id)) return null;
  if (data.asset && !isValidObjectId(data.asset)) throw new Error('Invalid assetId');
  return StrategicScenario.findByIdAndUpdate(id, data, { new: true });
};

const deleteStrategicScenario = async (id) => {
  if (!isValidObjectId(id)) return null;
  return StrategicScenario.findByIdAndDelete(id);
};

module.exports = {
  getAllStrategicScenarios,
  getStrategicScenarioById,
  createStrategicScenario,
  updateStrategicScenario,
  deleteStrategicScenario,
};
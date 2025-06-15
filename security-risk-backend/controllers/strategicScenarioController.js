const strategicScenarioService = require('../services/strategicScenarioService');
const mongoose = require('mongoose');

const getStrategicScenarios = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    }
    const scenarios = await strategicScenarioService.getAllStrategicScenarios(filter);
    res.json(scenarios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStrategicScenarioById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const scenario = await strategicScenarioService.getStrategicScenarioById(req.params.id);
    if (!scenario) return res.status(404).json({ message: 'Strategic scenario not found' });
    if (req.user.role !== 'admin' && scenario.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xem kịch bản chiến lược này' });
    }
    res.json(scenario);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createStrategicScenario = async (req, res) => {
  try {
    const scenario = await strategicScenarioService.createStrategicScenario(
      {
        ...req.body,
        createdBy: req.user.userId
      });
    res.status(201).json(scenario);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateStrategicScenario = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const scenario = await strategicScenarioService.updateStrategicScenario(req.params.id, req.body);
    if (!scenario) return res.status(404).json({ message: 'Strategic scenario not found' });
    if (req.user.role !== 'admin' && scenario.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền sửa đổi kịch bản chiến lược này' });
    }
    const updated = await strategicScenarioService.updateStrategicScenario(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteStrategicScenario = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const scenario = await strategicScenarioService.deleteStrategicScenario(req.params.id);
    if (!scenario) return res.status(404).json({ message: 'Strategic scenario not found' });
    if (req.user.role !== 'admin' && scenario.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa kịch bản chiến lược này' });
    }
    await strategicScenarioService.deleteStrategicScenario(req.params.id);
    res.json({ message: 'Kịch bản chiến lược đã bị xóa' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getStrategicScenarios,
  getStrategicScenarioById,
  createStrategicScenario,
  updateStrategicScenario,
  deleteStrategicScenario,
};
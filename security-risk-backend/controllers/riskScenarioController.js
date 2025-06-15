const riskScenarioService = require('../services/riskScenarioService');
const mongoose = require('mongoose');

const getRiskScenarios = async (req, res) => {
  try {
    const scenarios = await riskScenarioService.getAllRiskScenarios();
    res.json(scenarios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRiskScenarioById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const scenario = await riskScenarioService.getRiskScenarioById(req.params.id);
    if (!scenario) return res.status(404).json({ message: 'Risk scenario not found' });
    if (req.user.role !== 'admin' && scenario.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xem kịch bản rủi ro này' });
    }
    res.json(scenario);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createRiskScenario = async (req, res) => {
  try {
    const scenario = await riskScenarioService.createRiskScenario(req.body);
    res.status(201).json(scenario);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateRiskScenario = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const scenario = await riskScenarioService.updateRiskScenario(req.params.id, req.body);
    if (!scenario) return res.status(404).json({ message: 'Risk scenario not found' });
    if (req.user.role !== 'admin' && scenario.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền sửa đổi kịch bản rủi ro này' });
    }
    const updated = await riskScenarioService.updateRiskScenario(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteRiskScenario = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const scenario = await riskScenarioService.deleteRiskScenario(req.params.id);
    if (!scenario) return res.status(404).json({ message: 'Risk scenario not found' });
    if (req.user.role !== 'admin' && scenario.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa kịch bản rủi ro này' });
    }
    await riskScenarioService.deleteRiskScenario(req.params.id);
    res.json({ message: 'Risk scenario deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getRiskScenarios,
  getRiskScenarioById,
  createRiskScenario,
  updateRiskScenario,
  deleteRiskScenario,
};
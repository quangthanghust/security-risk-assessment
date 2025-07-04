const operationScenarioService = require('../services/operationScenarioService');
const mongoose = require('mongoose');


const getOperationScenarios = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    }
    const scenarios = await operationScenarioService.getAllOperationScenarios(filter);
    res.json(scenarios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOperationScenarioById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const scenario = await operationScenarioService.getOperationScenarioById(req.params.id);
    if (!scenario) return res.status(404).json({ message: 'Operation scenario not found' });
    if (req.user.role !== 'admin' && scenario.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xem kịch bản này' });
    }
    res.json(scenario);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createOperationScenario = async (req, res) => {
  const ss = await StrategicScenario.findById(req.body.strategicScenarioId);
  if (!ss) return res.status(400).json({ message: 'StrategicScenario không tồn tại' });
  if (String(req.body.asset) !== String(ss.asset)) {
    return res.status(400).json({ message: 'Tài sản phải trùng với tài sản của kịch bản chiến lược đã chọn' });
  }
  try {
    const scenario = await operationScenarioService.createOperationScenario(
      {
        ...req.body,
        createdBy: req.user.userId
      });
    res.status(201).json(scenario);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateOperationScenario = async (req, res) => {
  const ss = await StrategicScenario.findById(req.body.strategicScenarioId);
  if (!ss) return res.status(400).json({ message: 'StrategicScenario không tồn tại' });
  if (String(req.body.asset) !== String(ss.asset)) {
    return res.status(400).json({ message: 'Tài sản phải trùng với tài sản của kịch bản chiến lược đã chọn' });
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const updated = await operationScenarioService.updateOperationScenario(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Operation scenario not found' });
    if (req.user.role !== 'admin' && updated.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền sửa kịch bản này' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteOperationScenario = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const scenario = await operationScenarioService.deleteOperationScenario(req.params.id);
    if (!scenario) return res.status(404).json({ message: 'Operation scenario not found' });
    if (req.user.role !== 'admin' && scenario.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa kịch bản này' });
    }
    res.json({ message: 'Đã xóa kịch bản vận hành thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getOperationScenarios,
  getOperationScenarioById,
  createOperationScenario,
  updateOperationScenario,
  deleteOperationScenario,
};
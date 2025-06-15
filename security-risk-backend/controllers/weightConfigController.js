const weightConfigService = require('../services/weightConfigService');

const getAllConfigs = async (req, res) => {
  try {
    res.json(await weightConfigService.getAllConfigs());
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getConfigById = async (req, res) => {
  try {
    const config = await weightConfigService.getConfigById(req.params.id);
    if (!config) return res.status(404).json({ message: 'Not found' });
    res.json(config);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const createConfig = async (req, res) => {
  try {
    res.status(201).json(await weightConfigService.createConfig(req.body));
  }
  catch (err) { res.status(400).json({ message: err.message }); }
};

const updateConfig = async (req, res) => {
  try {
    const updated = await weightConfigService.updateConfig(req.params.id, req.body);
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

const deleteConfig = async (req, res) => {
  try {
    await weightConfigService.deleteConfig(req.params.id);
    res.json({ message: 'Đã xóa cấu hình thành công' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getAllConfigs, getConfigById, createConfig, updateConfig, deleteConfig };
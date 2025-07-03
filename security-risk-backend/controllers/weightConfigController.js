const weightConfigService = require('../services/weightConfigService');

function sumWeights(obj) {
  return Object.values(obj || {}).reduce((a, b) => a + Number(b || 0), 0);
}

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
    const { consequenceWeights, likelihoodWeights } = req.body;
    if (
      Math.abs(sumWeights(consequenceWeights) - 1) > 0.0001 ||
      Math.abs(sumWeights(likelihoodWeights) - 1) > 0.0001
    ) {
      return res.status(400).json({ message: 'Tổng các trọng số của hậu quả và khả năng xảy ra phải bằng 1.' });
    }
    res.status(201).json(await weightConfigService.createConfig(req.body));
  }
  catch (err) { res.status(400).json({ message: err.message }); }
};

const updateConfig = async (req, res) => {
  try {
    const { consequenceWeights, likelihoodWeights } = req.body;
    if (
      Math.abs(sumWeights(consequenceWeights) - 1) > 0.0001 ||
      Math.abs(sumWeights(likelihoodWeights) - 1) > 0.0001
    ) {
      return res.status(400).json({ message: 'Tổng các trọng số của hậu quả và khả năng xảy ra phải bằng 1.' });
    }
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
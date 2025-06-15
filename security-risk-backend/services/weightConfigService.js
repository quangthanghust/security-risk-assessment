const WeightConfig = require('../models/WeightConfig');

const getAllConfigs = async () => WeightConfig.find();
const getConfigById = async (id) => WeightConfig.findById(id);
const createConfig = async (data) => new WeightConfig(data).save();
const updateConfig = async (id, data) => WeightConfig.findByIdAndUpdate(id, data, { new: true });
const deleteConfig = async (id) => WeightConfig.findByIdAndDelete(id);

module.exports = { getAllConfigs, getConfigById, createConfig, updateConfig, deleteConfig };
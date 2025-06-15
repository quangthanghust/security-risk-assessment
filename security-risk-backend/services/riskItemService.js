const RiskItem = require('../models/RiskItem');
const autoRiskItemGenerator = require('./autoRiskItemGenerator');

const getAllRiskItems = async (filter = {}) => {
  return RiskItem.find(filter)
    .populate('asset')
    .populate('threat')
    .populate('vulnerability')
    .populate('strategicScenario')
    .populate('operationScenario');
};

const getRiskItemById = async (id) => RiskItem.findById(id);
const deleteRiskItem = async (id) => RiskItem.findByIdAndDelete(id);

const generateRiskItems = async (reportId, riskAcceptanceCriteriaId, userId) => {
  await autoRiskItemGenerator.generateRiskItemsForReport(reportId, riskAcceptanceCriteriaId, userId);
};

module.exports = {
  getAllRiskItems,
  getRiskItemById,
  deleteRiskItem,
  generateRiskItems
};
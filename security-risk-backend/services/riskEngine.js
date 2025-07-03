const StrategicScenario = require('../models/StrategicScenario');
const OperationScenario = require('../models/OperationScenario');
const Asset = require('../models/Asset');
const Vulnerability = require('../models/Vulnerability');
const Threat = require('../models/Threat');
const WeightConfig = require('../models/WeightConfig');
const RiskAcceptanceCriteria = require('../models/RiskAcceptanceCriteria');

// Tính consequence: đồng bộ trường với Asset
const calculateConsequence = async (strategicScenarioId, weightConfig) => {
  let scenario = await StrategicScenario.findOne({ _id: strategicScenarioId }).populate('asset');
  if (!scenario) {
    return 1;
  }
  const asset = scenario.asset;
  const w = weightConfig?.consequenceWeights || {};

  // Đồng bộ tên trường với Asset.js
  const assetValue = asset?.value || 1;
  const impactTypeLevel = asset?.impactTypeLevel || 1;
  const interestedPartiesLevel = scenario.interestedPartiesLevel || 1; // Lấy từ StrategicScenario
  const dependency = asset?.dependency || 1;
  const lossMagnitude = asset?.lossMagnitude || 1;

  /* Thêm log để kiểm tra
  console.log('TÍNH HẬU QUẢ:', {
    assetValue,
    impactTypeLevel,
    interestedPartiesLevel,
    dependency,
    lossMagnitude,
    w,
    score
  }); */

  const score = (
    assetValue * (w.assetValue || 0) +
    impactTypeLevel * (w.impactTypeLevel || 0) +
    interestedPartiesLevel * (w.interestedPartiesLevel || 0) +
    dependency * (w.dependency || 0) +
    lossMagnitude * (w.lossMagnitude || 0)
  );

  if (score < 1.5) return 1;
  if (score < 2.5) return 2;
  if (score < 3.5) return 3;
  if (score < 4.5) return 4;
  return 5;
};

const calculateLikelihood = async (vulnerabilityId, threatId, operationScenarioId, weightConfig) => {
  const vulnerability = await Vulnerability.findById(vulnerabilityId);
  const threat = await Threat.findById(threatId);
  const op = await OperationScenario.findById(operationScenarioId);

  const w = weightConfig?.likelihoodWeights || {};
  const vulnerabilityLevel = vulnerability?.vulnerabilityLevel || 1;
  const threatLevel = threat?.threatLevel || 1;
  const controlEffectiveness = op?.controlEffectiveness || 1;
  const exposureFrequency = op?.exposureFrequency || 1;
  const detectability = op?.detectability || 1;

  const score = (
    vulnerabilityLevel * (w.vulnerabilityLevel || 0) +
    threatLevel * (w.threatLevel || 0) +
    (6 - controlEffectiveness) * (w.controlEffectiveness || 0) +
    exposureFrequency * (w.exposureFrequency || 0) +
    (6 - detectability) * (w.detectability || 0)
  );

  if (score < 1.5) return 1;
  if (score < 2.5) return 2;
  if (score < 3.5) return 3;
  if (score < 4.5) return 4;
  return 5;
};

const calculateRiskLevel = (consequence, likelihood) => {
  const score = consequence * likelihood;
  if (score >= 20) return 'Rất cao';
  if (score >= 15) return 'Cao';
  if (score >= 8) return 'Trung bình';
  if (score >= 3) return 'Thấp';
  return 'Rất thấp';
};

const calculateRisk = async ({
  strategicScenarioId,
  vulnerabilityId,
  threatId,
  operationScenarioId,
  weightConfig
}) => {
  let config = weightConfig;
  if (!config) {
    config = await WeightConfig.findOne().sort({ createdAt: -1 });
  }
  const consequence = await calculateConsequence(strategicScenarioId, config);
  const likelihood = await calculateLikelihood(vulnerabilityId, threatId, operationScenarioId, config);
  const riskLevel = calculateRiskLevel(consequence, likelihood);
  return { consequence, likelihood, riskLevel };
};

const evaluateRisk = async (riskLevel, riskAcceptanceCriteriaId) => {
  const criteria = await RiskAcceptanceCriteria.findById(riskAcceptanceCriteriaId);
  if (!criteria) return { evaluationResult: 'Unknown', treatmentRecommendation: 'Unknown' };
  const found = criteria.criteria.find(c => c.riskLevel === riskLevel);
  return {
    evaluationResult: found?.evaluation || 'Unknown',
    treatmentRecommendation: found?.description || 'Unknown'
  };
};

module.exports = {
  calculateConsequence,
  calculateLikelihood,
  calculateRiskLevel,
  calculateRisk,
  evaluateRisk,
};
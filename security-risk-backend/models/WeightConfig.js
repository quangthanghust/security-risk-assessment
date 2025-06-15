// Cấu hình trọng số cho consequence và likelihood
const mongoose = require('mongoose');

const weightConfigSchema = new mongoose.Schema({
  name: { type: String, required: true }, // VD: "Default", "Custom for Bank", ...
  consequenceWeights: {
    assetValue: { type: Number, default: 0.3 },                // Trường số: Asset.value
    impactTypeLevel: { type: Number, default: 0.25 },          // Trường số: Asset.impactTypeLevel
    interestedPartiesLevel: { type: Number, default: 0.15 },   // Trường số: Asset.interestedPartiesLevel
    dependency: { type: Number, default: 0.15 },               // Trường số: Asset.dependency
    lossMagnitude: { type: Number, default: 0.15 }             // Trường số: Asset.lossMagnitude
  },
  likelihoodWeights: {
    vulnerabilityLevel: { type: Number, default: 0.3 },        // Trường số: Vulnerability.vulnerabilityLevel
    threatLevel: { type: Number, default: 0.25 },              // Trường số: Threat.threatLevel
    controlEffectiveness: { type: Number, default: 0.2 },      // Trường số: OperationScenario.controlEffectiveness
    exposureFrequency: { type: Number, default: 0.15 },        // Trường số: OperationScenario.exposureFrequency
    detectability: { type: Number, default: 0.1 }              // Trường số: OperationScenario.detectability
  },
});

module.exports = mongoose.model('WeightConfig', weightConfigSchema);
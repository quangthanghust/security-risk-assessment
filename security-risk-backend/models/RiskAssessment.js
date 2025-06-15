const mongoose = require('mongoose');

const riskAssessmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  threats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Threat' }],
  vulnerabilities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vulnerability' }],
  strategicScenarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StrategicScenario' }],
  operationScenarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OperationScenario' }],
  interestedParties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'InterestedParty' }]
});

module.exports = mongoose.model('RiskAssessment', riskAssessmentSchema);
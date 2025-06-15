const mongoose = require('mongoose');

const riskScenarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  strategicScenarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'StrategicScenario', required: true },
  operationScenarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'OperationScenario', required: true },
  riskLevel: { type: String, enum: ['Very low', 'Low', 'Medium', 'High', 'Very high'], required: true }
});

module.exports = mongoose.model('RiskScenario', riskScenarioSchema);
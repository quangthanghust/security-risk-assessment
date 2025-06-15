const mongoose = require('mongoose');

const riskAcceptanceCriteriaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  criteria: [{ riskLevel: String, evaluation: String, description: String }]
});

module.exports = mongoose.model('RiskAcceptanceCriteria', riskAcceptanceCriteriaSchema);
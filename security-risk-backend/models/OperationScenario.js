const mongoose = require('mongoose');

const operationScenarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  strategicScenarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'StrategicScenario', required: true },
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  threat: { type: mongoose.Schema.Types.ObjectId, ref: 'Threat', required: true },
  vulnerability: { type: mongoose.Schema.Types.ObjectId, ref: 'Vulnerability', required: true },
  controlEffectiveness: { type: Number, min: 1, max: 5 }, // Hiệu quả kiểm soát (1-5)
  detectability: { type: Number, min: 1, max: 5 }, // Khả năng phát hiện (1-5)
  exposureFrequency: { type: Number, min: 1, max: 5 }, // Tần suất tiếp xúc (1-5)
  likelihoodLevel: { type: Number, min: 1, max: 5 }, // Kết quả tính toán, không nhập tay
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('OperationScenario', operationScenarioSchema);
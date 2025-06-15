const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
  riskItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'RiskItem', required: true },
  content: { type: String, required: true },
  generatedBySystem: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'implemented', 'rejected'], default: 'pending' },
  implementedAt: { type: Date }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
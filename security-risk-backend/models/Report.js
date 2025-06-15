const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  riskItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RiskItem' }],
  recommendations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recommendation' }]
});

module.exports = mongoose.model('Report', reportSchema);
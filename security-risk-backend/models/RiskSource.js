const mongoose = require('mongoose');

const riskSourceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'Cố ý', // Deliberate
      'Vô ý', // Accidental
      'Môi trường' // Environmental
    ],
    required: true
  },
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('RiskSource', riskSourceSchema);
const mongoose = require('mongoose');

const strategicScenarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  riskSource: { type: String },
  interestedParties: [{ type: String }],
  interestedPartiesLevel: { type: Number, min: 1, max: 5 }, // Đánh giá mức độ ảnh hưởng tới các bên liên quan (1-5)
  consequenceLevel: { type: Number, min: 1, max: 5 }, // Kết quả tính toán, không nhập tay
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true // Tự động thêm trường createdAt và updatedAt
});

module.exports = mongoose.model('StrategicScenario', strategicScenarioSchema);
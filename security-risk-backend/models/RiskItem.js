const mongoose = require('mongoose');

const riskItemSchema = new mongoose.Schema({
  riskDescription: { type: String, required: true }, // Mô tả tự động sinh
  consequence: { type: Number, min: 1, max: 5, required: true }, // Hậu quả (tự động tính)
  likelihood: { type: Number, min: 1, max: 5, required: true }, // Khả năng xảy ra (tự động tính)
  riskLevel: { type: String, enum: ['Rất thấp', 'Thấp', 'Trung bình', 'Cao', 'Rất cao'], required: true }, // Mức rủi ro (tự động tính)
  evaluationResult: { type: String, required: true }, // Kết luận (tự động sinh)
  treatmentRecommendation: { type: String, required: true }, // Khuyến nghị xử lý (tự động sinh)
  responsiblePerson: { type: String }, // Người chịu trách nhiệm (tự động gán hoặc cập nhật)


  // BỔ SUNG CÁC TRƯỜNG LIÊN KẾT
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
  threat: { type: mongoose.Schema.Types.ObjectId, ref: 'Threat' },
  vulnerability: { type: mongoose.Schema.Types.ObjectId, ref: 'Vulnerability' },
  strategicScenario: { type: mongoose.Schema.Types.ObjectId, ref: 'StrategicScenario' },
  operationScenario: { type: mongoose.Schema.Types.ObjectId, ref: 'OperationScenario' },

  assessmentSession: { type: String, required: true },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Người tạo bản ghi
}, {
  timestamps: true // Tự động thêm trường createdAt và updatedAt
});

module.exports = mongoose.model('RiskItem', riskItemSchema);
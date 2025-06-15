const mongoose = require('mongoose');

const threatSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: [
      'Hành động con người', 'Mối đe dọa vật lý', 'Mối đe dọa tự nhiên', 'Thất bại hạ tầng',
      'Thất bại kỹ thuật', 'Mối đe dọa tổ chức', 'Thỏa hiệp chức năng hoặc dịch vụ', 'Khác'
    ],
    required: true
  },
  code: { type: String }, // VD: TH01, TP01, ...
  description: { type: String, required: true },
  // Không cho phép nhập tự do, chỉ cho nhập description khi chọn "Other"
  isCustom: { type: Boolean, default: false },
  threatLevel: { type: Number, min: 1, max: 5, default: 1 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Threat', threatSchema);
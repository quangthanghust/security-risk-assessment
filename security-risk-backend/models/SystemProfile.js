const mongoose = require('mongoose');

const systemProfileSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Tên hệ thống
  description: { type: String },
  manager: { type: String, required: true }, // Người quản lý hệ thống
  contact: { type: String }, // Email/SĐT người quản lý
  purpose: { type: String }, // Mục đích sử dụng (ISO 27005:2022 - 6.2)
  scope: { type: String }, // Phạm vi hệ thống (ISO 27005:2022 - 6.2)
  criticality: { type: String, enum: ['Rất quan trọng', 'Quan trọng', 'Bình thường'], default: 'Bình thường' }, // Mức độ quan trọng (ISO 27005:2022 - 6.2)
  organizationUnit: { type: String }, // Đơn vị phụ trách
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('SystemProfile', systemProfileSchema);

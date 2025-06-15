const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  system: { type: mongoose.Schema.Types.ObjectId, ref: 'SystemProfile' },
  assetType: { type: String, enum: ['Information', 'Hardware', 'Software', 'Personnel', 'Site', 'Service', 'Other'], required: true },
  value: { type: Number, min: 1, max: 5 }, // Giá trị tài sản (1-5)
  impactTypes: [{ type: String, enum: ['Confidentiality', 'Integrity', 'Availability', 'Legal', 'Reputation', 'Other'] }],
  impactTypeLevel: { type: Number, min: 1, max: 5 }, // Mức độ tác động (1-5)
  lossMagnitude: { type: Number, min: 1, max: 5 }, // Mức độ tổn thất (1-5)
  dependency: { type: Number, min: 1, max: 5 }, // Mức độ phụ thuộc (1-5)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Asset', assetSchema);
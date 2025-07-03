const mongoose = require('mongoose');

const interestedPartySchema = new mongoose.Schema({
  name: { type: String, required: true },
  organization: String,
  position: String,
  address: String,
  phone: String,
  type: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true // Tự động thêm trường createdAt và updatedAt
});

module.exports = mongoose.model('InterestedParty', interestedPartySchema);
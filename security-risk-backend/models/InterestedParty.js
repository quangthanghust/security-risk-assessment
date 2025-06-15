const mongoose = require('mongoose');

const interestedPartySchema = new mongoose.Schema({
  name: { type: String, required: true },
  organization: String,
  position: String,
  address: String,
  phone: String,
  type: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('InterestedParty', interestedPartySchema);
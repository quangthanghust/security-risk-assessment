const mongoose = require('mongoose');
const InterestedParty = require('../models/InterestedParty');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAllInterestedParties = async (filter = {}) => InterestedParty.find(filter);

const getInterestedPartyById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return InterestedParty.findById(id);
};

const createInterestedParty = async (data) => {
  const party = new InterestedParty(data);
  return party.save();
};

const updateInterestedParty = async (id, data) => {
  if (!isValidObjectId(id)) return null;
  return InterestedParty.findByIdAndUpdate(id, data, { new: true });
};

const deleteInterestedParty = async (id) => {
  if (!isValidObjectId(id)) return null;
  return InterestedParty.findByIdAndDelete(id);
};

module.exports = {
  getAllInterestedParties,
  getInterestedPartyById,
  createInterestedParty,
  updateInterestedParty,
  deleteInterestedParty,
};
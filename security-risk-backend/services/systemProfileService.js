const SystemProfile = require('../models/SystemProfile');

const getAllSystemProfiles = async (filter = {}) => SystemProfile.find(filter);
const getSystemProfileById = async (id) => SystemProfile.findById(id);
const createSystemProfile = async (data) => (new SystemProfile(data)).save();
const updateSystemProfile = async (id, data) => SystemProfile.findByIdAndUpdate(id, data, { new: true });
const deleteSystemProfile = async (id) => SystemProfile.findByIdAndDelete(id);

module.exports = {
  getAllSystemProfiles,
  getSystemProfileById,
  createSystemProfile,
  updateSystemProfile,
  deleteSystemProfile,
};

const mongoose = require('mongoose');
const Asset = require('../models/Asset');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAllAssets = async (filter = {}) => Asset.find(filter).populate('system');

const getAssetById = async (id) => {
  if (!isValidObjectId(id)) return null;
  return Asset.findById(id).populate('system');
};

const createAsset = async (data) => {
  const asset = new Asset(data);
  return asset.save();
};

const updateAsset = async (id, data) => {
  if (!isValidObjectId(id)) return null;
  return Asset.findByIdAndUpdate(id, data, { new: true });
};

const deleteAsset = async (id) => {
  if (!isValidObjectId(id)) return null;
  return Asset.findByIdAndDelete(id);
};

module.exports = {
  getAllAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
};
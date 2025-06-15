const mongoose = require('mongoose');
const Recommendation = require('../models/Recommendation');
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAllRecommendations = async (filter = {}) => Recommendation.find(filter).populate('assessmentId').populate('riskItemId');
const getRecommendationById = async (id) => isValidObjectId(id) ? Recommendation.findById(id).populate('assessmentId').populate('riskItemId') : null;
const createRecommendation = async (data) => new Recommendation(data).save();
const updateRecommendation = async (id, data) => isValidObjectId(id) ? Recommendation.findByIdAndUpdate(id, data, { new: true }) : null;
const deleteRecommendation = async (id) => isValidObjectId(id) ? Recommendation.findByIdAndDelete(id) : null;

module.exports = { getAllRecommendations, getRecommendationById, createRecommendation, updateRecommendation, deleteRecommendation };
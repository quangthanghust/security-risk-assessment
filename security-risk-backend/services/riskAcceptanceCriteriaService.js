const mongoose = require('mongoose');
const RiskAcceptanceCriteria = require('../models/RiskAcceptanceCriteria');
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAllCriteria = async (filter = {}) => RiskAcceptanceCriteria.find(filter);
const getCriteriaById = async (id) => isValidObjectId(id) ? RiskAcceptanceCriteria.findById(id) : null;
const createCriteria = async (data) => new RiskAcceptanceCriteria(data).save();
const updateCriteria = async (id, data) => isValidObjectId(id) ? RiskAcceptanceCriteria.findByIdAndUpdate(id, data, { new: true }) : null;
const deleteCriteria = async (id) => isValidObjectId(id) ? RiskAcceptanceCriteria.findByIdAndDelete(id) : null;

module.exports = { getAllCriteria, getCriteriaById, createCriteria, updateCriteria, deleteCriteria };
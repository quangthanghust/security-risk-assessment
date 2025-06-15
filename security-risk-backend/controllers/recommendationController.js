const recommendationService = require('../services/recommendationService');
const mongoose = require('mongoose');

const getRecommendations = async (req, res) => {
  try { res.json(await recommendationService.getAllRecommendations()); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
const getRecommendationById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
  try {
    const rec = await recommendationService.getRecommendationById(req.params.id);
    if (!rec) return res.status(404).json({ message: 'Recommendation not found' });
    res.json(rec);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
const createRecommendation = async (req, res) => {
  try { res.status(201).json(await recommendationService.createRecommendation(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
};
const updateRecommendation = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
  try {
    const rec = await recommendationService.updateRecommendation(req.params.id, req.body);
    if (!rec) return res.status(404).json({ message: 'Recommendation not found' });
    res.json(rec);
  } catch (err) { res.status(400).json({ message: err.message }); }
};
const deleteRecommendation = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
  try {
    const rec = await recommendationService.deleteRecommendation(req.params.id);
    if (!rec) return res.status(404).json({ message: 'Recommendation not found' });
    res.json({ message: 'Recommendation deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getRecommendations, getRecommendationById, createRecommendation, updateRecommendation, deleteRecommendation };
const riskAcceptanceCriteriaService = require('../services/riskAcceptanceCriteriaService');
const mongoose = require('mongoose');

const getAllCriteria = async (req, res) => {
  try { res.json(await riskAcceptanceCriteriaService.getAllCriteria()); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
const getCriteriaById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
  try {
    const criteria = await riskAcceptanceCriteriaService.getCriteriaById(req.params.id);
    if (!criteria) return res.status(404).json({ message: 'Criteria not found' });
    res.json(criteria);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
const createCriteria = async (req, res) => {
  try { res.status(201).json(await riskAcceptanceCriteriaService.createCriteria(req.body)); }
  catch (err) { res.status(400).json({ message: err.message }); }
};
const updateCriteria = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
  try {
    const criteria = await riskAcceptanceCriteriaService.updateCriteria(req.params.id, req.body);
    if (!criteria) return res.status(404).json({ message: 'Criteria not found' });
    res.json(criteria);
  } catch (err) { res.status(400).json({ message: err.message }); }
};
const deleteCriteria = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
  try {
    const criteria = await riskAcceptanceCriteriaService.deleteCriteria(req.params.id);
    if (!criteria) return res.status(404).json({ message: 'Criteria not found' });
    res.json({ message: 'Criteria deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getAllCriteria, getCriteriaById, createCriteria, updateCriteria, deleteCriteria };
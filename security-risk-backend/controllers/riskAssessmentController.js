const riskAssessmentService = require('../services/riskAssessmentService');
const mongoose = require('mongoose');

const getRiskAssessments = async (req, res) => {
  try {
    const assessments = await riskAssessmentService.getAllRiskAssessments();
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRiskAssessmentById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const assessment = await riskAssessmentService.getRiskAssessmentById(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Risk assessment not found' });
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createRiskAssessment = async (req, res) => {
  try {
    const assessment = await riskAssessmentService.createRiskAssessment(req.body);
    res.status(201).json(assessment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateRiskAssessment = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const assessment = await riskAssessmentService.updateRiskAssessment(req.params.id, req.body);
    if (!assessment) return res.status(404).json({ message: 'Risk assessment not found' });
    if (req.user.role !== 'admin' && assessment.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền cập nhật đánh giá rủi ro này' });
    }
    const updated = await riskAssessmentService.updateRiskAssessment(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteRiskAssessment = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const assessment = await riskAssessmentService.deleteRiskAssessment(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Risk assessment not found' });
    if (req.user.role !== 'admin' && assessment.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xóa đánh giá rủi ro này' });
    }
    await riskAssessmentService.deleteRiskAssessment(req.params.id);
    res.json({ message: 'Đã xóa đánh giá rủi ro thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getRiskAssessments,
  getRiskAssessmentById,
  createRiskAssessment,
  updateRiskAssessment,
  deleteRiskAssessment,
};
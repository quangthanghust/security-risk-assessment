const riskItemService = require('../services/riskItemService');
const mongoose = require('mongoose');
const RiskItem = require('../models/RiskItem');

const getRiskItems = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    }
    const items = await riskItemService.getAllRiskItems(filter);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRiskItemById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const item = await riskItemService.getRiskItemById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Risk item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteRiskItem = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
  try {
    const item = await riskItemService.deleteRiskItem(req.params.id);
    if (!item) return res.status(404).json({ message: 'Risk item not found' });
    res.json({ message: 'Risk item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const generateRiskItems = async (req, res) => {
  try {
    await riskItemService.generateRiskItems(
      req.body.reportId,
      req.body.riskAcceptanceCriteriaId,
      req.user.userId
    );
    res.json({ message: 'Đánh giá rủi ro thành công!' });
  } catch (err) {
    // Log lỗi
    console.error('Lỗi generateRiskItems:', err);
    res.status(500).json({ message: err.message });
  }
};

const getAssessmentSessions = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    }
    const sessions = await RiskItem.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$assessmentSession",
          createdAt: { $min: "$createdAt" }
        }
      },
      { $sort: { createdAt: -1 } }
    ]);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRiskItemsBySession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    let filter = { assessmentSession: sessionId };
    if (req.user.role !== 'admin') {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    }
    const items = await RiskItem.find(filter)
      .populate('asset')
      .populate('threat')
      .populate('vulnerability')
      .populate('strategicScenario')
      .populate('operationScenario')
      .sort({ createdAt: -1 });
    res.json(items || []);
  } catch (err) {
    res.json([]); // Trả về mảng rỗng thay vì lỗi 500
  }
};

const getLatestSessionRiskItems = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    }
    const latest = await RiskItem.findOne(filter).sort({ createdAt: -1 });
    if (!latest) return res.json([]);
    filter.assessmentSession = latest.assessmentSession;
    const items = await RiskItem.find(filter)
      .populate('asset')
      .populate('threat')
      .populate('vulnerability')
      .populate('strategicScenario')
      .populate('operationScenario')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getRiskItems,
  getRiskItemById,
  deleteRiskItem,
  generateRiskItems,
  getAssessmentSessions,
  getRiskItemsBySession,
  getLatestSessionRiskItems
};
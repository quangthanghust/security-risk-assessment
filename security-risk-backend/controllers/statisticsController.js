const Asset = require('../models/Asset');
const Vulnerability = require('../models/Vulnerability');
const Threat = require('../models/Threat');
const StrategicScenario = require('../models/StrategicScenario');
const OperationScenario = require('../models/OperationScenario');
const RiskItem = require('../models/RiskItem');
const Report = require('../models/Report');
const User = require('../models/User');
const mongoose = require('mongoose');

const getOverview = async (req, res) => {
  try {
    let assetFilter = {};
    let vulnerabilityFilter = {};
    let threatFilter = {};
    let strategicScenarioFilter = {};
    let operationScenarioFilter = {};
    let riskItemFilter = {};
    let reportFilter = {};

    if (req.user.role !== 'admin') {
      assetFilter.createdBy = req.user.userId;
      vulnerabilityFilter.createdBy = req.user.userId;
      threatFilter.createdBy = req.user.userId;
      strategicScenarioFilter.createdBy = req.user.userId;
      operationScenarioFilter.createdBy = req.user.userId;
      riskItemFilter.createdBy = req.user.userId;
      reportFilter.createdBy = req.user.userId;
    }

    const [assets, vulnerabilities, threats, strategicScenarios, operationScenarios, riskItems, reports, users] = await Promise.all([
      Asset.countDocuments(assetFilter),
      Vulnerability.countDocuments(vulnerabilityFilter),
      Threat.countDocuments(threatFilter),
      StrategicScenario.countDocuments(strategicScenarioFilter),
      OperationScenario.countDocuments(operationScenarioFilter),
      RiskItem.countDocuments(riskItemFilter),
      Report.countDocuments(reportFilter),
      User.countDocuments()
    ]);
    res.json({ assets, vulnerabilities, threats, strategicScenarios, operationScenarios, riskItems, reports, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getRiskLevels = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    }
    // Đếm số lượng riskItem theo riskLevel
    const levels = ['Rất thấp', 'Thấp', 'Trung bình', 'Cao', 'Rất cao'];
    const counts = await Promise.all(
      levels.map(level =>
        RiskItem.countDocuments({ ...filter, riskLevel: level }).then(count => ({ level, count }))
      )
    );
    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAssetTypes = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    }
    // Đếm số lượng asset theo assetType
    const types = ['Information', 'Hardware', 'Software', 'Personnel', 'Site', 'Service', 'Other'];
    const counts = await Promise.all(
      types.map(type =>
        Asset.countDocuments({ ...filter, assetType: type }).then(count => ({ type, count }))
      )
    );
    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Sơ đồ các mức rủi ro theo từng phiên trong lịch sử đánh giá
const getRiskLevelTrend = async (req, res) => {
  try {
    let match = {};
    if (req.user.role !== 'admin') {
      match.createdBy = new mongoose.Types.ObjectId(req.user.userId);
    }
    // Lấy tất cả các phiên đánh giá
    const sessions = await RiskItem.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$assessmentSession",
          createdAt: { $min: "$createdAt" }
        }
      },
      { $sort: { createdAt: 1 } }
    ]);

    // Đếm số lượng từng mức rủi ro theo từng phiên
    const levels = ['Rất thấp', 'Thấp', 'Trung bình', 'Cao', 'Rất cao'];
    const trend = [];
    for (const s of sessions) {
      const counts = await RiskItem.aggregate([
        { $match: { ...match, assessmentSession: s._id } },
        { $group: { _id: "$riskLevel", count: { $sum: 1 } } }
      ]);
      // Map về đủ levels
      const levelCounts = {};
      levels.forEach(l => { levelCounts[l] = 0; });
      counts.forEach(c => { levelCounts[c._id] = c.count; });
      trend.push({
        session: s._id,
        createdAt: s.createdAt,
        ...levelCounts
      });
    }
    res.json(trend || []);
  } catch (err) {
    res.json([]); // Trả về mảng rỗng thay vì lỗi 500
  }
};


module.exports = { getOverview, getRiskLevels, getAssetTypes, getRiskLevelTrend };
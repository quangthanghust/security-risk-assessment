const RiskItem = require('../models/RiskItem');
const OperationScenario = require('../models/OperationScenario');
const StrategicScenario = require('../models/StrategicScenario');
const Vulnerability = require('../models/Vulnerability');
const Threat = require('../models/Threat');
const Asset = require('../models/Asset');
const riskEngine = require('./riskEngine');
const RiskAcceptanceCriteria = require('../models/RiskAcceptanceCriteria');
const WeightConfig = require('../models/WeightConfig');
const mongoose = require('mongoose');

async function generateRiskItemsForReport(reportId, riskAcceptanceCriteriaId, userId) {
  const weightConfig = await WeightConfig.findOne().sort({ updatedAt: -1 }); // Thêm dòng này
  // Lấy các operationScenario (mỗi cái đã liên kết asset, threat, vulnerability, strategicScenario)
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const sessionId = new Date().toISOString(); // Tạo sessionId mới
  const operationScenarios = await OperationScenario.find({ createdBy: userObjectId }).populate('asset threat vulnerability strategicScenarioId');
  const criteria = await RiskAcceptanceCriteria.findById(riskAcceptanceCriteriaId);


  for (const op of operationScenarios) {
    try {
      if (
        !op.asset || !op.asset._id ||
        !op.threat || !op.threat._id ||
        !op.vulnerability || !op.vulnerability._id ||
        !op.strategicScenarioId || !op.strategicScenarioId._id
      ) {
        console.log('Thiếu liên kết:', {
          asset: op.asset?._id,
          threat: op.threat?._id,
          vulnerability: op.vulnerability?._id,
          strategicScenarioId: op.strategicScenarioId?._id
        });
        continue;
      }

      // Tính toán kết quả
      const { consequence, likelihood, riskLevel } = await riskEngine.calculateRisk({
        strategicScenarioId: op.strategicScenarioId._id,
        vulnerabilityId: op.vulnerability._id,
        threatId: op.threat._id,
        operationScenarioId: op._id,
        weightConfig
      });
      const { evaluationResult, treatmentRecommendation } = await riskEngine.evaluateRisk(
        riskLevel,
        criteria._id
      );
      const riskDescription = `${op.asset?.name || 'Tài sản'} có nguy cơ bị ${op.threat?.description || 'mối đe dọa'} qua ${op.vulnerability?.description || 'lỗ hổng'} trong kịch bản "${op.name}"`;

      await RiskItem.create({
        riskDescription,
        consequence,
        likelihood,
        riskLevel,
        evaluationResult,
        treatmentRecommendation,
        responsiblePerson: op.asset.owner ? op.asset.owner.toString() : '',

        // BỔ SUNG LIÊN KẾT
        asset: op.asset._id,
        threat: op.threat._id,
        vulnerability: op.vulnerability._id,
        strategicScenario: op.strategicScenarioId._id,
        operationScenario: op._id,

        assessmentSession: sessionId,

        createdBy: userObjectId
      });
    }
    catch (err) {
      console.error('Lỗi khi tạo RiskItem:', err, op);
    }
  }
}

module.exports = { generateRiskItemsForReport };
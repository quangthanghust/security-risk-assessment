const express = require('express');
const router = express.Router();
const riskAssessmentController = require('../controllers/riskAssessmentController');

router.get('/', riskAssessmentController.getRiskAssessments);
router.get('/:id', riskAssessmentController.getRiskAssessmentById);
router.post('/', riskAssessmentController.createRiskAssessment);
router.put('/:id', riskAssessmentController.updateRiskAssessment);
router.delete('/:id', riskAssessmentController.deleteRiskAssessment);

module.exports = router;

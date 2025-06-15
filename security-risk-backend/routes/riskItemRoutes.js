const express = require('express');
const router = express.Router();
const riskItemController = require('../controllers/riskItemController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/', authMiddleware, riskItemController.getRiskItems);
router.get('/sessions', authMiddleware, riskItemController.getAssessmentSessions);
router.get('/session/:sessionId', authMiddleware, riskItemController.getRiskItemsBySession);
router.get('/latest', authMiddleware, riskItemController.getLatestSessionRiskItems);
router.get('/:id', authMiddleware, riskItemController.getRiskItemById);
router.delete('/:id', authMiddleware, riskItemController.deleteRiskItem);
router.post('/generate', authMiddleware, riskItemController.generateRiskItems);

module.exports = router;

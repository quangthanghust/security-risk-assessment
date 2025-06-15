const express = require('express');
const router = express.Router();
const riskScenarioController = require('../controllers/riskScenarioController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, riskScenarioController.getRiskScenarios);
router.get('/:id', authMiddleware, riskScenarioController.getRiskScenarioById);
router.post('/', authMiddleware, riskScenarioController.createRiskScenario);
router.put('/:id', authMiddleware, riskScenarioController.updateRiskScenario);
router.delete('/:id', authMiddleware, riskScenarioController.deleteRiskScenario);

module.exports = router;

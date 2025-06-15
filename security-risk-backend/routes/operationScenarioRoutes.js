const express = require('express');
const router = express.Router();
const operationScenarioController = require('../controllers/operationScenarioController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, operationScenarioController.getOperationScenarios);
router.get('/:id', authMiddleware, operationScenarioController.getOperationScenarioById);
router.post('/', authMiddleware, operationScenarioController.createOperationScenario);
router.put('/:id', authMiddleware, operationScenarioController.updateOperationScenario);
router.delete('/:id', authMiddleware, operationScenarioController.deleteOperationScenario);

module.exports = router;

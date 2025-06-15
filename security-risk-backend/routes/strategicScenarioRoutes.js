const express = require('express');
const router = express.Router();
const strategicScenarioController = require('../controllers/strategicScenarioController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, strategicScenarioController.getStrategicScenarios);
router.get('/:id', authMiddleware, strategicScenarioController.getStrategicScenarioById);
router.post('/', authMiddleware, strategicScenarioController.createStrategicScenario);
router.put('/:id', authMiddleware, strategicScenarioController.updateStrategicScenario);
router.delete('/:id', authMiddleware, strategicScenarioController.deleteStrategicScenario);

module.exports = router;
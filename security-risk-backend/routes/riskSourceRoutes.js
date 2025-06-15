const express = require('express');
const router = express.Router();
const riskSourceController = require('../controllers/riskSourceController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, riskSourceController.getRiskSources);
router.get('/:id', authMiddleware, riskSourceController.getRiskSourceById);
router.post('/', authMiddleware, riskSourceController.createRiskSource);
router.put('/:id', authMiddleware, riskSourceController.updateRiskSource);
router.delete('/:id', authMiddleware, riskSourceController.deleteRiskSource);

module.exports = router;

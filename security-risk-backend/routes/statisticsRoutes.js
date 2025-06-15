const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const auth = require('../middlewares/authMiddleware');

router.get('/overview', auth, statisticsController.getOverview);
router.get('/risk-levels', auth, statisticsController.getRiskLevels);
router.get('/asset-types', auth, statisticsController.getAssetTypes);
router.get('/risk-level-trend', auth, statisticsController.getRiskLevelTrend);

module.exports = router;
const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, recommendationController.getRecommendations);
router.get('/:id', authMiddleware, recommendationController.getRecommendationById);
router.post('/', authMiddleware, recommendationController.createRecommendation);
router.put('/:id', authMiddleware, recommendationController.updateRecommendation);
router.delete('/:id', authMiddleware, recommendationController.deleteRecommendation);

module.exports = router;
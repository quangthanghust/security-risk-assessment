const express = require('express');
const router = express.Router();
const riskAcceptanceCriteriaController = require('../controllers/riskAcceptanceCriteriaController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, riskAcceptanceCriteriaController.getAllCriteria);
router.get('/:id', authMiddleware, riskAcceptanceCriteriaController.getCriteriaById);
router.post('/', authMiddleware, riskAcceptanceCriteriaController.createCriteria);
router.put('/:id', authMiddleware, riskAcceptanceCriteriaController.updateCriteria);
router.delete('/:id', authMiddleware, riskAcceptanceCriteriaController.deleteCriteria);

module.exports = router;
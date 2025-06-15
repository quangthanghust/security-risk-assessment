const express = require('express');
const router = express.Router();
const threatController = require('../controllers/threatController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, threatController.getThreats);
router.get('/:id', authMiddleware, threatController.getThreatById);
router.post('/', authMiddleware, threatController.createThreat);
router.put('/:id', authMiddleware, threatController.updateThreat);
router.delete('/:id', authMiddleware, threatController.deleteThreat);

module.exports = router;


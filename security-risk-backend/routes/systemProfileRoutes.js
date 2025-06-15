const express = require('express');
const router = express.Router();
const systemProfileController = require('../controllers/systemProfileController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, systemProfileController.getSystemProfiles);
router.get('/:id', authMiddleware, systemProfileController.getSystemProfileById);
router.post('/', authMiddleware, systemProfileController.createSystemProfile);
router.put('/:id', authMiddleware, systemProfileController.updateSystemProfile);
router.delete('/:id', authMiddleware, systemProfileController.deleteSystemProfile);

module.exports = router;
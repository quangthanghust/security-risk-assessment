const express = require('express');
const router = express.Router();
const interestedPartyController = require('../controllers/interestedPartyController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, interestedPartyController.getInterestedParties);
router.get('/:id', authMiddleware, interestedPartyController.getInterestedPartyById);
router.post('/', authMiddleware, interestedPartyController.createInterestedParty);
router.put('/:id', authMiddleware, interestedPartyController.updateInterestedParty);
router.delete('/:id', authMiddleware, interestedPartyController.deleteInterestedParty);

module.exports = router;
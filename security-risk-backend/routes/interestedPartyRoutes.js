const express = require('express');
const router = express.Router();
const interestedPartyController = require('../controllers/interestedPartyController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/export-excel', authMiddleware, interestedPartyController.exportExcel);
router.post('/import-excel', authMiddleware, upload.single('file'), interestedPartyController.importExcel);

router.get('/', authMiddleware, interestedPartyController.getInterestedParties);
router.get('/:id', authMiddleware, interestedPartyController.getInterestedPartyById);
router.post('/', authMiddleware, interestedPartyController.createInterestedParty);
router.put('/:id', authMiddleware, interestedPartyController.updateInterestedParty);
router.delete('/:id', authMiddleware, interestedPartyController.deleteInterestedParty);

module.exports = router;
const express = require('express');
const router = express.Router();
const threatController = require('../controllers/threatController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// EXPORT & IMPORT
router.get('/export-excel', authMiddleware, threatController.exportExcel);
router.post('/import-excel', authMiddleware, upload.single('file'), threatController.importExcel);

router.get('/', authMiddleware, threatController.getThreats);
router.get('/:id', authMiddleware, threatController.getThreatById);
router.post('/', authMiddleware, threatController.createThreat);
router.put('/:id', authMiddleware, threatController.updateThreat);
router.delete('/:id', authMiddleware, threatController.deleteThreat);

module.exports = router;


const express = require('express');
const router = express.Router();
const systemProfileController = require('../controllers/systemProfileController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/export-excel', authMiddleware, systemProfileController.exportExcel);
router.post('/import-excel', authMiddleware, upload.single('file'), systemProfileController.importExcel);

router.get('/', authMiddleware, systemProfileController.getSystemProfiles);
router.get('/:id', authMiddleware, systemProfileController.getSystemProfileById);
router.post('/', authMiddleware, systemProfileController.createSystemProfile);
router.put('/:id', authMiddleware, systemProfileController.updateSystemProfile);
router.delete('/:id', authMiddleware, systemProfileController.deleteSystemProfile);

module.exports = router;
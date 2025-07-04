const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/export-excel', authMiddleware, assetController.exportExcel);
router.post('/import-excel', authMiddleware, upload.single('file'), assetController.importExcel);

router.get('/', authMiddleware, assetController.getAssets);
router.get('/:id', authMiddleware, assetController.getAssetById);
router.post('/', authMiddleware, assetController.createAsset);
router.put('/:id', authMiddleware, assetController.updateAsset);
router.delete('/:id', authMiddleware, assetController.deleteAsset);

module.exports = router;

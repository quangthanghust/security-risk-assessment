const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, assetController.getAssets);
router.get('/:id', authMiddleware, assetController.getAssetById);
router.post('/', authMiddleware, assetController.createAsset);
router.put('/:id', authMiddleware, assetController.updateAsset);
router.delete('/:id', authMiddleware, assetController.deleteAsset);

module.exports = router;

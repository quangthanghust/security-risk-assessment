const express = require('express');
const router = express.Router();
const weightConfigController = require('../controllers/weightConfigController');
/*const authMiddleware = require('../middlewares/authMiddleware'); */

// router.use(authMiddleware);

router.get('/', weightConfigController.getAllConfigs);
router.get('/:id', weightConfigController.getConfigById);
router.post('/', weightConfigController.createConfig);
router.put('/:id', weightConfigController.updateConfig);
router.delete('/:id', weightConfigController.deleteConfig);

module.exports = router;
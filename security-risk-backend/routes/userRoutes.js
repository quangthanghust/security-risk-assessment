const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');


router.get('/profile', authenticateJWT, userController.getProfile);

// Route chỉ cho admin
router.get('/', authenticateJWT, adminMiddleware, userController.getUsers);
router.get('/:id', authenticateJWT, adminMiddleware, userController.getUserById);
router.post('/', authenticateJWT, adminMiddleware, userController.createUser);
router.put('/:id', authenticateJWT, adminMiddleware, userController.updateUser);
router.delete('/:id', authenticateJWT, adminMiddleware, userController.deleteUser);

module.exports = router;

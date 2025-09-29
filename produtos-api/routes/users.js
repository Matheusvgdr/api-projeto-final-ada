const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Dependendo do seu caso, você pode proteger essas rotas com requireAuth
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
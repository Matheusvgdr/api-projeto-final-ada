const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const requireAuth = require('../middleware/authMiddleware');

// Públicas
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protegidas
//router.post('/', requireAuth, productController.createProduct);
router.post('/', productController.createProduct);
router.put('/:id', requireAuth, productController.updateProduct);
router.delete('/:id', requireAuth, productController.deleteProduct);

module.exports = router;
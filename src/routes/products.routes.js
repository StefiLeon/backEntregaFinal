import express from 'express';
import productsController from '../controllers/products.controller.js';

const router = express.Router();

router.get('/', productsController.getAllProducts);
router.get('/:pid', productsController.getProductById);
router.post('/', productsController.saveProduct);
router.put('/:pid', productsController.updateProduct);
router.delete('/:pid', productsController.deleteProduct);

export default router;
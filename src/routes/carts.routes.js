import express from 'express';
import cartsController from '../controllers/carts.controller.js';
import { passportCall } from '../utils/middlewares.js';

const router = express.Router();

router.get('/:cid', cartsController.getCartById);
router.post('/purchase/:cid', passportCall('jwt'), cartsController.confirmPurchase);
router.post('/:cid/products/:pid', cartsController.addProduct);
router.put('/:cid', cartsController.updateCart);
router.delete('/:cid/products/:pid', cartsController.deleteProductFromCart);

export default router;
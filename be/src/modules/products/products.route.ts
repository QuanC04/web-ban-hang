import { Router } from 'express';
import { authenticate } from '../../middleware/authicate';
import {
    addProductController,
    deleteProductController,
    getCategoriesController,
    getProductByIdController,
    getProductsByUserIdController,
    updateProductController,
} from './products.controller';
import { requireAdmin } from '../../middleware/requireAdmin';

const productsRoute: Router = Router();

productsRoute.post('/create', authenticate, requireAdmin, addProductController);
productsRoute.get('/categories', authenticate, getCategoriesController);
productsRoute.get('/get-product', authenticate, requireAdmin, getProductsByUserIdController);
productsRoute.put('/update/:id', authenticate, requireAdmin, updateProductController);
productsRoute.get('/:id', authenticate, getProductByIdController);
productsRoute.delete('/delete/:productId', requireAdmin, authenticate, deleteProductController);

export default productsRoute;

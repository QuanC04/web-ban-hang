import { Router } from 'express';
import {
    getMarketProductByIdController,
    getMarketProductsController,
} from './marketProduct.controller';

const marketProductRoute: Router = Router();

marketProductRoute.get('/market-product', getMarketProductsController);
marketProductRoute.get('/market-product/:productId', getMarketProductByIdController);

export default marketProductRoute;

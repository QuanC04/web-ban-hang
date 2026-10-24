import { Router } from 'express';
import { buyNowOrderController, createOrderController, getMyOrdersController } from './order.controller';
import { authenticate } from '../../middleware/authicate';

const orderRouter: Router = Router();

orderRouter.post('/create-order', authenticate, createOrderController);
orderRouter.post('/buy-now', authenticate, buyNowOrderController);
orderRouter.get('/my-orders', authenticate, getMyOrdersController);

export default orderRouter;

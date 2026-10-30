import { Router } from 'express';
import {
    buyNowOrderController,
    confirmDeliveryController,
    createOrderController,
    getMyOrdersController,
    getShopOrdersController,
    updateOrderStatusController,
} from './order.controller';
import { authenticate } from '../../middleware/authicate';
import { requireAdmin } from '../../middleware/requireAdmin';

const orderRouter: Router = Router();

orderRouter.post('/create-order', authenticate, createOrderController);
orderRouter.post('/buy-now', authenticate, buyNowOrderController);
orderRouter.get('/my-orders', authenticate, getMyOrdersController);
orderRouter.patch('/:orderId/status', authenticate, requireAdmin, updateOrderStatusController);
orderRouter.put('/:orderId/status', authenticate, requireAdmin, updateOrderStatusController);
orderRouter.patch('/:orderId/confirm-delivery', authenticate, confirmDeliveryController);
orderRouter.put('/:orderId/confirm-delivery', authenticate, confirmDeliveryController);
orderRouter.get('/shop-orders', authenticate, requireAdmin, getShopOrdersController);

export default orderRouter;

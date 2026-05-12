import { Router } from 'express';
import { createOrderController } from './order.controller';
import { authenticate } from '../../middleware/authicate';

const orderRouter: Router = Router();

orderRouter.post('/create-order', authenticate, createOrderController);

export default orderRouter;

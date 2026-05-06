import { Router } from 'express';
import { createOrderController } from './order.controller';
import { authenticate } from '../../middleware/authicate';

const orderRouter: Router = Router();

orderRouter.post('/create', authenticate, createOrderController);

export default orderRouter;

import { Router } from 'express';
import { createCouponController, validateCouponController } from './coupon.controller';

const couponRouter: Router = Router();

couponRouter.post('/create', createCouponController);
couponRouter.post('/validate', validateCouponController);

export default couponRouter;

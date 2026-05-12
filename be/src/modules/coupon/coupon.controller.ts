import { asyncHandler } from '../../middleware/errorHandler';
import { errorResponse, successResponse } from '../../utils/response';
import { Request, Response, NextFunction } from 'express';
import { createCoupon, validateCouponData } from './coupon.service';

export const createCouponController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.body.user_id;
    const couponData = req.body;
    const result = await createCoupon(couponData, userId);
    successResponse(res, result, 'Tạo mã giảm giá thành công', 201);
});

export const validateCouponController = asyncHandler(async (req: Request, res: Response) => {
    const { code, subtotal } = req.body;
    const userId = req.body.user_id;
    const result = await validateCouponData(code, userId, subtotal);
    successResponse(res, result, 'Áp dụng thành công mã giảm giá');
});

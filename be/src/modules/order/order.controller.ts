import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { successResponse } from '../../utils/response';
import { BuyNowPayload, OrderPayload } from '../../models';
import { buyNowOrder, createOrder, getMyOrders } from './order.service';

export const createOrderController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const orderData: OrderPayload = req.body;
    const result = await createOrder(userId, orderData);
    successResponse(res, result, 'Đặt hàng thành công');
});

export const buyNowOrderController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const orderData: BuyNowPayload = req.body;
    const result = await buyNowOrder(userId, orderData);
    successResponse(res, result, 'Mua ngay thành công');
});

export const getMyOrdersController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string | undefined;
    const result = await getMyOrders(userId, page, limit, status);
    successResponse(res, result, 'Lấy danh sách đơn hàng thành công');
});

import { Request, Response } from 'express';
import { errorResponse, successResponse } from '../../utils/response';
import { OrderPayload } from '../../models';
import { createOrder } from './order.service';

export const createOrderController = async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const orderData: OrderPayload = req.body;
    await createOrder(userId, orderData);
    successResponse(res, null, 'Đặt hàng thành công');
};

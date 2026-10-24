import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import {
    createCartItem,
    deleteCartItem,
    getCartItemsByUserId,
    updateCartItem,
} from './cart.service';
import { successResponse } from '../../utils/response';

export const getCartItemsByUserIdController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const cartItems = await getCartItemsByUserId(userId);
    successResponse(res, cartItems, 'Lấy giỏ hàng thành công', 200);
});

export const createCartItemController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const cartItem = req.body;
    const createdCartItem = await createCartItem(userId, cartItem);
    successResponse(res, createdCartItem, 'Thêm vào giỏ hàng thành công', 201);
});

export const updateCartItemController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const { quantity, itemId } = req.body;
    const updatedCartItem = await updateCartItem(itemId, userId, { quantity });
    successResponse(res, updatedCartItem, 'Cập nhật giỏ hàng thành công', 200);
});

export const deleteCartItemController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const  itemId   = req.params.itemId as string;
    await deleteCartItem(itemId, userId);
    successResponse(res, null, 'Xóa khỏi giỏ hàng thành công', 200);
});

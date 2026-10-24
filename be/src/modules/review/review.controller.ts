import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { successResponse } from '../../utils/response';
import { createReview, getReviewsByProductId } from './review.service';

export const createReviewController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const reviewData = req.body;
    const result = await createReview(userId, reviewData);
    successResponse(res, result, 'Đánh giá sản phẩm thành công');
});

export const getReviewsByProductIdController = asyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.productId as string;
    const query = req.query;
    const result = await getReviewsByProductId(productId, query);
    successResponse(res, result, 'Lấy danh sách đánh giá sản phẩm thành công');
});

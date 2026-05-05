import { asyncHandler } from '../../middleware/errorHandler';
import { Request, Response } from 'express';
import {
    addProduct,
    deleteProduct,
    getCategories,
    getProductById,
    getProductsByUserId,
    updateProduct,
} from './products.service';
import { successResponse, errorResponse } from '../../utils/response';

export const addProductController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const productData = req.body;
    const result = await addProduct(userId, productData);
    successResponse(res, result, 'Thêm sản phẩm thành công', 201);
});

export const getCategoriesController = asyncHandler(async (req: Request, res: Response) => {
    const result = await getCategories();
    successResponse(res, result, 'Lấy danh mục thành công', 200);
});

export const getProductsByUserIdController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const result = await getProductsByUserId(userId);
    successResponse(res, result, 'Lấy sản phẩm thành công', 200);
});

export const updateProductController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const productId = req.params.id as string;
    const productData = req.body;
    const result = await updateProduct(productId, userId, productData);
    successResponse(res, result, 'Cập nhật sản phẩm thành công', 200);
});

export const getProductByIdController = asyncHandler(async (req: Request, res: Response) => {
    const productId = req.params.id as string;
    const result = await getProductById(productId);
    successResponse(res, result, 'Lấy sản phẩm thành công', 200);
});

export const deleteProductController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const productId = req.params.id as string;
    const result = await deleteProduct(productId, userId);
    successResponse(res, result, 'Xóa sản phẩm thành công', 200);
});

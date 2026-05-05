import { asyncHandler } from '../../middleware/errorHandler';
import { errorResponse, successResponse } from '../../utils/response';
import { Request, Response, NextFunction } from 'express';
import { login, logout, refreshToken, register } from './auth.service';

export const registerController = asyncHandler(async (req: Request, res: Response) => {
    const result = await register(req, res);
    successResponse(res, result, 'Đăng ký thành công', 201);
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
    const result = await login(req, res);
    successResponse(res, result, 'Đăng nhập thành công', 200);
});

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
    await logout(req);
    successResponse(res, null, 'Đăng xuất thành công', 200);
});

export const refreshTokenController = asyncHandler(async (req: Request, res: Response) => {
    const { oldRefreshToken } = req.body;
    try {
        const result = await refreshToken(oldRefreshToken);

        return successResponse(res, result, 'Làm mới token thành công', 200);
    } catch (error: any) {
        if (error.message === 'REFRESH_TOKEN_REQUIRED') {
            return errorResponse(res, 'Refresh token là bắt buộc', 400);
        }
        return errorResponse(res, 'Refresh token không hợp lệ hoặc đã hết hạn', 401);
    }
});

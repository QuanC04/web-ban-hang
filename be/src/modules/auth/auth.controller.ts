import { asyncHandler } from '../../middleware/errorHandler';
import { successResponse } from '../../utils/response';
import { Request, Response } from 'express';
import {
    login,
    logout,
    otpRequest,
    otpVerify,
    refreshToken,
    register,
    resetPassword,
} from './auth.service';

export const registerController = asyncHandler(async (req: Request, res: Response) => {
    const result = await register(req.body);
    successResponse(res, result, 'Đăng ký thành công', 201);
});

export const loginController = asyncHandler(async (req: Request, res: Response) => {
    const result = await login(req.body);
    successResponse(res, result, 'Đăng nhập thành công', 200);
});

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
    await logout(req.user?.userId);
    successResponse(res, null, 'Đăng xuất thành công', 200);
});

export const refreshTokenController = asyncHandler(async (req: Request, res: Response) => {
    const { oldRefreshToken } = req.body;
    const result = await refreshToken(oldRefreshToken);

    return successResponse(res, result, 'Làm mới token thành công', 200);
});

export const otpRequestController = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await otpRequest(email);
    return successResponse(res, result, 'Yêu cầu OTP thành công', 200);
});

export const otpVerifyController = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const result = await otpVerify(email, otp);
    return successResponse(res, result, 'Xác thực OTP thành công', 200);
});
export const resetPasswordController = asyncHandler(async (req: Request, res: Response) => {
    const { resetToken, newPassword } = req.body;
    const result = await resetPassword(resetToken, newPassword);
    return successResponse(res, result, 'Đặt lại mật khẩu thành công', 200);
});

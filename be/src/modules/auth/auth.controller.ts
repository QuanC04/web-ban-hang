import { asyncHandler } from "../../middleware/errorHandler";
import { successResponse } from "../../utils/response";
import { Request, Response, NextFunction } from 'express';
import { login, logout, register } from "./auth.service";

export const registerController = asyncHandler(async (req: Request, res: Response) => {
    const result = await register(req, res);
    successResponse(res, result, "Đăng ký thành công", 201);
})

export const loginController = asyncHandler(async (req: Request, res: Response) => {
    const result = await login(req, res);
    successResponse(res, result, "Đăng nhập thành công", 200);
})

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
    await logout(req);
    successResponse(res, null, "Đăng xuất thành công", 200);
})

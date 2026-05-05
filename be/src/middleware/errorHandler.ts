import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

interface AppError {
    statusCode?: number;
    message?: string;
    code?: string;
}

export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Chuyển đổi hàm về dạng Promise và catch lỗi
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export const errorHandler = (
    err: AppError,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Lỗi server nội bộ';
    const code = err.code || 'INTERNAL_SERVER_ERROR';

    errorResponse(res, message, statusCode, code);
};

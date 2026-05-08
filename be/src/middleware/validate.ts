import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

import { errorResponse } from '../utils/response';

export const validate =
    (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.issues.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            return errorResponse(res, 'Dữ liệu không hợp lệ', 400, 'VALIDATION_ERROR', errors);
        }
        req.body = result.data;
        next();
    };

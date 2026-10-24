import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/errorHandler';
import { getMe, updateProfile } from './user.service';
import { successResponse } from '../../utils/response';

export const getMeController = asyncHandler(async (req: Request, res: Response) => {
    const user = await getMe(req);
    successResponse(res, user);
});

export const updateProfileController = asyncHandler(async (req: Request, res: Response) => {
    const user = await updateProfile(req);
    successResponse(res, user);
});

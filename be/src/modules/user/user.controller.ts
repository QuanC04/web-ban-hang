import { Request, Response } from 'express';
import { getMe, updateProfile } from './user.service';
import { successResponse, errorResponse } from '../../utils/response';

export const getMeController = async (req: Request, res: Response) => {
    const user = await getMe(req);
    successResponse(res, user);
};

export const updateProfileController = async (req: Request, res: Response) => {
    const user = await updateProfile(req);
    successResponse(res, user);
};

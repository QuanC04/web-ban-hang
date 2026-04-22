import { Request, Response } from "express";
import { getMe, updateProfile } from "./user.service";
import { successResponse, errorResponse } from "../../utils/response";
import { uploadFileToR2 } from "../upload/upload.service";

export const getMeController = async (req: Request, res: Response) => {
    const user = await getMe(req);
    successResponse(res, user);
};

export const updateProfileController = async (req: Request, res: Response) => {

    const user = await updateProfile(req);
    successResponse(res, user);
};

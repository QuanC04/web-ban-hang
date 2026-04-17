import { asyncHandler } from "../../middleware/errorHandler";
import { Request, Response } from 'express';
import { uploadFileToR2 } from "./upload.service";
import { successResponse } from "../../utils/response";

export const uploadController = asyncHandler(async (req:Request, res:Response) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
 const url = await uploadFileToR2(req.file);
 successResponse(res, { url }, "Upload file thành công", 200);
})

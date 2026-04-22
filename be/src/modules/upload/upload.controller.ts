import { asyncHandler } from "../../middleware/errorHandler";
import { Request, Response } from 'express';
import { deleteFileFromR2, uploadFileToR2 } from "./upload.service";
import { errorResponse, successResponse } from "../../utils/response";

export const uploadController = asyncHandler(async (req:Request, res:Response) => {
    if (!req.file) {
        return errorResponse(res, "No file uploaded", 400, "UPLOAD_NO_FILE");
    }
 const uploadResult = await uploadFileToR2(req.file);
 successResponse(res, uploadResult, "Upload file thành công", 200);
})





export const deleteImageByKeyController = asyncHandler(async (req: Request, res: Response) => {
    const key = typeof req.body?.key === "string" ? req.body.key.trim() : "";

    if (!key) {
        return errorResponse(res, "Missing image key", 400, "UPLOAD_MISSING_IMAGE_KEY");
    }

    await deleteFileFromR2(key);
    successResponse(res, { key }, "Xóa ảnh thành công", 200);
});

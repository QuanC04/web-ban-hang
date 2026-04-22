// src/modules/upload/upload.service.ts
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET_NAME, PUBLIC_URL, r2Client } from "../../lib/r2";
import prisma from "../../lib/prisma";
import { UploadResult } from "../../models";

export const uploadFileToR2 = async (file: Express.Multer.File): Promise<UploadResult> => {
  const fileExtension = file.originalname.split(".").pop();
  const key = `products/${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await r2Client.send(command);

  return {
    url: `${PUBLIC_URL}/${key}`,
    key,
    mime: file.mimetype,
    size: file.size,
  };
};

export const deleteFileFromR2 = async (key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
};

export const updateImageInR2 = async (
  productId: string,
  userId: string,
  newFile: Express.Multer.File
): Promise<UploadResult> => {
  const existingProduct = await prisma.product.findFirst({
    where: {
      id: productId,
      user_id: userId,
    },
    select: {
      image_key: true,
    },
  });

  if (!existingProduct) {
    throw new Error("Không tìm thấy sản phẩm hoặc bạn không có quyền sửa ảnh");
  }

  const oldKey = existingProduct.image_key;
  const uploaded = await uploadFileToR2(newFile);

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        image_url: uploaded.url,
        image_key: uploaded.key,
        image_provider: "cloudflare_r2",
      },
    });
  } catch (error) {
    await deleteFileFromR2(uploaded.key).catch(() => undefined);
    throw error;
  }

  if (oldKey && oldKey !== uploaded.key) {
    await deleteFileFromR2(oldKey).catch(() => undefined);
  }

  return uploaded;
};

// src/modules/upload/upload.controller.ts
import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/errorHandler";
import { errorResponse, successResponse } from "../../utils/response";
import { deleteFileFromR2, updateImageInR2, uploadFileToR2 } from "./upload.service";

export const uploadController = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    return errorResponse(res, "No file uploaded", 400, "UPLOAD_NO_FILE");
  }

  const uploadResult = await uploadFileToR2(req.file);
  successResponse(res, uploadResult, "Upload file thành công", 200);
});

export const updateImageController = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const userId = req.user?.userId;

  if (!productId) {
    return errorResponse(res, "Thiếu productId", 400, "UPDATE_MISSING_PRODUCT_ID");
  }

  if (!userId) {
    return errorResponse(res, "Unauthorized", 401, "UNAUTHORIZED");
  }

  if (!req.file) {
    return errorResponse(res, "No file uploaded", 400, "UPLOAD_NO_FILE");
  }

  const uploadResult = await updateImageInR2(productId, userId, req.file);
  successResponse(res, uploadResult, "Cập nhật ảnh thành công", 200);
});

export const deleteController = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.body;

  if (!key) {
    return errorResponse(res, "No file key provided", 400, "DELETE_NO_KEY");
  }

  await deleteFileFromR2(key);
  successResponse(res, null, "Xóa file thành công", 200);
});

// src/modules/upload/upload.route.ts
import { Router } from "express";
import multer from "multer";
import { authenticate } from "../../middleware/authicate";
import { deleteController, updateImageController, uploadController } from "./upload.controller";

const uploadRoute: Router = Router();
const upload = multer({ storage: multer.memoryStorage() });

uploadRoute.post("/image", authenticate, upload.single("file"), uploadController);
uploadRoute.patch("/image/:productId", authenticate, upload.single("file"), updateImageController);
uploadRoute.delete("/image", authenticate, deleteController);

export default uploadRoute;

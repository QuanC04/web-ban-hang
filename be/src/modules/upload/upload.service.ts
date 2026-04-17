import { PutObjectCommand } from "@aws-sdk/client-s3";
import { BUCKET_NAME, PUBLIC_URL, r2Client } from "../../lib/r2";

export const uploadFileToR2 = async (file: Express.Multer.File): Promise<string> => {
  // Tạo key duy nhất cho file để tránh ghi đè
  const fileExtension = file.originalname.split('.').pop();
  const key = `products/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    await r2Client.send(command);
    // Trả về URL đầy đủ để lưu vào database
    return `${PUBLIC_URL}/${key}`;
  } catch (error) {
    console.error("R2 Upload Error:", error);
    throw new Error("Không thể upload ảnh lên Cloudflare R2");
  }
};

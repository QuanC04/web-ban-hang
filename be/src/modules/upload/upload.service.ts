import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { BUCKET_NAME, PUBLIC_URL, r2Client } from '../../lib/r2';
import { UploadResult } from '../../models';

export const uploadFileToR2 = async (file: Express.Multer.File): Promise<UploadResult> => {
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
        return {
            url: `${PUBLIC_URL}/${key}`,
            key: key,
            mime: file.mimetype,
            size: file.size,
        };
    } catch (error) {
        console.error('R2 Upload Error:', error);
        throw new Error('Không thể upload ảnh lên Cloudflare R2');
    }
};

export const deleteFileFromR2 = async (key: string): Promise<void> => {
    const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    });
    try {
        await r2Client.send(command);
    } catch (error) {
        console.error('R2 Delete Error:', error);
        throw new Error('Không thể xóa ảnh từ Cloudflare R2');
    }
};

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const requiredEnvs = [
    'CLOUDFLARE_ACCOUNT_ID',
    'CLOUDFLARE_ACCESS_KEY_ID',
    'CLOUDFLARE_SECRET_ACCESS_KEY',
    'R2_BUCKET_NAME',
    'R2_PUBLIC_URL',
];

for (const env of requiredEnvs) {
    if (!process.env[env]) {
        throw new Error(`Missing critical environment variable: ${env}`);
    }
}
export const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || '',
    },
});
export const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
export const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

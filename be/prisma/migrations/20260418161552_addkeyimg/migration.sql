-- AlterTable
ALTER TABLE `products` ADD COLUMN `image_key` VARCHAR(191) NULL,
    ADD COLUMN `image_provider` VARCHAR(191) NOT NULL DEFAULT 'cloudflare_r2';

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `discount_amount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `shipping_fee` INTEGER NOT NULL DEFAULT 0;

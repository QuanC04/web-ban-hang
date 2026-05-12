/*
  Warnings:

  - You are about to alter the column `discount_value` on the `coupons` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `updated_at` to the `coupons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `coupons` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `min_order_amount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `per_user_limit` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `usage_limit` INTEGER NULL,
    MODIFY `discount_value` INTEGER NOT NULL;

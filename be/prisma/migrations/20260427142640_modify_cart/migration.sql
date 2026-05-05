/*
  Warnings:

  - You are about to drop the column `cart_id` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the column `create_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `creat_at` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the `cart` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,product_id]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `cart_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `cart_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `cart_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `cart_items` DROP FOREIGN KEY `cart_items_cart_id_fkey`;

-- DropIndex
DROP INDEX `cart_items_cart_id_fkey` ON `cart_items`;

-- AlterTable
ALTER TABLE `cart_items` DROP COLUMN `cart_id`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `create_at`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `payments` DROP COLUMN `creat_at`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `cart`;

-- CreateIndex
CREATE UNIQUE INDEX `cart_items_user_id_product_id_key` ON `cart_items`(`user_id`, `product_id`);

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

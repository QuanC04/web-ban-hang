/*
  Warnings:

  - Added the required column `name` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `address` ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone_number` VARCHAR(191) NOT NULL;

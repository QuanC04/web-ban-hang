-- Align migration history with schema changes that already exist in the current database.
ALTER TABLE `address` DROP COLUMN `province`,
    ADD COLUMN `province_id` VARCHAR(191) NULL,
    ADD COLUMN `province_name` VARCHAR(191) NULL;

ALTER TABLE `users` ADD COLUMN `avatar_key` VARCHAR(191) NULL;

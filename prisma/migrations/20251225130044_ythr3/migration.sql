/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `assets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `assets` DROP COLUMN `deleted_at`,
    MODIFY `storage_provider_name` ENUM('IMAGE_KIT') NOT NULL DEFAULT 'IMAGE_KIT';

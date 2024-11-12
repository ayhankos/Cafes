/*
  Warnings:

  - Added the required column `category` to the `Cafe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Cafe` ADD COLUMN `category` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `ContactInfo` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('WEBSITE', 'INSTAGRAM', 'FACEBOOK', 'TWITTER', 'PHONE', 'EMAIL') NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `cafeId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ContactInfo` ADD CONSTRAINT `ContactInfo_cafeId_fkey` FOREIGN KEY (`cafeId`) REFERENCES `Cafe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

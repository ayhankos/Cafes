/*
  Warnings:

  - You are about to drop the column `location` on the `Cafe` table. All the data in the column will be lost.
  - Added the required column `city` to the `Cafe` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `Cafe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Cafe` DROP COLUMN `location`,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `district` VARCHAR(191) NOT NULL,
    ADD COLUMN `googleMapsUrl` VARCHAR(191) NULL;

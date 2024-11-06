/*
  Warnings:

  - You are about to drop the column `score` on the `Rating` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Rating` DROP COLUMN `score`,
    ADD COLUMN `rating` DOUBLE NOT NULL DEFAULT 0;

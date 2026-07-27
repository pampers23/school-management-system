/*
  Warnings:

  - You are about to drop the column `updateAt` on the `enrollmentapplicationreview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `enrollmentapplicationreview` DROP COLUMN `updateAt`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

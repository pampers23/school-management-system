/*
  Warnings:

  - A unique constraint covering the columns `[startYear,endYear]` on the table `SchoolYear` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endYear` to the `SchoolYear` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startYear` to the `SchoolYear` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `schoolyear` ADD COLUMN `endYear` INTEGER NOT NULL,
    ADD COLUMN `startYear` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `SchoolYear_startYear_endYear_key` ON `SchoolYear`(`startYear`, `endYear`);

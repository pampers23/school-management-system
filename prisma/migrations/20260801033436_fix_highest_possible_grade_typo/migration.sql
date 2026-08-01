/*
  Warnings:

  - You are about to drop the column `highestPossibleGrade` on the `assessmentitem` table. All the data in the column will be lost.
  - Added the required column `highestPossibleScore` to the `AssessmentItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assessmentitem` DROP COLUMN `highestPossibleGrade`,
    ADD COLUMN `highestPossibleScore` DECIMAL(6, 2) NOT NULL;

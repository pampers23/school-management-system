/*
  Warnings:

  - You are about to drop the column `highesPossibleGrade` on the `assessmentitem` table. All the data in the column will be lost.
  - Added the required column `highestPossibleGrade` to the `AssessmentItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `assessmentitem` DROP COLUMN `highesPossibleGrade`,
    ADD COLUMN `highestPossibleGrade` DECIMAL(6, 2) NOT NULL;

/*
  Warnings:

  - Added the required column `reviewId` to the `EnrollmentApplicationReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `EnrollmentApplicationReview` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `enrollmentapplicationreview` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `remarks` VARCHAR(191) NULL,
    ADD COLUMN `reviewId` INTEGER NOT NULL,
    ADD COLUMN `reviewedAt` DATETIME(3) NULL,
    ADD COLUMN `updateAt` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `EnrollmentApplicationReview` ADD CONSTRAINT `EnrollmentApplicationReview_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

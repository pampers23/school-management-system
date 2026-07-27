-- CreateTable
CREATE TABLE `EnrollmentApplicationReview` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enrollmentApplicationId` INTEGER NOT NULL,

    UNIQUE INDEX `EnrollmentApplicationReview_enrollmentApplicationId_key`(`enrollmentApplicationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EnrollmentApplicationReview` ADD CONSTRAINT `EnrollmentApplicationReview_enrollmentApplicationId_fkey` FOREIGN KEY (`enrollmentApplicationId`) REFERENCES `EnrollmentApplication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

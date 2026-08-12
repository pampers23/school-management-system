-- CreateTable
CREATE TABLE `Grade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `sectionSubjectId` INTEGER NOT NULL,
    `gradingPeriodId` INTEGER NOT NULL,
    `quarterGrade` DECIMAL(5, 2) NOT NULL,

    UNIQUE INDEX `Grade_studentId_sectionSubjectId_gradingPeriodId_key`(`studentId`, `sectionSubjectId`, `gradingPeriodId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Grade` ADD CONSTRAINT `Grade_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grade` ADD CONSTRAINT `Grade_sectionSubjectId_fkey` FOREIGN KEY (`sectionSubjectId`) REFERENCES `SectionSubject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Grade` ADD CONSTRAINT `Grade_gradingPeriodId_fkey` FOREIGN KEY (`gradingPeriodId`) REFERENCES `GradingPeriod`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

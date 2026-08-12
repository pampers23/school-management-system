-- CreateTable
CREATE TABLE `StudentQuarterGrade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `subjectId` INTEGER NOT NULL,
    `schoolYearId` INTEGER NOT NULL,
    `gradingPeriodId` INTEGER NOT NULL,
    `quarterGrade` DECIMAL(5, 2) NOT NULL,
    `importedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StudentQuarterGrade_studentId_subjectId_schoolYearId_grading_key`(`studentId`, `subjectId`, `schoolYearId`, `gradingPeriodId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentFinalGrade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `subjectId` INTEGER NOT NULL,
    `schoolYearId` INTEGER NOT NULL,
    `finalGrade` DECIMAL(5, 2) NOT NULL,
    `remarks` VARCHAR(191) NOT NULL,
    `importedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StudentFinalGrade_studentId_subjectId_schoolYearId_key`(`studentId`, `subjectId`, `schoolYearId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudentQuarterGrade` ADD CONSTRAINT `StudentQuarterGrade_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentQuarterGrade` ADD CONSTRAINT `StudentQuarterGrade_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentQuarterGrade` ADD CONSTRAINT `StudentQuarterGrade_schoolYearId_fkey` FOREIGN KEY (`schoolYearId`) REFERENCES `SchoolYear`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentQuarterGrade` ADD CONSTRAINT `StudentQuarterGrade_gradingPeriodId_fkey` FOREIGN KEY (`gradingPeriodId`) REFERENCES `GradingPeriod`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFinalGrade` ADD CONSTRAINT `StudentFinalGrade_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFinalGrade` ADD CONSTRAINT `StudentFinalGrade_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentFinalGrade` ADD CONSTRAINT `StudentFinalGrade_schoolYearId_fkey` FOREIGN KEY (`schoolYearId`) REFERENCES `SchoolYear`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

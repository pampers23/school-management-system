-- CreateTable
CREATE TABLE `GradingPeriod` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `quarter` INTEGER NOT NULL,
    `schoolYearId` INTEGER NOT NULL,
    `isCurrent` BOOLEAN NOT NULL DEFAULT false,
    `isOpen` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `GradingPeriod_schoolYearId_quarter_key`(`schoolYearId`, `quarter`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssessmentItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `assessmentType` ENUM('WRITTEN_WORK', 'PERFORMANCE_TASK', 'QUARTERLY_ASSESSMENT') NOT NULL,
    `highesPossibleGrade` DECIMAL(6, 2) NOT NULL,
    `gradingPeriodId` INTEGER NOT NULL,
    `sectionSubjectId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AssessmentItem_sectionSubjectId_gradingPeriodId_name_key`(`sectionSubjectId`, `gradingPeriodId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentAssessmentScore` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `assessmentItemId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,
    `score` DECIMAL(6, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StudentAssessmentScore_assessmentItemId_studentId_key`(`assessmentItemId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuarterlyGrade` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studentId` INTEGER NOT NULL,
    `sectionSubjectId` INTEGER NOT NULL,
    `gradingPeriodId` INTEGER NOT NULL,
    `writtenWorks` DECIMAL(5, 2) NOT NULL,
    `performanceTask` DECIMAL(5, 2) NOT NULL,
    `quarterlyAssessment` DECIMAL(5, 2) NOT NULL,
    `initialGrade` DECIMAL(5, 2) NOT NULL,
    `transmutedGrade` DECIMAL(5, 2) NOT NULL,
    `isSubmitted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `QuarterlyGrade_studentId_sectionSubjectId_gradingPeriodId_key`(`studentId`, `sectionSubjectId`, `gradingPeriodId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AssessmentWeight` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sectionSubjectId` INTEGER NOT NULL,
    `gradingPeriodId` INTEGER NOT NULL,
    `writtenWorkWeight` DECIMAL(5, 2) NOT NULL,
    `performanceTaskWeight` DECIMAL(5, 2) NOT NULL,
    `quarterlyAssessmentWeight` DECIMAL(5, 2) NOT NULL,

    UNIQUE INDEX `AssessmentWeight_sectionSubjectId_gradingPeriodId_key`(`sectionSubjectId`, `gradingPeriodId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GradingPeriod` ADD CONSTRAINT `GradingPeriod_schoolYearId_fkey` FOREIGN KEY (`schoolYearId`) REFERENCES `SchoolYear`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssessmentItem` ADD CONSTRAINT `AssessmentItem_gradingPeriodId_fkey` FOREIGN KEY (`gradingPeriodId`) REFERENCES `GradingPeriod`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssessmentItem` ADD CONSTRAINT `AssessmentItem_sectionSubjectId_fkey` FOREIGN KEY (`sectionSubjectId`) REFERENCES `SectionSubject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAssessmentScore` ADD CONSTRAINT `StudentAssessmentScore_assessmentItemId_fkey` FOREIGN KEY (`assessmentItemId`) REFERENCES `AssessmentItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAssessmentScore` ADD CONSTRAINT `StudentAssessmentScore_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuarterlyGrade` ADD CONSTRAINT `QuarterlyGrade_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuarterlyGrade` ADD CONSTRAINT `QuarterlyGrade_sectionSubjectId_fkey` FOREIGN KEY (`sectionSubjectId`) REFERENCES `SectionSubject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuarterlyGrade` ADD CONSTRAINT `QuarterlyGrade_gradingPeriodId_fkey` FOREIGN KEY (`gradingPeriodId`) REFERENCES `GradingPeriod`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssessmentWeight` ADD CONSTRAINT `AssessmentWeight_sectionSubjectId_fkey` FOREIGN KEY (`sectionSubjectId`) REFERENCES `SectionSubject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AssessmentWeight` ADD CONSTRAINT `AssessmentWeight_gradingPeriodId_fkey` FOREIGN KEY (`gradingPeriodId`) REFERENCES `GradingPeriod`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

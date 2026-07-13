-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'TEACHER', 'STUDENT') NOT NULL,
    `mustChangePassword` BOOLEAN NOT NULL DEFAULT true,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teacher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Teacher_userId_key`(`userId`),
    UNIQUE INDEX `Teacher_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `employeeId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Admin_userId_key`(`userId`),
    UNIQUE INDEX `Admin_employeeId_key`(`employeeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Student` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `studentNumber` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Student_userId_key`(`userId`),
    UNIQUE INDEX `Student_studentNumber_key`(`studentNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EnrollmentApplication` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `schoolYear` VARCHAR(191) NOT NULL,
    `gradeLevel` INTEGER NOT NULL,
    `hasLRN` BOOLEAN NOT NULL,
    `isReturning` BOOLEAN NOT NULL DEFAULT false,
    `psaNumber` VARCHAR(191) NULL,
    `lrn` INTEGER NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `middlename` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `extensionName` VARCHAR(191) NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NOT NULL,
    `placeOfBirth` VARCHAR(191) NOT NULL,
    `isIP` BOOLEAN NOT NULL DEFAULT false,
    `ipCommunity` VARCHAR(191) NULL,
    `is4ps` BOOLEAN NOT NULL DEFAULT false,
    `householdId` VARCHAR(191) NULL,
    `hasDisabitlity` BOOLEAN NOT NULL DEFAULT false,
    `lastGradeCompleted` INTEGER NULL,
    `lastSchoolYear` VARCHAR(191) NULL,
    `lastSchoolAttendance` VARCHAR(191) NULL,
    `lastSchoolId` VARCHAR(191) NULL,
    `semester` VARCHAR(191) NULL,
    `track` VARCHAR(191) NULL,
    `strand` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APRROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `approveAt` DATETIME(3) NULL,
    `rejectedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EnrollmentApplicationAddress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enrollmentApplicationId` INTEGER NOT NULL,
    `type` ENUM('CURRENT', 'PERMANENT') NOT NULL,
    `houseNo` VARCHAR(191) NULL,
    `street` VARCHAR(191) NULL,
    `sitio` VARCHAR(191) NULL,
    `barangay` VARCHAR(191) NOT NULL,
    `municipality` VARCHAR(191) NOT NULL,
    `province` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `zipCode` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EnrollmentApplicationParent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enrollmentApplicationId` INTEGER NOT NULL,
    `type` ENUM('FATHER', 'MOTHER', 'GUARDIAN') NOT NULL,
    `firtName` VARCHAR(191) NOT NULL,
    `middleName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `contactNumber` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EnrollmentApplicationDisability` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enrollmentApplicationId` INTEGER NOT NULL,
    `disabilityType` ENUM('VISUAL_IMPAIRMENT_BLIND', 'VISUAL_IMPAIRMENT_LOW_VISION', 'HEARING_IMPAIRMENT', 'LEARNING_DISABILITY', 'INTELLECTUAL_DISABILITY', 'AUTISM_SPECTRUM_DISORDER', 'EMOTIONAL_BEHAVIORAL_DISORDER', 'ORTHOPEDIC_PHYSICAL_HANDICAP', 'SPEECH_LANGUAGE_DISORDER', 'CEREBRAL_PALSY', 'SPECIAL_HEALTH_PROBLEM_CHRONIC_DISEASE', 'CANCER', 'MULTIPLE_DISORDER') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EnrollmentApplicationLearningMode` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `enrollmentApplicationId` INTEGER NOT NULL,
    `learningMode` ENUM('MODULAR_PRINT', 'MODULAR_DIGITAL', 'BLENDED', 'FACE_TO_FACE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Teacher` ADD CONSTRAINT `Teacher_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EnrollmentApplicationAddress` ADD CONSTRAINT `EnrollmentApplicationAddress_enrollmentApplicationId_fkey` FOREIGN KEY (`enrollmentApplicationId`) REFERENCES `EnrollmentApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EnrollmentApplicationParent` ADD CONSTRAINT `EnrollmentApplicationParent_enrollmentApplicationId_fkey` FOREIGN KEY (`enrollmentApplicationId`) REFERENCES `EnrollmentApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EnrollmentApplicationDisability` ADD CONSTRAINT `EnrollmentApplicationDisability_enrollmentApplicationId_fkey` FOREIGN KEY (`enrollmentApplicationId`) REFERENCES `EnrollmentApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EnrollmentApplicationLearningMode` ADD CONSTRAINT `EnrollmentApplicationLearningMode_enrollmentApplicationId_fkey` FOREIGN KEY (`enrollmentApplicationId`) REFERENCES `EnrollmentApplication`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

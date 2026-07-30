/*
  Warnings:

  - You are about to drop the `attendancesessoin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `Attendance_attendanceSessionId_fkey`;

-- DropForeignKey
ALTER TABLE `attendancesessoin` DROP FOREIGN KEY `AttendanceSessoin_createdByTeacherId_fkey`;

-- DropForeignKey
ALTER TABLE `attendancesessoin` DROP FOREIGN KEY `AttendanceSessoin_schoolYearId_fkey`;

-- DropForeignKey
ALTER TABLE `attendancesessoin` DROP FOREIGN KEY `AttendanceSessoin_sectionSubjectId_fkey`;

-- DropTable
DROP TABLE `attendancesessoin`;

-- CreateTable
CREATE TABLE `AttendanceSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sectionSubjectId` INTEGER NOT NULL,
    `schoolYearId` INTEGER NOT NULL,
    `attendanceDate` DATETIME(3) NOT NULL,
    `createdByTeacherId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AttendanceSession_sectionSubjectId_attendanceDate_key`(`sectionSubjectId`, `attendanceDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AttendanceSession` ADD CONSTRAINT `AttendanceSession_sectionSubjectId_fkey` FOREIGN KEY (`sectionSubjectId`) REFERENCES `SectionSubject`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttendanceSession` ADD CONSTRAINT `AttendanceSession_schoolYearId_fkey` FOREIGN KEY (`schoolYearId`) REFERENCES `SchoolYear`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttendanceSession` ADD CONSTRAINT `AttendanceSession_createdByTeacherId_fkey` FOREIGN KEY (`createdByTeacherId`) REFERENCES `Teacher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_attendanceSessionId_fkey` FOREIGN KEY (`attendanceSessionId`) REFERENCES `AttendanceSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `approveAt` on the `enrollmentapplication` table. All the data in the column will be lost.
  - You are about to drop the column `hasDisabitlity` on the `enrollmentapplication` table. All the data in the column will be lost.
  - You are about to drop the column `is4ps` on the `enrollmentapplication` table. All the data in the column will be lost.
  - You are about to drop the column `lastSchoolAttendance` on the `enrollmentapplication` table. All the data in the column will be lost.
  - You are about to drop the column `middlename` on the `enrollmentapplication` table. All the data in the column will be lost.
  - You are about to drop the column `firtName` on the `enrollmentapplicationparent` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `user` table. All the data in the column will be lost.
  - Made the column `semester` on table `enrollmentapplication` required. This step will fail if there are existing NULL values in that column.
  - Made the column `track` on table `enrollmentapplication` required. This step will fail if there are existing NULL values in that column.
  - Made the column `strand` on table `enrollmentapplication` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `firstName` to the `EnrollmentApplicationParent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `applicationId` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Teacher` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `Student_userId_fkey`;

-- AlterTable
ALTER TABLE `enrollmentapplication` DROP COLUMN `approveAt`,
    DROP COLUMN `hasDisabitlity`,
    DROP COLUMN `is4ps`,
    DROP COLUMN `lastSchoolAttendance`,
    DROP COLUMN `middlename`,
    ADD COLUMN `approvedAt` DATETIME(3) NULL,
    ADD COLUMN `hasDisability` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is4Ps` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `lastSchoolAttended` VARCHAR(191) NULL,
    ADD COLUMN `middleName` VARCHAR(191) NULL,
    ADD COLUMN `studentId` INTEGER NULL,
    MODIFY `lrn` VARCHAR(191) NULL,
    MODIFY `semester` ENUM('FIRST', 'SECOND') NOT NULL,
    MODIFY `track` ENUM('ACADEMIC', 'TVL', 'SPORTS', 'ARTS_AND_DESIGN') NOT NULL,
    MODIFY `strand` ENUM('STEM', 'ABM', 'HUMSS', 'GAS', 'TVL_ICT', 'TVL_HE', 'TVL_AGRI') NOT NULL;

-- AlterTable
ALTER TABLE `enrollmentapplicationparent` DROP COLUMN `firtName`,
    ADD COLUMN `firstName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `student` ADD COLUMN `applicationId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `teacher` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `updateAt`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EnrollmentApplication` ADD CONSTRAINT `EnrollmentApplication_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

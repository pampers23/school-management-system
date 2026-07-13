/*
  Warnings:

  - The values [APRROVED] on the enum `EnrollmentApplication_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `enrollmentapplication` MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

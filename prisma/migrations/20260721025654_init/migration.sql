/*
  Warnings:

  - A unique constraint covering the columns `[sectionSubjectId,schoolYearId]` on the table `TeacherAssignment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `TeacherAssignment_sectionSubjectId_schoolYearId_key` ON `TeacherAssignment`(`sectionSubjectId`, `schoolYearId`);

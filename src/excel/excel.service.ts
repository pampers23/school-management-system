import { BadRequestException, Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import 'multer';

import {
  MatchedStudentRow,
  StudentImportRow,
  UnmatchedStudentRow,
} from '../type';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExcelService {
  constructor(private prisma: PrismaService) {}

  // ============================================================
  // VALIDATE QUARTER GRADES
  // ============================================================

  async validateQuarterGrades(
    file: Express.Multer.File,
    sectionSubjectId: number,
    gradingPeriodId: number,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    // Load workbook
    const workbook = XLSX.read(file.buffer, {
      type: 'buffer',
      raw: false,
    });

    // Get subject from SectionSubject
    const sectionSubject = await this.prisma.sectionSubject.findUnique({
      where: {
        id: sectionSubjectId,
      },
      include: {
        subject: true,
      },
    });

    if (!sectionSubject) {
      throw new BadRequestException('Section subject not found.');
    }

    // Get grading period
    const gradingPeriod = await this.prisma.gradingPeriod.findUnique({
      where: {
        id: gradingPeriodId,
      },
    });

    if (!gradingPeriod) {
      throw new BadRequestException('Grading period not found.');
    }

    const subjectCode = sectionSubject.subject.code.trim().toUpperCase();

    // Example:
    // MATH + Quarter 1 = MATH_Q1
    // ENGLISH + Quarter 1 = ENGLISH_Q1
    const sheetName = `${subjectCode}_Q${gradingPeriod.quarter}`;

    // Find expected worksheet
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      return {
        valid: false,
        subject: sectionSubject.subject.name,
        subjectCode,
        gradingPeriod: gradingPeriod.name,
        quarter: gradingPeriod.quarter,
        worksheet: sheetName,
        totalStudents: 0,
        matchedStudents: 0,
        unmatchedStudents: 0,
        errors: [
          `Worksheet "${sheetName}" was not found in the uploaded Excel file.`,
        ],
      };
    }

    // Convert worksheet into rows
    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      defval: '',
      raw: false,
    });

    // Parse students
    const students = this.parseQuarterGrades(rows);

    if (students.length === 0) {
      return {
        valid: false,
        subject: sectionSubject.subject.name,
        subjectCode,
        gradingPeriod: gradingPeriod.name,
        quarter: gradingPeriod.quarter,
        worksheet: sheetName,
        totalStudents: 0,
        matchedStudents: 0,
        unmatchedStudents: 0,
        errors: ['No students were found in the worksheet.'],
      };
    }

    // Match students against the selected section
    const result = await this.matchStudents(students, sectionSubjectId);

    const errors: string[] = [];

    // Check unmatched students
    if (result.unmatched.length > 0) {
      errors.push(
        `${result.unmatched.length} student(s) could not be matched.`,
      );
    }

    // Check grades
    for (const student of students) {
      if (!Number.isFinite(student.quarterGrade)) {
        errors.push(`${student.name} has an invalid quarter grade.`);

        continue;
      }

      if (student.quarterGrade < 0 || student.quarterGrade > 100) {
        errors.push(
          `${student.name} has an invalid grade: ${student.quarterGrade}.`,
        );
      }
    }

    return {
      valid: errors.length === 0,
      subject: sectionSubject.subject.name,
      subjectCode,
      gradingPeriod: gradingPeriod.name,
      quarter: gradingPeriod.quarter,
      worksheet: sheetName,
      totalStudents: students.length,
      matchedStudents: result.matched.length,
      unmatchedStudents: result.unmatched.length,
      errors,
      unmatched: result.unmatched,
    };
  }

  // ============================================================
  // IMPORT / SAVE QUARTER GRADES
  // ============================================================

  async importQuarterGrades(
    file: Express.Multer.File,
    sectionSubjectId: number,
    gradingPeriodId: number,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded.');
    }

    // First validate/match the Excel file
    const validation = await this.validateQuarterGrades(
      file,
      sectionSubjectId,
      gradingPeriodId,
    );

    // If the worksheet itself is invalid, stop
    if (validation.totalStudents === 0) {
      throw new BadRequestException({
        message: 'Grade import failed.',
        validation,
      });
    }

    // Get the matched students again
    const workbook = XLSX.read(file.buffer, {
      type: 'buffer',
      raw: false,
    });

    const sheetName = validation.worksheet;

    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      throw new BadRequestException(`Worksheet "${sheetName}" was not found.`);
    }

    const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
      header: 1,
      defval: '',
      raw: false,
    });

    const students = this.parseQuarterGrades(rows);

    const result = await this.matchStudents(students, sectionSubjectId);

    const savedGrades: Array<{
      studentId: number;
      name: string;
      quarterGrade: number;
      gradeId: number;
    }> = [];

    const failedGrades: Array<{
      studentId: number;
      name: string;
      quarterGrade: number;
      reason: string;
    }> = [];

    for (const student of result.matched) {
      try {
        const grade = await this.prisma.grade.upsert({
          where: {
            studentId_sectionSubjectId_gradingPeriodId: {
              studentId: student.studentId,
              sectionSubjectId,
              gradingPeriodId,
            },
          },

          update: {
            quarterGrade: student.quarterGrade,
          },

          create: {
            studentId: student.studentId,
            sectionSubjectId,
            gradingPeriodId,
            quarterGrade: student.quarterGrade,
          },
        });

        savedGrades.push({
          studentId: student.studentId,
          name: student.name,
          quarterGrade: student.quarterGrade,
          gradeId: grade.id,
        });
      } catch {
        failedGrades.push({
          studentId: student.studentId,
          name: student.name,
          quarterGrade: student.quarterGrade,
          reason: 'Failed to save grade.',
        });
      }
    }

    return {
      message: 'Quarter grades imported.',
      subject: validation.subject,
      subjectCode: validation.subjectCode,
      gradingPeriod: validation.gradingPeriod,
      worksheet: validation.worksheet,

      totalStudents: students.length,

      matchedStudents: result.matched.length,
      unmatchedStudents: result.unmatched.length,

      savedGrades: savedGrades.length,
      failedGrades: failedGrades.length,

      saved: savedGrades,
      unmatched: result.unmatched,
      failed: failedGrades,
    };
  }

  // ============================================================
  // PARSE EXCEL
  // ============================================================

  private parseQuarterGrades(rows: any[][]): StudentImportRow[] {
    const students: StudentImportRow[] = [];

    /*
     * Excel row 11 = array index 10
     */
    const START_ROW = 10;

    const STUDENT_NUMBER_COL = 0;
    const NAME_COL = 1;
    const QUARTER_GRADE_COL = 35;

    let currentGender: 'MALE' | 'FEMALE' | null = null;

    for (let i = START_ROW; i < rows.length; i++) {
      const row = rows[i];

      if (!row) {
        continue;
      }

      const studentNumber = String(row[STUDENT_NUMBER_COL] ?? '').trim();

      const name = String(row[NAME_COL] ?? '').trim();

      const section = name.toUpperCase();

      // Detect MALE section
      if (section === 'MALE') {
        currentGender = 'MALE';
        continue;
      }

      // Detect FEMALE section
      if (section === 'FEMALE') {
        currentGender = 'FEMALE';
        continue;
      }

      // Ignore rows before a gender section
      if (!currentGender) {
        continue;
      }

      // Ignore empty student slots
      if (!studentNumber || !name) {
        continue;
      }

      const quarterGrade = Number(row[QUARTER_GRADE_COL] ?? 0);

      students.push({
        rows: i + 1,
        studentNumber,
        name,
        gender: currentGender,
        quarterGrade,
      });
    }

    return students;
  }

  // ============================================================
  // NORMALIZE NAME
  // ============================================================

  private normalizeName(name: string) {
    return name.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  // ============================================================
  // MATCH STUDENTS
  // ============================================================

  private async matchStudents(
    students: StudentImportRow[],
    sectionSubjectId: number,
  ) {
    const unmatched: UnmatchedStudentRow[] = [];
    const matched: MatchedStudentRow[] = [];

    /*
     * Get the SectionSubject and its section.
     *
     * Then get only students who are ENROLLED
     * in that section.
     */
    const sectionSubject = await this.prisma.sectionSubject.findUnique({
      where: {
        id: sectionSubjectId,
      },

      include: {
        section: {
          include: {
            enrollments: {
              where: {
                status: 'ENROLLED',
              },

              include: {
                student: {
                  select: {
                    id: true,
                    firstName: true,
                    middleName: true,
                    lastName: true,
                    extensionName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!sectionSubject) {
      throw new BadRequestException('Section subject not found.');
    }

    /*
     * Extract enrolled students.
     */
    const dbStudents = sectionSubject.section.enrollments.map(
      (enrollment) => enrollment.student,
    );

    console.log('========== SECTION ENROLLMENTS ==========');
    console.log('Section Subject ID:', sectionSubjectId);
    console.log('Section:', sectionSubject.section.name);
    console.log(
      'Enrolled students:',
      dbStudents.map((student) => ({
        id: student.id,
        name: [
          student.firstName,
          student.middleName,
          student.lastName,
          student.extensionName,
        ]
          .filter(Boolean)
          .join(' '),
      })),
    );
    console.log('==========================================');

    /*
     * Match each Excel student against enrolled students.
     */
    for (const student of students) {
      const excelName = this.normalizeName(student.name);

      const dbStudent = dbStudents.find((dbStudent) => {
        const dbName = [
          dbStudent.firstName,
          dbStudent.middleName,
          dbStudent.lastName,
          dbStudent.extensionName,
        ]
          .filter(Boolean)
          .join(' ');

        return this.normalizeName(dbName) === excelName;
      });

      /*
       * Student does not exist in this section.
       */
      if (!dbStudent) {
        unmatched.push({
          ...student,
          reason: 'Student is not enrolled in this section.',
        });

        continue;
      }

      /*
       * Student successfully matched.
       */
      matched.push({
        ...student,
        studentId: dbStudent.id,
      });
    }

    return {
      matched,
      unmatched,
    };
  }

  async debugEnrollment(sectionSubjectId: number) {
    // ==========================================
    // 1. GET SECTION SUBJECT
    // ==========================================

    const sectionSubject = await this.prisma.sectionSubject.findUnique({
      where: {
        id: sectionSubjectId,
      },
      select: {
        id: true,
        sectionId: true,
        subjectId: true,

        section: {
          select: {
            id: true,
            name: true,
          },
        },

        subject: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });

    if (!sectionSubject) {
      throw new BadRequestException('Section subject not found.');
    }

    // ==========================================
    // 2. GET ENROLLED STUDENTS IN THIS SECTION
    // ==========================================

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        sectionId: sectionSubject.sectionId,
        status: 'ENROLLED',
      },

      select: {
        id: true,
        studentId: true,
        sectionId: true,
        status: true,

        student: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            extensionName: true,
          },
        },
      },
    });

    // ==========================================
    // 3. GET ALL STUDENTS
    // ==========================================

    const students = await this.prisma.student.findMany({
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        extensionName: true,
      },

      orderBy: {
        id: 'asc',
      },
    });

    // ==========================================
    // 4. GET ALL ENROLLMENTS
    // ==========================================

    const allEnrollments = await this.prisma.enrollment.findMany({
      select: {
        id: true,
        studentId: true,
        sectionId: true,
        status: true,

        student: {
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            extensionName: true,
          },
        },

        section: {
          select: {
            id: true,
            name: true,
          },
        },
      },

      orderBy: {
        id: 'asc',
      },
    });

    // ==========================================
    // 5. FORMAT STUDENTS
    // ==========================================

    const formatStudentName = (student: {
      firstName: string;
      middleName: string | null;
      lastName: string;
      extensionName: string | null;
    }) => {
      return [
        student.firstName,
        student.middleName,
        student.lastName,
        student.extensionName,
      ]
        .filter(Boolean)
        .join(' ');
    };

    // ==========================================
    // 6. RETURN DEBUG INFORMATION
    // ==========================================

    return {
      sectionSubject: {
        id: sectionSubject.id,
        sectionId: sectionSubject.sectionId,
        subjectId: sectionSubject.subjectId,

        section: sectionSubject.section,

        subject: sectionSubject.subject,
      },

      enrolledStudents: enrollments.map((enrollment) => ({
        enrollmentId: enrollment.id,
        studentId: enrollment.studentId,
        sectionId: enrollment.sectionId,
        status: enrollment.status,

        name: formatStudentName(enrollment.student),
      })),

      totalEnrolledStudents: enrollments.length,

      allStudents: students.map((student) => ({
        id: student.id,
        name: formatStudentName(student),
      })),

      totalStudents: students.length,

      allEnrollments: allEnrollments.map((enrollment) => ({
        enrollmentId: enrollment.id,
        studentId: enrollment.studentId,
        sectionId: enrollment.sectionId,
        status: enrollment.status,

        studentName: formatStudentName(enrollment.student),

        sectionName: enrollment.section.name,
      })),

      totalEnrollments: allEnrollments.length,
    };
  }

  async activateEnrollment(enrollmentId: number) {
    return this.prisma.enrollment.update({
      where: {
        id: enrollmentId,
      },
      data: {
        status: 'ENROLLED',
      },
    });
  }

  async getGrades(sectionSubjectId: number, gradingPeriodId: number) {
    const sectionSubject = await this.prisma.sectionSubject.findUnique({
      where: { id: sectionSubjectId },
      include: {
        section: {
          include: {
            enrollments: {
              where: {
                status: 'ENROLLED',
              },
              include: {
                student: {
                  select: {
                    id: true,
                    firstName: true,
                    middleName: true,
                    lastName: true,
                    extensionName: true,
                  },
                },
              },
            },
          },
        },
        subject: true,
        grades: {
          where: { gradingPeriodId },
        },
      },
    });

    if (!sectionSubject) {
      throw new BadRequestException('Section Subject not found.');
    }

    const gradingPeriod = await this.prisma.gradingPeriod.findUnique({
      where: { id: gradingPeriodId },
    });

    if (!gradingPeriod) {
      throw new BadRequestException('Grading period not found.');
    }

    const grades = sectionSubject.section.enrollments.map((enrollment) => {
      const student = enrollment.student;

      const grade = sectionSubject.grades.find(
        (grade) => grade.studentId === student.id,
      );

      const name = [
        student.firstName,
        student.middleName,
        student.lastName,
        student.extensionName,
      ]
        .filter(Boolean)
        .join(' ');

      return {
        studentId: student.id,
        enrollmentId: enrollment.id,
        name,
        quarterGrade: grade?.quarterGrade ?? null,
        gradeId: grade?.id ?? null,
      };
    });

    return {
      sectionSubjectId: sectionSubject.id,
      section: {
        id: sectionSubject.section.id,
        name: sectionSubject.section.name,
      },
      subject: {
        id: sectionSubject.subject.id,
        code: sectionSubject.subject.code,
        name: sectionSubject.subject.name,
      },
      gradingPeriod: {
        id: gradingPeriod.id,
        name: gradingPeriod.name,
        quarter: gradingPeriod.quarter,
      },
      totalStudents: grades.length,
      students: grades,
    };
  }

  async getStudentQuarterlyAverage(studentId: number, gradingPeriodId: number) {
    const gradingPeriod = await this.prisma.gradingPeriod.findUnique({
      where: { id: gradingPeriodId },
    });

    if (!gradingPeriod) {
      throw new BadRequestException('Grading Period not found.');
    }

    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        firstName: true,
        middleName: true,
        lastName: true,
        extensionName: true,
      },
    });

    if (!student) {
      throw new BadRequestException('Studet not found.');
    }

    const grades = await this.prisma.grade.findMany({
      where: {
        studentId,
        gradingPeriodId,
      },
      include: {
        sectionSubject: {
          include: {
            subject: true,
          },
        },
      },
      orderBy: {
        sectionSubject: {
          subject: { name: 'asc' },
        },
      },
    });

    const subjects = grades.map((grade) => ({
      gradeId: grade.id,
      subjectId: grade.sectionSubject.subject.id,
      subject: grade.sectionSubject.subject.name,
      subjectCode: grade.sectionSubject.subject.code,
      grade: Number(grade.quarterGrade),
    }));

    const gradedSubjects = subjects.filter((subject) =>
      Number.isFinite(subject.grade),
    );

    const totalGrades = gradedSubjects.reduce(
      (total, subject) => total + subject.grade,
      0,
    );

    const overAllAverage =
      gradedSubjects.length > 0 ? totalGrades / gradedSubjects.length : null;

    return {
      student: {
        id: student.id,
        name: [
          student.firstName,
          student.middleName,
          student.lastName,
          student.extensionName,
        ]
          .filter(Boolean)
          .join(' '),
      },
      gradingPeriod: {
        id: gradingPeriod.id,
        name: gradingPeriod.name,
        quarter: gradingPeriod.quarter,
      },
      totalSubjects: subjects.length,
      gradedSubjects: gradedSubjects.length,
      ungradedSubjects: subjects.length - gradedSubjects.length,
      subjects,
      overallAverage:
        overAllAverage !== null ? Number(overAllAverage.toFixed(2)) : null,
    };
  }
}

import { Role } from '../generated/prisma/enums';

export type JwtUser = {
  id: number;
  sub: string;
  username: string;
  role: Role;
  mustChangePassword: boolean;
  isActive: boolean;
};

export type JwtPayload = {
  sub: number;
  username: string;
  role: Role;
};

export type AssessmentBreakdownItem = {
  assessment: string;
  score: number;
  highestPossibleScore: number;
};

export type StudentImportRow = {
  rows: number;
  studentNumber: string;
  name: string;
  gender: 'MALE' | 'FEMALE';
  quarterGrade: number;
};

export type UnmatchedStudentRow = StudentImportRow & {
  reason: string;
};

export type MatchedStudentRow = StudentImportRow & {
  studentId: number;
};

export type SavedGradeRow = {
  studentId: number;
  name: string;
  quarterGrade: number;
  gender: 'MALE' | 'FEMALE';
  gradeId: number;
};

export type FailedGradeRow = StudentImportRow & {
  reason: string;
};

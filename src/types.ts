import { COURSES, YEAR_LEVELS, SEMESTERS, STRAND } from "@/data";

export type Profile = {
  id: string;
  email: string;
  role: "student" | "teacher" | "admin";
  active: boolean;
  must_change_password: boolean;
  created_at: string;
}

export type StudentProfile = {
  id: number;
  profile_id: string;
  school_id: string;
  firstname: string;
  lastname: string;
  course: string;
  year_level: number;
  section: string;
};

export type TeacherProfile = {
  id: number;
  profile_id: string;
  firstname: string;
  lastname: string;
  department: string;
  specialization: string;
}

export type CreateTeacher = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  department: string;
  specialization: string;
}

export type SubjectStatus = "Active" | "Archived";

export type Subject = {
  id: string;
  subject_code: string;
  subject_name: string;
  units: number;
  description: string;
  status: SubjectStatus;
}

export type FormSub = {
  subject_code: string;
  subject_name: string;
  units: string;
  description: string;
}

export type CreateSubject = {
  subject_code: string;
  subject_name: string;
  units: string;
  description: string;
}

export type SubjectRef = {
  id: string;
  subject_code: string;
  subject_name: string;
  units: number;
}

export type Curriculum = {
  id: string;
  course: Course;
  year_level: YearLevel;
  semester: Semester;
  subject_id: string[];
}

export type FormState = {
  course: Course | "";
  year_level: YearLevel | "";
  semester: Semester | "";
  strand: Strand | "";
}

export type Strand = (typeof STRAND)[number];

export type Course = (typeof COURSES)[number];

export type YearLevel = (typeof YEAR_LEVELS)[number];

export type Semester = (typeof SEMESTERS)[number];
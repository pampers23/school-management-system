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
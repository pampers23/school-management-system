export type Profile = {
  id: string;
  role: "student" | "teacher" | "admin";
  school_id?: string | null;
  must_change_password: boolean;  
}
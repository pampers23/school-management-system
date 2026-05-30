import { supabase } from "@/lib/supabase";
import { AuthError } from "@supabase/supabase-js";
import { CreateSubjectSchema, CreateTeacherSchema } from "@/zod-schema";
import { toast } from "sonner";
import { SubjectStatus } from "@/types";


export const getProfile = async (userId: string) => {
  try {
   if (!userId) {
    throw new Error("User ID is required");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data;
  return data;
  } catch (error) {
    const err = error as AuthError;
    toast.error(err.message);
  }
};

export async function createTeacher(values: CreateTeacherSchema) {
  try {
   const { data, error } = await supabase.functions.invoke("create-teacher", {
    body: values,
  });

  if (error) {
    const errorBody = await (error).context?.json()
    throw new Error(errorBody?.error || error.message)
  }


  if (error) throw error;

  return data;
  } catch (error) {
   const err = error as AuthError;
   toast.error(err.message);
  }
}

export const createSubject = async (payload: CreateSubjectSchema) => {
  try {
    const { data, error } = await supabase
    .from("subjects")
     .insert({
        subject_code: payload.subject_code,
        subject_name: payload.subject_name,
        units: payload.units,
        description: payload.description,
      })
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
  } catch (error) {
    const err = error as AuthError;
    toast.error(err.message);
  }
}

export const getSubjectList = async () => {
  try {
    const { data, error } = await supabase
    .from("subjects")
    .select("id, subject_code, subject_name, units, description, status")
    .order("created_at", { ascending: false });

  if (error) {
      throw new Error(error.message);
  }
  // const seen = new Set();

  // const subjectsList = data
  //   ?.filter((row) => {
  //     if (seen.has(row.subject_code)) return false;
  //     seen.add(row.subject_code);
  //     return true;
  //   })

   return {
    subjectsList: (data ?? []).map((s) => ({
      ...s,
      status: s.status ? "Active" : "Archived" as SubjectStatus,
    })),
  };

  } catch (error) {
    const err = error as AuthError;
    toast.error(err.message);
  }
}

export const addCurriculum = async (curriculum: { course: string; year_level: string; semester: string, strand?: string }) => {
  try {
    const { data, error } = await supabase
      .from("curriculums")
      .insert([curriculum])
      .select()
      .single()

    if (error) {
      throw new Error(error.message);
    }

    return data; 
  } catch (error) {
    const err = error as AuthError;
    toast.error(err.message);
  }
}

export const getCurriculum = async () => {
  try {
    const { data, error } = await supabase
      .from("curriculums")
      .select("*")
      .order("created_at", { ascending: false })
      
    if (error) {
      throw new Error(error.message);
      return { curriculumList: [] };
    }

    return { curriculumList: data ?? [] };   
  } catch (error) {
    const err = error as AuthError;
    toast.error(err.message);
  }
}
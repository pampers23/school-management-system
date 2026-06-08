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
      .select(`
        *,
        curriculum_subjects (
          subject_id
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const curriculumList = (data ?? []).map((c) => ({
      ...c,
      subject_id: c.curriculum_subjects.map((cs: { subject_id: string }) => cs.subject_id),
    }));

    return { curriculumList };
  } catch (error) {
    const err = error as AuthError;
    toast.error(err.message);
  }
}

export const getSubjects = async () => {
  try {
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("subject_code", { ascending: true })

    if (error) {
      throw new Error(error.message);
    }

    return data ?? []  
  } catch (error) {
    const err = error as AuthError;
    toast.error(err.message);
    return [];
  }
}

export const assignSubjectToCurriculum = async () => {
  try {
    const { data, error } = await supabase
      .from("curriculum_subjects")
      .insert("curriculum_id, subject_id")
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    const err = error as AuthError;
    toast.error(err.message);
  }
}

export const getCurriculumSubjects = async (curriculum_id: string) => {
  try {
    const { data, error } = await supabase
      .from("curriculum_subjects")
      .select(`*,
        subjects (
          id, subject_code, subject_name, units, status
        )
      `)
      .eq("curriculum_id", curriculum_id);

    if (error) throw new Error(error.message);

    return data;
  } catch (error) {
    const err = error as AuthError;
    toast.error(err.message);
  }
}
export const removeCurriculum = async (id: string) => {
  try {
    // delete junction rows first
    const { error: subjectsError } = await supabase
      .from("curriculum_subjects")
      .delete()
      .eq("curriculum_id", id);

    if (subjectsError) throw new Error(subjectsError.message);

    // then delete the curriculum itself
    const { error } = await supabase
      .from("curriculums")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);

  } catch (error) {
    const err = error as AuthError;
    toast.error(err.message);
  }
}

export const updateCurriculumSubject = async (
  id: string,
  form: { course: string; year_level: string; semester: string; strand: string },
) => {
  try {
    const { data, error } = await supabase
      .from("curriculums")
      .update({
        course: form.course,
        year_level: form.year_level,
        semester: form.semester,
        strand: form.strand,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    const err = error as AuthError;
    toast.error(err.message);
  }
}


export const syncCurriculumSubjects = async (curriculum_id: string, subject_ids: string[]) => {
  try {
    // delete existing
    const { error: deleteError } = await supabase
      .from("curriculum_subjects")
      .delete()
      .eq("curriculum_id", curriculum_id);

    if (deleteError) throw new Error(deleteError.message);

    // insert new
    if (subject_ids.length > 0) {
      const { error: insertError } = await supabase
        .from("curriculum_subjects")
        .insert(subject_ids.map((subject_id) => ({ curriculum_id, subject_id })));

      if (insertError) throw new Error(insertError.message);
    }
  } catch (error) {
    const err = error as AuthError;
    toast.error(err.message);
  }
}

export const createSection = async (section: { name: string; course: string; year_level: string; maxStudents: number }) => {
  try {
    const { data, error } = await supabase
      .from("sections")
      .insert({
        name: section.name,
        course: section.course,
        year_level: parseInt(section.year_level),
        max_students: section.maxStudents,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    const err = error as AuthError;
    toast.error(err.message);
  }
}


export const getSection = async () => {
  try {
    const { data, error } = await supabase
      .from("sections")
      .select("*")
      .order("created_at",{ ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    const err = error as AuthError;
    toast.error(err.message);
  }
}

export const updateSection = async (section_id: string) => {
  try {
    const { data, error } = await supabase
      .from("sections")
      .update("name, course, year_level, max_students")
      .eq("id", section_id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    const err = error as AuthError;
    toast.error(err.message);
  }
}
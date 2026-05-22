import { supabase } from "@/lib/supabase"
import { AuthError } from "@supabase/supabase-js";
import { toast } from "sonner";


export const login = async ({ identifier, password } : { identifier: string, password: string }) => {
  try {
    const cleanIdentifier = identifier.trim();   

    const isEmail = cleanIdentifier.includes("@");

   // admin / teacher login
   if (isEmail) {
   const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanIdentifier,
      password,
   });

   if (error) throw error;

   // get profile using authenticated user id
   const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

   if (profileError || !profile) {
      await supabase.auth.signOut();
      throw new Error("Profile not found");
   }

   // block students from using email
   if (profile.role === "student") {
      await supabase.auth.signOut();
      throw new Error("Students must login using School ID");
   }

   return { data, role:profile.role };
   }

   //  student login using school ID
   const { data: studentProfile, error: studentError } = await supabase
      .from("student_profiles")
      .select("profile_id")
      .eq("school_id", cleanIdentifier)
      .maybeSingle();

   if (studentError) {
      throw new Error(`Database error: , ${studentError.message}`)
   }
   
   if (!studentProfile) {
      throw new Error("Invalid School ID")
   } 
   
   const { data: profile, error: profilError } = await supabase
      .from("profiles")
      .select("email, role")
      .eq("id", studentProfile.profile_id)
      .single()

   if (profilError || !profile) {
      throw new Error("Invalid student account")
   }
   if (profile.role !== "student") throw new Error("Only students can login with School ID")

   const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password,
   });

   if (authError) throw authError;

   return { data, role: profile.role };
  } catch (error) {
   const err = error as AuthError;
   toast.error(err.message);
   throw error;
  }
}

export async function userLogout() {
   try {
      const { error } = await supabase.auth.signOut();

      if (error) {
         throw new Error(error.message)
      }
   } catch (error) {
      const err = error as AuthError;
      toast.error(err.message);
   }
}


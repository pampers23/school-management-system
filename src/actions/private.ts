import { supabase } from "@/lib/supabase";
import { AuthError } from "@supabase/supabase-js";
import { toast } from "sonner";


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
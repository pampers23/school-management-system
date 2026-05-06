import { useEffect, useState, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { getProfile } from "@/actions/action";
import { Profile } from "@/types";

const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isInitializedRef = useRef(false);

  // 1. Listen to auth state
  useEffect(() => {
    const setupAuth = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Initial session:", data.session);
      setSession(data.session);
      isInitializedRef.current = true;
      setIsLoading(false);
    };

    setupAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Auth state changed:", _event, session);
        setSession(session);
        if (isInitializedRef.current) {
          setIsLoading(true);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 2. FETCH PROFILE ONLY WHEN SESSION EXISTS
  useEffect(() => {
    if (!isInitializedRef.current) {
      console.log("Skipping profile load - still initializing");
      return;
    }

    const loadProfile = async () => {
      console.log("Loading profile for session:", session?.user?.id);
      
      if (!session?.user?.id) {
        console.log("No session, clearing profile");
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching profile...");
        const data = await getProfile();
        console.log("Profile loaded:", data);
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [session]);

  return { session, profile, isLoading };
};

export default useSession;
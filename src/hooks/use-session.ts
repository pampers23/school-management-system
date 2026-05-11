import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { getProfile } from "@/actions/private";
import { Profile } from "@/types";

const useSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // SESSION LISTENER
  useEffect(() => {
    const initialize = async () => {
      const { data } = await supabase.auth.getSession();

      setSession(data.session);
      setSessionLoading(false);
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setSessionLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // PROFILE LOADER
  useEffect(() => {
  const loadProfile = async () => {
    const userId = session?.user?.id;

    // 🚨 STOP if undefined
    if (!userId) {
      return;
    }

    setProfileLoading(true);

    try {
      const data = await getProfile(userId);

      setProfile(data);
    } catch (error) {
      console.error("PROFILE ERROR:", error);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  loadProfile();
}, [session]);

  return {
    session,
    profile,
    isLoading: sessionLoading || profileLoading,
  };
};

export default useSession;
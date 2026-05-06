import SessionLoader from "@/components/session-loader";
import useSessionListener from "@/hooks/use-session-listener";
import { Profile } from "@/types";
import { Session } from "@supabase/supabase-js";
import { createContext, ReactNode, useState } from "react";

type UserSessionContextProps = {
  session: Session | null;
  isLoading: boolean;
  passwordResetState: boolean;
  profile: Profile | null;
};

export const UserSessionContext = createContext<UserSessionContextProps>({
  session: null,
  isLoading: false,
  passwordResetState: false,
  profile: null
});

function UserSessionContextProvider({ children }: { children: ReactNode }) {
  const { isLoading, session, passwordResetState } = useSessionListener();
  const [profile] = useState<Profile | null>(null); // temporary

  return (
    <UserSessionContext.Provider value={{ isLoading, session, passwordResetState, profile }}>
      {isLoading ? <SessionLoader /> : children}
    </UserSessionContext.Provider>
  );
}

export default UserSessionContextProvider;

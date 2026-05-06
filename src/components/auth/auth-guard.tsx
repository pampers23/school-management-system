import useSession from "@/hooks/use-session";
import { ReactNode } from "react";
import { Navigate } from "react-router";

type Props = {
  children: ReactNode;
  allowedRoles?: string[];
};

function AuthGuard({ children, allowedRoles }: Props) {
  const { session, profile, isLoading } = useSession();

  if (isLoading) return <div>Loading...</div>;

  if (!session) {
    return <Navigate to="/login" />;
  }

  // ensure profile exists
   if (!profile) {
    return <div>Loading profile...</div>;
  }

  // role check
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}

export default AuthGuard;
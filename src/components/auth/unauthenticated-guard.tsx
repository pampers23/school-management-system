import useSession from "@/hooks/use-session";
import { ReactNode } from "react";
import { Navigate } from "react-router";

function UnauthenticatedGuard({ children }: { children: ReactNode }) {
  const { session, profile, passwordResetState, isLoading } = useSession();

  if (isLoading) return <div>Loading...</div>;

  if (session && !passwordResetState) {
    if (profile?.role === "student") {
      return <Navigate to="/student/dashboard" />;
    }

    if (profile?.role === "teacher") {
      return <Navigate to="/teacher/dashboard" />;
    }

    if (profile?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    }
  }

  return <>{children}</>;
}

export default UnauthenticatedGuard;

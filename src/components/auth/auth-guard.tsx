import useSession from "@/hooks/use-session";
import { ReactNode } from "react";
import { Navigate } from "react-router";

type Props = {
  children: ReactNode;
  allowedRoles?: string[];
};

// Updated AuthGuard component
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

  // role check - redirect to appropriate dashboard instead of /unauthorized
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    // Redirect to the correct dashboard based on role
    switch (profile.role) {
      case 'student':
        return <Navigate to="/student/dashboard" replace />;
      case 'teacher':
        return <Navigate to="/teacher/dashboard" replace />;
      case 'admin':
        return <Navigate to="/" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}

export default AuthGuard;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useSession from "@/hooks/use-session";

const HomeRedirect = () => {
  const { session, profile, isLoading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      navigate("/login", { replace: true });
      return;
    }
    if (!profile) return;

    const roleRoutes: Record<string, string> = {
      student: "/student/dashboard",
      teacher: "/teacher/dashboard",
      admin: "/admin/dashboard",
    };

    navigate(roleRoutes[profile.role] ?? "/login", { replace: true });
  }, [session, profile, isLoading, navigate]);

  return <div>Redirecting...</div>;
};

export default HomeRedirect;
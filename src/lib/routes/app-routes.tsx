import HomeRedirect from "@/pages/home-redirect";
import Login from "@/pages/public/login";
import StudentDashboard from "@/pages/private/student-dashboard";
import TeacherDashboard from "@/pages/private/teacher-dashboard";
import AdminDashboard from "@/pages/private/admin-dashboard";
import AuthGuard from "@/components/auth/auth-guard";
import { BrowserRouter, Route, Routes } from "react-router";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROOT */}
        <Route path="/" element={<HomeRedirect />} />

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED */}
        <Route
          path="/student/dashboard"
          element={
            <AuthGuard allowedRoles={["student"]}>
              <StudentDashboard />
            </AuthGuard>
          }
        />

        <Route
          path="/teacher/dashboard"
          element={
            <AuthGuard allowedRoles={["teacher"]}>
              <TeacherDashboard />
            </AuthGuard>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <AuthGuard allowedRoles={["admin"]}>
              <AdminDashboard />
            </AuthGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
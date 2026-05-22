import HomeRedirect from "@/pages/home-redirect";
import Login from "@/pages/public/login";
import StudentDashboard from "@/pages/private/student-dashboard";
import TeacherDashboard from "@/pages/private/teacher-dashboard";
import AdminDashboard from "@/pages/private/admin-dashboard";
import AuthGuard from "@/components/auth/auth-guard";
import { BrowserRouter, Route, Routes } from "react-router";
import { AdminLayout } from "@/layouts/admin-layout";
import Students from "@/pages/admin/students";
import Teachers from "@/pages/admin/teachers";
import Subjects from "@/pages/admin/subjects";
import Schedules from "@/pages/admin/schedules";
import Announcements from "@/pages/admin/announcements";
import NotFound from "@/pages/not-found";
import Unauthorized from "@/pages/unauthorized";
import Curriculum from "@/pages/admin/curriculum";

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
          path="/"
          element={
            <AuthGuard allowedRoles={["admin"]}>
              <AdminLayout />
            </AuthGuard>
          }
        >
          <Route index element={<AdminDashboard />} />

          <Route path="students" element={<Students />} />

          <Route path="teachers" element={<Teachers />} />

          <Route path="subjects" element={<Subjects />} />

          <Route path="curriculum" element={<Curriculum />} />

          <Route path="schedules" element={<Schedules />} />
    
          <Route path="announcements" element={<Announcements />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
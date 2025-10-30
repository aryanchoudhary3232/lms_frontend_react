import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./helper/ProtectedRoute";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Student from "./components/student/Student";
import StudentHome from "./components/student/Home";
import StudentDashboard from "./components/student/StudentDashboard";
import StudentCourses from "./components/student/Courses";
import StudentCourseDetail from "./components/student/CourseDetail";
import StudentQuiz from "./components/student/Quiz";
import Teacher from "./components/teacher/Teacher";
import TeacherHome from "./components/teacher/Home";
import TeacherCourses from "./components/teacher/Courses";
import TeacherCourseDetail from "./components/teacher/CourseDetail";
import TeacherAddCourse from "./components/teacher/AddCourse";
import TeacherChapters from "./components/teacher/Chapters";
import TeacherQualificationUpload from "./components/teacher/TeacherQualificationUpload";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminCourses from "./components/admin/AdminCourses";
import AdminCourseDetail from "./components/admin/AdminCourseDetail";
import AdminTeacherDetail from "./components/admin/AdminTeacherDetail";
import AdminSidebar from "./components/admin/AdminSidebar";
import AddCourse from "./components/teacher/AddCourse";
import Quiz from "./components/student/Quiz";
import Courses from "./pages/Courses";

function App() {
  return (
    <BrowserRouter basename="/">
      <Main />
    </BrowserRouter>
  );
}

function Main() {
  const location = useLocation();
  const hideShell = location.pathname === "/login";

  return (
    <>
      {!hideShell && !(location.pathname === "/teacher/courses/add") && (
        <Navbar />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
  <Route path="/contact" element={<Contact />} />
  {/* Cart currently not implemented - render 404 for now */}
  <Route path="/cart" element={<NotFound />} />

        {/* Teacher routes  */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRole={["Teacher"]}>
              <Teacher />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<TeacherHome />}></Route>
          <Route path="courses" element={<TeacherCourses />} />
          <Route path="courses/:courseId" element={<TeacherCourseDetail />} />
          <Route path="courses/add" element={<AddCourse />} />
          <Route
            path="upload-qualification"
            element={<TeacherQualificationUpload />}
          />
          {/* removed student/teacher sidebar routes to avoid showing admin components under their sidebar */}
        </Route>

        {/* Student routes  */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole={["Student"]}>
              <Student />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<StudentDashboard />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="courses/:courseId" element={<StudentCourseDetail />} />
          <Route
            path="courses/:courseId/:chapterId/:topicId/quiz"
            element={<Quiz />}
          />
          {/* removed student sidebar to avoid mounting admin layout for students */}
        </Route>

        {/* Admin routes  - protect admin pages */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole={["Admin"]}>
              <AdminSidebar />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="teachers/:teacherId" element={<AdminTeacherDetail />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="courses/:courseId" element={<AdminCourseDetail />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideShell &&
        !(location.pathname === "/teacher/courses/add") &&
        !(location.pathname === "/admin/dashboard") &&
        !(location.pathname === "/admin/users") &&
        !(location.pathname === "/admin/courses") &&
        !(location.pathname === "/student/dashboard") &&
        !(location.pathname === "/teacher/dashboard") && <Footer />}
    </>
  );
}

export default App;

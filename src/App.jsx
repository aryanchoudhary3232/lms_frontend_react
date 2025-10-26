import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./helper/ProtectedRoute";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Student from "./components/student/Student";
import StudentHome from "./components/student/Home";
import StudentCourses from "./components/student/Courses";
import StudentCourseDetail from "./components/student/CourseDetail";
import StudentQuiz from "./components/student/Quiz";
import Teacher from "./components/teacher/Teacher";
import TeacherHome from "./components/teacher/Home";
import TeacherCourses from "./components/teacher/Courses";
import TeacherCourseDetail from "./components/teacher/CourseDetail";
import TeacherAddCourse from "./components/teacher/AddCourse";
import TeacherChapters from "./components/teacher/Chapters";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminCourses from "./components/admin/AdminCourses";
import AdminSidebar from "./components/admin/AdminSidebar";
import AddCourse from "./components/teacher/AddCourse";
import Quiz from "./components/student/Quiz";

function App() {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
}

function Main() {
  const location = useLocation();
  // Do not hide the shell on /login — keep Navbar visible on the login page
  const hideShell = false;

  return (
    <>
      {!hideShell && !(location.pathname === "/teacher/courses/add") && (
        <Navbar />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/404" element={<NotFound />} />

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
          <Route path="home" element={<StudentHome />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="courses/:courseId" element={<StudentCourseDetail />} />
          <Route
            path="courses/:courseId/:chapterId/:topicId/quiz"
            element={<Quiz />}
          />
        </Route>

        {/* Admin routes  */}
        <Route path="/admin" element={<AdminSidebar />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="courses" element={<AdminCourses />} />
        </Route>
        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!hideShell &&
        !(location.pathname === "/teacher/courses/add") &&
        !(location.pathname === "/admin/dashboard") &&
        !(location.pathname === "/admin/users") &&
        !(location.pathname === "/admin/courses") && <Footer />}
    </>
  );
}

export default App;

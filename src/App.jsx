import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
//common routes
import Login from "./pages/Login";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import ProtectedRoute from "./helper/ProtectedRoute";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
//student routes
import Student from "./components/student/Student";
import StudentHome from "./components/student/Home";
import StudentCourseDetail from "./components/student/CourseDetail";
import StudentQuiz from "./components/student/Quiz";
import Quiz from "./components/student/Quiz";
import Streak from "./components/student/Streak";
import StudentCourses from "./components/student/StudentCourses";
//teacher routes
import Teacher from "./components/teacher/Teacher";
import TeacherHome from "./components/teacher/Home";
import TeacherCourses from "./components/teacher/Courses";
import TeacherCourseDetail from "./components/teacher/CourseDetail";
import TeacherAddCourse from "./components/teacher/AddCourse";
import TeacherChapters from "./components/teacher/Chapters";
import TeacherQualificationUpload from "./components/teacher/TeacherQualificationUpload";
import AddCourse from "./components/teacher/AddCourse";
//admin routes
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminCourses from "./components/admin/AdminCourses";
import AdminCourseDetail from "./components/admin/AdminCourseDetail";
import AdminTeacherDetail from "./components/admin/AdminTeacherDetail";
import AdminSidebar from "./components/admin/AdminSidebar";

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
    <div style={{ width: "100%" }}>
      {!hideShell && !(location.pathname === "/teacher/courses/add") && (
        <Navbar />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />

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
          <Route path="sidebar" element={<AdminSidebar />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="courses" element={<AdminCourses />} />
          </Route>
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
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:courseId" element={<StudentCourseDetail />} />
          <Route
            path="courses/:courseId/:chapterId/:topicId/quiz"
            element={<Quiz />}
          />
          <Route path="sidebar" element={<AdminSidebar />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="streak" element={<Streak />} />
          </Route>
        </Route>

        {/* Admin routes  */}
        <Route path="/admin" element={<AdminSidebar />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="teachers/:teacherId" element={<AdminTeacherDetail />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="courses/:courseId" element={<AdminCourseDetail />} />
        </Route>
      </Routes>

      {!hideShell &&
        !(location.pathname === "/teacher/courses/add") &&
        !(location.pathname === "/admin/dashboard") &&
        !(location.pathname === "/admin/users") &&
        !(location.pathname === "/admin/courses") &&
        !(location.pathname === "/student/dashboard") &&
        !(location.pathname === "/student/sidebar/courses") &&
        !(location.pathname === "/teacher/dashboard") && <Footer />}
    </div>
  );
}

export default App;

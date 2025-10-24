import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
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
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/student/*"
          element={
            <ProtectedRoute allowedRoles={["Student"]}>
              <Routes>
                <Route path="home" element={<StudentHome />} />
                <Route path="courses" element={<StudentCourses />} />
                <Route
                  path="courses/:courseId"
                  element={<StudentCourseDetail />}
                />
                <Route
                  path="courses/:courseId/:chapterIdx/:topicIdx/quiz"
                  element={<StudentQuiz />}
                />
                <Route path="*" element={<StudentHome />} />
              </Routes>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute allowedRoles={["Teacher"]}>
              <Routes>
                <Route path="home" element={<TeacherHome />} />
                <Route path="courses" element={<TeacherCourses />} />
                <Route path="courses/:id" element={<TeacherCourseDetail />} />
                <Route path="add-course" element={<TeacherAddCourse />} />
                <Route
                  path="chapters/:courseId"
                  element={<TeacherChapters />}
                />
                <Route path="*" element={<TeacherHome />} />
              </Routes>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <div className="admin-layout">
                <AdminSidebar />
                <div className="admin-content">
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="courses" element={<AdminCourses />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        {/* Catch all route */}
        <Route path="*" element={<Home />} />
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
      </Routes>
    </Router>
  );
}

export default App;

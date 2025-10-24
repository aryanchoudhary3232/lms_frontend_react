import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./helper/ProtectedRoute";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// Teacher routes
import Teacher from "./components/teacher/Teacher";
import TeacherHome from "./components/teacher/Home";
import TeacherCourses from "./components/teacher/Courses";
import TeacherCourseDetail from "./components/teacher/CourseDetail";

// Student routes
import Student from "./components/student/Student";
import StudentHome from "./components/student/Home";
import StudentCourses from "./components/student/Courses";
import StudentCourseDetail from "./components/student/CourseDetail";
import AddCourse from "./components/teacher/AddCourse";
import Quiz from "./components/student/Quiz";

const App = () => {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
};

function Main() {
  const location = useLocation();
  const hideShell = location.pathname === "/login";

  return (
    <>
      {!hideShell && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute>
              <Login />
            </ProtectedRoute>
          }
        />
        {/* Teacher routes  */}
        <Route path="/teacher" element={<Teacher />}>
          <Route path="home" element={<TeacherHome />}></Route>
          <Route path="courses" element={<TeacherCourses />} />
          <Route path="courses/:courseId" element={<TeacherCourseDetail />} />
          <Route path="courses/add" element={<AddCourse />} />
        </Route>

        {/* Student routes  */}
        <Route path="/student" element={<Student />}>
          <Route path="home" element={<StudentHome />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="courses/:courseId" element={<StudentCourseDetail />} />
          <Route
            path="courses/:courseId/:chapterIdx/:topicIdx/quiz"
            element={<Quiz />}
          />
        </Route>
      </Routes>
      {!hideShell && <Footer />}
    </>
  );
}

export default App;

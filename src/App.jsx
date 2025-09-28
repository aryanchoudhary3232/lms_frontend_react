import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
// Teacher routes
import TeacherHome from "./components/teacher/Home";
import TeacherCourses from "./components/teacher/Courses";
import TeacherCourseDetail from "./components/teacher/CourseDetail";

import StudentHome from "./components/student/Home";
import StudentCourses from "./components/student/Courses";
import StudentCourseDetail from "./components/student/CourseDetail";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* Teacher routes  */}
        <Route path="/home/teacher" element={<TeacherHome />}></Route>
        <Route path="/teacher/courses" element={<TeacherCourses />} />
        <Route
          path="teacher/courses/:courseId"
          element={<TeacherCourseDetail />}
        />

        {/* Student routes  */}
        <Route path="/home/student" element={<StudentHome />} />
        <Route path="/student/courses" element={<StudentCourses />} />
        <Route
          path="/student/courses/:courseId"
          element={<StudentCourseDetail />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

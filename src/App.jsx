import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";

// Critical path - eagerly loaded
import Login from "./pages/Login";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ProtectedRoute from "./helper/ProtectedRoute";

// Loading fallback component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2rem',
    color: '#666'
  }}>
    Loading...
  </div>
);

// Lazy load common routes (not critical path)
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Cart = lazy(() => import("./components/student/Cart"));

// Lazy load student routes
const Student = lazy(() => import("./components/student/Student"));
const StudentHome = lazy(() => import("./components/student/Home"));
const StudentDashboard = lazy(() => import("./components/student/StudentDashboard"));
const StudentCourseDetail = lazy(() => import("./components/student/CourseDetail"));
const StudentQuiz = lazy(() => import("./components/student/Quiz"));
const StudentAssignments = lazy(() => import("./components/student/assignments/StudentAssignments"));
const SubmitAssignment = lazy(() => import("./components/student/assignments/SubmitAssignment"));
const ViewSubmission = lazy(() => import("./components/student/assignments/ViewSubmission"));
const Streak = lazy(() => import("./components/student/Streak"));
const StudentCourses = lazy(() => import("./components/student/StudentCourses"));
const StudentFlashcards = lazy(() => import("./components/student/StudentFlashcards"));
const StudentStudyDeck = lazy(() => import("./components/student/StudentStudyDeck"));

// Lazy load teacher routes
const Teacher = lazy(() => import("./components/teacher/Teacher"));
const TeacherHome = lazy(() => import("./components/teacher/Home"));
const TeacherCourseDetail = lazy(() => import("./components/teacher/CourseDetail"));
const TeacherAddCourse = lazy(() => import("./components/teacher/AddCourse"));
const TeacherEditCourse = lazy(() => import("./components/teacher/EditCourse"));
const TeacherChapters = lazy(() => import("./components/teacher/Chapters"));
const TeacherQualificationUpload = lazy(() => import("./components/teacher/TeacherQualificationUpload"));
const TeacherAssignments = lazy(() => import("./components/teacher/assignments/TeacherAssignments"));
const CreateAssignment = lazy(() => import("./components/teacher/assignments/CreateAssignment"));
const AssignmentSubmissions = lazy(() => import("./components/teacher/assignments/AssignmentSubmissions"));
const TeacherAllCourses = lazy(() => import("./components/teacher/TeacherAllCourses"));
const TeacherFlashcards = lazy(() => import("./components/teacher/flashcards/TeacherFlashcards"));
const TeacherCourses = lazy(() => import("./components/teacher/TeacherCourses"));
const TeacherDashboard = lazy(() => import("./components/teacher/TeacherDashboard"));
const StudentsEnrolled = lazy(() => import("./components/teacher/StudentsEnrolled"));

// Lazy load admin routes
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./components/admin/AdminUsers"));
const AdminCourses = lazy(() => import("./components/admin/AdminCourses"));
const AdminCourseDetail = lazy(() => import("./components/admin/AdminCourseDetail"));
const AdminTeacherDetail = lazy(() => import("./components/admin/AdminTeacherDetail"));
const AdminSidebar = lazy(() => import("./components/admin/AdminSidebar"));

// Lazy load common components
const Profile = lazy(() => import("./components/common/Profile"));
const Settings = lazy(() => import("./components/common/Settings"));

function App() {
  return <Main />;
}

function Main() {
  const location = useLocation();
  const hideShell = location.pathname === "/login";

  // Use explicit ternary for conditional rendering (rendering-conditional-render)
  const showNavbar = !hideShell &&
    !(location.pathname === "/teacher/courses/add") &&
    !location.pathname.startsWith("/admin") &&
    !location.pathname.startsWith("/teacher/sidebar") &&
    !location.pathname.startsWith("/student/sidebar");

  return (
    <>
      {showNavbar ? <Navbar /> : null}

      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Teacher routes */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRole={["Teacher"]}>
                <Teacher />
              </ProtectedRoute>
            }
          >
            <Route path="home" element={<TeacherHome />} />
            <Route path="courses" element={<TeacherAllCourses />} />
            <Route path="courses/:courseId" element={<TeacherCourseDetail />} />
            <Route
              path="courses/:courseId/edit"
              element={<TeacherEditCourse />}
            />
            <Route
              path="courses/:courseId/:chapterId/:topicId/quiz"
              element={<StudentQuiz />}
            />
            <Route path="courses/add" element={<TeacherAddCourse />} />
            <Route path="flashcards" element={<TeacherFlashcards />} />
            <Route path="chapters" element={<TeacherChapters />} />
            <Route
              path="upload-qualification"
              element={<TeacherQualificationUpload />}
            />
            <Route path="assignments" element={<TeacherAssignments />} />
            <Route path="assignments/create" element={<CreateAssignment />} />
            <Route
              path="assignments/:assignmentId/submissions"
              element={<AssignmentSubmissions />}
            />
          </Route>

          {/* Teacher Sidebar Dashboard (same layout as admin) */}
          <Route path="/teacher/sidebar" element={<AdminSidebar />}>
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="users" element={<StudentsEnrolled />} />
            <Route path="courses" element={<TeacherCourses />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
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
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:courseId" element={<StudentCourseDetail />} />
            <Route
              path="courses/:courseId/:chapterId/:topicId/quiz"
              element={<StudentQuiz />}
            />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route
              path="assignments/:assignmentId/submit"
              element={<SubmitAssignment />}
            />
            <Route
              path="assignments/:assignmentId/view"
              element={<ViewSubmission />}
            />
          </Route>

          {/* Student Sidebar Dashboard (same layout as admin) */}
          <Route path="/student/sidebar" element={<AdminSidebar />}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route
              path="courses/:courseId/flashcards"
              element={<StudentFlashcards />}
            />
            <Route path="deck/:deckId" element={<StudentStudyDeck />} />
            <Route path="streak" element={<Streak />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
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
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {showNavbar ? <Footer /> : null}
    </>
  );
}

export default App;

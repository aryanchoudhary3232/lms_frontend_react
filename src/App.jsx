import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Student from "./components/student/Student";
import Teacher from "./components/teacher/Teacher";
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
        <Route path="/student/*" element={<Student />} />
        <Route path="/teacher/*" element={<Teacher />} />
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
      </Routes>
    </Router>
  );
}

export default App;

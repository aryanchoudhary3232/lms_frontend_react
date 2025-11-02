import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../../css/admin/Admin.css";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="" style={{ display: "flex", width: "100%" }}>
      <div style={{ width: "15%" }} className="admin-sidebar">
        <nav className="admin-nav">
          <ul>
            <li className="admin-nav-item">
              <NavLink
                to={
                  role === "Admin"
                    ? "/admin/dashboard"
                    : role === "Teacher"
                    ? "/teacher/sidebar/dashboard"
                    : "/student/sidebar/dashboard"
                }
                className={({ isActive }) =>
                  `admin-nav-link ${isActive ? "active" : ""}`
                }
              >
                <span className="admin-nav-icon">📊</span>
                Dashboard
              </NavLink>
            </li>
            <li className="admin-nav-item">
              <NavLink
                to={
                  role === "Admin"
                    ? "/admin/users"
                    : role === "Teacher"
                    ? "/teacher/sidebar/users"
                    : "/student/sidebar/users"
                }
                className={({ isActive }) =>
                  `admin-nav-link ${isActive ? "active" : ""}`
                }
              >
                <span className="admin-nav-icon">👥</span>
                Users
              </NavLink>
            </li>
            <li className="admin-nav-item">
              <NavLink
                to={
                  role === "Admin"
                    ? "/admin/courses"
                    : role === "Teacher"
                    ? "/teacher/sidebar/courses"
                    : "/student/sidebar/courses"
                }
                className={({ isActive }) =>
                  `admin-nav-link ${isActive ? "active" : ""}`
                }
              >
                <span className="admin-nav-icon">📚</span>
                {role === "Student" && "My"} Courses
              </NavLink>
            </li>
            {role === "Student" && (
              <li className="admin-nav-item">
                <NavLink
                  to={"/student/sidebar/streak"}
                  className={({ isActive }) =>
                    `admin-nav-link ${isActive ? "active" : ""}`
                  }
                >
                  <span className="admin-nav-icon">🏅</span>
                  Streak
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        <div className="admin-logout-container">
          <button onClick={handleLogout} className="admin-logout-btn">
            <span>🚪</span>
            Logout
          </button>
        </div>
      </div>
      <div style={{ width: "85%" }}>
        {" "}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminSidebar;

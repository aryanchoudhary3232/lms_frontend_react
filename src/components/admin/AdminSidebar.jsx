import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar"; // <--- Adjust this path if needed
import "../../css/admin/Admin.css";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* 1. Add The Navbar Here */}
      <Navbar />

      {/* 2. The Dashboard Layout sits below it */}
      <div className="admin-layout-container">
        
        {/* Mobile Hamburger Button for Sidebar */}
        <button className="mobile-menu-btn" onClick={toggleSidebar}>
          {isOpen ? "✕" : "☰"}
        </button>

        {/* Overlay for mobile */}
        {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

        {/* Sidebar */}
        <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>
          <div className="admin-sidebar-header">
            <h3>SeekhoBharat</h3>
          </div>

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
                  onClick={closeSidebar}
                >
                  <span className="admin-nav-icon">📊</span>
                  Dashboard
                </NavLink>
              </li>
              {(role === "Admin" || role === "Teacher") && (
                <li className="admin-nav-item">
                  <NavLink
                    to={
                      role === "Admin"
                        ? "/admin/users"
                        : "/teacher/sidebar/users"
                    }
                    className={({ isActive }) =>
                      `admin-nav-link ${isActive ? "active" : ""}`
                    }
                    onClick={closeSidebar}
                  >
                    <span className="admin-nav-icon">👥</span>
                    Users
                  </NavLink>
                </li>
              )}
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
                  onClick={closeSidebar}
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
                    onClick={closeSidebar}
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

        {/* Main Content Area */}
        <div className="admin-main-content">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
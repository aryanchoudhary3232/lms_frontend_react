import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../css/admin/Admin.css";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h3>Admin Panel</h3>
      </div>

      <nav className="admin-nav">
        <ul>
          <li className="admin-nav-item">
            <NavLink
              to="/admin/dashboard"
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
              to="/admin/users"
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
              to="/admin/courses"
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
            >
              <span className="admin-nav-icon">📚</span>
              Courses
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="admin-logout-container">
        <button onClick={handleLogout} className="admin-logout-btn">
          <span>🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;

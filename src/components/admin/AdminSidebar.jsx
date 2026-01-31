import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import "../../css/admin/Admin.css";

// Lucide Icons for premium look
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Flame,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Navigation items configuration
  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path:
        role === "Admin"
          ? "/admin/dashboard"
          : role === "Teacher"
          ? "/teacher/sidebar/dashboard"
          : "/student/sidebar/dashboard",
      roles: ["Admin", "Teacher", "Student"],
    },
    {
      label: "Users",
      icon: Users,
      path: role === "Admin" ? "/admin/users" : "/teacher/sidebar/users",
      roles: ["Admin", "Teacher"],
    },
    {
      label: role === "Student" ? "My Courses" : "Courses",
      icon: BookOpen,
      path:
        role === "Admin"
          ? "/admin/courses"
          : role === "Teacher"
          ? "/teacher/sidebar/courses"
          : "/student/sidebar/courses",
      roles: ["Admin", "Teacher", "Student"],
    },
    {
      label: "Streak",
      icon: Flame,
      path: "/student/sidebar/streak",
      roles: ["Student"],
    },
    {
      label: "Profile",
      icon: User,
      path:
        role === "Admin"
          ? "/admin/profile"
          : role === "Teacher"
          ? "/teacher/sidebar/profile"
          : "/student/sidebar/profile",
      roles: ["Admin", "Teacher", "Student"],
    },
    {
      label: "Settings",
      icon: Settings,
      path:
        role === "Admin"
          ? "/admin/settings"
          : role === "Teacher"
          ? "/teacher/sidebar/settings"
          : "/student/sidebar/settings",
      roles: ["Admin", "Teacher", "Student"],
    },
  ];

  return (
    <>
      <Navbar />

      <div className="admin-layout-container">
        {/* Mobile Hamburger Button */}
        <button className="mobile-menu-btn" onClick={toggleSidebar}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Overlay for mobile */}
        {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

        {/* Premium Sidebar */}
        <div
          className={`admin-sidebar premium ${isOpen ? "open" : ""} ${
            isCollapsed ? "collapsed" : ""
          }`}
        >
          {/* Header with Brand */}
          <div className="admin-sidebar-header">
            <div className="sidebar-brand">
              <div className="brand-logo">
                <BookOpen size={28} strokeWidth={2} />
              </div>
              {!isCollapsed && (
                <div className="brand-text">
                  <h3>SeekhoBharat</h3>
                  <span className="role-badge">{role}</span>
                </div>
              )}
            </div>

            {/* Collapse Toggle (Desktop only) */}
            <button
              className="collapse-toggle"
              onClick={toggleCollapse}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="admin-nav">
            <ul>
              {navItems
                .filter((item) => item.roles.includes(role))
                .map((item) => (
                  <li key={item.path} className="admin-nav-item">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `admin-nav-link ${isActive ? "active" : ""}`
                      }
                      onClick={closeSidebar}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <span className="admin-nav-icon">
                        <item.icon size={20} strokeWidth={1.75} />
                      </span>
                      {!isCollapsed && (
                        <span className="nav-label">{item.label}</span>
                      )}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </nav>

          {/* Logout Section */}
          <div className="admin-logout-container">
            <button
              onClick={handleLogout}
              className="admin-logout-btn"
              title={isCollapsed ? "Logout" : undefined}
            >
              <LogOut size={20} strokeWidth={1.75} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className={`admin-main-content ${isCollapsed ? "expanded" : ""}`}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
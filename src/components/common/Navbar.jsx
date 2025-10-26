import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../common/layout.css";

const Navbar = () => {
  const navigate = useNavigate();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;

  // Determine safe targets for links when user is not authenticated
  const brandTarget = role
    ? role === "Admin"
      ? "/admin/dashboard"
      : role === "Teacher"
      ? "/teacher/home"
      : "/student/home"
    : "/";

  const coursesTarget = role
    ? role === "Admin"
      ? "/admin/courses"
      : role === "Student"
      ? "/student/courses"
      : "/teacher/courses"
    : "/";

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <header className="site-navbar">
      <div className="container nav-inner">
        <Link to={brandTarget} className="brand">
          SeekhoBharat
        </Link>

        <nav className="nav-links">
          <Link to={coursesTarget} className="nav-item">
            Courses
          </Link>
          <Link to="/cart" className="nav-item">
            Cart
          </Link>

          {token ? (
            // when logged in show Sign Out and role if available
            <>
              {role && (
                <span className="nav-item" style={{ opacity: 0.9 }}>
                  {role}
                </span>
              )}
              <button className="nav-item action" onClick={handleSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-item action">
              Login / Register
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

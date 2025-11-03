import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../common/layout.css";

const Navbar = () => {
  const navigate = useNavigate();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const role =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <header className="site-navbar" style={{width: '100%'}}>
      <div className="container nav-inner">
        <Link
          to={
            role === "Admin"
              ? "/admin/dashboard"
              : role === "Teacher"
              ? "/teacher/home"
              : "/student/home"
          }
          className="brand"
        >
          SeekhoBharat
        </Link>

        <nav className="nav-links">
          {role === "Teacher" && (
            <Link to={"/teacher/sidebar/dashboard"} className="nav-item">
              Dashboard
            </Link>
          )}
          {role === "Student" && (
            <Link to={"/student/sidebar/dashboard"} className="nav-item">
              Dashboard
            </Link>
          )}

          <Link to={
              !token
                ? "/courses"
                : role === "Admin"
                ? "/admin/courses"
                : role === "Student"
                ? "/courses"
                : "/teacher/courses"
            }
            className="nav-item"
          >
            Courses
          </Link>
          {token && role === "Student" && (
            <Link to="/cart" className="nav-item">
              Cart
            </Link>
          )}

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

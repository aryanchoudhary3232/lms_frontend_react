import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // If no token, allow access to public routes (e.g. /login)
  if (!token) return children;

  // If token exists, redirect based on role
  if (role === "Teacher") return <Navigate to="/teacher/home" />;
  if (role === "Student") return <Navigate to="/student/home" />;

  // Fallback: token present but role missing/unknown -> clear auth and redirect to home
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  return <Navigate to="/" />;
};

export default ProtectedRoute;

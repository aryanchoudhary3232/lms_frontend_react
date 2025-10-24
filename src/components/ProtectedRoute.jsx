import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // Safely decode JWT payload
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userRole = payload.role;

    // If no specific roles are required, just check if user is authenticated
    if (allowedRoles.length === 0) {
      return children;
    }

    // Check if user role is in allowed roles
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;

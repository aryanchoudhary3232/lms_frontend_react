import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return children;
  } else if (role === "Teacher") {
    return <Navigate to={"/teacher/home"} />;
  } else if (role === "Student") {
    return <Navigate to={"/student/home"} />;
  }
};

export default ProtectedRoute;

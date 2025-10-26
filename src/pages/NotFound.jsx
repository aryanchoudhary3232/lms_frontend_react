import React from "react";
import { Link } from "react-router-dom";
import "../components/common/layout.css";

const NotFound = () => {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 72, color: 'rgb(35,55,173)', margin: 0 }}>404</h1>
        <h2 style={{ marginTop: 8, color: '#334155' }}>Page not found</h2>
        <p style={{ color: '#475569' }}>The page you are looking for does not exist or is under construction.</p>
        <Link to="/" className="btn primary" style={{ marginTop: 12 }}>Go to Home</Link>
      </div>
    </div>
  );
};

export default NotFound;

import React, { useEffect, useState } from "react";
import "../css/Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <h1 className="logo">MyLMS</h1>
        <ul className="nav-links">
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <h2>Welcome to MyLMS</h2>
        <p>Learn anytime, anywhere with our courses.</p>
        <Link to="/login" className="btn">
          Explore Courses
        </Link>
      </header>

      {/* Courses Preview */}
      <section className="courses-preview">
        <h2>Popular Courses</h2>
        <div className="courses-grid">
          <div className="course-card">
            <img src="https://via.placeholder.com/250" alt="Course 1" />
            <h3>Web Development</h3>
            <p>Learn HTML, CSS, JavaScript and React.</p>
          </div>
          <div className="course-card">
            <img src="https://via.placeholder.com/250" alt="Course 2" />
            <h3>Data Science</h3>
            <p>Learn Python, Pandas, ML and AI basics.</p>
          </div>
          <div className="course-card">
            <img src="https://via.placeholder.com/250" alt="Course 3" />
            <h3>Mobile Development</h3>
            <p>Learn Flutter & React Native for apps.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

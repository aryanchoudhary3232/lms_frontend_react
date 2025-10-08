import React from "react";
import "../../css/teacher/Home.css";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Navbar */}
      <div className="navbar">
        <h1 className="logo">MyLMS</h1>
        <div
          style={{
            display: "flex",
            gap: "23px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link
            style={{ textDecoration: "none", color: "white" }}
            to="/teacher/home"
          >
            Home
          </Link>
          <Link
            style={{ textDecoration: "none", color: "white" }}
            to="/teacher/courses"
          >
            Courses
          </Link>
          <button
            style={{
              border: "none",
              background: "none",
              color: "white",
              fontSize: "17px",
            }}
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              navigate("/login");
            }}
          >
            Log out
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <header className="hero">
        <h2>Welcome to MyLMS</h2>
        <p>Learn anytime, anywhere with our courses.</p>
        <Link to="/teacher/courses" className="btn">
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

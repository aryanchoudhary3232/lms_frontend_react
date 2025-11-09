import React from "react"
import "../../css/Home.css";
import Header from "../common/Header";


import {
  FaStar,
  FaUserFriends,
  FaBook,
  FaRegPlayCircle,
  FaRegListAlt,
} from "react-icons/fa";

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero">
        <h2>Welcome to SeekhoBharat</h2>
        <p>Learn anytime, anywhere with our courses.</p>
        <Link to="/student/courses" className="btn">
          Explore Courses
        </Link>
      </header>

      {/* Courses Preview */}
      <section className="courses-preview">
        <h2>Popular Courses</h2>
        <div className="courses-grid">
          <div className="course-card">
            <img
              src="https://via.placeholder.com/250.png?text=Course+1"
              alt="Course 1"
              onError={(e) => (e.target.src = "https://via.placeholder.com/250.png?text=No+Image")}
            />
            <h3>Web Development</h3>
            <p>Learn HTML, CSS, JavaScript and React.</p>
          </div>
          <div className="course-card">
            <img
              src="https://via.placeholder.com/250.png?text=Course+2"
              alt="Course 2"
              onError={(e) => (e.target.src = "https://via.placeholder.com/250.png?text=No+Image")}
            />
            <h3>Data Science</h3>
            <p>Learn Python, Pandas, ML and AI basics.</p>
          </div>
          <div className="course-card">
            <img
              src="https://via.placeholder.com/250.png?text=Course+3"
              alt="Course 3"
              onError={(e) => (e.target.src = "https://via.placeholder.com/250.png?text=No+Image")}
            />
            <h3>Mobile Development</h3>
            <p>Learn Flutter & React Native for apps.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

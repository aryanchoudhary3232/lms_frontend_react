import React from "react";
import "../css/Home.css";
import Header from "../components/common/Header";

function Home() {
  return (
    <div className="home-container">
      <Header />

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

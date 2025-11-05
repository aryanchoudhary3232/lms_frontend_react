import React from "react";
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
      {/* <Header /> */}

      <main>

        {/* --- Hero Section --- */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Welcome to SeekhoBharat</h1>
            <p>
              Learn anytime, anywhere — courses for every learner.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary">Get Started</button>
              <button className="btn btn-secondary">Browse all Course</button>
            </div>
          </div>
          <div className="hero-image">
            {/* Using a placeholder. Replace with your actual image. */}
            <img
              src="https://via.placeholder.com/550x450.png?text=Hero+Image"
              alt="Students"
            />
          </div>
        </section>

        {/* --- Stats Bar --- */}
        <section className="stats-bar">
          <div className="stat-item">
            <FaUserFriends className="stat-icon" />
            <div className="stat-text">
              <strong>5,000+</strong>
              <span>Students</span>
            </div>
          </div>
          <div className="stat-item">
            <FaUserFriends className="stat-icon" />
            <strong>30+</strong>
            <span>Instructors</span>
          </div>
          <div className="stat-item">
            <FaRegPlayCircle className="stat-icon" />
            <strong>200+</strong>
            <span>Learning Videos</span>
          </div>
          <div className="stat-item">
            <FaRegListAlt className="stat-icon" />
            <strong>100+</strong>
            <span>Study Materials</span>
          </div>
        </section>

        {/* --- Courses Section --- */}
        <section className="courses-section">
          <div className="courses-header">
            <h2>Courses</h2>
            <a href="/courses" className="view-all-link">
              View All (12) &rarr;
            </a>
          </div>
          <div className="courses-grid">
            {/* Example Course Card 1 */}
            <div className="course-card">
              <img
                src="https://via.placeholder.com/350x200.png?text=Course+Image"
                alt="Moral Foundation of Law"
                className="course-image"
              />
              <div className="course-content">
                <div className="course-rating">
                  <FaStar style={{ color: "#f39c12" }} /> 5.0 (144)
                </div>
                <h3 className="course-title">Moral Foundation of Law</h3>
                <p className="course-instructor">Member: Guy Hawkins</p>
                <div className="course-meta">
                  <span>
                    <FaBook /> 21 Lessons
                  </span>
                  <span>
                    <FaUserFriends /> 800+ Students
                  </span>
                </div>
                <div className="course-footer">
                  <span className="course-price">$350</span>
                  {/* Add to cart/wishlist icon would go here */}
                </div>
              </div>
            </div>

            {/* Example Course Card 2 */}
            <div className="course-card">
              <img
                src="https://via.placeholder.com/350x200.png?text=Course+Image"
                alt="International Human Rights"
                className="course-image"
              />
              <div className="course-content">
                <div className="course-rating">
                  <FaStar style={{ color: "#f39c12" }} /> 5.0 (122)
                </div>
                <h3 className="course-title">International Human Rights</h3>
                <p className="course-instructor">Member: Esther Howard</p>
                <div className="course-meta">
                  <span>
                    <FaBook /> 18 Lessons
                  </span>
                  <span>
                    <FaUserFriends /> 450+ Students
                  </span>
                </div>
                <div className="course-footer">
                  <span className="course-price">$499</span>
                </div>
              </div>
            </div>

            {/* Example Course Card 3 */}
            <div className="course-card">
              <img
                src="https://via.placeholder.com/350x200.png?text=Course+Image"
                alt="International Law"
                className="course-image"
              />
              <div className="course-content">
                <div className="course-rating">
                  <FaStar style={{ color: "#f39c12" }} /> 5.0 (144)
                </div>
                <h3 className="course-title">International Law</h3>
                <p className="course-instructor">Member: Brooklyn Simmons</p>
                <div className="course-meta">
                  <span>
                    <FaBook /> 24 Lessons
                  </span>
                  <span>
                    <FaUserFriends /> 1.2k+ Students
                  </span>
                </div>
                <div className="course-footer">
                  <span className="course-price">$699</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* You can continue adding other sections here... */}
        {/* <section className="why-different-section">
          <h2>Why We're Different From Others</h2>
          ...
        </section>
        
        <section className="testimonials-section">
          <h2>What Our Students Say</h2>
          ...
        </section>
        */}

      </main>
    </div>
  );
}

export default Home;

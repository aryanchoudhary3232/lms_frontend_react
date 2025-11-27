import React, { useState, useEffect } from "react"
import "../../css/Home.css";
import Header from "../common/Header";

import { Link } from "react-router-dom";

import {
  FaStar,
  FaUserFriends,
  FaBook,
  FaRegPlayCircle,
  FaRegListAlt,
} from "react-icons/fa";

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/student/courses`);
      const data = await response.json();
      
      if (data.success) {
        // Get first 3 courses for home page preview
        setCourses(data.data.slice(0, 3));
      } else {
        console.error('Failed to fetch courses:', data.message);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

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
        {loading ? (
          <div className="loading-message">Loading courses...</div>
        ) : (
          <div className="courses-grid">
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <div key={course._id || index} className="course-card">
                  <img
                    src={course.image || `https://via.placeholder.com/250.png?text=${encodeURIComponent(course.title)}`}
                    alt={course.title}
                    onError={(e) => (e.target.src = `https://via.placeholder.com/250.png?text=${encodeURIComponent(course.title)}`)}
                  />
                  <h3>{course.title}</h3>
                  <p>{course.description || 'Explore this amazing course and enhance your skills.'}</p>
                  <div className="course-meta">
                    {course.teacher && (
                      <small>By: {course.teacher.name}</small>
                    )}
                    {course.price && (
                      <div className="price">₹{course.price}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // Fallback static courses if no courses in database
              <>
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
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;

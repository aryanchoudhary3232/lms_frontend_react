import React, { useEffect, useState } from "react";
import "../css/teacher/CourseDetail.css"; // We will create this new CSS file
import { Link, useParams } from "react-router-dom";

// Simple star rating component
const StarRating = ({ rating }) => {
  // rating may be a number or an object { average, count }
  const avg = rating && typeof rating === 'object' ? rating.average : rating;
  const count = rating && typeof rating === 'object' ? rating.count : 0;
  const num = Number(avg) || 0;
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => (
        <span key={index}>{index < Math.round(num) ? "⭐" : "☆"}</span>
      ))}
      <span className="rating-text" style={{ marginLeft: 8 }}>{num}</span>
      {count ? <small style={{ marginLeft: 6, color: '#eee' }}>({count})</small> : null}
    </div>
  );
};

const CourseDetail = () => {
  const [course, setCourse] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [isEnroll, setIsEnroll] = useState(false);
  const { courseId } = useParams();

  // --- Your existing data fetching (works perfectly here) ---
  useEffect(() => {
    async function getStudentProfile() {
      const token = localStorage.getItem("token");
      if (!token) return; // Added a check
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/student/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setStudentId(data.data._id);
      } catch (error) {
        console.log("err occurred...", error);
      }
    }
    getStudentProfile();
  }, []);

  useEffect(() => {
    async function getCourseById() {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
        console.log("Fetching course from:", `${backendUrl}/student/courses/${courseId}`);
        const response = await fetch(
          `${backendUrl}/student/courses/${courseId}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) {
          const text = await response.text();
          console.error("Server response:", text);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const courseResponse = await response.json();
        
        if (courseResponse.success) {
          setCourse(courseResponse.data);
        } else {
          console.error("Error fetching course:", courseResponse.message);
        }
      } catch (error) {
        console.error("Error details:", error);
      }
    }

    if (courseId) {
      getCourseById();
    }
  }, [courseId]);

  useEffect(() => {
    if (course?.students && studentId) {
      setIsEnroll(course.students.includes(studentId));
    }
  }, [course, studentId]);

  // --- End of data fetching ---

  if (!course) {
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <p>Loading course details...</p>
          <p style={{ fontSize: '0.8em', color: '#666' }}>Course ID: {courseId}</p>
        </div>
      </div>
    );
  }

  // A function to handle enrollment - you'll need to build this
  const handleEnroll = () => {
    // This would typically redirect to a payment page or API call
    alert("Redirecting to enrollment/payment...");
    // Example: window.location.href = `/checkout/${courseId}`;
  };

  return (
    <div className="course-detail-container">
      <div className="main-content">
        <div className="breadcrumbs">
          <Link to="/">Dashboard</Link> &gt;{" "}
          <Link to="/courses">Courses</Link> &gt;{" "}
          <span>{course.title}</span>
        </div>

        <div
          className="course-header"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${
              course.image || "/default-banner.jpg"
            })`,
          }}
        >
          <h1>{course.title}</h1>
          <p>{course.shortDescription || "Learn how to master this subject."}</p>
          <StarRating rating={course.rating || 4.5} />{" "}
          {/* Assuming you have a rating */}
        </div>

        <div className="course-body">
          <div className="course-tabs">
            <span className="tab active">Description</span>
            <span className="tab">Course content</span>
            <span className="tab">Teacher</span>
            <span className="tab">Reviews</span>
          </div>

          <div className="tab-content">
            <h3>Course Description</h3>
            <p>{course.description}</p>

            <h3>Teacher Information</h3>
            {course.teacher && (
              <div className="teacher-info">
                <p><strong>Name:</strong> {course.teacher.name}</p>
                <p><strong>Contact:</strong> {course.teacher.email}</p>
              </div>
            )}

            <h3>What you will learn</h3>
            <ul className="learning-list">
              {/* You should add this 'whatYouWillLearn' array to your course data in the backend */}
              <li>Be able to use the budgeting process to increase teamwork.</li>
              <li>Be able to speak confidently on the key concepts.</li>
              <li>
                Understand the "who, what, when, where, and why" of a budget.
              </li>
              <li>Plan, and control where you work or in your own business.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="sidebar">
        <div className="video-preview">
          <img
            src={course.thumbnail || "/default-thumbnail.jpg"}
            alt={course.title}
          />
          <div className="overlay">
            <span>▶</span>
            <p>Overview</p>
          </div>
        </div>

        <div className="course-meta">
          <h2 className="price">
            {course.price ? `$${course.price}` : "Free"}
          </h2>
          <div className="course-format">
            <h4>Course Format</h4>
            <ul>
              <li>
                ✓ {course.chapters?.length || "5"}{" "}
                Video lessons
              </li>
              <li>✓ {course.quizzes?.length || "3"} Quizzes</li>
              <li>✓ 4 Downloadable resources</li>
              <li>✓ Course Duration: 02:36:14</li>
            </ul>
          </div>

          {isEnroll ? (
            <Link
              to={`/student/course-player/${courseId}`} // Link to the NEW player page
              className="start-course-btn"
            >
              Start Course →
            </Link>
          ) : (
            <button onClick={handleEnroll} className="enroll-now-btn">
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
import React, { useEffect, useState } from "react";
import "../../css/teacher/Courses.css";
import { Link } from "react-router-dom";

const getToken = () => {
  // Try to get token from localStorage (assume login stores it as 'token')
  return localStorage.getItem("token") || "";
};

const TeacherAllCourses = () => {
  const [courses, setCourses] = useState([]);

  const getAllCourses = async () => {
    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const response = await fetch(`${backendUrl}/courses`);
      const coursesResponse = await response.json();

      if (coursesResponse.success) {
        setCourses(coursesResponse.data);
      } else {
        console.error("Error fetching courses:", coursesResponse.message);
      }
    } catch (error) {
      console.log("error occurred", error);
    }
  };

  useEffect(() => {
    getAllCourses();
  }, []);

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1>Courses</h1>
      </div>

      <div className="course-list">
        {courses.length === 0 ? (
          <p className="no-courses">No courses available. Add one!</p>
        ) : (
          courses.map((course) => (
            <div
              key={course._id}
              className="course-card"
              style={{ width: "22rem" }}
            >
              <Link
                style={{ textDecoration: "none" }}
                to={`/student/courses/${course._id}`}
              >
                <img src={course.image} alt={course.title} />
                <h2>{course.title}</h2>
                <p
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 2,
                    overflow: "hidden",
                  }}
                >
                  {course.description}
                </p>
                <p>
                  <b>Category:</b> {course.category}
                </p>
                <p>
                  <b>Level:</b> {course.level}
                </p>
                <p>
                  <b>Duration:</b> {course.duration} hours
                </p>
                <p>
                  <b>Price:</b> ₹{course.price}
                </p>
              </Link>
              <Link to={`/teacher/courses/${course._id}`}>
                <button
                  className="add-btn"
                  style={{ marginTop: "10px", width: "100%" }}
                >
                  View Course
                </button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TeacherAllCourses;

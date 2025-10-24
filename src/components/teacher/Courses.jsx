import React, { useEffect, useState } from "react";
import "../../css/teacher/Courses.css";
import { Link } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState([]);

  const getAllCourses = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/teacher/courses/get_courses`
      );
      const coursesResponse = await response.json();
      setCourses(coursesResponse.data);
    } catch (error) {
      console.log("error occured", error);
    }
  };
  console.log(courses);

  useEffect(() => {
    getAllCourses();
  }, []);

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1>Courses</h1>
        <Link
          style={{
            textDecoration: "none",
          }}
          to={`/teacher/add-course`}
        >
          <button className="add-btn">+ Add New Course</button>
        </Link>
      </div>

      <div className="course-list">
        {courses.length === 0 ? (
          <p className="no-courses">No courses available. Add one!</p>
        ) : (
          courses.map((course) => (
            <Link
              style={{
                textDecoration: "none",
              }}
              to={`/teacher/courses/${course._id}`}
              key={course._id}
              className="course-card"
            >
              <img src={course.image} />
              <h2>{course.title}</h2>
              <p>{course.description}</p>
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
          ))
        )}
      </div>
    </div>
  );
};

export default Courses;

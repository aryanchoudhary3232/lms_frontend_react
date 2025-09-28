import React, { useEffect, useState } from "react";
import "../../css/teacher/CourseDetail.css";
import { useParams } from "react-router-dom";

const CourseDetail = () => {
  const [course, setCourse] = useState([]);

  const { courseId } = useParams();

  useEffect(() => {
    async function getCourseById() {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/teacher/courses/get_course_by_id/${courseId}`
        );
        const courseResponse = await response.json();

        if (response.ok) {
          setCourse(courseResponse.data);
        }
      } catch (error) {}
    }

    getCourseById();
  }, []);

  return (
    <div className="course-detail-container">
      {/* Left section - Image & Video */}
      <div className="course-media">
        <video src={course.video} className="course-video" controls />
      </div>

      {/* Right section - Details */}
      <div className="course-info">
        <h2 className="course-title">{course.title}</h2>
        <p className="course-description">{course.description}</p>

        <div className="course-meta">
          <p>
            <strong>Category:</strong> {course.category}
          </p>
          <p>
            <strong>Level:</strong> {course.level}
          </p>
          <p>
            <strong>Duration:</strong> {course.duration} mins
          </p>
          <p>
            <strong>Price:</strong> ${course.price}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

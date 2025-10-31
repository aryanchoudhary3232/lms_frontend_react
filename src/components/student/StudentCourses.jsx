import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/admin/Admin.css";

const StudentCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

        const response = await fetch(`${backendUrl}/student/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          setCourses(data.data);
        } else {
          console.error("Error fetching courses:", data.message);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  console.log("courses", courses);

  const viewCourseDetails = (courseId) => {
    navigate(`/admin/courses/${courseId}`);
  };

  if (loading) {
    return <div className="admin-loading">Loading courses...</div>;
  }

  return (
    <div
      style={{ width: "100%", padding: "39px", boxSizing: "border-box" }}
      className="admin-courses"
    >
      <h2>All Courses ({courses.length})</h2>

      {courses.length > 0 ? (
        <div className="admin-courses-grid">
          {courses.map((course) => (
            <div
              key={course._id}
              className="admin-course-card"
              style={{ position: "relative", height: "27rem" }}
            >
              {/* Course Image */}
              <div className="admin-course-image-container">
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="admin-course-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=Course+Image";
                    }}
                  />
                ) : (
                  <div className="admin-course-placeholder">
                    <span className="placeholder-icon">📚</span>
                    <span className="placeholder-text">No Image</span>
                  </div>
                )}
                <div className="admin-course-overlay">
                  <button
                    onClick={() => viewCourseDetails(course._id)}
                    className="admin-view-btn"
                    title="View Course Details"
                  >
                    👁️
                  </button>
                </div>
              </div>

              {/* Course Info */}
              <div className="admin-course-info">
                <h3 className="admin-course-title">{course.title}</h3>
                <p
                  className="admin-course-description"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                  }}
                >
                  {course.description || "No description available"}
                </p>

                <div
                  className="admin-course-details"
                  // style={{ position: "absolute", left: "0px", bottom: "0px" }}
                >
                  <div className="admin-course-detail-item">
                    <span className="detail-label">Teacher:</span>
                    <span className="detail-value">
                      {course.teacher
                        ? course.teacher.name
                        : "No teacher assigned"}
                    </span>
                  </div>

                  {course.category && (
                    <div className="admin-course-detail-item">
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{course.category}</span>
                    </div>
                  )}

                  {course.level && (
                    <div className="admin-course-detail-item">
                      <span className="detail-label">Level:</span>
                      <span className="detail-value">{course.level}</span>
                    </div>
                  )}

                  <div className="admin-course-detail-item">
                    <span className="detail-label">Chapters:</span>
                    <span className="detail-value">
                      {course.chapters ? course.chapters.length : 0} chapters
                    </span>
                  </div>
                </div>

                <div
                  className="admin-course-actions"
                  style={{
                    position: "absolute",
                    bottom: "0px",
                    left: "0px",
                    width: "100%",
                    margin: "0 0 0 0",
                  }}
                >
                  <button
                    onClick={() => viewCourseDetails(course._id)}
                    className="admin-view-details-btn"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <span className="empty-icon">📚</span>
          <h3>No courses found</h3>
          <p>There are currently no courses in the system.</p>
        </div>
      )}
    </div>
  );
};

export default StudentCourses;

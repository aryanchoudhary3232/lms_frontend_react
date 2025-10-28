import React, { useEffect, useState } from "react";
import "../css/admin/Admin.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

        const response = await fetch(`${backendUrl}/courses`, {
          headers: {
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

  if (loading) {
    return <div className="admin-loading">Loading courses...</div>;
  }

  return (
    <div
      style={{ width: "84vw", marginLeft: "12px" }}
      className="admin-courses"
    >
      <h2>All Courses ({courses.length})</h2>

      {courses.length > 0 ? (
        <div className="admin-grid">
          {courses.map((course) => (
            <div key={course._id} className="admin-card course">
              <div className="admin-course-info">
                <h4>{course.title}</h4>
                <p>
                  <strong>Teacher:</strong>{" "}
                  {course.teacher ? course.teacher.name : "No teacher assigned"}
                </p>
                <p>
                  <strong>Description:</strong>{" "}
                  {course.description || "No description"}
                </p>
                {course.category && (
                  <p>
                    <strong>Category:</strong> {course.category}
                  </p>
                )}
                {course.level && (
                  <p>
                    <strong>Level:</strong> {course.level}
                  </p>
                )}
                {course.students && (
                  <p>
                    <strong>Students Enrolled:</strong> {course.students.length}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty">No courses found</div>
      )}
    </div>
  );
};

export default Courses;

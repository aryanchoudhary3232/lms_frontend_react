import React, { useEffect, useState } from "react";
import "../../css/admin/Admin.css";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

        const response = await fetch(`${backendUrl}/admin/courses`, {
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

  const deleteCourse = async (courseId) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const token = localStorage.getItem("token");
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

      const response = await fetch(`${backendUrl}/admin/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setCourses(courses.filter((course) => course._id !== courseId));
        alert("Course deleted successfully");
      } else {
        alert("Error deleting course: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Error deleting course");
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading courses...</div>;
  }

  return (
    <div className="admin-courses">
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
              <div className="admin-course-actions">
                <button
                  onClick={() => deleteCourse(course._id)}
                  className="admin-delete-btn"
                >
                  Delete
                </button>
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

export default AdminCourses;

import React, { useEffect, useState } from "react";
import "../../css/teacher/Courses.css";
import { Link } from "react-router-dom";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    duration: "",
    price: "",
    image: null,
    video: null,
  });

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData(() => {
      return {
        ...formData,
        [name]: files ? files[0] : value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("level", formData.level);
    data.append("duration", formData.duration);
    data.append("price", formData.price);
    data.append("image", formData.image);
    data.append("video", formData.video);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/teacher/courses/create_course`,
        {
          method: "POST",
          body: data,
        }
      );
      const coursesResponse = await response.json();

      if (response.ok) {
        setShowForm(false);
      }
    } catch (err) {
      console.log("error occured", err);
    }
  };

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
            <Link
              to={`/student/courses/${course._id}`}
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

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h2>Add New Course</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Course Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Course Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
              />
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advance">Advance</option>
              </select>
              <input
                type="number"
                name="duration"
                placeholder="Duration (in hours)"
                value={formData.duration}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price (₹)"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <label>Preview Image:</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
              <label>Course Video:</label>
              <input
                type="file"
                name="video"
                accept="video/*"
                onChange={handleChange}
              />

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;

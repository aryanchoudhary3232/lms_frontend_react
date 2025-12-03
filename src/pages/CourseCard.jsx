import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaUserFriends, FaShoppingCart, FaPlay } from "react-icons/fa";
// Make sure you have "../css/teacher/Courses.css" linked in the parent

const CourseCard = ({ course, onAddToCart, isOwned = false, isAuthenticated = false }) => {
  // --- Placeholders ---
  // course.rating may be an object { average, count } returned by backend
  const ratingAverage = course && typeof course.rating === "object" ? course.rating.average : course.rating || 4.5;
  const ratingCount = course && typeof course.rating === "object" ? course.rating.count : (course.ratingCount || 0);
  const studentCount = course.studentCount || "435,671";
  // local inline SVG data URI placeholder to avoid external DNS issues
  const svgPlaceholder =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='250' height='150'><rect fill='%23e6e6e6' width='100%' height='100%'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='18'>No Image</text></svg>";
  // --------------------
  return (
    <div className="course-card">
      <Link to={`/courses/${course._id}`}>
        <img
          src={course.image || svgPlaceholder}
          alt={course.title}
          className="course-card-image"
          onError={(e) => {
            // fallback to inline SVG placeholder if external image fails
            if (e && e.target) e.target.src = svgPlaceholder;
          }}
        />
      </Link>
      <div className="course-card-content">
        <div className="card-top">
          <span className="course-category">
            {course.category || "Development"}
          </span>
          <div className="course-rating">
            <FaStar style={{ color: "#f39c12" }} />
            <span style={{ marginLeft: 6 }}>{ratingAverage}</span>
            {ratingCount ? (
              <small style={{ marginLeft: 6, color: '#666' }}>({ratingCount})</small>
            ) : null}
          </div>
        </div>

        <Link
          style={{ textDecoration: "none" }}
          to={`/courses/${course._id}`}
        >
          <h3 className="course-title">{course.title}</h3>
        </Link>

        <div className="card-bottom">
          <div className="student-count">
            <FaUserFriends />
            <span>{studentCount} students</span>
          </div>
          {/* Price is here from your original data */}
          <span className="course-price">₹{course.price}</span>
        </div>

        {/* --- Add to Cart Button --- */}
        {/* We add it after the bottom border, as in your original code */}
        <div className="course-card-action">
          {isOwned && isAuthenticated ? (
            <Link
              className="btn-add-to-cart owned-course-btn"
              to={`/student/courses/${course._id}`}
            >
              <FaPlay /> Go to Course
            </Link>
          ) : (
            <div className="course-card-actions-row">
              <button className="btn-add-to-cart" onClick={onAddToCart}>
                <FaShoppingCart /> Add to Cart
              </button>

              <Link className="btn-details" to={`/courses/${course._id}`}>
                Details
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
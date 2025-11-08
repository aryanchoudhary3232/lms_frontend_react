import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaUserFriends, FaShoppingCart } from "react-icons/fa";
// Make sure you have "../css/teacher/Courses.css" linked in the parent

const CourseCard = ({ course, onAddToCart }) => {
  // --- Placeholders ---
  const rating = course.rating || 4.5;
  const studentCount = course.studentCount || "435,671";
  // --------------------

  return (
    <div className="course-card">
      <Link to={`/courses/${course._id}`}>
        <img
          src={course.image}
          alt={course.title}
          className="course-card-image"
        />
      </Link>
      <div className="course-card-content">
        <div className="card-top">
          <span className="course-category">
            {course.category || "Development"}
          </span>
          <div className="course-rating">
            <FaStar style={{ color: "#f39c12" }} />
            <span>{rating}</span>
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
          <button className="btn-add-to-cart" onClick={onAddToCart}>
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
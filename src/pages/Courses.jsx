import React, { useEffect, useState, useCallback } from "react";
import "../css/teacher/Courses.css";
import CourseCard from "./CourseCard";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses } from "../features/courses/coursesSlice";

const getToken = () => localStorage.getItem("token") || "";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchParams, setSearchParams] = useState({
    query: "",
    category: "",
    level: "",
  });
  const [loading, setLoading] = useState(false);
  const [ownedCourseIds, setOwnedCourseIds] = useState(() => {
    try {
      const persisted = JSON.parse(
        localStorage.getItem("enrolledCourseIds") || "[]"
      );
      return new Set(persisted);
    } catch (error) {
      console.error(
        "Failed to parse enrolledCourseIds from localStorage:",
        error
      );
      return new Set();
    }
  });
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const coursesList = useSelector((state) => state.courses.list);
  

  const handleSearch = async (e) => {
    const { name, value } = e.target;
    const nextParams = {
      ...searchParams,
      [name]: value,
    };
    setSearchParams(nextParams);

    try {
      setLoading(true);
      const queryString = new URLSearchParams(nextParams).toString();

      const response = await fetch(
        `${backendUrl}/courses/search?${queryString}`
      );
      const data = await response.json();

      if (data.success) {
        setCourses(data.data);
      } else {
        console.error("Error searching courses:", data.message);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

 

  const loadOwnedCourses = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;
      const response = await fetch(`${backendUrl}/student/enrolled-courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success && Array.isArray(data.data)) {
        const ownedIds = data.data.map((course) => course._id);
        setOwnedCourseIds(new Set(ownedIds));
        localStorage.setItem("enrolledCourseIds", JSON.stringify(ownedIds));
      }
    } catch (error) {
      console.error("Error fetching enrolled courses", error);
    }
  }, [backendUrl]);



  useEffect(() => {
    loadOwnedCourses();
  }, [loadOwnedCourses]);

  const handleAddToCart = async (courseId) => {
    const token = getToken();
    if (!token) {
      alert("Please sign in to add courses to your cart");
      return;
    }

    if (ownedCourseIds.has(courseId)) {
      alert("You already own this course");
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/cart/add/${courseId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Added to cart!");
      } else {
        alert(data.message || "Failed to add to cart");
      }
    } catch (err) {
      alert("Error adding to cart", err);
    }
  };

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1>Courses</h1>
      </div>

      <div className="courses-filter-bar">
        <div className="filter-search">
          <FaSearch className="filter-icon" />
          <input
            type="text"
            name="query"
            placeholder="Search in your courses..."
            value={searchParams.query}
            onChange={handleSearch}
          />
        </div>
        <div className="filter-dropdown">
          <select
            name="category"
            value={searchParams.category}
            onChange={handleSearch}
          >
            <option value="">All Category</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Business">Business</option>
            <option value="Marketing">Marketing</option>
          </select>
          <FaChevronDown className="filter-icon-small" />
        </div>
        <div className="filter-dropdown">
          <select
            name="level"
            value={searchParams.level}
            onChange={handleSearch}
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advance">Advance</option>
          </select>
          <FaChevronDown className="filter-icon-small" />
        </div>
      </div>

      <div className="courses-grid">
        {loading ? (
          <p className="no-courses">Searching...</p>
        ) : coursesList.length === 0 ? (
          <p className="no-courses">No courses available.</p>
        ) : (
          coursesList.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              isOwned={ownedCourseIds.has(course._id)}
              onAddToCart={() => handleAddToCart(course._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Courses;

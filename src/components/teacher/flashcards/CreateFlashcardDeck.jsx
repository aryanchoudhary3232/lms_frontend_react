import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Modal.css';

const CreateFlashcardDeck = ({ onClose, onCreate, initialCourseId }) => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    visibility: 'private'
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const fetchTeacherCourses = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/teacher/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data.data);
    } catch (err) {
      alert('Failed to load courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTeacherCourses();
  }, [fetchTeacherCourses]);

  // Preselect course when initialCourseId provided and courses loaded
  useEffect(() => {
    if (initialCourseId && courses.length > 0) {
      setFormData(prev => ({ ...prev, courseId: initialCourseId }));
    }
  }, [initialCourseId, courses]);

  // replaced with useCallback version above

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.courseId || !formData.title) {
      alert('Please fill in all required fields');
      return;
    }
    onCreate(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Flashcard Deck</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Select Course *</label>
            {loading ? (
              <p>Loading courses...</p>
            ) : (
              <select
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose a course --</option>
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.title || course.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label>Deck Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Chapter 3 - Key Concepts"
              maxLength="100"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What topics does this deck cover?"
              rows="4"
              maxLength="500"
            />
          </div>

          <div className="form-group">
            <label>Visibility</label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
            >
              <option value="private">Private (Only you)</option>
              <option value="course">Course (All enrolled students)</option>
              <option value="public">Public (Everyone)</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Create Deck
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFlashcardDeck;
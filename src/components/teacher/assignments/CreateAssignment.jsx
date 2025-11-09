import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../css/teacher/Assignments.css";

const CreateAssignment = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    course: "",
    chapter: "",
    maxMarks: 100,
    dueDate: "",
    allowLateSubmission: false,
    submissionType: "both",
  });
  const [files, setFiles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/teacher/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.course) {
      alert("Please select a course");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Append files
      files.forEach((file) => {
        formDataToSend.append("attachments", file);
      });

      const response = await fetch(
        `${BACKEND_URL}/assignments/teacher/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Assignment created successfully!");
        navigate("/teacher/assignments");
      } else {
        alert(data.message || "Failed to create assignment");
      }
    } catch (error) {
      console.error("Error creating assignment:", error);
      alert("Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-assignment-container">
      <div className="form-header">
        <button
          onClick={() => navigate("/teacher/assignments")}
          className="btn-back"
        >
          ← Back
        </button>
        <h2>📝 Create New Assignment</h2>
      </div>

      <form onSubmit={handleSubmit} className="assignment-form">
        <div className="form-section">
          <h3>Basic Information</h3>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Week 1 - JavaScript Basics"
            />
          </div>

          <div className="form-group">
            <label>Course *</label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Chapter (Optional)</label>
            <input
              type="text"
              name="chapter"
              value={formData.chapter}
              onChange={handleChange}
              placeholder="e.g., Chapter 3: Functions"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Brief description of the assignment"
            />
          </div>

          <div className="form-group">
            <label>Detailed Instructions</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows="5"
              placeholder="Provide detailed instructions for students..."
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Assignment Settings</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Maximum Marks *</label>
              <input
                type="number"
                name="maxMarks"
                value={formData.maxMarks}
                onChange={handleChange}
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Due Date *</label>
              <input
                type="datetime-local"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Submission Type</label>
            <select
              name="submissionType"
              value={formData.submissionType}
              onChange={handleChange}
            >
              <option value="both">File & Text</option>
              <option value="file">File Only</option>
              <option value="text">Text Only</option>
            </select>
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="allowLateSubmission"
                checked={formData.allowLateSubmission}
                onChange={handleChange}
              />
              <span>Allow late submissions</span>
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Attachments (Optional)</h3>
          <div className="form-group">
            <label>Upload Reference Files</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.jpg,.png"
            />
            {files.length > 0 && (
              <div className="selected-files">
                <p>Selected files:</p>
                <ul>
                  {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/teacher/assignments")}
            className="btn-cancel"
          >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? "Creating..." : "Create Assignment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssignment;

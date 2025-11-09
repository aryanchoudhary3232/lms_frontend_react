import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../../css/student/Assignments.css";

const SubmitAssignment = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    fetchAssignmentDetails();
  }, [assignmentId]);

  const fetchAssignmentDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // We need to get assignment from the list
      const response = await fetch(`${BACKEND_URL}/assignments/student/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (data.success) {
        const found = data.data.find((a) => a._id === assignmentId);
        if (found) {
          setAssignment(found);

          // Check if already submitted
          if (found.submissionStatus.submitted) {
            alert("You have already submitted this assignment!");
            navigate("/student/assignments");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!textContent && files.length === 0) {
      alert("Please provide either text content or upload files");
      return;
    }

    setSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("textContent", textContent);

      files.forEach((file) => {
        formData.append("attachments", file);
      });

      const response = await fetch(
        `${BACKEND_URL}/assignments/student/submit/${assignmentId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Assignment submitted successfully!");
        navigate("/student/assignments");
      } else {
        alert(data.message || "Failed to submit assignment");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="submit-loading">Loading assignment...</div>;
  }

  if (!assignment) {
    return <div className="submit-error">Assignment not found</div>;
  }

  const now = new Date();
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = now > dueDate;

  return (
    <div className="submit-assignment-container">
      <div className="submit-header">
        <button
          onClick={() => navigate("/student/assignments")}
          className="btn-back"
        >
          ← Back
        </button>
        <h2>📤 Submit Assignment</h2>
      </div>

      <div className="assignment-details">
        <h3>{assignment.title}</h3>
        <p className="course-name">📚 {assignment.course?.title}</p>

        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Max Marks:</span>
            <span className="value">{assignment.maxMarks}</span>
          </div>
          <div className="detail-item">
            <span className="label">Due Date:</span>
            <span className={`value ${isOverdue ? "overdue" : ""}`}>
              {dueDate.toLocaleString()}
            </span>
          </div>
        </div>

        {isOverdue && (
          <div className="overdue-warning">
            ⚠️ This assignment is overdue.{" "}
            {assignment.allowLateSubmission
              ? "Late submissions are allowed."
              : "Late submissions are not allowed!"}
          </div>
        )}

        <div className="assignment-description">
          <h4>Description:</h4>
          <p>{assignment.description}</p>
        </div>

        {assignment.instructions && (
          <div className="assignment-instructions">
            <h4>Instructions:</h4>
            <p>{assignment.instructions}</p>
          </div>
        )}

        {assignment.attachments && assignment.attachments.length > 0 && (
          <div className="reference-files">
            <h4>Reference Files:</h4>
            <ul>
              {assignment.attachments.map((file, index) => (
                <li key={index}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    📎 {file.filename}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="submission-form">
        <h3>Your Submission</h3>

        {(assignment.submissionType === "text" ||
          assignment.submissionType === "both") && (
          <div className="form-group">
            <label>Text Content</label>
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              rows="8"
              placeholder="Type your answer here..."
              required={assignment.submissionType === "text"}
            />
          </div>
        )}

        {(assignment.submissionType === "file" ||
          assignment.submissionType === "both") && (
          <div className="form-group">
            <label>Upload Files</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.jpg,.png,.zip"
              required={assignment.submissionType === "file"}
            />
            {files.length > 0 && (
              <div className="selected-files">
                <p>Selected files:</p>
                <ul>
                  {files.map((file, index) => (
                    <li key={index}>
                      📎 {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/student/assignments")}
            className="btn-cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              submitting || (isOverdue && !assignment.allowLateSubmission)
            }
            className="btn-submit"
          >
            {submitting ? "Submitting..." : "Submit Assignment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitAssignment;

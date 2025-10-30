import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/teacher/TeacherQualification.css";

const TeacherQualificationUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [verificationStatus, setVerificationStatus] = useState(null);
  const navigate = useNavigate();

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BACKEND_URL}/teacher/qualification-status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setVerificationStatus(data.data);
      }
    } catch (error) {
      console.error("Error fetching verification status:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type (PDF, JPG, PNG, DOC, DOCX)
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validTypes.includes(selectedFile.type)) {
        setMessage({
          type: "error",
          text: "Please upload a valid file (PDF, JPG, PNG, DOC, DOCX)",
        });
        setFile(null);
        e.target.value = "";
        return;
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "File size should not exceed 5MB",
        });
        setFile(null);
        e.target.value = "";
        return;
      }

      setFile(selectedFile);
      setMessage({ type: "", text: "" });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage({ type: "error", text: "Please select a file to upload" });
      return;
    }

    setUploading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("qualification", file);

      const response = await fetch(
        `${BACKEND_URL}/teacher/upload-qualification`,
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
        setMessage({
          type: "success",
          text: "Qualification uploaded successfully! Awaiting admin verification.",
        });
        setFile(null);
        document.getElementById("fileInput").value = "";

        // Refresh verification status
        setTimeout(() => {
          fetchVerificationStatus();
        }, 1000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to upload qualification",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Verified":
        return "status-verified";
      case "Rejected":
        return "status-rejected";
      case "Pending":
      default:
        return "status-pending";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Verified":
        return "✅";
      case "Rejected":
        return "❌";
      case "Pending":
      default:
        return "⏳";
    }
  };

  return (
    <div className="teacher-qualification-container">
      <div className="qualification-header">
        <button onClick={() => navigate("/teacher/home")} className="back-btn">
          ← Back to Dashboard
        </button>
        <h1>Teacher Qualification Verification</h1>
        <p className="qualification-subtitle">
          Upload your teaching qualification documents for verification
        </p>
      </div>

      {/* Current Verification Status */}
      {verificationStatus && (
        <div className="verification-status-card">
          <h3>Current Verification Status</h3>
          <div className="status-info">
            <div
              className={`status-badge ${getStatusBadgeClass(
                verificationStatus.verificationStatus
              )}`}
            >
              <span className="status-icon">
                {getStatusIcon(verificationStatus.verificationStatus)}
              </span>
              <span className="status-text">
                {verificationStatus.verificationStatus}
              </span>
            </div>

            {verificationStatus.verificationNotes && (
              <div className="verification-notes">
                <h4>Admin Notes:</h4>
                <p>{verificationStatus.verificationNotes}</p>
              </div>
            )}

            {verificationStatus.qualificationDoc && (
              <div className="uploaded-doc-info">
                <h4>Uploaded Document:</h4>
                <div className="doc-details">
                  <span className="doc-icon">📄</span>
                  <div className="doc-info">
                    <p className="doc-name">
                      {verificationStatus.qualificationDoc.publicId ||
                        "Qualification Document"}
                    </p>
                    <p className="doc-date">
                      Uploaded on:{" "}
                      {new Date(
                        verificationStatus.qualificationDoc.uploadedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  {verificationStatus.qualificationDoc.url && (
                    <a
                      href={verificationStatus.qualificationDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="view-doc-btn"
                    >
                      View Document
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Form */}
      <div className="upload-form-card">
        <h3>
          {verificationStatus?.qualificationDoc
            ? "Upload New Qualification Document"
            : "Upload Qualification Document"}
        </h3>
        <p className="upload-instructions">
          Please upload your teaching qualification certificate or degree.
          Accepted formats: PDF, JPG, PNG, DOC, DOCX (Max size: 5MB)
        </p>

        <form onSubmit={handleUpload} className="qualification-form">
          <div className="file-input-container">
            <label htmlFor="fileInput" className="file-input-label">
              <span className="file-icon">📎</span>
              <span className="file-text">
                {file ? file.name : "Choose a file or drag it here"}
              </span>
            </label>
            <input
              type="file"
              id="fileInput"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileChange}
              disabled={uploading}
              className="file-input"
            />
          </div>

          {file && (
            <div className="file-preview">
              <span className="file-preview-icon">📄</span>
              <div className="file-preview-info">
                <p className="file-preview-name">{file.name}</p>
                <p className="file-preview-size">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  document.getElementById("fileInput").value = "";
                }}
                className="file-remove-btn"
                disabled={uploading}
              >
                ✕
              </button>
            </div>
          )}

          {message.text && (
            <div className={`message-box ${message.type}`}>
              {message.type === "success" ? "✅" : "⚠️"} {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={!file || uploading}
            className="upload-submit-btn"
          >
            {uploading ? (
              <>
                <span className="spinner"></span>
                Uploading...
              </>
            ) : (
              <>
                <span>📤</span>
                Upload Qualification
              </>
            )}
          </button>
        </form>

        <div className="upload-guidelines">
          <h4>📋 Upload Guidelines:</h4>
          <ul>
            <li>
              ✓ Upload clear, readable copies of your qualification documents
            </li>
            <li>✓ Ensure all text and details are visible</li>
            <li>✓ Accepted: Teaching certificates, degrees, diplomas</li>
            <li>✓ File size limit: 5MB</li>
            <li>✓ Supported formats: PDF, JPG, PNG, DOC, DOCX</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeacherQualificationUpload;

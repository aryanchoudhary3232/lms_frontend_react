import React, { useState, useEffect } from "react";
import "../../css/common/Profile.css";

/**
 * Profile Component - Personal Information Management
 * ============================================
 * Allows users to view and update their profile information.
 * Works for all user roles (Student, Teacher, Admin) with smart routing.
 * 
 * Features:
 * - View current name and email
 * - Update display name
 * - Email is read-only (cannot be changed)
 * - Success/error feedback messages
 * - Loading states while fetching data
 */

const Profile = () => {
  // ============================================
  // State Management
  // ============================================
  
  // User profile data
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
  });
  
  // Form state for editing
  const [formData, setFormData] = useState({
    name: "",
  });
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Feedback messages
  const [alert, setAlert] = useState({
    type: "", // "success" or "error"
    message: "",
  });

  // Backend URL from environment
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  // ============================================
  // Data Fetching
  // ============================================

  /**
   * Fetches the current user's profile data from the server
   * Called on component mount
   */
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      clearAlert();

      const token = localStorage.getItem("token");
      
      if (!token) {
        setAlert({
          type: "error",
          message: "You are not logged in. Please login again.",
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${backendUrl}/auth/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Update profile state with fetched data
        setProfileData({
          name: data.data.name,
          email: data.data.email,
          role: data.data.role,
        });
        // Initialize form data with current name
        setFormData({
          name: data.data.name,
        });
      } else {
        setAlert({
          type: "error",
          message: data.message || "Failed to fetch profile data.",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setAlert({
        type: "error",
        message: "Network error. Please check your connection.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch profile on component mount
  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================
  // Event Handlers
  // ============================================

  /**
   * Handles input field changes
   * Updates the formData state
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Toggles edit mode on/off
   * Resets form data when canceling edit
   */
  const handleToggleEdit = () => {
    if (isEditing) {
      // Cancel editing - reset form to original values
      setFormData({
        name: profileData.name,
      });
    }
    setIsEditing(!isEditing);
    clearAlert();
  };

  /**
   * Clears the current alert message
   */
  const clearAlert = () => {
    setAlert({ type: "", message: "" });
  };

  /**
   * Handles form submission to update profile
   * Sends updated name to the server
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate name is not empty
    if (!formData.name.trim()) {
      setAlert({
        type: "error",
        message: "Name cannot be empty.",
      });
      return;
    }

    // Check if name actually changed
    if (formData.name.trim() === profileData.name) {
      setAlert({
        type: "error",
        message: "No changes detected.",
      });
      return;
    }

    try {
      setIsSaving(true);
      clearAlert();

      const token = localStorage.getItem("token");

      const response = await fetch(`${backendUrl}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update profile data with new values
        setProfileData((prev) => ({
          ...prev,
          name: data.data.name,
        }));
        setIsEditing(false);
        setAlert({
          type: "success",
          message: "Profile updated successfully!",
        });
      } else {
        setAlert({
          type: "error",
          message: data.message || "Failed to update profile.",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setAlert({
        type: "error",
        message: "Network error. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ============================================
  // Helper Functions
  // ============================================

  /**
   * Generates initials from the user's name
   * Used for the avatar display
   */
  const getInitials = (name) => {
    if (!name) return "?";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // ============================================
  // Render: Loading State
  // ============================================
  
  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="profile-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // Render: Main Component
  // ============================================
  
  return (
    <div className="profile-container">
      {/* Page Header */}
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>View and manage your personal information</p>
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        {/* Avatar Section */}
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {getInitials(profileData.name)}
          </div>
          <div className="profile-avatar-info">
            <h2>{profileData.name || "User"}</h2>
            <span className="role-badge">{profileData.role}</span>
          </div>
        </div>

        {/* Alert Messages */}
        {alert.message && (
          <div className={`profile-alert profile-alert-${alert.type}`}>
            <span className="profile-alert-icon">
              {alert.type === "success" ? "✓" : "⚠"}
            </span>
            {alert.message}
          </div>
        )}

        {/* Profile Form */}
        <form className="profile-form" onSubmit={handleSubmit}>
          {/* Full Name Field */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={isEditing ? formData.name : profileData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Field (Read-Only) */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              disabled
              readOnly
            />
            <span className="input-hint">
              Email cannot be changed as it is used for login
            </span>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  className="profile-btn profile-btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="profile-btn profile-btn-secondary"
                  onClick={handleToggleEdit}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                className="profile-btn profile-btn-primary"
                onClick={handleToggleEdit}
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

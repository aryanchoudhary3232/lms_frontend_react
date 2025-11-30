import React, { useState } from "react";
import "../../css/common/Settings.css";

/**
 * Settings Component - Security & Password Management
 * ============================================
 * Allows users to change their password with proper validation.
 * Works for all user roles (Student, Teacher, Admin).
 * 
 * Features:
 * - Current password verification before allowing change
 * - New password with confirmation
 * - Password visibility toggle
 * - Password strength indicator
 * - Success/error feedback messages
 */

const Settings = () => {
  // ============================================
  // State Management
  // ============================================
  
  // Form data for password change
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // Password visibility toggles
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Feedback messages
  const [alert, setAlert] = useState({
    type: "", // "success" or "error"
    message: "",
  });
  
  // Field-specific errors
  const [fieldErrors, setFieldErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Backend URL from environment
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  // ============================================
  // Event Handlers
  // ============================================

  /**
   * Handles input field changes
   * Updates formData and clears related field errors
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    
    // Clear general alert
    if (alert.message) {
      clearAlert();
    }
  };

  /**
   * Toggles password visibility for a specific field
   */
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  /**
   * Clears the current alert message
   */
  const clearAlert = () => {
    setAlert({ type: "", message: "" });
  };

  /**
   * Clears all field errors
   */
  const clearFieldErrors = () => {
    setFieldErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  /**
   * Resets the form to initial state
   */
  const resetForm = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
    clearFieldErrors();
  };

  // ============================================
  // Validation Functions
  // ============================================

  /**
   * Validates the form data before submission
   * Returns true if valid, false otherwise
   */
  const validateForm = () => {
    let isValid = true;
    const errors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    // Check current password is provided
    if (!formData.currentPassword) {
      errors.currentPassword = "Current password is required";
      isValid = false;
    }

    // Check new password length (minimum 6 characters)
    if (!formData.newPassword) {
      errors.newPassword = "New password is required";
      isValid = false;
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
      isValid = false;
    }

    // Check passwords match
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Check new password is different from current
    if (formData.currentPassword && formData.newPassword && 
        formData.currentPassword === formData.newPassword) {
      errors.newPassword = "New password must be different from current password";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  /**
   * Calculates password strength
   * Returns "weak", "medium", or "strong"
   */
  const getPasswordStrength = (password) => {
    if (!password) return null;
    
    let score = 0;
    
    // Length checks
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    if (score <= 3) return "weak";
    if (score <= 5) return "medium";
    return "strong";
  };

  /**
   * Gets human-readable password strength text
   */
  const getStrengthText = (strength) => {
    switch (strength) {
      case "weak": return "Weak password";
      case "medium": return "Medium strength";
      case "strong": return "Strong password";
      default: return "";
    }
  };

  // ============================================
  // Form Submission
  // ============================================

  /**
   * Handles form submission for password change
   * Sends request to server after validation
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous alerts
    clearAlert();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const token = localStorage.getItem("token");
      
      if (!token) {
        setAlert({
          type: "error",
          message: "You are not logged in. Please login again.",
        });
        return;
      }

      const response = await fetch(`${backendUrl}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Success - reset form and show success message
        resetForm();
        setAlert({
          type: "success",
          message: "Password changed successfully!",
        });
      } else {
        // Handle specific error messages from backend
        setAlert({
          type: "error",
          message: data.message || "Failed to change password.",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setAlert({
        type: "error",
        message: "Network error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================
  // Derived Values
  // ============================================
  
  const passwordStrength = getPasswordStrength(formData.newPassword);

  // ============================================
  // Render: Main Component
  // ============================================
  
  return (
    <div className="settings-container">
      {/* Page Header */}
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account security and preferences</p>
      </div>

      {/* Password Change Card */}
      <div className="settings-card">
        {/* Card Header */}
        <div className="settings-card-header">
          <div className="settings-card-icon">🔒</div>
          <div>
            <h2>Change Password</h2>
            <p>Update your password to keep your account secure</p>
          </div>
        </div>

        {/* Alert Messages */}
        {alert.message && (
          <div className={`settings-alert settings-alert-${alert.type}`}>
            <span className="settings-alert-icon">
              {alert.type === "success" ? "✓" : "⚠"}
            </span>
            {alert.message}
          </div>
        )}

        {/* Password Change Form */}
        <form className="settings-form" onSubmit={handleSubmit}>
          {/* Current Password Field */}
          <div className="form-group">
            <label htmlFor="currentPassword">
              Current Password<span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type={showPasswords.current ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter your current password"
                className={fieldErrors.currentPassword ? "input-error" : ""}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility("current")}
                aria-label={showPasswords.current ? "Hide password" : "Show password"}
              >
                {showPasswords.current ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {fieldErrors.currentPassword && (
              <span className="field-error">{fieldErrors.currentPassword}</span>
            )}
          </div>

          <div className="settings-divider"></div>

          {/* New Password Field */}
          <div className="form-group">
            <label htmlFor="newPassword">
              New Password<span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type={showPasswords.new ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="Enter your new password"
                className={fieldErrors.newPassword ? "input-error" : ""}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility("new")}
                aria-label={showPasswords.new ? "Hide password" : "Show password"}
              >
                {showPasswords.new ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {fieldErrors.newPassword && (
              <span className="field-error">{fieldErrors.newPassword}</span>
            )}
            <span className="input-hint">
              Password must be at least 6 characters long
            </span>
            
            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div className={`strength-fill ${passwordStrength}`}></div>
                </div>
                <span className="strength-text">
                  {getStrengthText(passwordStrength)}
                </span>
              </div>
            )}
          </div>

          {/* Confirm New Password Field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm New Password<span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your new password"
                className={fieldErrors.confirmPassword ? "input-error" : ""}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility("confirm")}
                aria-label={showPasswords.confirm ? "Hide password" : "Show password"}
              >
                {showPasswords.confirm ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <span className="field-error">{fieldErrors.confirmPassword}</span>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="submit"
              className="settings-btn settings-btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Changing Password..." : "Change Password"}
            </button>
            <button
              type="button"
              className="settings-btn settings-btn-secondary"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;

import React, { useState } from "react";
import "../css/Login.css";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/common/Navbar";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const { login } = useAuth();

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.trim().length < 3) {
          error = "Name must be at least 3 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Name can only contain letters and spaces";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = "Password must contain at least one lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = "Password must contain at least one uppercase letter";
        } else if (!/(?=.*\d)/.test(value)) {
          error = "Password must contain at least one number";
        }
        break;

      case "role":
        if (!value) {
          error = "Please select a role";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({
        ...errors,
        [name]: error,
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched({
      ...touched,
      [name]: true,
    });

    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const handleSubmitSignUp = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      role: true,
    });

    // Validate all fields
    const newErrors = {};
    newErrors.name = validateField("name", formData.name);
    newErrors.email = validateField("email", formData.email);
    newErrors.password = validateField("password", formData.password);
    newErrors.role = validateField("role", formData.role);

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const response = await fetch(`${backendUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Registration response:", data);

      if (response.ok && data.success) {
        alert("Registration successful! Please login with your credentials.");
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "",
        });
        setErrors({});
        setTouched({});

        // Switch to login form
        setIsSignup(false);
      } else {
        alert("Registration Error: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.log("Registration error:", error);
      alert("Network error during registration. Please try again.");
    }
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    // No validation for login - just submit directly
    await login(formData, setFormData);
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-container">
        <div className="login-content">
          {/* Left Panel - Info Panel */}
          <div className="info-panel">
            <div className="info-content">
              <h1 className="brand-title">
                {isSignup ? "Welcome To SeekoBharat" : "Hi Scholars!"}
              </h1>
              <p className="brand-subtitle">
                {isSignup
                  ? "Sign in With ID & Password"
                  : "Join SeekoBharat to Improve Your Knowledge"}
              </p>
              <button
                className="switch-btn"
                onClick={() => {
                  setIsSignup(!isSignup);
                  setErrors({});
                  setTouched({});
                  setFormData({
                    name: "",
                    email: "",
                    password: "",
                    role: "",
                  });
                }}
              >
                {isSignup ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>

          {/* Right Panel - Form Panel */}
          <div className="form-panel">
            <div className="form-content">
              {/* Sign In Form */}
              {!isSignup && (
                <form onSubmit={handleSubmitLogin} className="auth-form">
                  <h2 className="form-title">Sign In</h2>

                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleOnChange}
                      placeholder="Enter E-mail"
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleOnChange}
                      placeholder="Enter Password"
                      required
                      className="form-input"
                    />
                  </div>

                  <div className="forgot-password">
                    <a href="#" className="forgot-link">
                      Forgot Password?
                    </a>
                  </div>

                  <button type="submit" className="submit-btn">
                    Sign In
                  </button>
                </form>
              )}

              {/* Sign Up Form */}
              {isSignup && (
                <form onSubmit={handleSubmitSignUp} className="auth-form">
                  <h2 className="form-title">Create Account</h2>

                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleOnChange}
                      onBlur={handleBlur}
                      placeholder="Name"
                      required
                      className={`form-input ${
                        errors.name && touched.name ? "error" : ""
                      }`}
                    />
                    {errors.name && touched.name && (
                      <span className="error-message">{errors.name}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleOnChange}
                      onBlur={handleBlur}
                      placeholder="Enter E-mail"
                      required
                      className={`form-input ${
                        errors.email && touched.email ? "error" : ""
                      }`}
                    />
                    {errors.email && touched.email && (
                      <span className="error-message">{errors.email}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleOnChange}
                      onBlur={handleBlur}
                      placeholder="Enter Password"
                      required
                      className={`form-input ${
                        errors.password && touched.password ? "error" : ""
                      }`}
                    />
                    {errors.password && touched.password && (
                      <span className="error-message">{errors.password}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleOnChange}
                      onBlur={handleBlur}
                      required
                      className={`form-select ${
                        errors.role && touched.role ? "error" : ""
                      }`}
                    >
                      <option value="">...Choose role...</option>
                      <option value="Student">Student</option>
                      <option value="Teacher">Teacher</option>
                    </select>
                    {errors.role && touched.role && (
                      <span className="error-message">{errors.role}</span>
                    )}
                  </div>

                  <button type="submit" className="submit-btn">
                    Sign Up
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

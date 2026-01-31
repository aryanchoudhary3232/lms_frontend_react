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

    // Use functional setState to avoid stale state (rerender-functional-setstate)
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Use functional setState for consistency (rerender-functional-setstate)
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
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

    await login(formData, setFormData);
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-container">
        <div className="login-content">
          {/* Left Panel - Form Panel */}
          <div className="form-panel">
            <div className="form-content">
              {/* Brand Logo */}
              <div className="brand-logo">
                <div className="brand-icon">S</div>
                <span className="brand-name">SeekhoBharat</span>
              </div>

              {/* Sign In Form */}
              {!isSignup && (
                <form onSubmit={handleSubmitLogin} className="auth-form">
                  <h2 className="form-title">Holla,<br />Welcome Back</h2>
                  <p className="form-subtitle">Hey, welcome back to your special place</p>

                  <div className="form-group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleOnChange}
                      placeholder="email@example.com"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleOnChange}
                      placeholder="••••••••••"
                      className="form-input"
                    />
                  </div>

                  <div className="form-options">
                    <label className="remember-me">
                      <input type="checkbox" />
                      <span>Remember me</span>
                    </label>
                    <a href="#" className="forgot-link">
                      Forgot Password?
                    </a>
                  </div>

                  <button type="submit" className="submit-btn">
                    Sign In
                  </button>

                  <p className="signup-link">
                    Don't have an account?
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsSignup(true);
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
                      Sign Up
                    </a>
                  </p>
                </form>
              )}

              {/* Sign Up Form */}
              {isSignup && (
                <form onSubmit={handleSubmitSignUp} className="auth-form">
                  <h2 className="form-title">Create<br />Account</h2>
                  <p className="form-subtitle">Join us and start your learning journey</p>

                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleOnChange}
                      onBlur={handleBlur}
                      placeholder="Full Name"
                      required
                      className={`form-input ${errors.name && touched.name ? "error" : ""
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
                      placeholder="email@example.com"
                      required
                      className={`form-input ${errors.email && touched.email ? "error" : ""
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
                      placeholder="Create Password"
                      required
                      className={`form-input ${errors.password && touched.password ? "error" : ""
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
                      className={`form-select ${errors.role && touched.role ? "error" : ""
                        }`}
                    >
                      <option value="">Choose your role...</option>
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

                  <p className="signup-link">
                    Already have an account?
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsSignup(false);
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
                      Sign In
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Right Panel - Illustration Panel */}
          <div className="info-panel">
            <div className="info-content">
              <h1 className="brand-title">
                {isSignup ? "Start Learning Today" : "Welcome Back!"}
              </h1>
              <p className="brand-subtitle">
                {isSignup
                  ? "Join thousands of learners on SeekhoBharat"
                  : "Your learning journey continues here"}
              </p>

              {/* Illustration Placeholder */}
              <div className="illustration-placeholder">
                <span className="icon">🎓</span>
                <span className="text">Learn & Grow</span>
              </div>

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
                {isSignup ? "Sign In Instead" : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

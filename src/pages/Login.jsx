import React, { useState } from "react";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";
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

  const { login } = useAuth();

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitSignUp = async (e) => {
    e.preventDefault();

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
          
          {/* Left Panel - Info Panel */}
          <div className="info-panel">
            <div className="info-content">
              <h1 className="brand-title">
                {isSignup ? "Welcome To SeekoBharat" : "Hi Scholars!"}
              </h1>
              <p className="brand-subtitle">
                {isSignup 
                  ? "Sign in With ID & Password" 
                  : "Join SeekoBharat to Improve Your Knowledge"
                }
              </p>
              <button 
                className="switch-btn"
                onClick={() => setIsSignup(!isSignup)}
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
                    <a href="#" className="forgot-link">Forgot Password?</a>
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
                      placeholder="Name"
                      required
                      className="form-input"
                    />
                  </div>

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

                  <div className="form-group">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleOnChange}
                      required
                      className="form-select"
                    >
                      <option value="">...Choose role...</option>
                      <option value="Student">Student</option>
                      <option value="Teacher">Teacher</option>
                    </select>
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

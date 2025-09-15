import React, { useState } from "react";
import "../css/Login.css";
import { redirect } from "react-router-dom";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const handleOnChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("res", response);
      console.log("data", data);

      if (response.ok) {
        alert("Sign up successfully");
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "",
        });
        redirect("/");
      } else {
        alert("error:", data.error);
      }
    } catch (error) {
      console.log("error coming...", error);
    }
  };

  return (
    <div className="auth-page">
      <div className="loginform">
        <div className={`container ${isSignup ? "active" : ""}`} id="container">
          <div className="form-container sign-up">
            <form onSubmit={handleSubmit} id="signup_form">
              <h1 style={{ color: "black" }}>Create Account</h1>
              <div className="social-icons">
                <a href="#" className="icons">
                  <i className="bx bxl-google"></i>
                </a>
                <a href="#" className="icons">
                  <i className="bx bxl-facebook"></i>
                </a>
                <a href="#" className="icons">
                  <i className="bx bxl-github"></i>
                </a>
                <a href="#" className="icons">
                  <i className="bx bxl-linkedin"></i>
                </a>
              </div>
              <input
                onChange={handleOnChange}
                name="name"
                value={formData.name}
                type="text"
                placeholder="Name"
                required
              />
              <input
                onChange={handleOnChange}
                name="email"
                value={formData.email}
                type="email"
                placeholder="Enter E-mail"
                required
              />
              <input
                onChange={handleOnChange}
                name="password"
                value={formData.password}
                type="password"
                placeholder="Enter Password"
                required
              />
              <select
                onChange={handleOnChange}
                name="role"
                value={formData.role}
                required
              >
                <option value="">...Choose role...</option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
              </select>

              <button type="submit">Sign Up</button>
            </form>
          </div>

          <div className="form-container sign-in">
            <form id="login_form">
              <h1 style={{ color: "black" }}>Sign In</h1>
              <div className="social-icons">
                <a href="#" className="icons">
                  <i className="bx bxl-google"></i>
                </a>
                <a href="#" className="icons">
                  <i className="bx bxl-facebook"></i>
                </a>
                <a href="#" className="icons">
                  <i className="bx bxl-github"></i>
                </a>
                <a href="#" className="icons">
                  <i className="bx bxl-linkedin"></i>
                </a>
              </div>
              <input
                onChange={handleOnChange}
                name="email"
                value={formData.email}
                type="email"
                id="login_email"
                placeholder="Enter E-mail"
                required
              />
              <input
                onChange={handleOnChange}
                name="password"
                value={formData.password}
                type="password"
                id="login_password"
                placeholder="Enter Password"
              />
              <a href="#" title="We got you covered">
                Forget Password?
              </a>
              <button type="submit">Sign In</button>
            </form>
          </div>

          <div className="toggle-container">
            <div className="toggle">
              <div
                className={`toggle-panel toggle-left ${
                  isSignup ? "active" : ""
                }`}
              >
                <h1>
                  Welcome To <br />
                  SeekoBharat
                </h1>
                <p>Sign in With ID & Password</p>
                <button onClick={() => setIsSignup(false)} id="login">
                  Sign In
                </button>
              </div>
              <div className="toggle-panel toggle-right">
                <h1>Hii Scholars!</h1>
                <p>Join SeekoBharat to Improve Your knowledge</p>
                <button onClick={() => setIsSignup(true)} id="register">
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

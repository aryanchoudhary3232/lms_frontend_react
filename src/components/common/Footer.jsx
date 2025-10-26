import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../common/layout.css";

const Footer = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
    if (!form.message.trim()) errs.message = "Message is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;

    try {
      const res = await fetch(`${backend}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({ ok: true, message: "Thanks — we'll get back to you soon." });
        setForm({ name: "", email: "", message: "" });
        setErrors({});
      } else {
        setStatus({ ok: false, message: data.message || 'Submission failed' });
      }
    } catch (err) {
      setStatus({ ok: false, message: 'Network error' });
    }
  };

  return (
    <footer className="site-footer">
      <div className="container footer-inner footer-grid">
        <div className="footer-col">
          <h4>About SeekhoBharat</h4>
          <p>
            SeekhoBharat is an India-focused e-learning platform providing
            high-quality courses in native languages to make learning
            accessible for every learner across the country.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/student/courses">Courses</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li style={{ marginTop: 8 }}>
              Address: 42, Knowledge Park, Sector 18,<br />
              Noida, Uttar Pradesh, 201301, India
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact Us</h4>
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <input name="name" placeholder="Your name" value={form.name} onChange={handleChange} />
            {errors.name && <small className="error">{errors.name}</small>}

            <input name="email" placeholder="Your email" value={form.email} onChange={handleChange} />
            {errors.email && <small className="error">{errors.email}</small>}

            <textarea name="message" placeholder="Message" value={form.message} onChange={handleChange} />
            {errors.message && <small className="error">{errors.message}</small>}

            <button type="submit" className="btn primary">Send</button>
            {status && (
              <p className={status.ok ? 'success' : 'error'} style={{ marginTop: 8 }}>{status.message}</p>
            )}
          </form>
        </div>
      </div>
      <div className="container footer-bottom">
        <div>© {new Date().getFullYear()} SeekhoBharat — All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;

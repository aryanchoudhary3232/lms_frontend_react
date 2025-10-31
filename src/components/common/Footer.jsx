import React from "react";
import { Link } from "react-router-dom";
import "./layout.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container footer-inner footer-grid">
        <div className="footer-col">
          <h4>About SeekhoBharat</h4>
          <p>
            India's first LMS platform focusing on teaching in regional
            languages — making quality education accessible across the country.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li>
              <Link to="/courses">Courses</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              Address: 42, Knowledge Park, Sector 18,
              <br /> Noida, Uttar Pradesh, 201301, India
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Connect</h4>
          <p>
            For collaboration or support, visit our <Link to="/contact">Contact</Link> page.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

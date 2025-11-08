import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./checkout.css";

const validateCardNumber = (num) => /^\d{12}$/.test(num);
const validateCvv = (cvv) => /^\d{3}$/.test(cvv);
const validateName = (name) => /^[A-Za-z ]{2,}$/.test(name.trim());

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItems = (location.state && location.state.cartItems) || [];
  const total = (location.state && location.state.total) || 0;

  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!validateCardNumber(cardNumber)) newErrors.cardNumber = "Card number must be exactly 12 digits";
    if (!validateCvv(cvv)) newErrors.cvv = "CVV must be exactly 3 digits";
    if (!validateName(name)) newErrors.name = "Name must be at least 2 letters and only contain letters and spaces";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Proceed with checkout (call backend to enroll)
    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const courseIds = cartItems.map((i) => i.id);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"}/cart/update-enroll-courses`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseIds }),
      });

      const json = await response.json();
      if (response.ok) {
        // Simple success flow: redirect to student home
        navigate("/student/home");
      } else {
        setErrors({ form: json.message || "Checkout failed" });
      }
    } catch (err) {
      setErrors({ form: "Network error during checkout" });
      console.error("Checkout error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-grid">
        <div className="checkout-form">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={12}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="123412341234"
              />
              {errors.cardNumber && <div className="error">{errors.cardNumber}</div>}
            </div>

            <div className="form-row">
              <div className="form-group small">
                <label>CVV</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={3}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="123"
                />
                {errors.cvv && <div className="error">{errors.cvv}</div>}
              </div>

              <div className="form-group flex">
                <label>Name on Card</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                />
                {errors.name && <div className="error">{errors.name}</div>}
              </div>
            </div>

            {errors.form && <div className="error form-error">{errors.form}</div>}

            <button className="btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Processing..." : `Pay ₹${total}`}
            </button>
          </form>
        </div>

        <aside className="checkout-summary">
          <h3>Order Summary</h3>
          <div className="summary-list">
            {cartItems.length === 0 ? <p>No items in cart</p> : cartItems.map((c) => (
              <div key={c.id} className="summary-item">
                <span>{c.title}</span>
                <strong>₹{c.price}</strong>
              </div>
            ))}
          </div>
          <div className="summary-total">Total: <strong>₹{total}</strong></div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;

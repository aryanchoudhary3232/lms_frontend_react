import React, { useState, useEffect } from "react";
import "../../css/student/Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // For now, we'll get cart items from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      setCartItems(items);
      calculateTotal(items);
    }
    setLoading(false);
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + item.price, 0);
    setTotal(sum);
  };

  const removeFromCart = (courseId) => {
    const updatedCart = cartItems.filter(item => item.id !== courseId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleCheckout = () => {
    // This would integrate with a payment gateway in production
    alert("This would proceed to payment in production!");
  };

  if (loading) {
    return <div className="cart-container">Loading...</div>;
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={() => window.location.href = '/courses'} className="browse-courses-btn">
            Browse Courses
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.thumbnail} alt={item.title} className="course-thumbnail" />
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p>{item.instructor}</p>
                  <p className="price">₹{item.price}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Total Items:</span>
              <span>{cartItems.length}</span>
            </div>
            <div className="summary-row">
              <span>Total Amount:</span>
              <span>₹{total}</span>
            </div>
            <button onClick={handleCheckout} className="checkout-btn">
              Proceed to Checkout
            </button>
            <div className="payment-methods">
              <p>We accept:</p>
              <div className="payment-icons">
                <i className="far fa-credit-card"></i>
                <i className="fab fa-cc-visa"></i>
                <i className="fab fa-cc-mastercard"></i>
                <i className="fab fa-cc-paypal"></i>
                <i className="fab fa-google-pay"></i>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
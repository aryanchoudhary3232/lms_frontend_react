import React, { useState, useEffect } from "react";
import "../../css/student/Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT from login
        const res = await fetch("http://localhost:3000/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.success && data.data.items) {
          const items = data.data.items.map((i) => ({
            id: i.course._id,
            title: i.course.title,
            instructor: i.course.description, // adjust if needed
            price: i.course.price,
            thumbnail: i.course.image,
          }));
          setCartItems(items);
          calculateTotal(items);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);
  console.log("....", cartItems);
  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + (item.price || 0), 0);
    setTotal(sum);
  };

  const removeFromCart = async (courseId) => {
    try {
      await fetch(`http://localhost:3000/cart/remove/${courseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = cartItems.filter((item) => item.id !== courseId);
      setCartItems(updated);
      calculateTotal(updated);
    } catch (err) {
      console.error("Error removing course:", err);
    }
  };

  const handleCheckout = async () => {
    try {
      const courseIds = cartItems.map((item) => item.id);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/cart/update-enroll-courses`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ courseIds: courseIds }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        window.location.href = "/student/home";
      }
    } catch (error) {
      console.log("err occured...", error);
    }
  };

  if (loading) return <div className="cart-container">Loading...</div>;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button
            onClick={() => (window.location.href = "/courses")}
            className="browse-courses-btn"
          >
            Browse Courses
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="course-thumbnail"
                />
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
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

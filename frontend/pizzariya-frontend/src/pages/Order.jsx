// src/pages/Order.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cart from "../components/Cart";

const Order = () => {
  const [userId, setUserId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Simulate fetching user and outlet data
  useEffect(() => {
    // Replace these with actual API calls or session data
    const loggedInUserId = "1"; // Example user ID
    const selectedOutletId = ""; // Example outlet ID

    setUserId(loggedInUserId);
    setOutletId(selectedOutletId);
  }, []);

  const handlePlaceOrder = () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const totalPrice = Math.round(
      cartItems.reduce((acc, item) => acc + item.subtotal, 0)
    );

    const orderData = {
      user_id: userId,
      outlet_id: outletId,
      total_price: totalPrice,
      items: cartItems.map((item) => ({
        item_id: item.id,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    };

    console.log("Order Data:", orderData); // Debugging log

    axios
      .post("http://localhost:5000/order", orderData)
      .then((response) => {
        console.log(response.data);
        localStorage.removeItem("cart");
        setOrderPlaced(true);
        alert("Order placed successfully!");
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        alert("Failed to place order.");
      });
  };

  return (
    <div className="order-page">
      <h1>Place Your Order</h1>
      <div className="order-details">
        <label>
          User ID:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your User ID"
          />
        </label>
        <br />
        <label>
          Outlet ID:
          <input
            type="text"
            value={outletId}
            onChange={(e) => setOutletId(e.target.value)}
            placeholder="Enter Outlet ID"
          />
        </label>
      </div>
      <Cart />
      <button onClick={handlePlaceOrder}>Place Order</button>
      {orderPlaced && <p>Your order has been placed!</p>}
    </div>
  );
};

export default Order;

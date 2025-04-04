// src/components/OrderTracking.jsx
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:5000");

const OrderTracking = ({ orderId }) => {
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    // Initial order status fetch
    fetch(`http://localhost:5000/order-status/${orderId}`)
      .then(res => res.json())
      .then(data => setStatus(data.delivery_status))
      .catch(err => console.error(err));

    // Listen for real-time updates
    socket.on("orderUpdate", (data) => {
      if (data.order_id === orderId) {
        setStatus(data.delivery_status);
      }
    });

    // Clean up socket listener on unmount
    return () => {
      socket.off("orderUpdate");
    };
  }, [orderId]);

  return <h3>Order Status: {status}</h3>;
};

export default OrderTracking;

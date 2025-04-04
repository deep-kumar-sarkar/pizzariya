// src/components/Cart.jsx
import React, { useState, useEffect } from "react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Remove an item from the cart
  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Update the quantity of an item
  const updateQuantity = (itemId, newQuantity) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === itemId) {
        const updatedItem = {
          ...item,
          quantity: newQuantity,
          subtotal: newQuantity * item.price,
        };
        return updatedItem;
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <div>
          <ul>
            {cartItems.map(item => (
              <li key={item.id} className="cart-item">
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>
                <p>
                  Quantity:{" "}
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  />
                </p>
                <p>Subtotal: ₹{item.subtotal}</p>
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <h3>Total: ₹{totalPrice}</h3>
          <button>Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};

export default Cart;

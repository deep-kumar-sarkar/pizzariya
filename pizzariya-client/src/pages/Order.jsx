import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import "./Order.css";

const Order = () => {
  const { cart, removeFromCart, clearOutlet } = useContext(CartContext);
  const { token, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loadingOutlet, setLoadingOutlet] = useState(null);

  // Check if user is authenticated
  if (!isAuthenticated || !token) {
    return (
      <div className="order-page">
        <h2>Authentication Required</h2>
        <p>Please log in to place orders.</p>
        <button onClick={() => navigate("/login")} className="login-btn">
          Go to Login
        </button>
      </div>
    );
  }

  const outletIds = Object.keys(cart);

  const handlePlaceOrder = async (outletId) => {
    setError("");
    setLoadingOutlet(outletId);
    try {
      console.log("Preparing payload for outlet:", outletId);

      // Prepare payload grouped by outlet
      const itemsByOutlet = {};
      outletIds.forEach((id) => {
        itemsByOutlet[id] = cart[id].items.map((it) => ({
          menu_item_id: it.id,
          price: it.price,
          quantity: 1,
        }));
      });

      console.log("Payload:", {
        itemsByOutlet: { [outletId]: itemsByOutlet[outletId] },
      });

      const res = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemsByOutlet: { [outletId]: itemsByOutlet[outletId] },
        }),
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error response from server:", errorData);
        throw new Error(errorData.message || "Order placement failed");
      }

      const responseData = await res.json();
      console.log("Order placed successfully:", responseData);

      clearOutlet(outletId);
    } catch (err) {
      console.error("Error placing order:", err.message);
      setError(err.message);
    } finally {
      setLoadingOutlet(null);
    }
  };

  if (outletIds.length === 0) {
    return <p className="empty-cart">Your cart is empty.</p>;
  }

  return (
    <div className="order-page">
      <h2>Your Cart</h2>
      {error && <p className="error">{error}</p>}
      {outletIds.map((outletId) => {
        const { outlet, items } = cart[outletId];
        const total = items.reduce((sum, i) => sum + parseFloat(i.price), 0);

        return (
          <div key={outletId} className="outlet-section">
            <h3>{outlet.name}</h3>
            {items.map((item, index) => (
              <CartItem
                key={`${item.id}-${index}`}
                item={item}
                onRemove={() => removeFromCart(outletId, item.id)}
              />
            ))}
            <p className="subtotal">Subtotal: ₹ {total.toFixed(2)}</p>
            <button
              className="place-btn"
              onClick={() => handlePlaceOrder(outletId)}
              disabled={loadingOutlet === outletId}
            >
              {loadingOutlet === outletId ? "Placing..." : "Place Order"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Order;

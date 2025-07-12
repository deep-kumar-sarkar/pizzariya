import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Review.css";

const Review = () => {
  const { token, isAuthenticated } = useContext(AuthContext);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    console.log("Fetching purchased items..."); // Debug log

    fetch("http://localhost:4000/api/orders/purchased", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // <-- Add "Bearer "
      },
    })
      .then((res) => {
        console.log("Response status:", res.status); // Debug log
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Purchased items fetched:", data); // Debug log
        setPurchasedItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching purchased items:", err.message);
        setError(err.message);
      });
  }, [token, isAuthenticated]); // Ensure dependencies are correct

  if (!isAuthenticated) {
    return <p className="error">Please log in to leave reviews.</p>;
  }

  return (
    <div className="review-page">
      <h2>Review Your Purchased Items</h2>
      {error && <p className="error">{error}</p>}
      {purchasedItems.length === 0 ? (
        <p>You have not ordered anything yet.</p>
      ) : (
        purchasedItems.map((item) => (
          <div key={`${item.outlet_id}-${item.menu_item_id}`}>
            <p>{item.name}</p>
            <p>Price: ₹{item.price}</p>
            <p>Quantity: {item.quantity}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Review;

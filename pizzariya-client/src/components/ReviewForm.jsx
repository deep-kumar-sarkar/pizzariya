import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import API_BASE_URL from "../config/api";
import "./ReviewForm.css";

const ReviewForm = ({ item, outletId }) => {
  const { token, isAuthenticated } = useContext(AuthContext);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    fetch(`${API_BASE_URL}/api/orders/purchased`, {
      headers: { Authorization: `Bearer ${token}` },
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
  }, [token, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          menu_item_id: item.menu_item_id,
          outlet_id: item.outlet_id,
          rating,
          comment,
        }),
      });
      if (!res.ok) throw new Error("Review failed");
      setStatus("Review submitted successfully!");
      setComment("");
      setRating(5);
    } catch (err) {
      setStatus(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h4>{item.name}</h4>
      <label>
        Rating:
        <select value={rating} onChange={(e) => setRating(+e.target.value)}>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
      <textarea
        placeholder="Your comments"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
      {status && <p className="status">{status}</p>}
    </form>
  );
};

export default ReviewForm;

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Review.css";

const Review = () => {
  const { token, isAuthenticated } = useContext(AuthContext);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [error, setError] = useState("");
  const [reviewState, setReviewState] = useState({}); // { [itemKey]: { rating, comment, submitted } }

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    fetch("http://localhost:4000/api/orders/purchased", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setPurchasedItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [token, isAuthenticated]);

  const handleRatingChange = (itemKey, rating) => {
    setReviewState((prev) => ({
      ...prev,
      [itemKey]: { ...prev[itemKey], rating },
    }));
  };

  const handleCommentChange = (itemKey, comment) => {
    setReviewState((prev) => ({
      ...prev,
      [itemKey]: { ...prev[itemKey], comment },
    }));
  };

  const handleSubmit = async (item) => {
    const itemKey = `${item.menu_item_id}`;
    const { rating, comment } = reviewState[itemKey] || {};
    if (!rating) {
      setError("Please select a rating.");
      return;
    }
    setError("");
    try {
      const res = await fetch("http://localhost:4000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          menu_item_id: item.menu_item_id,
          rating,
          comment,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to submit review");
      }
      setReviewState((prev) => ({
        ...prev,
        [itemKey]: { ...prev[itemKey], submitted: true },
      }));
    } catch (err) {
      setError(err.message);
    }
  };

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
        purchasedItems.map((item) => {
          const itemKey = `${item.menu_item_id}`;
          const state = reviewState[itemKey] || {};
          return (
            <div key={itemKey} className="review-item-block">
              <p>{item.name}</p>
              <p>Price: ₹{parseFloat(item.price).toFixed(2)}</p>
              <p>Quantity: {item.quantity}</p>
              {state.submitted ? (
                <p className="review-success">Thank you for your review!</p>
              ) : (
                <form
                  className="review-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(item);
                  }}
                >
                  <label>Rating: </label>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={
                        state.rating >= star ? "star selected" : "star"
                      }
                      onClick={() => handleRatingChange(itemKey, star)}
                      style={{ cursor: "pointer", fontSize: "20px" }}
                    >
                      ★
                    </span>
                  ))}
                  <br />
                  <textarea
                    placeholder="Leave a comment (optional)"
                    value={state.comment || ""}
                    onChange={(e) =>
                      handleCommentChange(itemKey, e.target.value)
                    }
                    rows={2}
                    style={{ width: "250px", marginTop: "8px" }}
                  />
                  <br />
                  <button
                    type="submit"
                    className="submit-review-btn"
                    style={{ marginTop: "8px" }}
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default Review;

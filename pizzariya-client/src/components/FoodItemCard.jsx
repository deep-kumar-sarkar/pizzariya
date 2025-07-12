import { useState, useEffect } from "react";
import "./FoodItemCard.css";

const FoodItemCard = ({ item, onAddToCart }) => {
  const [avgRating, setAvgRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    // Fetch average rating for this item (item-based, no outlet filtering)
    fetch(`http://localhost:4000/api/reviews/average/${item.id}`)
      .then((res) => res.json())
      .then((data) => {
        setAvgRating(
          data.averageRating ? parseFloat(data.averageRating).toFixed(1) : null
        );
        setReviewCount(data.reviewCount || 0);
      })
      .catch(() => {
        setAvgRating(null);
        setReviewCount(0);
      });
  }, [item.id]);

  return (
    <div className="food-card">
      <h3>{item.name}</h3>
      <p>₹ {item.price}</p>
      {avgRating !== null && reviewCount > 0 ? (
        <p>
          ⭐ {avgRating} / 5 ({reviewCount} review{reviewCount > 1 ? "s" : ""})
        </p>
      ) : (
        <p>No ratings yet</p>
      )}
      <button onClick={() => onAddToCart(item)}>Add to Cart</button>
    </div>
  );
};

export default FoodItemCard;

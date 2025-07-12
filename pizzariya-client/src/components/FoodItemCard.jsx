import { useState, useEffect } from "react";
import "./FoodItemCard.css";

const FoodItemCard = ({ item, onAddToCart }) => {
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    // Fetch average rating for this item + outlet
    fetch(`http://localhost:4000/api/reviews/average?menu_item_id=${item.id}&outlet_id=${item.outletId}`)
      .then(res => res.json())
      .then(data => setAvgRating(data.averageRating.toFixed(1)))
      .catch(() => setAvgRating(null));
  }, [item.id, item.outletId]);

  return (
    <div className="food-card">
      <h3>{item.name}</h3>
      <p>₹ {item.price}</p>
      {avgRating !== null 
        ? <p>⭐ {avgRating} / 5</p>
        : <p>No ratings yet</p>
      }
      <button onClick={() => onAddToCart(item)}>Add to Cart</button>
    </div>
  );
};

export default FoodItemCard;

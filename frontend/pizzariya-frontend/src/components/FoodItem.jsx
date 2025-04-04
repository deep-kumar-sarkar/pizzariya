// src/components/FoodItem.jsx
import React from 'react';

const FoodItem = ({ item }) => (
  <li>
    <h3>{item.name} ({item.category})</h3>
    <p>{item.description}</p>
    <p>₹{item.price}</p>
    {/* Add "Add to Cart" functionality here */}
  </li>
);

export default FoodItem;

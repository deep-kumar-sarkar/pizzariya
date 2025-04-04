// Updated Menu.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FoodItem from '../components/FoodItem';

const Menu = () => {
  const [category, setCategory] = useState('');
  const [region, setRegion] = useState('');
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    let url = 'http://localhost:5000/food-items';
    const params = [];
    if (category) params.push(`category=${category}`);
    if (region) params.push(`region=${region}`);
    if (params.length) url += `?${params.join('&')}`;

    axios.get(url)
      .then(response => setFoodItems(response.data))
      .catch(error => console.error(error));
  }, [category, region]);

  const handleAddToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex(ci => ci.id === item.item_id);

    if (index !== -1) {
      cart[index].quantity += 1;
      cart[index].subtotal += item.price;
    } else {
      cart.push({
        id: item.item_id,
        name: item.name,
        price: item.price,
        quantity: 1,
        subtotal: item.price,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${item.name} added to cart.`);
  };

  return (
    <div>
      <h1>Menu</h1>
      <div>
        <button onClick={() => setCategory('')}>All</button>
        <button onClick={() => setCategory('veg')}>Veg</button>
        <button onClick={() => setCategory('non-veg')}>Non-Veg</button>
      </div>
      <div>
        <input 
          type="text"
          placeholder="Filter by region"
          value={region}
          onChange={e => setRegion(e.target.value)}
        />
      </div>
      <ul>
        {foodItems.map(item => (
          <li key={item.item_id}>
            <FoodItem item={item} />
            <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;

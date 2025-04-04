// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Outlet from '../components/Outlet';

const Home = () => {
  const [city, setCity] = useState('');
  const [outlets, setOutlets] = useState([]);

  useEffect(() => {
    if (city) {
      axios.get(`http://localhost:5000/outlets/${city}`)
        .then(response => setOutlets(response.data))
        .catch(error => console.error(error));
    }
  }, [city]);

  return (
    <div>
      <h1>Select Your City</h1>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={e => setCity(e.target.value)}
      />
      <div>
        {outlets.map(outlet => (
          <Outlet key={outlet.outlet_id} outlet={outlet} />
        ))}
      </div>
    </div>
  );
};

export default Home;
    
// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <nav>
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/menu">Menu</Link></li>
      <li><Link to="/order">Order</Link></li>
      <li><Link to="/review">Review</Link></li>
    </ul>
  </nav>
);

export default Header;

// src/components/Outlet.jsx
import React from 'react';

const Outlet = ({ outlet }) => (
  <div>
    <h2>{outlet.name}</h2>
    <p>{outlet.address}</p>
  </div>
);

export default Outlet;

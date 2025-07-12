import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});

  // Add an item to the cart, grouped by outlet
  const addToCart = (outlet, item) => {
    setCart(prev => {
      const outletId = outlet.id;
      const prevOutlet = prev[outletId] || { outlet, items: [] };
      return {
        ...prev,
        [outletId]: {
          outlet,
          items: [...prevOutlet.items, item]
        }
      };
    });
  };

  // Remove one item by ID from a specific outlet
  const removeFromCart = (outletId, itemId) => {
    setCart(prev => {
      const { [outletId]: out, ...rest } = prev;
      const filtered = out.items.filter(i => i.id !== itemId);
      if (filtered.length === 0) return rest;
      return { ...rest, [outletId]: { outlet: out.outlet, items: filtered } };
    });
  };

  // Clear entire outlet cart on order placement
  const clearOutlet = (outletId) => {
    setCart(prev => {
      const { [outletId]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearOutlet }}>
      {children}
    </CartContext.Provider>
  );
};

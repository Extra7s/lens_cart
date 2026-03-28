import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../utils/api.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) { setCart([]); return; }
    try {
      setLoading(true);
      const { data } = await cartAPI.get();
      setCart(data.items || []);
    } catch {} finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (cameraId, quantity = 1) => {
    const { data } = await cartAPI.add(cameraId, quantity);
    setCart(data.items || []);
  };

  const updateQuantity = async (cameraId, quantity) => {
    const { data } = await cartAPI.update(cameraId, quantity);
    setCart(data.items || []);
  };

  const removeFromCart = async (cameraId) => {
    const { data } = await cartAPI.remove(cameraId);
    setCart(data.items || []);
  };

  const clearCart = async () => {
    await cartAPI.clear();
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.cameraId?.price || 0) * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);

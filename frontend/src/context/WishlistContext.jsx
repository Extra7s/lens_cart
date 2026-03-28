import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../utils/api.js';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!user) { setWishlist([]); return; }
    try {
      const { data } = await wishlistAPI.get();
      setWishlist(data || []);
    } catch {}
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggleWishlist = async (cameraId) => {
    const { data } = await wishlistAPI.toggle(cameraId);
    if (data.added) {
      // Optimistically handled by refetch
    }
    await fetchWishlist();
    return data.added;
  };

  const isWishlisted = (cameraId) => wishlist.some(c => (c._id || c) === cameraId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);

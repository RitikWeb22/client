import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    const local = localStorage.getItem('aura_guest_wishlist');
    return local ? JSON.parse(local) : [];
  });

  useEffect(() => {
    const fetchWishlist = async () => {
      if (isAuthenticated) {
        try {
          const res = await cartService.getWishlist();
          setWishlist(res.data || []);
        } catch (err) {
          console.warn('Failed to load wishlist:', err.message);
        }
      }
    };
    fetchWishlist();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('aura_guest_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isAuthenticated]);

  const toggleWishlist = async (product) => {
    const productId = product._id || product;

    if (isAuthenticated) {
      try {
        const res = await cartService.toggleWishlist(productId);
        setWishlist(res.data || []);
        toast.success('Wishlist updated');
      } catch (err) {
        toast.error(err.message || 'Failed to update wishlist');
      }
    } else {
      setWishlist((prev) => {
        const exists = prev.some((p) => (p._id || p) === productId);
        if (exists) {
          toast.success('Removed from wishlist');
          return prev.filter((p) => (p._id || p) !== productId);
        } else {
          toast.success('Added to wishlist');
          return [...prev, product];
        }
      });
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isWishlisted,
        wishlistCount: wishlist.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};

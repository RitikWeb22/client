import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { couponService } from '../services/couponService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const localCart = localStorage.getItem('aura_guest_cart');
    return localCart ? JSON.parse(localCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch or sync cart when auth status changes
  useEffect(() => {
    const syncCart = async () => {
      if (isAuthenticated) {
        try {
          const guestItems = JSON.parse(localStorage.getItem('aura_guest_cart') || '[]');
          if (guestItems.length > 0) {
            const res = await cartService.mergeCart(guestItems);
            localStorage.removeItem('aura_guest_cart');
            formatAndSetCart(res.data);
          } else {
            const res = await cartService.getCart();
            formatAndSetCart(res.data);
          }
        } catch (err) {
          console.warn('Failed to fetch user cart:', err.message);
        }
      }
    };
    syncCart();
  }, [isAuthenticated]);

  // Persist guest cart locally if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('aura_guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const formatAndSetCart = (serverCart) => {
    if (!serverCart || !serverCart.items) return;
    const formatted = serverCart.items.map((item) => ({
      _id: item._id,
      product: item.product,
      productId: item.product?._id || item.product,
      name: item.product?.name || item.name,
      price: item.product?.price || item.price,
      image: item.product?.images?.[0] || item.image || '',
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      stock: item.product?.stock ?? 99
    }));
    setCartItems(formatted);
  };

  const addToCart = async (product, size, color, quantity = 1) => {
    if (!size || !color) {
      toast.error('Please select size and color');
      return;
    }

    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items in stock`);
      return;
    }

    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await cartService.addToCart({
          productId: product._id,
          size,
          color,
          quantity
        });
        formatAndSetCart(res.data);
        toast.success(`Added ${product.name} to cart`);
        setIsCartOpen(true);
      } catch (err) {
        toast.error(err.message || 'Failed to add item to cart');
      } finally {
        setLoading(false);
      }
    } else {
      // Guest cart logic
      setCartItems((prev) => {
        const existingIdx = prev.findIndex(
          (item) => (item.productId === product._id || item.product === product._id) && item.size === size && item.color === color
        );

        if (existingIdx > -1) {
          const newQty = prev[existingIdx].quantity + quantity;
          if (newQty > product.stock) {
            toast.error(`Cannot exceed available stock (${product.stock})`);
            return prev;
          }
          const updated = [...prev];
          updated[existingIdx].quantity = newQty;
          return updated;
        }

        return [
          ...prev,
          {
            _id: `guest_${Date.now()}_${Math.random()}`,
            productId: product._id,
            product,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || '',
            size,
            color,
            quantity,
            stock: product.stock
          }
        ];
      });
      toast.success(`Added ${product.name} to cart`);
      setIsCartOpen(true);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    const targetItem = cartItems.find((item) => item._id === itemId);
    if (!targetItem) return;

    if (newQuantity > targetItem.stock) {
      toast.error(`Max available stock is ${targetItem.stock}`);
      return;
    }

    if (newQuantity <= 0) {
      return removeFromCart(itemId);
    }

    if (isAuthenticated) {
      try {
        const res = await cartService.updateCartItem(itemId, newQuantity);
        formatAndSetCart(res.data);
      } catch (err) {
        toast.error(err.message || 'Failed to update quantity');
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item._id === itemId ? { ...item, quantity: newQuantity } : item))
      );
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        const res = await cartService.removeCartItem(itemId);
        formatAndSetCart(res.data);
        toast.success('Item removed from cart');
      } catch (err) {
        toast.error(err.message || 'Failed to remove item');
      }
    } else {
      setCartItems((prev) => prev.filter((item) => item._id !== itemId));
      toast.success('Item removed from cart');
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    localStorage.removeItem('aura_guest_cart');
  };

  const applyCouponCode = async (code) => {
    if (!code || !code.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    const cleanCode = code.trim().toUpperCase();
    try {
      setLoading(true);
      const res = await couponService.validateCoupon(cleanCode, cartSubtotal);
      if (res.success && res.data) {
        setCoupon({
          code: res.data.code,
          type: res.data.type,
          value: res.data.value,
          discount: res.data.discount,
          minOrderValue: res.data.minOrderValue || 0,
          maxDiscount: res.data.maxDiscount || 0
        });
        toast.success(res.message || `Coupon ${res.data.code} applied successfully!`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid or expired coupon code';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    toast.success('Coupon removed');
  };

  // Financial metrics
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (coupon) {
    if (coupon.type === 'percentage') {
      discountAmount = (cartSubtotal * coupon.value) / 100;
      if (coupon.maxDiscount > 0 && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.type === 'fixed') {
      discountAmount = Math.min(coupon.value, cartSubtotal);
    }
  }

  const shippingFee = cartSubtotal > 1999 || cartItems.length === 0 ? 0 : 150;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemCount,
        cartSubtotal,
        discountAmount,
        shippingFee,
        cartTotal,
        coupon,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCouponCode,
        removeCoupon,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

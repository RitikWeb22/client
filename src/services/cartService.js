import api from './api';

export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateCartItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeCartItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  mergeCart: (guestItems) => api.post('/cart/merge', { guestItems }),
  
  getWishlist: () => api.get('/wishlist'),
  toggleWishlist: (productId) => api.post('/wishlist/toggle', { productId })
};

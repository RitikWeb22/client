import api from './api';

export const couponService = {
  getCoupons: () => api.get('/coupons'),
  createCoupon: (couponData) => api.post('/coupons', couponData),
  deleteCoupon: (id) => api.delete(`/coupons/${id}`),
  validateCoupon: (code, cartSubtotal) => api.post('/coupons/validate', { code, cartSubtotal })
};

import api from './api';

export const paymentService = {
  createPaymentOrder: (checkoutData) => api.post('/payments/create-order', checkoutData),
  verifySignature: (paymentResult) => api.post('/payments/verify-signature', paymentResult)
};

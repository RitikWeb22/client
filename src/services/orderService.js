import api from './api';

export const orderService = {
  getUserOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  getAllOrdersAdmin: (params = {}) => api.get('/orders/admin/all', { params }),
  updateOrderStatusAdmin: (id, statusData) => api.put(`/orders/${id}/status`, statusData)
};

import api from './api';

export const reviewService = {
  getProductReviews: (productId) => api.get(`/reviews/product/${productId}`),
  createReview: (reviewData) => api.post('/reviews', reviewData),
  getAllReviewsAdmin: () => api.get('/reviews/admin/all'),
  replyReviewAdmin: (reviewId, comment) =>
    api.post(`/reviews/admin/${reviewId}/reply`, { comment }),
  deleteReviewAdmin: (reviewId) => api.delete(`/reviews/admin/${reviewId}`)
};

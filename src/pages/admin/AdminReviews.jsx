import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageSquare, Trash2, Reply, CheckCircle2, Search, Filter, ShieldCheck, CornerDownRight, ExternalLink } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import toast from 'react-hot-toast';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'replied'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Reply modal / drawer state
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [savingReply, setSavingReply] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewService.getAllReviewsAdmin();
      setReviews(res.data || []);
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleOpenReply = (review) => {
    setReplyingTo(review);
    setReplyText(review.adminReply?.comment || '');
  };

  const handleCloseReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.error('Please enter a response message.');
      return;
    }

    try {
      setSavingReply(true);
      await reviewService.replyReviewAdmin(replyingTo._id, replyText.trim());
      toast.success('Admin response published successfully!');
      handleCloseReply();
      fetchReviews();
    } catch (err) {
      toast.error(err.message || 'Failed to publish response');
    } finally {
      setSavingReply(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you certain you wish to permanently delete this customer review?')) {
      return;
    }

    try {
      await reviewService.deleteReviewAdmin(id);
      toast.success('Review removed successfully');
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      toast.error(err.message || 'Failed to delete review');
    }
  };

  // Filter & Search
  const filteredReviews = reviews.filter((r) => {
    const hasReply = !!r.adminReply?.comment;
    if (filter === 'pending' && hasReply) return false;
    if (filter === 'replied' && !hasReply) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const pName = (r.product?.name || r.productName || '').toLowerCase();
      const rName = (r.name || '').toLowerCase();
      const title = (r.title || '').toLowerCase();
      const comment = (r.comment || '').toLowerCase();
      return pName.includes(q) || rName.includes(q) || title.includes(q) || comment.includes(q);
    }

    return true;
  });

  const pendingCount = reviews.filter((r) => !r.adminReply?.comment).length;
  const repliedCount = reviews.filter((r) => !!r.adminReply?.comment).length;
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">Customer Reviews & Moderation</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Monitor client appraisals, manage ratings, and publish official Maison Vogue atelier replies.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 border border-neutral-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Reviews</span>
          <p className="text-2xl font-bold text-neutral-900">{reviews.length}</p>
          <span className="text-[11px] text-neutral-500">Across entire catalog</span>
        </div>

        <div className="bg-white p-6 border border-neutral-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Average Store Rating</span>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-neutral-900">{avgRating} / 5.0</p>
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">Store-wide satisfaction</span>
        </div>

        <div className="bg-white p-6 border border-neutral-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Pending Concierge Reply</span>
          <p className="text-2xl font-bold text-purple-900">{pendingCount}</p>
          <span className="text-[11px] text-neutral-500">Reviews awaiting response</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-neutral-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Tab Filters */}
        <div className="flex border border-neutral-200 text-xs w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 font-semibold uppercase tracking-wider transition-colors ${
              filter === 'all' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 font-semibold uppercase tracking-wider transition-colors border-x border-neutral-200 ${
              filter === 'pending' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Pending Reply ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('replied')}
            className={`px-4 py-2 font-semibold uppercase tracking-wider transition-colors ${
              filter === 'replied' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            Replied ({repliedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews or products..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-300 outline-none focus:border-black"
          />
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-neutral-500 animate-pulse">Loading reviews...</div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white border border-neutral-200 p-12 text-center space-y-3">
          <MessageSquare className="h-8 w-8 text-neutral-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-neutral-800">No Reviews Matching Criteria</h3>
          <p className="text-xs text-neutral-500">Adjust your search or status filter to see customer reviews.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => {
            const prodName = rev.product?.name || rev.productName || 'Heavyweight Boxy Tee';
            const prodImg = rev.product?.images?.[0] || rev.productImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200';
            const prodSlug = rev.product?.slug || 'heavyweight-boxy-tee';

            return (
              <div
                key={rev._id}
                className="bg-white border border-neutral-200 p-6 shadow-sm space-y-4 transition-all hover:border-neutral-300"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Product & Reviewer Header */}
                  <div className="flex items-start gap-4">
                    <img
                      src={prodImg}
                      alt={prodName}
                      className="h-16 w-14 object-cover border border-neutral-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/product/${prodSlug}`}
                          target="_blank"
                          className="font-serif font-bold text-sm text-neutral-900 hover:underline inline-flex items-center gap-1"
                        >
                          {prodName} <ExternalLink className="h-3 w-3 text-neutral-400" />
                        </Link>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-neutral-800">{rev.rating}.0</span>
                        <span className="text-[11px] text-neutral-400">•</span>
                        <span className="text-xs font-semibold text-neutral-700">{rev.name}</span>
                        {rev.email && <span className="text-[11px] text-neutral-400">({rev.email})</span>}
                      </div>

                      <p className="font-bold text-xs text-neutral-900 mt-2">{rev.title}</p>
                      <p className="text-xs text-neutral-600 font-light mt-1 max-w-3xl leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  </div>

                  {/* Date & Actions */}
                  <div className="flex md:flex-col items-end justify-between md:justify-start gap-3 shrink-0">
                    <span className="text-[11px] font-mono text-neutral-400">
                      {new Date(rev.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenReply(rev)}
                        className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-colors ${
                          rev.adminReply?.comment
                            ? 'border-purple-300 bg-purple-50 text-purple-900 hover:bg-purple-100'
                            : 'border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800'
                        }`}
                      >
                        <Reply className="h-3 w-3" />
                        <span>{rev.adminReply?.comment ? 'Edit Reply' : 'Reply'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteReview(rev._id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 border border-neutral-200 hover:border-red-300 transition-colors"
                        title="Delete Review"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Published Admin Concierge Reply */}
                {rev.adminReply?.comment && (
                  <div className="mt-3 ml-0 md:ml-18 p-4 bg-purple-50/60 border-l-2 border-purple-900 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold uppercase tracking-wider text-purple-950 flex items-center gap-1.5">
                        <CornerDownRight className="h-3.5 w-3.5 text-purple-700" />
                        {rev.adminReply.repliedBy || 'Maison Vogue Concierge Response'}
                      </span>
                      {rev.adminReply.repliedAt && (
                        <span className="text-purple-600 font-mono text-[10px]">
                          {new Date(rev.adminReply.repliedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-800 italic leading-relaxed pl-5">
                      "{rev.adminReply.comment}"
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-800 max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl animate-fadeIn">
            <div className="border-b border-neutral-200 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-purple-900">
                Official Atelier Response
              </span>
              <h3 className="font-serif text-xl font-bold text-neutral-900 mt-0.5">
                Reply to {replyingTo.name}'s Review
              </h3>
              <p className="text-xs text-neutral-500 mt-1 italic">
                "{replyingTo.title}" — {replyingTo.comment.slice(0, 80)}...
              </p>
            </div>

            <form onSubmit={handleSubmitReply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-1">
                  Store Concierge Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Thank you for sharing your perspective, Sophia. We are delighted to hear you appreciate the 280 GSM cotton drape..."
                  className="w-full text-xs border border-neutral-300 p-3 outline-none focus:border-black resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseReply}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingReply}
                  className="px-6 py-2 bg-purple-900 hover:bg-purple-800 text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:bg-neutral-400"
                >
                  {savingReply ? 'Publishing...' : 'Publish Official Reply'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

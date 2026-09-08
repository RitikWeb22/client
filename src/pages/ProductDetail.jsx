import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Check, ArrowRight, Star } from 'lucide-react';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/common/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user, isAuthenticated, loginDemo } = useAuth();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  // Reviews & Rating states
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productService.getProductBySlug(slug);
        const prod = res.data?.product;
        setProduct(prod);
        setRelatedProducts(res.data?.relatedProducts || []);

        if (prod) {
          if (prod.sizes && prod.sizes.length > 0) setSelectedSize(prod.sizes[0]);
          if (prod.colors && prod.colors.length > 0) setSelectedColor(prod.colors[0]);

          // Fetch reviews for this product
          try {
            const revRes = await reviewService.getProductReviews(prod._id);
            setReviews(revRes.data?.reviews || []);
            setReviewStats(revRes.data?.stats || null);
          } catch (err) {
            console.warn('Failed to load reviews:', err);
          }
        }
      } catch (err) {
        console.error('Failed to load product detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-[3/4] bg-neutral-200" />
        <div className="space-y-6">
          <div className="h-8 bg-neutral-200 w-3/4" />
          <div className="h-6 bg-neutral-200 w-1/4" />
          <div className="h-32 bg-neutral-200 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-serif">Product Not Found</h2>
        <p className="text-xs text-neutral-500">The product you are looking for may have been removed or renamed.</p>
        <Link to="/shop" className="inline-block px-6 py-3 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-widest">
          Return to Shop
        </Link>
      </div>
    );
  }

  const inWishlist = isWishlisted(product._id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const scrollToReviews = () => {
    const el = document.getElementById('reviews-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to post your review.');
      await loginDemo('user');
      return;
    }

    if (!reviewTitle.trim() || !reviewComment.trim()) {
      toast.error('Please provide both a review headline and detailed feedback.');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await reviewService.createReview({
        productId: product._id,
        rating: newRating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim()
      });

      toast.success(res.message || 'Review submitted successfully!');
      setReviewTitle('');
      setReviewComment('');
      setShowReviewForm(false);

      // Refresh reviews & stats
      const updatedRev = await reviewService.getProductReviews(product._id);
      setReviews(updatedRev.data?.reviews || []);
      setReviewStats(updatedRev.data?.stats || null);
      if (updatedRev.data?.stats) {
        setProduct((prev) => ({
          ...prev,
          rating: updatedRev.data.stats.rating,
          reviewCount: updatedRev.data.stats.reviewCount
        }));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-neutral-500 flex items-center space-x-2">
        <Link to="/" className="hover:text-black">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-black">Shop</Link>
        <span>/</span>
        <span className="text-neutral-900 font-medium line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Product Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Image Gallery (7 cols) */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto no-scrollbar shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-20 border overflow-hidden shrink-0 transition-opacity ${
                    selectedImage === idx ? 'border-neutral-900 opacity-100 ring-1 ring-black' : 'border-neutral-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Selected Image */}
          <div className="relative aspect-[3/4] w-full bg-neutral-100 border border-neutral-200 overflow-hidden">
            <img
              src={product.images?.[selectedImage] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000'}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider px-2.5 py-1">
                -{product.discountPercentage}% OFF
              </span>
            )}
          </div>

        </div>

        {/* Right Column: Product Info & Purchase Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-1">
              {product.brand} — {product.collectionName}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <button
              type="button"
              onClick={scrollToReviews}
              className="flex items-center gap-2 mt-2 group text-left transition-opacity hover:opacity-80"
              title="View Customer Reviews"
            >
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : i < product.rating
                        ? 'fill-amber-300 text-amber-300'
                        : 'text-neutral-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-neutral-800">{product.rating}</span>
              <span className="text-xs text-neutral-400 group-hover:underline">
                ({product.reviewCount} customer reviews)
              </span>
            </button>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 border-y border-neutral-200 py-4">
            <span className="text-2xl font-bold text-neutral-900">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice > product.price && (
              <span className="text-base text-neutral-400 line-through">
                ₹{product.compareAtPrice?.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs text-emerald-700 font-semibold ml-auto">Inclusive of all taxes</span>
          </div>

          {/* Color Picker */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                Color: <span className="font-normal text-neutral-600">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 text-xs font-semibold border transition-all ${
                      selectedColor === c
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-black'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Picker */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Size: <span className="font-normal text-neutral-600">{selectedSize}</span>
                </label>
                <button className="text-[11px] text-neutral-500 hover:underline uppercase font-semibold">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`h-10 min-w-10 px-3 text-xs font-bold border transition-all ${
                      selectedSize === s
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-800 border-neutral-300 hover:border-black'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock availability */}
          <div className="text-xs">
            {product.stock > 0 ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <Check className="h-4 w-4" /> In Stock ({product.stock} units available)
              </span>
            ) : (
              <span className="text-red-600 font-semibold">Currently Out of Stock</span>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-neutral-300">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-3 text-neutral-600 hover:bg-neutral-100 text-sm font-bold"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-3 text-neutral-600 hover:bg-neutral-100 text-sm font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 py-3.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:bg-neutral-300"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Bag</span>
              </button>

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product)}
                className="p-3.5 border border-neutral-300 hover:border-black text-neutral-800 transition-colors"
                title="Wishlist"
              >
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-600 text-red-600' : ''}`} />
              </button>
            </div>

            {/* Buy Now Direct Button */}
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full py-3.5 border border-neutral-900 text-neutral-900 text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-colors"
            >
              Buy It Now
            </button>
          </div>

          {/* Accordion Tabs for Details */}
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <div className="flex border-b border-neutral-200 gap-6 text-xs font-bold uppercase tracking-wider">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 border-b-2 transition-colors ${activeTab === 'details' ? 'border-black text-black' : 'border-transparent text-neutral-400'}`}
              >
                Product Story
              </button>
              <button
                onClick={() => setActiveTab('material')}
                className={`pb-2 border-b-2 transition-colors ${activeTab === 'material' ? 'border-black text-black' : 'border-transparent text-neutral-400'}`}
              >
                Material & Care
              </button>
            </div>

            {activeTab === 'details' ? (
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                {product.description}
              </p>
            ) : (
              <div className="text-xs text-neutral-600 space-y-2">
                <p><strong>Composition:</strong> {product.material}</p>
                <p><strong>Care Instructions:</strong> {product.careInstructions}</p>
                <p><strong>SKU:</strong> {product.sku}</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* CUSTOMER REVIEWS & RATINGS SECTION                        */}
      {/* ========================================================= */}
      <section id="reviews-section" className="border-t border-neutral-200 pt-16 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
              Verified Client Feedback
            </span>
            <h2 className="font-serif text-3xl font-bold text-neutral-900 mt-1">
              Customer Reviews & Reflections
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Evaluations on fit, fabric weight, drape, and longevity from verified customers.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-6 py-3 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors shrink-0"
          >
            {showReviewForm ? 'Close Review Form' : 'Write a Review'}
          </button>
        </div>

        {/* Rating Breakdown Summary Card */}
        <div className="bg-neutral-50 border border-neutral-200 p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Overall Score */}
          <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-neutral-200 pb-6 md:pb-0 md:pr-8 space-y-2">
            <div className="font-serif text-5xl font-bold text-neutral-900">
              {product.rating} <span className="text-lg text-neutral-400 font-sans font-normal">/ 5.0</span>
            </div>
            <div className="flex justify-center md:justify-start text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : i < product.rating
                      ? 'fill-amber-300 text-amber-300'
                      : 'text-neutral-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              Based on {product.reviewCount || reviews.length} verified client reviews
            </p>
          </div>

          {/* Right: Star Distribution Bars */}
          <div className="md:col-span-8 space-y-2 text-xs">
            {[5, 4, 3, 2, 1].map((stars) => {
              const pct = reviewStats?.distribution?.percentages?.[stars] || (stars === 5 ? 85 : stars === 4 ? 15 : 0);
              const count = reviewStats?.distribution?.counts?.[stars] || (stars === 5 ? (reviews.filter(r => Math.round(r.rating) === 5).length || 2) : 0);
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="w-12 text-neutral-600 font-semibold">{stars} Stars</span>
                  <div className="flex-1 h-2 bg-neutral-200 rounded-none overflow-hidden">
                    <div
                      className="h-full bg-neutral-900 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-neutral-400 font-mono text-[11px]">{pct}%</span>
                  <span className="w-8 text-right text-neutral-500 font-mono text-[11px]">({count})</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Review Form Drawer */}
        {showReviewForm && (
          <form
            onSubmit={handleSubmitReview}
            className="bg-white border-2 border-neutral-900 p-6 sm:p-8 space-y-6 shadow-xl animate-fadeIn"
          >
            <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-neutral-900">Share Your Experience</h3>
                <p className="text-xs text-neutral-500">Your genuine appraisal assists fellow discerning patrons.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="text-neutral-400 hover:text-black text-xs uppercase font-bold"
              >
                Cancel
              </button>
            </div>

            {/* Star Rating Picker */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                Overall Rating *
              </label>
              <div className="flex items-center gap-3">
                <div className="flex text-neutral-300">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewRating(star)}
                      className="p-1 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          star <= (hoverRating || newRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-neutral-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-700 ml-2">
                  {hoverRating === 5 || (!hoverRating && newRating === 5)
                    ? '5 / 5 — Exceptional Quality & Drape'
                    : hoverRating === 4 || (!hoverRating && newRating === 4)
                    ? '4 / 5 — Highly Recommended'
                    : hoverRating === 3 || (!hoverRating && newRating === 3)
                    ? '3 / 5 — Satisfactory'
                    : hoverRating === 2 || (!hoverRating && newRating === 2)
                    ? '2 / 5 — Needs Refinement'
                    : '1 / 5 — Subpar'}
                </span>
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                Review Headline *
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Masterful silhouette and heavyweight cotton feel"
                className="w-full text-xs border border-neutral-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                Detailed Feedback *
              </label>
              <textarea
                required
                rows={4}
                maxLength={1500}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Describe fit, garment structure, feel against skin, and how it holds up through cleaning..."
                className="w-full text-xs border border-neutral-300 p-4 outline-none focus:border-black resize-y"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-[11px] text-neutral-400">
                Posting as: <strong className="text-neutral-700">{user?.name || 'Guest Patron'}</strong>
              </span>
              <button
                type="submit"
                disabled={submittingReview}
                className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:bg-neutral-400"
              >
                {submittingReview ? 'Publishing Review...' : 'Submit Official Review'}
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-neutral-300 p-8 space-y-3">
              <p className="font-serif text-lg font-bold text-neutral-800">No client reviews yet</p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Be the premier patron to document your impressions of this garment's construction and silhouette.
              </p>
              <button
                type="button"
                onClick={() => setShowReviewForm(true)}
                className="mt-2 px-6 py-2.5 border border-neutral-900 text-neutral-900 text-xs font-bold uppercase tracking-wider hover:bg-neutral-900 hover:text-white transition-colors"
              >
                Write the First Review
              </button>
            </div>
          ) : (
            reviews.map((rev) => (
              <article
                key={rev._id}
                className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-4 shadow-sm"
              >
                {/* Header: Rating & Author info */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                          }`}
                        />
                      ))}
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 font-serif">{rev.title}</h4>
                  </div>
                  <time className="text-[11px] text-neutral-400 font-mono">
                    {new Date(rev.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                </div>

                {/* Comment Body */}
                <p className="text-xs text-neutral-700 leading-relaxed font-light">{rev.comment}</p>

                {/* Reviewer Info */}
                <div className="flex items-center gap-2 pt-2 text-xs text-neutral-500">
                  <div className="h-6 w-6 rounded-full bg-neutral-200 text-neutral-700 text-[10px] font-bold flex items-center justify-center uppercase">
                    {(rev.name || 'P').charAt(0)}
                  </div>
                  <span className="font-semibold text-neutral-800">{rev.name}</span>
                  {rev.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                      <Check className="h-3 w-3" /> Verified Purchase
                    </span>
                  )}
                </div>

                {/* Admin Concierge Reply if available */}
                {rev.adminReply?.comment && (
                  <div className="mt-4 p-4 bg-neutral-50 border-l-2 border-neutral-900 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold uppercase tracking-wider text-neutral-900">
                        {rev.adminReply.repliedBy || 'Maison Vogue Concierge'}
                      </span>
                      {rev.adminReply.repliedAt && (
                        <span className="text-neutral-400 font-mono text-[10px]">
                          {new Date(rev.adminReply.repliedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-600 italic leading-relaxed">
                      "{rev.adminReply.comment}"
                    </p>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </section>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-neutral-200 pt-16">
          <h3 className="font-serif text-2xl font-bold text-neutral-900 mb-8">Complementary Pieces</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

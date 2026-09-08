import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  Truck,
  RotateCcw,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';
import { productService } from '../services/productService';
import ProductCard from '../components/common/ProductCard';

const HERO_SLIDES = [
  {
    id: 'slide-1',
    season: 'SPRING / SUMMER 2026',
    title: 'Sovereign Simplicity',
    subtitle: 'Constructed from 280 GSM combed organic cotton and Italian linen poplin, architected for effortless drape.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=85',
    primaryCta: { text: 'Shop Collection', link: '/shop' },
    secondaryCta: { text: 'Shop Women', link: '/shop?gender=women' }
  },
  {
    id: 'slide-2',
    season: 'AUTUMN / WINTER 2026',
    title: 'Sculpted Outerwear',
    subtitle: 'Structured virgin wool overcoats, relaxed double-breasted blazers, and clean-cut outerwear without unnecessary hardware.',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=1800&q=85',
    primaryCta: { text: 'Shop Outerwear', link: '/shop/jackets' },
    secondaryCta: { text: 'Shop Men', link: '/shop?gender=men' }
  },
  {
    id: 'slide-3',
    season: 'PERMANENT WARDROBE',
    title: 'Everyday Essentials',
    subtitle: 'Heavyweight French terry fleeces, pleated wide-leg trousers, and artisanal basics engineered for daily rotation.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1800&q=85',
    primaryCta: { text: 'Shop Essentials', link: '/shop' },
    secondaryCta: { text: 'View Bestsellers', link: '/shop?sort=bestseller' }
  }
];

const CATEGORIES_DATA = [
  {
    name: 'Outerwear',
    description: 'Virgin wool coats & blazers',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=900&q=80',
    link: '/shop/jackets',
    colSpan: 'md:col-span-6'
  },
  {
    name: 'Heavyweight Tees',
    description: '280 GSM boxy cotton tees',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&q=80',
    link: '/shop/t-shirts',
    colSpan: 'md:col-span-6'
  },
  {
    name: 'Pleated Trousers',
    description: 'Tailored relaxed trousers',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&q=80',
    link: '/shop/trousers',
    colSpan: 'md:col-span-4'
  },
  {
    name: 'Hoodies & Fleece',
    description: '480 GSM French terry fleece',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&q=80',
    link: '/shop/hoodies',
    colSpan: 'md:col-span-4'
  },
  {
    name: 'Shirts & Knits',
    description: 'Breathable linen & poplin',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&q=80',
    link: '/shop/shirts',
    colSpan: 'md:col-span-4'
  }
];

const CURATED_REVIEWS = [
  {
    name: 'Sophia Laurent',
    rating: 5,
    city: 'Mumbai',
    quote: 'The collar structure is exceptionally rigid and stays crisp after wash. Boxy silhouette without looking clumsy.',
    item: 'Heavyweight Boxy Tee'
  },
  {
    name: 'Julian Vance',
    rating: 5,
    city: 'Bengaluru',
    quote: 'Subtle dropped shoulders and dense fabric weave. Fits true to size with an elevated relaxed drape.',
    item: 'Minimal Wool Overcoat'
  },
  {
    name: 'Claire Beauchamp',
    rating: 5,
    city: 'New Delhi',
    quote: 'The enzyme wash gives it an authentic worn-in drape right out of the packaging. Masterpiece craftsmanship.',
    item: 'Oversized Washed Graphic Tee'
  }
];

export default function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Auto-advance slider every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  // Load Products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, featRes, newRes] = await Promise.all([
          productService.getProducts({ limit: 12 }),
          productService.getProducts({ isFeatured: 'true', limit: 8 }),
          productService.getProducts({ isNewArrival: 'true', limit: 8 })
        ]);
        setAllProducts(prodRes.data?.products || []);
        setFeaturedProducts(featRes.data?.products || []);
        setNewArrivals(newRes.data?.products || []);
      } catch (err) {
        console.warn('Failed to load home page products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayedShowcaseProducts = (selectedCategoryTab === 'all'
    ? featuredProducts.length > 0 ? featuredProducts : allProducts
    : allProducts.filter((p) => p.category?.toLowerCase() === selectedCategoryTab.toLowerCase())
  ).slice(0, 8);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
    }
  };

  const activeSlide = HERO_SLIDES[currentSlide];

  return (
    <div className="bg-white text-neutral-900">
      
      {/* ========================================================================= */}
      {/* 1. TOP PROMO BANNER                                                       */}
      {/* ========================================================================= */}
      <div className="bg-neutral-900 text-neutral-200 text-center py-2 px-4 text-xs tracking-wider uppercase font-medium flex items-center justify-center gap-3">
        <span>Complimentary Express Shipping across India on all orders over ₹1,999</span>
        <span className="hidden sm:inline text-neutral-500">•</span>
        <span className="hidden sm:inline text-neutral-400">Code: <strong className="text-white">AURA10</strong> for 10% off</span>
      </div>

      {/* ========================================================================= */}
      {/* 2. MODERN EDITORIAL HERO SLIDER                                           */}
      {/* ========================================================================= */}
      <section className="relative w-full h-[70vh] sm:h-[78vh] lg:h-[84vh] bg-neutral-950 overflow-hidden">
        {/* Background Images */}
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>
          );
        })}

        {/* Hero Content */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-xl text-white space-y-4">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-300">
              {activeSlide.season}
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
              {activeSlide.title}
            </h1>
            <p className="text-sm sm:text-base text-neutral-200 font-light leading-relaxed max-w-lg">
              {activeSlide.subtitle}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                to={activeSlide.primaryCta.link}
                className="px-7 py-3.5 bg-white text-neutral-900 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
              >
                <span>{activeSlide.primaryCta.text}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to={activeSlide.secondaryCta.link}
                className="px-7 py-3.5 border border-white/80 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-neutral-900 transition-colors"
              >
                {activeSlide.secondaryCta.text}
              </Link>
            </div>
          </div>
        </div>

        {/* Slider Navigation Controls */}
        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 z-30 flex items-center gap-3">
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-1.5 mr-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 transition-all ${
                  idx === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Prev / Next Buttons */}
          <button
            onClick={handlePrevSlide}
            className="p-2.5 bg-black/40 hover:bg-black/80 text-white border border-white/20 transition-colors backdrop-blur-sm"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNextSlide}
            className="p-2.5 bg-black/40 hover:bg-black/80 text-white border border-white/20 transition-colors backdrop-blur-sm"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. VALUE PROPOSITIONS / TRUST BAR                                         */}
      {/* ========================================================================= */}
      <section className="border-b border-neutral-200 bg-neutral-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <Truck className="h-5 w-5 text-neutral-800 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Complimentary Shipping</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">On all orders over ₹1,999</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <RotateCcw className="h-5 w-5 text-neutral-800 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">14-Day Returns</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">Complimentary doorstep pickups</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-neutral-800 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Authentic Quality</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">280 GSM combed organic cotton</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <Clock className="h-5 w-5 text-neutral-800 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Razorpay Secure</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">UPI, Cards & Net Banking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SHOP BY CATEGORY                                                       */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex items-end justify-between border-b border-neutral-200 pb-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Explore Departments
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-widest text-neutral-900 hover:text-neutral-600 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>All Categories</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {CATEGORIES_DATA.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.link}
              className={`group relative h-64 sm:h-72 overflow-hidden bg-neutral-100 ${cat.colSpan}`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-300">
                  {cat.description}
                </p>
                <h3 className="text-xl sm:text-2xl font-serif font-bold mt-1">
                  {cat.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-white mt-2 group-hover:underline">
                  Shop Collection <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. CURATED PRODUCTS SHOWCASE                                              */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Curated Wardrobe
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mt-1">
              Featured Pieces
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { id: 'all', label: 'All Items' },
              { id: 't-shirts', label: 'T-Shirts' },
              { id: 'jackets', label: 'Outerwear' },
              { id: 'hoodies', label: 'Hoodies' },
              { id: 'trousers', label: 'Trousers' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategoryTab(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategoryTab === tab.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedShowcaseProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-neutral-900 text-neutral-900 text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-colors"
          >
            <span>Explore All Products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. EDITORIAL CAMPAIGN BANNER                                              */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="relative bg-neutral-900 text-white overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-300">
              The Atelier Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
              Designed for Longevity, Never Ephemeral Trends.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg font-light">
              Every Maison Vogue piece starts with fiber density. With double-needle structural seams and combed organic cotton, our garments retain their shape and clean drape wear after wear.
            </p>
            <div className="pt-3">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
              >
                <span>Read Our Story</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-[420px]">
            <img
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1000&q=85"
              alt="Atelier Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. VERIFIED CLIENT REVIEWS                                                */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="flex items-end justify-between border-b border-neutral-200 pb-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Patron Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900 mt-1">
              What Our Clients Say
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-widest text-neutral-900 hover:text-neutral-600 transition-colors"
          >
            View All Reviews
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CURATED_REVIEWS.map((rev, idx) => (
            <div
              key={idx}
              className="bg-neutral-50 border border-neutral-200 p-6 space-y-4 shadow-xs hover:border-neutral-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 border border-emerald-200 inline-flex items-center gap-1">
                  <Check className="h-2.5 w-2.5" /> Verified Buyer
                </span>
              </div>

              <p className="text-xs text-neutral-700 leading-relaxed italic font-light">
                "{rev.quote}"
              </p>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-neutral-900">{rev.name}</h4>
                  <span className="text-[11px] text-neutral-400">{rev.city}, India</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">{rev.item}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. NEWSLETTER SIGNUP                                                      */}
      {/* ========================================================================= */}
      <section className="border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Join the Circle
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-900">
            Receive 10% Off Your First Order
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
            Subscribe for early access to limited capsule releases, seasonal sales, and private invitations.
          </p>

          {subscribed ? (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-medium max-w-md mx-auto">
              Thank you for subscribing. Your exclusive discount code is: <strong>AURA10</strong>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 bg-white border border-neutral-300 px-4 py-3 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-900"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[10px] text-neutral-400 uppercase tracking-widest pt-2">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </section>

    </div>
  );
}

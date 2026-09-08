import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);

  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800';
  const hoverImage = product.images?.[1] || mainImage;
  const inWishlist = isWishlisted(product._id);

  return (
    <div 
      className="group relative flex flex-col bg-white border border-neutral-100 rounded-none overflow-hidden transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100">
        <Link to={`/product/${product.slug}`} className="block h-full w-full">
          <img
            src={isHovered ? hoverImage : mainImage}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.discountPercentage > 0 && (
            <span className="bg-neutral-900 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5">
              -{product.discountPercentage}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-white/95 backdrop-blur-sm text-neutral-900 border border-neutral-200 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-950 text-amber-200 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className="absolute top-2.5 right-2.5 z-20 p-2 rounded-full bg-white/90 backdrop-blur-sm text-neutral-700 hover:text-red-600 transition-colors shadow-sm"
          aria-label="Add to Wishlist"
        >
          <Heart className={`h-4 w-4 ${inWishlist ? 'fill-red-600 text-red-600' : ''}`} />
        </button>

        {/* Quick View on Hover */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-center">
          <Link
            to={`/product/${product.slug}`}
            className="w-full py-2 bg-white text-neutral-900 text-xs font-semibold uppercase tracking-widest text-center hover:bg-neutral-900 hover:text-white transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-widest text-neutral-400 mb-1">
            {product.brand || product.category}
          </div>
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="text-sm font-medium text-neutral-900 line-clamp-1 group-hover:text-neutral-600 transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-neutral-900">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through">
                ₹{product.compareAtPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Color Dots */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 3).map((col, idx) => (
                <span
                  key={idx}
                  className="w-2.5 h-2.5 rounded-full border border-neutral-300"
                  style={{
                    backgroundColor:
                      col.toLowerCase().includes('black') ? '#111' :
                      col.toLowerCase().includes('white') ? '#fff' :
                      col.toLowerCase().includes('sand') || col.toLowerCase().includes('taupe') ? '#d4b896' :
                      col.toLowerCase().includes('blue') || col.toLowerCase().includes('navy') ? '#1b2a4a' :
                      col.toLowerCase().includes('olive') ? '#4a5d4e' : '#a39c98'
                  }}
                  title={col}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[10px] text-neutral-400">+{product.colors.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/common/ProductCard';

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-neutral-200 pb-6 flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">Your Wishlist</h1>
          <p className="text-xs text-neutral-500 mt-1">Saved items for future acquisitions ({wishlist.length})</p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white border border-neutral-200">
          <Heart className="h-14 w-14 text-neutral-300 mx-auto stroke-1" />
          <h3 className="text-lg font-serif font-bold text-neutral-900">Your Wishlist is Empty</h3>
          <p className="text-xs text-neutral-500">Explore our campaign pieces and click the heart icon to save garments.</p>
          <Link to="/shop" className="inline-block px-6 py-3 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-widest">
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id || product} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

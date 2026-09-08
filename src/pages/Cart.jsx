import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    cartTotal,
    coupon,
    applyCouponCode,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCouponCode(couponInput);
      setCouponInput('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <ShoppingBag className="h-16 w-16 text-neutral-300 mx-auto stroke-1" />
        <h1 className="font-serif text-3xl font-bold text-neutral-900">Your Bag is Empty</h1>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto">
          Explore our latest arrival catalog and discover contemporary minimalist fashion pieces.
        </p>
        <div className="pt-2">
          <Link to="/shop" className="px-8 py-3.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest inline-block hover:bg-neutral-800">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="font-serif text-3xl font-bold text-neutral-900">Shopping Bag</h1>
        <p className="text-xs text-neutral-500 mt-1">Review your selected items before proceeding to secure checkout</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Cart Table (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 p-6 space-y-6">
          <div className="divide-y divide-neutral-200">
            {cartItems.map((item) => (
              <div key={item._id} className="py-6 flex flex-col sm:flex-row gap-6 first:pt-0">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300'}
                  alt={item.name}
                  className="w-24 h-32 object-cover object-center bg-neutral-100 border border-neutral-200 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <Link to={`/product/${item.product?.slug || ''}`} className="text-sm font-semibold text-neutral-900 hover:underline">
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-xs text-neutral-500 mt-1">
                      Size: <strong className="text-neutral-900">{item.size}</strong> | Color: <strong className="text-neutral-900">{item.color}</strong>
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border border-neutral-300">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-4 text-xs font-bold text-neutral-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-neutral-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-neutral-400">₹{item.price} each</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-neutral-200 p-6 space-y-6">
          <h2 className="font-serif text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-3">
            Order Summary
          </h2>

          {/* Coupon */}
          {coupon ? (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <Tag className="h-4 w-4" />
                <span>Coupon {coupon.code} Applied</span>
              </div>
              <button onClick={removeCoupon} className="text-xs text-red-600 font-bold hover:underline">
                Remove
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="Discount code (e.g. AURA10)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-neutral-300 outline-none uppercase"
              />
              <button type="submit" className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider">
                Apply
              </button>
            </form>
          )}

          {/* Pricing Breakdown */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount</span>
                <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Estimated Shipping</span>
              <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-neutral-900 pt-3 border-t border-neutral-200">
              <span>Grand Total</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="pt-2 text-center text-[11px] text-neutral-500 flex items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span>Guaranteed 256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

      </div>
    </div>
  );
}

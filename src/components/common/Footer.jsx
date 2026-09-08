import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Twitter, Facebook, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success('Thank you for subscribing to AURA Gazette!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#141414] text-white border-t border-neutral-800">
      
      {/* Brand Value Pillars */}
      <div className="border-b border-neutral-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4">
            <Truck className="h-6 w-6 text-neutral-400" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-200">Complimentary Shipping</h4>
              <p className="text-xs text-neutral-400">On all domestic orders over ₹1,999</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <RefreshCw className="h-6 w-6 text-neutral-400" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-200">Hassle-Free Returns</h4>
              <p className="text-xs text-neutral-400">14-day complimentary exchange policy</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4">
            <ShieldCheck className="h-6 w-6 text-neutral-400" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-200">Authentic Craftsmanship</h4>
              <p className="text-xs text-neutral-400">100% certified organic & sustainable fabrics</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <span className="font-serif text-2xl font-bold tracking-widest text-white uppercase">SNITCHFLOW</span>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Contemporary fashion brand dedicated to clean modern streetwear, premium fabrics, and tailored everyday essentials.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="#" className="text-neutral-400 hover:text-white transition-colors" aria-label="Instagram">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors" aria-label="Twitter">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors" aria-label="Facebook">
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Collection Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-200 mb-4">Collections</h4>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li><Link to="/shop?gender=men" className="hover:text-white transition-colors">Men's Apparel</Link></li>
            <li><Link to="/shop?gender=women" className="hover:text-white transition-colors">Women's Apparel</Link></li>
            <li><Link to="/shop?category=t-shirts" className="hover:text-white transition-colors">Heavyweight Tees</Link></li>
            <li><Link to="/shop?category=hoodies" className="hover:text-white transition-colors">French Terry Hoodies</Link></li>
            <li><Link to="/shop?category=jeans" className="hover:text-white transition-colors">Selvedge Denim</Link></li>
          </ul>
        </div>

        {/* Customer Care Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-200 mb-4">Customer Care</h4>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link to="/orders" className="hover:text-white transition-colors">Track Order</Link></li>
            <li><Link to="/about" className="hover:text-white transition-colors">Our Sustainability Story</Link></li>
            <li><Link to="/contact#faq" className="hover:text-white transition-colors">FAQs & Shipping Info</Link></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-200 mb-4">The SnitchFlow Club</h4>
          <p className="text-xs text-neutral-400 mb-4">
            Subscribe to receive private preview access, seasonal lookbooks, and exclusive drops.
          </p>
          <form onSubmit={handleSubscribe} className="flex border border-neutral-700 focus-within:border-white transition-colors">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-transparent text-white placeholder-neutral-500 outline-none"
              required
            />
            <button type="submit" className="px-3 bg-white text-black hover:bg-neutral-200 transition-colors">
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

      </div>

      {/* Copyright Line */}
      <div className="border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
        <p>© {new Date().getFullYear()} SnitchFlow Studio. All Rights Reserved.</p>
      </div>

    </footer>
  );
}

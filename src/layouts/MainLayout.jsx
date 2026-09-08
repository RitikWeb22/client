import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import CartDrawer from '../components/common/CartDrawer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#faf9f6]">
      {/* Top Announcement Promo Bar */}
      <div className="bg-neutral-900 text-white text-[11px] font-medium tracking-widest uppercase py-2 text-center px-4">
        <span>Complimentary Worldwide Shipping On Orders Above ₹1,999 — Code: <strong className="text-amber-300">AURA10</strong></span>
      </div>

      <Header />
      
      <main className="flex-1">
        <Outlet />
      </main>

      <CartDrawer />
      <Footer />
    </div>
  );
}

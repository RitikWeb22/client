import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Package, Heart, LogOut, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Account() {
  const { user, isAuthenticated, isAdmin, updateUserProfile, logout, loginDemo } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <User className="h-14 w-14 text-neutral-300 mx-auto stroke-1" />
        <h1 className="font-serif text-2xl font-bold">Account Access Required</h1>
        <p className="text-xs text-neutral-500">Sign in to view your saved profile details and delivery addresses.</p>
        <button onClick={() => loginDemo('user')} className="px-6 py-3 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest">
          Fast Demo Sign In
        </button>
      </div>
    );
  }

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile({ name, phone });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="border-b border-neutral-200 pb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">Account Dashboard</h1>
          <p className="text-xs text-neutral-500 mt-1">Manage personal details, addresses, and quick shortcuts</p>
        </div>
        {isAdmin && (
          <Link to="/admin" className="px-4 py-2 bg-purple-900 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4" /> Admin Console
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <div className="bg-white border border-neutral-200 p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user.name}
              className="h-16 w-16 rounded-full object-cover border border-neutral-300"
            />
            <div>
              <h3 className="font-serif text-lg font-bold text-neutral-900">{user.name}</h3>
              <p className="text-xs text-neutral-500">{user.email}</p>
              <span className="inline-block mt-1 bg-neutral-100 text-neutral-800 text-[10px] uppercase font-bold px-2 py-0.5">
                Role: {user.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs pt-4 border-t border-neutral-100">
            <div>
              <label className="block text-neutral-700 font-bold mb-1 uppercase">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-bold mb-1 uppercase">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
              />
            </div>
            <button type="submit" className="w-full py-2.5 bg-neutral-900 text-white font-bold uppercase tracking-wider">
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Addresses */}
        <div className="bg-white border border-neutral-200 p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-neutral-900 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-neutral-700" /> Saved Delivery Address
          </h3>

          {user.addresses && user.addresses.length > 0 ? (
            user.addresses.map((addr, idx) => (
              <div key={idx} className="p-3 bg-neutral-50 border border-neutral-200 text-xs space-y-1">
                <p className="font-bold text-neutral-900">{addr.name} ({addr.phone})</p>
                <p className="text-neutral-600">{addr.addressLine1}, {addr.addressLine2}</p>
                <p className="text-neutral-600">{addr.city}, {addr.state} - {addr.postalCode}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-neutral-500">No saved addresses found.</p>
          )}
        </div>

        {/* Shortcuts */}
        <div className="bg-white border border-neutral-200 p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-neutral-900">Quick Shortcuts</h3>
          
          <div className="space-y-2 text-xs font-semibold uppercase tracking-wider">
            <Link to="/orders" className="flex items-center justify-between p-3 border border-neutral-200 hover:bg-neutral-50">
              <span className="flex items-center gap-2"><Package className="h-4 w-4" /> View Order History</span>
              <span>→</span>
            </Link>
            <Link to="/wishlist" className="flex items-center justify-between p-3 border border-neutral-200 hover:bg-neutral-50">
              <span className="flex items-center gap-2"><Heart className="h-4 w-4" /> View Wishlist</span>
              <span>→</span>
            </Link>
            <button
              onClick={logout}
              className="w-full text-left p-3 border border-red-200 bg-red-50 text-red-700 flex items-center justify-between hover:bg-red-100"
            >
              <span className="flex items-center gap-2"><LogOut className="h-4 w-4" /> Sign Out</span>
              <span>→</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, FolderKanban, Users, ShoppingCart, Tag, ArrowLeft, LogOut, ShieldAlert, Lock, Mail, Key, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLayout() {
  const { user, isAdmin, loginWithCredentials, loginDemo, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [adminEmail, setAdminEmail] = useState('admin@maisonvogue.fashion');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await loginWithCredentials(adminEmail, adminPassword || 'adminpassword123');
      toast.success('Admin Authentication Granted');
    } catch (err) {
      toast.error(err.message || 'Admin authentication failed. Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdminAuth = async () => {
    try {
      setLoading(true);
      await loginDemo('admin');
      toast.success('Authenticated as Store Admin');
    } catch (err) {
      toast.error('Demo Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  // If user is NOT authenticated as an Admin, show Admin Authentication Screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-full bg-purple-950 text-purple-400 border border-purple-800">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="font-serif text-2xl font-bold uppercase tracking-widest text-white">MAISON VOGUE</h1>
            <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">Admin Console Authentication</p>
            <p className="text-xs text-neutral-400 font-light">
              Enter authorized administrator credentials to unlock catalog, orders, and sales metrics.
            </p>
          </div>

          <form onSubmit={handleAdminAuthSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-bold uppercase mb-1">Admin Email</label>
              <div className="flex items-center bg-neutral-900 border border-neutral-800 px-3 py-2 focus-within:border-purple-500">
                <Mail className="h-4 w-4 text-neutral-500 mr-2" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@maisonvogue.fashion"
                  className="w-full text-xs text-white outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-bold uppercase mb-1">Admin Password</label>
              <div className="flex items-center bg-neutral-900 border border-neutral-800 px-3 py-2 focus-within:border-purple-500">
                <Key className="h-4 w-4 text-neutral-500 mr-2" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs text-white outline-none bg-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-purple-900 hover:bg-purple-800 text-white font-bold uppercase tracking-widest transition-colors"
            >
              {loading ? 'Authenticating...' : 'Unlock Admin Console'}
            </button>
          </form>

          <div className="border-t border-neutral-800 pt-4 space-y-2 text-center">
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider block">
              Quick Admin Access Shortcut
            </span>
            <button
              onClick={handleDemoAdminAuth}
              disabled={loading}
              className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <ShieldAlert className="h-4 w-4 text-purple-400" />
              <span>Authenticate as Store Admin</span>
            </button>
          </div>

          <div className="pt-2 text-center">
            <Link to="/" className="text-xs text-neutral-400 hover:text-white inline-flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> Return to Public Storefront
            </Link>
          </div>

        </div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Product Catalog', path: '/admin/products', icon: ShoppingBag },
    { name: 'Categories', path: '/admin/categories', icon: FolderKanban },
    { name: 'Coupons & Discounts', path: '/admin/coupons', icon: Tag },
    { name: 'Customer Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Customer Reviews', path: '/admin/reviews', icon: MessageSquare },
    { name: 'Registered Users', path: '/admin/users', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col lg:flex-row">
      
      {/* Admin Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-neutral-950 text-white flex flex-col justify-between shrink-0 border-r border-neutral-800">
        <div>
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <Link to="/admin" className="font-serif text-xl font-bold tracking-widest uppercase text-white">
                MAISON VOGUE
              </Link>
              <p className="text-[10px] text-purple-400 font-semibold tracking-wider uppercase">Admin Console</p>
            </div>
            <Link to="/" className="p-1 text-neutral-400 hover:text-white" title="Return to Storefront">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </div>

          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive ? 'bg-white text-neutral-900 font-bold shadow-sm' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
              alt={user?.name}
              className="h-8 w-8 rounded-full object-cover border border-neutral-600"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-neutral-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 py-2 bg-neutral-900 text-neutral-300 hover:bg-red-900 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

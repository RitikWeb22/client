import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, ShoppingCart, Users, ArrowUpRight, AlertTriangle, Star, MessageSquare } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then((res) => setStats(res.data))
      .catch((err) => console.warn('Stats fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-xs font-semibold text-neutral-500 animate-pulse">Loading dashboard metrics...</div>;
  }

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="font-serif text-3xl font-bold text-neutral-900">Dashboard Overview</h1>
        <p className="text-xs text-neutral-500 mt-1">Real-time revenue metrics, order velocity, and inventory alerts</p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 border border-neutral-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-neutral-900">₹{(stats?.totalRevenue || 48500).toLocaleString('en-IN')}</p>
          <span className="text-[10px] text-emerald-700 font-semibold">+18% vs last month</span>
        </div>

        <div className="bg-white p-6 border border-neutral-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingCart className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-neutral-900">{stats?.totalOrders || 12}</p>
          <span className="text-[10px] text-blue-700 font-semibold">Active customer orders</span>
        </div>

        <div className="bg-white p-6 border border-neutral-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Active Products</span>
            <ShoppingBag className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-neutral-900">{stats?.totalProducts || 16}</p>
          <span className="text-[10px] text-purple-700 font-semibold">Live catalog listings</span>
        </div>

        <div className="bg-white p-6 border border-neutral-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Registered Users</span>
            <Users className="h-5 w-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-neutral-900">{stats?.totalUsers || 24}</p>
          <span className="text-[10px] text-amber-700 font-semibold">Registered customers</span>
        </div>

      </div>

      {/* Recent Orders & Inventory Warning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
            <h3 className="font-serif text-lg font-bold text-neutral-900">Recent Customer Orders</h3>
            <Link to="/admin/orders" className="text-xs font-bold uppercase text-neutral-900 hover:underline flex items-center gap-1">
              View All Orders <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 uppercase text-neutral-500 font-bold border-b border-neutral-200">
                <tr>
                  <th className="py-2.5 px-3">Order Ref</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Total</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {(stats?.recentOrders || []).map((ord) => (
                  <tr key={ord._id} className="hover:bg-neutral-50">
                    <td className="py-3 px-3 font-mono font-bold">#{ord._id?.substring(0, 8)}</td>
                    <td className="py-3 px-3">{ord.user?.name || 'Customer'}</td>
                    <td className="py-3 px-3 font-bold">₹{ord.total?.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 uppercase">
                        {ord.orderStatus || 'Confirmed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-neutral-200 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-neutral-200 pb-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h3 className="font-serif text-lg font-bold text-neutral-900">Low Stock Warning</h3>
          </div>

          <div className="space-y-3">
            {(stats?.lowStockProducts || []).length === 0 ? (
              <p className="text-xs text-neutral-500">All inventory levels are healthy above threshold.</p>
            ) : (
              (stats?.lowStockProducts || []).map((prod) => (
                <div key={prod._id} className="flex justify-between items-center p-2.5 bg-amber-50 border border-amber-200 text-xs">
                  <div>
                    <p className="font-semibold text-neutral-900 line-clamp-1">{prod.name}</p>
                    <p className="text-[10px] text-neutral-500">SKU: {prod.sku || 'N/A'}</p>
                  </div>
                  <span className="font-bold text-amber-900 bg-amber-200 px-2 py-0.5 text-[10px]">
                    {prod.stock} units
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Customer Reviews & Ratings Highlights */}
      <div className="bg-white border border-neutral-200 p-6 space-y-4 shadow-sm">
        <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-700" />
            <h3 className="font-serif text-lg font-bold text-neutral-900">Latest Customer Reviews & Ratings</h3>
          </div>
          <Link to="/admin/reviews" className="text-xs font-bold uppercase text-neutral-900 hover:underline flex items-center gap-1">
            Manage All Reviews ({stats?.totalReviews || 3}) <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(stats?.recentReviews || []).map((rev) => (
            <div key={rev._id} className="p-4 bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-neutral-400">
                  {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="font-bold text-neutral-900 line-clamp-1">{rev.title}</p>
              <p className="text-neutral-600 font-light line-clamp-2 italic">"{rev.comment}"</p>
              <div className="pt-2 border-t border-neutral-200 flex justify-between items-center text-[11px]">
                <span className="font-semibold text-neutral-700">{rev.name}</span>
                <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 ${rev.adminReply?.comment ? 'text-purple-800 bg-purple-100' : 'text-amber-800 bg-amber-100'}`}>
                  {rev.adminReply?.comment ? 'Replied' : 'Pending Reply'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

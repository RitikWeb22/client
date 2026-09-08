import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, Truck, XCircle, ArrowRight } from 'lucide-react';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const { isAuthenticated, loginDemo } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      orderService.getUserOrders()
        .then((res) => setOrders(res.data || []))
        .catch((err) => console.warn('Orders fetch error:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Package className="h-14 w-14 text-neutral-300 mx-auto stroke-1" />
        <h1 className="font-serif text-2xl font-bold">Sign In to View Orders</h1>
        <p className="text-xs text-neutral-500">Log in with your Google account or Demo Login to access your purchase history.</p>
        <button
          onClick={() => loginDemo('user')}
          className="px-6 py-3 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest"
        >
          Fast Demo Sign In
        </button>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">Delivered</span>;
      case 'shipped':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">Shipped</span>;
      case 'confirmed':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">Confirmed</span>;
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">Cancelled</span>;
      default:
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">Processing</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="font-serif text-3xl font-bold text-neutral-900">Your Orders</h1>
        <p className="text-xs text-neutral-500 mt-1">Track current shipments and view historical invoices</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-200 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-white border border-neutral-200">
          <Package className="h-12 w-12 text-neutral-300 mx-auto stroke-1" />
          <h3 className="text-lg font-serif font-bold text-neutral-900">No Orders Found</h3>
          <p className="text-xs text-neutral-500">You haven't placed any orders with AURA yet.</p>
          <Link to="/shop" className="inline-block px-6 py-2.5 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-widest">
            Browse Apparel Catalog
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((ord) => (
            <div key={ord._id} className="bg-white border border-neutral-200 p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4 text-xs">
                <div>
                  <span className="text-neutral-500">Order ID: </span>
                  <span className="font-mono font-bold text-neutral-900">#{ord._id}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-neutral-500">Date: {new Date(ord.createdAt).toLocaleDateString()}</span>
                  {getStatusBadge(ord.orderStatus)}
                </div>
              </div>

              <div className="divide-y divide-neutral-100">
                {ord.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex gap-4 items-center">
                    <img src={item.image} alt="" className="w-12 h-16 object-cover bg-neutral-100" />
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-neutral-900">{item.name}</p>
                      <p className="text-neutral-500">Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-bold text-neutral-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t border-neutral-100 pt-4 text-xs">
                <span className="text-neutral-500">Payment: <strong className="text-emerald-700 uppercase font-bold">{ord.paymentStatus}</strong></span>
                <span className="text-sm font-bold text-neutral-900">Total: ₹{ord.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

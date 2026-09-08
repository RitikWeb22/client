import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { orderService } from '../services/orderService';

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      orderService.getOrderById(orderId)
        .then((res) => setOrder(res.data))
        .catch((err) => console.warn('Could not load order confirmation:', err));
    }
  }, [orderId]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      
      <div className="inline-flex p-4 rounded-full bg-emerald-100 text-emerald-800 mb-2">
        <CheckCircle2 className="h-12 w-12" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">Payment Confirmed</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">Thank You For Your Order</h1>
        <p className="text-xs text-neutral-500 max-w-md mx-auto">
          Your payment signature has been verified and your order has been stored in our system. A confirmation notification has been dispatched.
        </p>
      </div>

      {order && (
        <div className="bg-white border border-neutral-200 p-6 text-left space-y-4 max-w-lg mx-auto">
          <div className="flex justify-between items-center border-b border-neutral-200 pb-3 text-xs">
            <span className="font-bold uppercase tracking-wider text-neutral-900">Order Reference</span>
            <span className="font-mono text-neutral-600">#{order._id}</span>
          </div>

          <div className="text-xs space-y-1">
            <p className="text-neutral-500">Payment Status: <strong className="text-emerald-700 uppercase font-bold">{order.paymentStatus}</strong></p>
            <p className="text-neutral-500">Total Paid: <strong className="text-neutral-900 font-bold">₹{order.total?.toLocaleString('en-IN')}</strong></p>
            <p className="text-neutral-500">Shipping to: <span className="text-neutral-900">{order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}</span></p>
          </div>
        </div>
      )}

      <div className="pt-4 flex flex-wrap justify-center gap-4">
        <Link
          to="/orders"
          className="px-8 py-3.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 hover:bg-neutral-800"
        >
          <Package className="h-4 w-4" />
          <span>View My Orders</span>
        </Link>

        <Link
          to="/shop"
          className="px-8 py-3.5 border border-neutral-900 text-neutral-900 text-xs font-bold uppercase tracking-widest inline-flex items-center gap-2 hover:bg-neutral-900 hover:text-white transition-colors"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/orderService';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getAllOrdersAdmin();
      setOrders(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatusAdmin(orderId, { orderStatus: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Status update failed');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="font-serif text-3xl font-bold text-neutral-900">Customer Order Management</h1>
        <p className="text-xs text-neutral-500 mt-1">Review active transactions and update delivery fulfillment statuses</p>
      </div>

      <div className="bg-white border border-neutral-200 overflow-x-auto shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 uppercase text-neutral-500 font-bold border-b border-neutral-200">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Fulfillment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-400">Loading orders...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-neutral-500">No orders found.</td>
              </tr>
            ) : (
              orders.map((ord) => (
                <tr key={ord._id} className="hover:bg-neutral-50">
                  <td className="py-3 px-4 font-mono font-bold">#{ord._id?.substring(0, 8)}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-neutral-900">{ord.user?.name || 'Customer'}</p>
                    <p className="text-[10px] text-neutral-400">{ord.user?.email}</p>
                  </td>
                  <td className="py-3 px-4">{ord.items?.length || 0} items</td>
                  <td className="py-3 px-4 font-bold text-neutral-900">₹{ord.total?.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 uppercase">
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                      className="bg-white border border-neutral-300 text-xs font-semibold px-2 py-1 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

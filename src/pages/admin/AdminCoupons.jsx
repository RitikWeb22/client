import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Tag, Percent, DollarSign } from 'lucide-react';
import { couponService } from '../../services/couponService';
import toast from 'react-hot-toast';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState('');
  const [type, setType] = useState('percentage');
  const [value, setValue] = useState(15);
  const [minOrderValue, setMinOrderValue] = useState(1500);
  const [maxDiscount, setMaxDiscount] = useState(500);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await couponService.getCoupons();
      setCoupons(res.data || []);
    } catch (err) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      await couponService.createCoupon({
        code: code.trim().toUpperCase(),
        type,
        value: Number(value),
        minOrderValue: Number(minOrderValue),
        maxDiscount: Number(maxDiscount)
      });
      toast.success(`Coupon ${code.toUpperCase()} created successfully!`);
      setCode('');
      setValue(15);
      fetchCoupons();
    } catch (err) {
      toast.error(err.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id, couponCode) => {
    if (window.confirm(`Delete coupon "${couponCode}"?`)) {
      try {
        await couponService.deleteCoupon(id);
        toast.success(`Deleted ${couponCode}`);
        setCoupons(coupons.filter(c => c._id !== id));
      } catch (err) {
        toast.error(err.message || 'Delete failed');
      }
    }
  };

  return (
    <div className="space-y-8">
      
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="font-serif text-3xl font-bold text-neutral-900">Promotional Coupons & Discounts</h1>
        <p className="text-xs text-neutral-500 mt-1">Create promotional discount codes and configure order thresholds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Create Form (4 cols) */}
        <form onSubmit={handleCreate} className="lg:col-span-4 bg-white border border-neutral-200 p-6 space-y-4 text-xs">
          <h3 className="font-serif text-base font-bold text-neutral-900 flex items-center gap-2">
            <Tag className="h-4 w-4 text-purple-700" /> Create New Coupon
          </h3>

          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Coupon Code *</label>
            <input
              type="text"
              required
              placeholder="e.g. VOGUE25"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 outline-none uppercase font-mono"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Discount Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 outline-none"
            >
              <option value="percentage">Percentage Off (%)</option>
              <option value="fixed">Fixed Amount Off (₹)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">
              Discount Value ({type === 'percentage' ? '%' : '₹'}) *
            </label>
            <input
              type="number"
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-neutral-700 mb-1">Min Order Value (₹)</label>
            <input
              type="number"
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 outline-none"
            />
          </div>

          {type === 'percentage' && (
            <div>
              <label className="block font-bold uppercase text-neutral-700 mb-1">Max Cap Discount (₹)</label>
              <input
                type="number"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-neutral-900 text-white font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-neutral-800"
          >
            <Plus className="h-4 w-4" /> Create Discount Coupon
          </button>
        </form>

        {/* Coupons Table (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 overflow-x-auto shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 uppercase text-neutral-500 font-bold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Value</th>
                <th className="py-3 px-4">Min Order</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">Loading coupons...</td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500">No coupons active.</td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-neutral-50">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-900 bg-neutral-50 px-2 py-1 border border-neutral-200 w-fit">
                      {c.code}
                    </td>
                    <td className="py-3 px-4 capitalize">{c.type}</td>
                    <td className="py-3 px-4 font-bold text-emerald-700">
                      {c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`}
                    </td>
                    <td className="py-3 px-4">₹{c.minOrderValue || 0}</td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 uppercase">
                        Active
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(c._id, c.code)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete coupon"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}

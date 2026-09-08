import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CreditCard, ArrowLeft, CheckCircle2, Save, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { paymentService } from '../services/paymentService';
import toast from 'react-hot-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loginDemo, updateUserProfile } = useAuth();
  const { cartItems, cartSubtotal, discountAmount, shippingFee, cartTotal, coupon, clearCart, applyCouponCode, removeCoupon } = useCart();
  const [checkoutCouponInput, setCheckoutCouponInput] = useState('');

  const [address, setAddress] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });

  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-fill address & phone from user profile as soon as user is loaded
  useEffect(() => {
    if (user) {
      const defaultAddr = user.addresses?.[0] || {};
      setAddress((prev) => ({
        name: prev.name || user.name || '',
        phone: prev.phone || user.phone || defaultAddr.phone || '+91 98765 43210',
        addressLine1: prev.addressLine1 || defaultAddr.addressLine1 || '42 Fashion Boulevard, Suite 100',
        addressLine2: prev.addressLine2 || defaultAddr.addressLine2 || 'Bandra West',
        city: prev.city || defaultAddr.city || 'Mumbai',
        state: prev.state || defaultAddr.state || 'Maharashtra',
        postalCode: prev.postalCode || defaultAddr.postalCode || '400050',
        country: 'India'
      }));
    }
  }, [user]);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please sign in to complete your order.');
      await loginDemo('user');
      return;
    }

    if (!address.name || !address.phone || !address.addressLine1 || !address.city || !address.postalCode) {
      toast.error('Please complete all required shipping address fields.');
      return;
    }

    try {
      setIsProcessing(true);

      // Save address & phone to user profile if toggle is checked
      if (saveAddressToProfile) {
        updateUserProfile({
          phone: address.phone,
          addresses: [
            {
              name: address.name,
              phone: address.phone,
              addressLine1: address.addressLine1,
              addressLine2: address.addressLine2,
              city: address.city,
              state: address.state,
              postalCode: address.postalCode,
              country: address.country,
              isDefault: true
            }
          ]
        }).catch(() => {});
      }

      // 1. Create order on backend
      const res = await paymentService.createPaymentOrder({
        items: cartItems.map((item) => ({
          product: item.productId || item.product?._id || item.product,
          name: item.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity
        })),
        shippingAddress: address,
        couponCode: coupon?.code
      });

      const { orderId, razorpayOrderId, amount, currency, key } = res.data;

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: key || 'rzp_test_samplekeyid123',
        amount: amount,
        currency: currency || 'INR',
        name: 'MAISON VOGUE Paris',
        description: `Order #${orderId.substring(0, 8)} Payment`,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200',
        order_id: razorpayOrderId.startsWith('rzp_order_mock') ? undefined : razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyRes = await paymentService.verifySignature({
              orderId,
              razorpayOrderId: response.razorpay_order_id || razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id || `pay_mock_${Date.now()}`,
              razorpaySignature: response.razorpay_signature || 'mock_signature'
            });

            if (verifyRes.success) {
              clearCart();
              toast.success('Payment verified successfully!');
              navigate(`/order-success?orderId=${orderId}`);
            }
          } catch (err) {
            toast.error(err.message || 'Payment signature verification failed.');
          }
        },
        prefill: {
          name: address.name,
          email: user?.email || 'customer@maisonvogue.fashion',
          contact: address.phone
        },
        theme: {
          color: '#111111'
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.error('Payment window closed.');
          }
        }
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback for development if script is blocked
        toast.loading('Verifying secure payment...');
        setTimeout(async () => {
          try {
            const verifyRes = await paymentService.verifySignature({
              orderId,
              razorpayOrderId,
              razorpayPaymentId: `pay_sim_${Date.now()}`,
              razorpaySignature: 'simulated_signature'
            });
            if (verifyRes.success) {
              clearCart();
              toast.success('Payment verified successfully!');
              navigate(`/order-success?orderId=${orderId}`);
            }
          } catch (err) {
            toast.error(err.message || 'Payment failed');
          } finally {
            setIsProcessing(false);
          }
        }, 1500);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
        <div>
          <button
            onClick={() => navigate('/cart')}
            className="text-xs text-neutral-500 hover:text-black flex items-center gap-1 mb-2 font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Bag
          </button>
          <h1 className="font-serif text-3xl font-bold text-neutral-900">Checkout & Delivery</h1>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 border border-emerald-200">
          <Lock className="h-3.5 w-3.5" />
          <span>Razorpay 256-Bit SSL Encrypted</span>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 p-4 flex items-center justify-between">
          <p className="text-xs text-amber-900 font-medium">
            Checking out as guest. Click Demo Login to auto-fill customer profile details.
          </p>
          <button
            onClick={() => loginDemo('user')}
            className="px-4 py-1.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider"
          >
            Fast Demo Login
          </button>
        </div>
      )}

      <form onSubmit={handlePayment} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Shipping Address Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6 bg-white border border-neutral-200 p-6">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <h2 className="font-serif text-lg font-bold text-neutral-900">
              1. Shipping Address & Contact
            </h2>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
              Auto-filled from Profile
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-bold mb-1 uppercase">Full Name *</label>
              <input
                type="text"
                name="name"
                required
                value={address.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-bold mb-1 uppercase">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                required
                value={address.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-neutral-700 font-bold mb-1 uppercase">Address Line 1 *</label>
            <input
              type="text"
              name="addressLine1"
              required
              placeholder="Street address, building, house number"
              value={address.addressLine1}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
            />
          </div>

          <div className="text-xs">
            <label className="block text-neutral-700 font-bold mb-1 uppercase">Address Line 2 (Optional)</label>
            <input
              type="text"
              name="addressLine2"
              placeholder="Apartment, suite, landmark"
              value={address.addressLine2}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-neutral-700 font-bold mb-1 uppercase">City *</label>
              <input
                type="text"
                name="city"
                required
                value={address.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-bold mb-1 uppercase">State *</label>
              <input
                type="text"
                name="state"
                required
                value={address.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-neutral-700 font-bold mb-1 uppercase">Postal Code *</label>
              <input
                type="text"
                name="postalCode"
                required
                value={address.postalCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="pt-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-neutral-800 font-semibold">
              <input
                type="checkbox"
                checked={saveAddressToProfile}
                onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                className="accent-black h-4 w-4"
              />
              <span>Save this address and phone number to my profile for future orders</span>
            </label>
          </div>

        </div>

        {/* Order Summary & Payment CTA (5 cols) */}
        <div className="lg:col-span-5 space-y-6 bg-white border border-neutral-200 p-6">
          <h2 className="font-serif text-lg font-bold text-neutral-900 border-b border-neutral-200 pb-3">
            2. Order Items ({cartItems.length})
          </h2>

          <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100 pr-2">
            {cartItems.map((item) => (
              <div key={item._id} className="py-3 flex gap-3 items-center">
                <img src={item.image} alt="" className="w-12 h-16 object-cover bg-neutral-100" />
                <div className="flex-1 text-xs">
                  <p className="font-semibold text-neutral-900 line-clamp-1">{item.name}</p>
                  <p className="text-neutral-500">{item.size} / {item.color} x {item.quantity}</p>
                </div>
                <span className="text-xs font-bold text-neutral-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          {/* Coupon Entry / Applied Badge */}
          <div className="border-t border-neutral-200 pt-4">
            {coupon ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <Tag className="h-3.5 w-3.5" />
                  <span>Coupon {coupon.code} Applied</span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-xs text-red-600 font-bold hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. AURA10)"
                  value={checkoutCouponInput}
                  onChange={(e) => setCheckoutCouponInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-neutral-300 outline-none uppercase placeholder:normal-case focus:border-neutral-900"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (checkoutCouponInput.trim()) {
                      applyCouponCode(checkoutCouponInput);
                      setCheckoutCouponInput('');
                    }
                  }}
                  className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shrink-0"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-neutral-200 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Coupon Discount ({coupon?.code})</span>
                <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Shipping Fee</span>
              <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-neutral-900 pt-3 border-t border-neutral-200">
              <span>Total Payable</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:bg-neutral-400"
          >
            <CreditCard className="h-4 w-4" />
            <span>{isProcessing ? 'Processing Payment...' : `Pay ₹${cartTotal.toLocaleString('en-IN')} via Razorpay`}</span>
          </button>

          <p className="text-[11px] text-neutral-500 text-center">
            By clicking Pay, Razorpay Checkout will launch safely to verify your payment signature.
          </p>
        </div>

      </form>
    </div>
  );
}

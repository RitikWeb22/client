import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Thank you for contacting AURA Customer Concierge. We will reply within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Concierge</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">Contact Studio Concierge</h1>
        <p className="text-xs text-neutral-500 font-light">
          Have questions regarding sizing, custom tailoring, or shipment status? We are available 7 days a week.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 bg-neutral-900 text-white p-8 space-y-8">
          <h2 className="font-serif text-2xl font-bold">Atelier Information</h2>

          <div className="space-y-6 text-xs font-light">
            <div className="flex items-start space-x-4">
              <MapPin className="h-5 w-5 text-amber-300 shrink-0" />
              <div>
                <strong className="block text-white font-semibold uppercase tracking-wider mb-1">Flagship Studio</strong>
                <p className="text-neutral-300">42 Fashion Boulevard, Bandra West, Mumbai 400050, India</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="h-5 w-5 text-amber-300 shrink-0" />
              <div>
                <strong className="block text-white font-semibold uppercase tracking-wider mb-1">Electronic Support</strong>
                <p className="text-neutral-300">concierge@aura.fashion</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="h-5 w-5 text-amber-300 shrink-0" />
              <div>
                <strong className="block text-white font-semibold uppercase tracking-wider mb-1">Telephone Concierge</strong>
                <p className="text-neutral-300">+91 (022) 8765-4321</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 p-8 space-y-6">
          <h2 className="font-serif text-xl font-bold text-neutral-900 border-b border-neutral-200 pb-3">
            Send an Inquiry
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">Your Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase text-neutral-700 mb-1">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-neutral-700 mb-1">Message *</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 outline-none focus:border-black"
              />
            </div>

            <button type="submit" className="px-8 py-3.5 bg-neutral-900 text-white font-bold uppercase tracking-widest hover:bg-neutral-800 flex items-center gap-2">
              <Send className="h-4 w-4" />
              <span>Submit Message</span>
            </button>
          </form>
        </div>

      </div>

      {/* FAQ Shortcut */}
      <div id="faq" className="border-t border-neutral-200 pt-12 space-y-6">
        <h2 className="font-serif text-2xl font-bold text-neutral-900 text-center">Frequently Asked Questions</h2>
        
        <div className="max-w-3xl mx-auto divide-y divide-neutral-200 text-xs space-y-4 pt-4">
          <div className="pt-4">
            <h4 className="font-bold text-neutral-900 mb-1">What is your complimentary domestic shipping policy?</h4>
            <p className="text-neutral-600 font-light">Orders over ₹1,999 qualify for complimentary express shipping across India within 3-5 business days.</p>
          </div>

          <div className="pt-4">
            <h4 className="font-bold text-neutral-900 mb-1">How does your 14-day exchange policy work?</h4>
            <p className="text-neutral-600 font-light">We accept unworn garments with original security tags attached within 14 days of delivery.</p>
          </div>
        </div>
      </div>

    </div>
  );
}

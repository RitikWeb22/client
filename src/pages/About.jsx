import React from 'react';
import { Compass, Sparkles, Feather, ShieldCheck } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero */}
      <section className="relative h-[60vh] bg-neutral-900 text-white flex items-center justify-center text-center px-4 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-300">Brand Manifesto</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold">The Architecture of Minimal Living</h1>
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
            Founded on the principle that true elegance is defined by subtraction rather than addition.
          </p>
        </div>
      </section>

      {/* Narrative */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">Crafted Without Compromise</h2>
        <p className="text-sm text-neutral-600 leading-relaxed font-light">
          Every piece in the AURA catalog originates from meticulous textile sourcing across European mills and Japanese denim workshops. We prioritize 280-480 GSM organic cottons, European flax linens, and virgin wool blends that improve with character and age.
        </p>
      </section>

      {/* Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-8 bg-white border border-neutral-200 space-y-3">
          <Feather className="h-8 w-8 text-neutral-800 mx-auto stroke-1" />
          <h3 className="font-serif text-lg font-bold">Traceable Raw Textiles</h3>
          <p className="text-xs text-neutral-500 font-light">100% GOTS certified organic cotton and non-toxic vegetable dyes.</p>
        </div>

        <div className="p-8 bg-white border border-neutral-200 space-y-3">
          <Compass className="h-8 w-8 text-neutral-800 mx-auto stroke-1" />
          <h3 className="font-serif text-lg font-bold">Timeless Proportions</h3>
          <p className="text-xs text-neutral-500 font-light">Engineered relaxed & boxy fits designed to transcend seasonal trend cycles.</p>
        </div>

        <div className="p-8 bg-white border border-neutral-200 space-y-3">
          <ShieldCheck className="h-8 w-8 text-neutral-800 mx-auto stroke-1" />
          <h3 className="font-serif text-lg font-bold">Ethical Garment Production</h3>
          <p className="text-xs text-neutral-500 font-light">Manufactured in fair-wage artisan atelier studios with zero micro-plastic packaging.</p>
        </div>
      </section>

    </div>
  );
}

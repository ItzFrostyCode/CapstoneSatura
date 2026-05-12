'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Camera, Scissors, QrCode, Clock, Star, X } from 'lucide-react';
import TrackingTimeline from '@/components/customer/TrackingTimeline';

export default function CustomerPortal() {
  const [orderId, setOrderId] = useState('');
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      setIsTracking(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 1. HERO SECTION (Track Order First) */}
      <section className="bg-slate-900 text-white pt-24 pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
            Track Your Bespoke Garment.
          </h1>
          <p className="text-lg text-slate-300 font-medium mb-12 max-w-xl mx-auto">
            Enter your Order ID below to see live updates on your tailoring progress, from pattern drafting to final fitting.
          </p>

          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="e.g. ORD-2026-98X2"
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:bg-white focus:text-slate-900 focus:outline-none transition-all text-lg font-bold"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="w-full sm:w-auto h-14 px-8 bg-white text-slate-900 font-black text-[15px] rounded-xl hover:bg-slate-100 transition-colors shrink-0 shadow-xl"
            >
              Track Order
            </button>
            <button 
              type="button"
              className="w-full sm:w-auto h-14 px-5 bg-white/10 text-white border border-white/20 font-bold text-[15px] rounded-xl hover:bg-white/20 transition-colors shrink-0 flex items-center justify-center gap-2"
              title="Scan QR Code from Receipt"
            >
              <QrCode size={20} />
            </button>
          </form>

          <div className="mt-8">
             <span className="text-slate-400 text-sm font-medium">Or</span>
             <Link href="#book" className="inline-block ml-4 text-white font-bold underline underline-offset-4 hover:text-indigo-300 transition-colors">
               Book a new consultation
             </Link>
          </div>
        </div>
      </section>

      {/* TRACKING RESULT SECTION */}
      {isTracking && (
        <section className="max-w-4xl mx-auto px-6 -mt-16 relative z-20 mb-20 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10 pb-10 border-b border-slate-100">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Active Order</span>
                  <span className="text-slate-400 font-bold text-[13px]">Ordered on May 10, 2026</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Order #{orderId || 'ORD-2026-98X2'}</h2>
                <div className="flex flex-wrap gap-4 text-slate-500 font-medium text-[14px]">
                  <span className="flex items-center gap-1.5"><Scissors size={14} className="text-indigo-500" /> Bespoke 3-Piece Silk Suit</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-indigo-500" /> Est. Delivery: June 15, 2026</span>
                </div>
              </div>

              {/* Shop Owner Info Card */}
              <div className="w-full md:w-[320px] bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center shrink-0">
                    <Scissors size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-[15px]">SUTURA Flagship</h3>
                    <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Shop Owner: J. Wayman</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-[13px] font-black">4.9</span>
                  </div>
                  <button className="text-[12px] font-black text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-widest">Contact Shop</button>
                </div>
              </div>

              <button 
                onClick={() => setIsTracking(false)}
                className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"
                title="Close"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-2">
                <h3 className="text-xl font-black text-slate-900 mb-8">Production Status</h3>
                <TrackingTimeline currentStatus="in_production" />
              </div>
              <div className="bg-slate-50/50 rounded-2xl p-8 border border-slate-100 h-fit">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6">Recent Movement</h4>
                <div className="space-y-6">
                  {[
                    { status: 'In Production', time: 'Today, 10:30 AM', note: 'Fabric cutting completed.' },
                    { status: 'Materials Sourced', time: 'Yesterday', note: 'Silk blend verified.' },
                    { status: 'Order Confirmed', time: 'May 10', note: 'Deposit received.' },
                  ].map((log, i) => (
                    <div key={i} className="relative pl-4 border-l-2 border-slate-200">
                      <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-slate-300"></div>
                      <p className="text-[13px] font-black text-slate-900">{log.status}</p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase">{log.time}</p>
                      <p className="text-[12px] text-slate-500 font-medium mt-1">{log.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. DISCOVERY SECTION (Shops & Designers) */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16">
          
          {/* Explore Shops */}
          <div>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Local Tailors</h2>
                <p className="text-slate-500 font-medium">Find specialized tailoring shops near you.</p>
              </div>
              <Link href="/customer/shops" className="text-[14px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group">
                View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid gap-6">
              {[
                { name: 'Davao Famous Tailoring', type: 'Classic Bespoke & Uniforms', loc: 'San Pedro St., Davao City', img: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&q=80&w=800' },
                { name: "Chard's Tailoring", type: 'Modern Tailoring & Formal Wear', loc: 'Ponciano St., Davao City', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800' }
              ].map((shop, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:shadow-lg transition-all cursor-pointer group">
                  <img src={shop.img} alt={shop.name} className="w-24 h-24 rounded-xl object-cover" />
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{shop.name}</h3>
                    <span className="text-sm text-slate-500 mb-1">{shop.type}</span>
                    <span className="text-[12px] font-bold text-slate-400">{shop.loc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meet Designers */}
          <div>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Featured Designers</h2>
                <p className="text-slate-500 font-medium">Browse portfolios and request custom blueprints.</p>
              </div>
              <Link href="/customer/designs" className="text-[14px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group">
                View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Edgar Buyan', style: 'Contemporary Ethnic', img: '/mockups/designer-edgar.png' },
                { name: 'Aztec Barba', style: 'Avant-Garde Formal', img: '/mockups/designer-aztec.png' }
              ].map((designer, i) => (
                <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
                  <img src={designer.img} alt={designer.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                  <div className="absolute bottom-0 left-0 p-5">
                    <h3 className="text-white font-black text-lg mb-1 tracking-tight">{designer.name}</h3>
                    <p className="text-indigo-300 text-[12px] font-black uppercase tracking-widest">{designer.style}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. BOOK CONSULTATION CALLOUT */}
      <section id="book" className="max-w-5xl mx-auto px-6 pb-24">
        <div className="bg-slate-900 rounded-[32px] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="text-3xl font-black text-white mb-4">Ready for something custom?</h2>
            <p className="text-slate-400 font-medium text-lg max-w-md">
              Book a walk-in fitting or online consultation with any of our Premium shops and designers.
            </p>
          </div>
          <button className="h-14 px-8 bg-white text-slate-900 font-black text-[15px] rounded-xl hover:bg-slate-100 transition-colors shrink-0 shadow-xl">
            Book Consultation
          </button>
        </div>
      </section>

    </div>
  );
}

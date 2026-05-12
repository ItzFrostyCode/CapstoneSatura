'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Search, MapPin, Star, Filter, ArrowRight, 
  Scissors, Clock, ShieldCheck, Map 
} from 'lucide-react';
import { MapModal } from '@/components/shared/MapModal';


const SHOPS = [
  {
    id: 'SH-001',
    name: 'Davao Famous Tailoring',
    type: 'Classic Bespoke & Uniforms',
    location: 'San Pedro St., Davao City',
    rating: 4.9,
    reviews: 245,
    image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&q=80&w=800',
    specialties: ['Executive Suits', 'Barong Tagalog'],
    isVerified: true,
    status: 'Open now'
  },
  {
    id: 'SH-002',
    name: "Chard's Tailoring",
    type: 'Modern Tailoring & Formal Wear',
    location: 'Ponciano St., Davao City',
    rating: 4.8,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    specialties: ['Groom Suits', 'Evening Gowns'],
    isVerified: true,
    status: 'Open now'
  },
  {
    id: 'SH-003',
    name: 'Golden Needle Tailoring',
    type: 'Specialized Alterations',
    location: 'Ilustre St., Davao City',
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800',
    specialties: ['Suit Resizing', 'Gown Restoration'],
    isVerified: true,
    status: 'Open now'
  },
  {
    id: 'SH-004',
    name: "E's Tailoring",
    type: 'Contemporary Menswear',
    location: 'Bajada, Davao City',
    rating: 4.6,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
    specialties: ['Business Casual', 'Made-to-Measure'],
    isVerified: true,
    status: 'Closes at 6 PM'
  }
];

export default function ExploreShops() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);


  return (
    <main className="min-h-screen bg-white">
      {/* 1. SEARCH & FILTER HEADER */}
      <section className="bg-slate-900 pt-32 pb-20 px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8">
            Find Your Master Tailor.
          </h1>
          <p className="text-lg text-slate-400 font-medium mb-12 max-w-2xl mx-auto">
            Browse verified tailoring shops across the Philippines. Filter by specialty, location, or rating to find the perfect match for your bespoke project.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
              <input 
                type="text" 
                placeholder="Search by shop name, city, or service..."
                className="w-full h-16 pl-14 pr-6 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 focus:bg-white focus:text-slate-900 outline-none transition-all text-lg font-bold shadow-2xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsMapModalOpen(true)}
              className="h-16 px-8 bg-white text-slate-900 rounded-2xl font-black text-[16px] flex items-center gap-3 hover:bg-slate-100 transition-all shrink-0 shadow-xl"
            >
              <Map size={20} /> View Map
            </button>
          </div>
        </div>
      </section>

      <MapModal 
        isOpen={isMapModalOpen}
        onClose={() => setIsMapModalOpen(false)}
        shops={SHOPS}
      />

      {/* 2. RESULTS GRID */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Verified Tailoring Shops</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[12px] mt-1">Showing 14 Shops in Metro Manila</p>
          </div>
          <div className="flex items-center gap-4">
             <button className="h-12 px-5 rounded-full border border-slate-200 bg-white text-slate-900 font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
                <Filter size={18} /> Filters
             </button>
             <select className="h-12 px-5 rounded-full border border-slate-200 bg-white text-slate-900 font-bold outline-none cursor-pointer">
                <option>Sort by: Recommended</option>
                <option>Highest Rated</option>
                <option>Most Reviews</option>
                <option>Lead Time (Fastest)</option>
             </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {SHOPS.map((shop) => (
            <div key={shop.id} className="group relative flex flex-col md:flex-row bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all cursor-pointer">
              {/* Image Section */}
              <div className="w-full md:w-[280px] h-[280px] relative shrink-0">
                <img src={shop.image} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                {shop.isVerified && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                    <ShieldCheck size={12} /> Verified
                  </div>
                )}
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-bold text-slate-900">
                  {shop.status}
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-8 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{shop.name}</h3>
                    <div className="flex items-center gap-2 text-slate-500 font-medium text-[14px] mt-1">
                      <MapPin size={14} className="text-indigo-500" /> {shop.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="text-[14px] font-black text-slate-900">{shop.rating}</span>
                  </div>
                </div>

                <p className="text-[14px] text-slate-500 font-medium mb-6 line-clamp-2">
                  {shop.type} specializing in {shop.specialties.join(' & ')}.
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {shop.specialties.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[12px] font-bold">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-6">
                  <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">{shop.reviews} Reviews</span>
                  <Link 
                    href="/customer/book"
                    className="flex items-center gap-2 text-[14px] font-black text-indigo-600 hover:text-indigo-700 group/link"
                  >
                    Book Appointment <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PARTNERSHIP CALLOUT */}
      <section className="max-w-7xl mx-auto px-8 pb-32">
        <div className="bg-slate-50 rounded-[48px] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12 border border-slate-100">
          <div className="w-24 h-24 bg-indigo-600 text-white rounded-[32px] flex items-center justify-center shrink-0 shadow-2xl shadow-indigo-600/20">
            <Scissors size={40} />
          </div>
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Are you a shop owner?</h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Join the SUTURA network to reach premium clients, manage your workshop with our ERP, and connect with elite designers.
            </p>
          </div>
          <Link 
            href="/register" 
            className="h-16 px-10 bg-slate-900 text-white rounded-full font-black text-[16px] hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center shrink-0 ml-auto"
          >
            List Your Shop
          </Link>
        </div>
      </section>
    </main>
  );
}

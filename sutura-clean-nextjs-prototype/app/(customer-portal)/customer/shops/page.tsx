"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, MapPin, Star, Filter, ArrowRight, 
  Scissors, Clock, ShieldCheck, Map, Sparkles
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
    <main className="min-h-screen bg-[#FAF8F5] font-poppins">
      {/* 1. SEARCH & FILTER HEADER */}
      <section className="bg-slate-900 pt-40 pb-24 px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="flex justify-center mb-6">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-blue-400 text-[12px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/10">
                <Sparkles size={14} /> Discovery Engine
             </div>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold text-[#FAF8F5] tracking-tight mb-8">
            The Master Artisan Directory
          </h1>
          <p className="text-lg text-[#FAF8F5]/60 font-medium mb-16 max-w-2xl mx-auto">
            Discover and connect with the Philippines' most distinguished tailoring houses. Curated for those who value precision and craftsmanship.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FAF8F5]/40 group-focus-within:text-blue-400 transition-colors" size={24} />
              <input 
                type="text" 
                placeholder="Search by name, city, or bespoke service..."
                className="w-full h-20 pl-16 pr-8 rounded-[24px] bg-white/5 border border-white/10 text-white placeholder:text-[#FAF8F5]/30 focus:bg-white focus:text-slate-900 outline-none transition-all text-xl font-medium shadow-2xl backdrop-blur-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsMapModalOpen(true)}
              className="h-20 px-10 bg-slate-100 text-slate-900 rounded-[24px] font-bold text-[18px] flex items-center gap-3 hover:bg-white transition-all shrink-0 shadow-xl"
            >
              <Map size={22} /> View WorkshopMap
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
      <section className="max-w-7xl mx-auto px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Verified Workshop</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[12px] mt-2 opacity-60">Showing 14 Houses in Metro Davao</p>
          </div>
          <div className="flex items-center gap-4">
             <button className="h-14 px-8 rounded-2xl border border-slate-200 bg-white text-slate-900 font-bold flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm">
                <Filter size={18} /> Filters
             </button>
             <select className="h-14 px-8 rounded-2xl border border-slate-200 bg-white text-slate-900 font-bold outline-none cursor-pointer shadow-sm">
                <option>Curated Selection</option>
                <option>Highest Rating</option>
                <option>Elite Experience</option>
                <option>Fastest Delivery</option>
             </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {SHOPS.map((shop) => (
            <div key={shop.id} className="group relative flex flex-col md:flex-row bg-white rounded-[48px] overflow-hidden border border-slate-200 hover:shadow-2xl hover:shadow-slate-900/5 transition-all duration-500 cursor-pointer">
              {/* Image Section */}
              <div className="w-full md:w-[320px] h-[320px] relative shrink-0 overflow-hidden">
                <Image 
                  src={shop.image} 
                  alt={shop.name} 
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                />
                {shop.isVerified && (
                  <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">
                    <ShieldCheck size={14} /> Satura Verified
                  </div>
                )}
                <div className="absolute bottom-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[11px] font-bold text-slate-900 border border-slate-200/50">
                  {shop.status}
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-10 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{shop.name}</h3>
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-[13px] mt-2">
                        <MapPin size={14} className="text-slate-400" /> {shop.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
                      <Star size={16} className="fill-blue-500 text-blue-500" />
                      <span className="text-[15px] font-bold text-slate-900">{shop.rating}</span>
                    </div>
                  </div>

                  <p className="text-[15px] text-slate-500 font-medium mb-8 leading-relaxed line-clamp-2">
                    {shop.type} orchestrating {shop.specialties.join(' & ')} for the discerning client.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {shop.specialties.map((s, i) => (
                      <span key={i} className="px-4 py-1.5 bg-slate-50 text-slate-900 rounded-xl text-[12px] font-bold border border-slate-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3 shrink-0">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${shop.id}${i}`} alt="user" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold text-slate-900 leading-none">{shop.reviews}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 opacity-60">Verified Reviews</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Link 
                      href={`/customer/profile/${shop.id === 'SH-001' ? 'davao-famous' : 'chard'}`}
                      className="h-12 px-6 rounded-xl text-[13px] font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all uppercase tracking-widest"
                    >
                      House Profile
                    </Link>
                    <Link 
                      href={`/customer/book?provider=${encodeURIComponent(shop.name)}`}
                      className="h-12 px-8 rounded-xl bg-slate-900 text-white text-[13px] font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 uppercase tracking-widest"
                    >
                      Book Workshop<ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PARTNERSHIP CALLOUT */}
      <section className="max-w-7xl mx-auto px-8 pb-40">
        <div className="bg-slate-900 rounded-[64px] p-16 md:p-24 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden shadow-2xl shadow-slate-900/20">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full -mr-40 -mt-40 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full -ml-40 -mb-40 blur-3xl" />
          
          <div className="w-24 h-24 bg-white/10 text-white rounded-[32px] flex items-center justify-center shrink-0 shadow-xl group-hover:rotate-12 transition-transform backdrop-blur-md border border-white/10">
            <Scissors size={48} />
          </div>
          <div className="max-w-2xl text-center md:text-left relative z-10">
            <h2 className="text-4xl font-bold text-[#FAF8F5] mb-6">List Your Distinguished House</h2>
            <p className="text-xl text-[#FAF8F5]/60 font-medium leading-relaxed">
              Join the SUTURA network to connect with high-discretion clients and orchestrate your workshop with our master ERP suite.
            </p>
          </div>
          <Link 
            href="/register" 
            className="h-16 px-12 bg-white text-slate-900 rounded-2xl font-bold text-[18px] hover:bg-slate-100 transition-all shadow-xl flex items-center justify-center shrink-0 ml-auto relative z-10"
          >
            Become a Partner
          </Link>
        </div>
      </section>
    </main>
  );
}

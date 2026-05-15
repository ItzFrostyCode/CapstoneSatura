'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, Star, Store, MapPin, 
  MessageSquare, ShoppingCart, Scissors, Search, Filter 
} from 'lucide-react';

export default function ShopsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const premiumShops = [
    { 
      name: "Golden Needle Tailoring", 
      rating: 4.9, 
      specialty: "Wedding & Formal", 
      price: "₱₱₱", 
      img: "/catalog/Golden Needle Tailoring LOGO.png",
      address: "Quirino Ave, Davao City",
      distance: "1.2km"
    },
    { 
      name: "Davao Uniform Center", 
      rating: 4.8, 
      specialty: "Corporate Uniforms", 
      price: "₱₱", 
      img: "/catalog/Davao Tailoring Shop LOGO.png",
      address: "Ponciano St, Davao City",
      distance: "2.5km"
    },
    { 
      name: "Hiyas Tailoring Studio", 
      rating: 4.7, 
      specialty: "Filipiniana & Terno", 
      price: "₱₱₱", 
      img: "/catalog/Hiyas Tailoring Studio LOGO.png",
      address: "Torres St, Davao City",
      distance: "3.1km"
    },
  ];

  return (
    <div className="min-h-screen font-outfit selection:bg-emerald-100 flex justify-center">
      {/* MOBILE CANVAS (480px) */}
      <div className="w-full max-w-[480px] min-h-screen bg-[#FAF8F5] shadow-[0_0_50px_rgba(0,0,0,0.1)] flex flex-col relative overflow-x-hidden">
        
        {/* HEADER */}
        <header className="sticky top-0 z-[3000] bg-emerald-700 pt-6 pb-4 px-6 shadow-xl">
          <div className="flex items-center gap-4 mb-5">
            <Link href="/" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-xl font-black text-white tracking-tight">Premium Shops</h1>
          </div>

          {/* SEARCH IN SHOPS */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search premium shops..." 
              className="w-full h-12 pl-12 pr-4 bg-white rounded-2xl text-[14px] font-medium outline-none focus:ring-2 focus:ring-amber-400 transition-all shadow-inner border border-white/5"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {/* SHOP LIST */}
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between px-2">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Showing 3 Tailoring Studios</p>
            <button className="flex items-center gap-2 text-emerald-600">
              <Filter size={14} />
              <span className="text-[11px] font-bold uppercase tracking-widest">Filter</span>
            </button>
          </div>

          <div className="space-y-3 pb-32">
            {premiumShops.map((shop, i) => (
              <Link 
                href="/customer/shops/1" 
                key={i} 
                className="bg-white rounded-[24px] p-3 border border-slate-100 shadow-sm hover:shadow-md hover:translate-x-1 transition-all cursor-pointer group flex items-center gap-4"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100 p-2 group-hover:scale-105 transition-transform">
                  <img src={shop.img} alt={shop.name} className="w-full h-full object-contain" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="text-[14px] font-black text-slate-900 truncate group-hover:text-emerald-700 transition-colors">{shop.name}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-black text-slate-900">{shop.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-[11px] font-medium text-slate-500 truncate">{shop.specialty}</p>
                    <div className="w-1 h-1 bg-slate-200 rounded-full" />
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Open</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 h-8 bg-emerald-50 text-emerald-700 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all">
                      Inquire
                    </button>
                    <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                      <Store size={12} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        {/* PERSISTENT FOOTER FOR CONSISTENCY */}
        <div className="p-8 text-center bg-slate-900 border-t border-white/5 pb-12">
           <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-relaxed">Connecting you to Davao&apos;s finest tailoring ecosystem.</p>
        </div>

      </div>
    </div>
  );
}

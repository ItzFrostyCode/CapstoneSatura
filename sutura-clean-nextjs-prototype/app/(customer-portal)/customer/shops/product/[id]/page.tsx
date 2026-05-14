"use client";
import Link from 'next/link';
import { Scissors, Star, ShieldCheck, ArrowRight, Ruler, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

export default function ProductDetails() {
  return (
    <main className="min-h-screen bg-[#FAF8F5] pb-24">
      <div className="max-w-[1400px] mx-auto px-8 pt-12">
        <Link href="/customer/shops" className="inline-flex items-center gap-2 text-[#78716C] text-[12px] font-bold uppercase tracking-widest mb-10 hover:text-[#1E3A1F] transition-colors">
          <ChevronLeft size={16} /> Back to Directory
        </Link>

        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Product Image Section */}
          <div className="w-full lg:w-1/2 relative h-[700px] rounded-[64px] overflow-hidden shadow-2xl group">
             <img 
               src="https://images.unsplash.com/photo-1594932224010-74f43a183543?auto=format&fit=crop&q=80&w=1200" 
               alt="Midnight Silk Gala" 
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
             />
             <div className="absolute top-10 left-10">
                <div className="bg-[#1E3A1F] text-[#C9A84C] px-6 py-2 rounded-full text-[12px] font-bold uppercase tracking-widest shadow-xl border border-white/10 backdrop-blur-md">
                   Bespoke Original
                </div>
             </div>
          </div>

          {/* Product Info Section */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
               <span className="px-4 py-1.5 bg-[#1E3A1F]/5 text-[#1E3A1F] rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#1E3A1F]/10">Davao Famous Tailoring</span>
               <div className="flex items-center gap-1.5">
                  <Star size={14} className="fill-[#C9A84C] text-[#C9A84C]" />
                  <span className="text-[13px] font-bold text-[#1C1917]">4.9 (128 Reviews)</span>
               </div>
            </div>

            <h1 className="text-6xl font-bold font-serif text-[#1C1917] tracking-tight mb-6">Midnight Silk Gala</h1>
            <p className="text-xl text-[#78716C] leading-relaxed mb-10">
              An exquisite evening wear piece featuring fine Filipino silk and master-grade bespoke tailoring. Designed for grand galas and distinguished events.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-12">
               <div className="p-6 bg-white rounded-[32px] border border-[#E2DDD7] flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FAF8F5] rounded-xl flex items-center justify-center text-[#C9A84C] shrink-0">
                     <Scissors size={20} />
                  </div>
                  <div>
                     <div className="text-[14px] font-bold text-[#1C1917]">Handcrafted</div>
                     <div className="text-[12px] text-[#78716C]">120+ hours of labor</div>
                  </div>
               </div>
               <div className="p-6 bg-white rounded-[32px] border border-[#E2DDD7] flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#FAF8F5] rounded-xl flex items-center justify-center text-[#C9A84C] shrink-0">
                     <Ruler size={20} />
                  </div>
                  <div>
                     <div className="text-[14px] font-bold text-[#1C1917]">Bespoke Sizing</div>
                     <div className="text-[12px] text-[#78716C]">Guided fitting process</div>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <Link 
                 href={`/customer/shops/product/123/size`} 
                 className="h-20 bg-[#1E3A1F] text-[#C9A84C] rounded-[24px] font-bold text-[18px] flex items-center justify-center gap-3 hover:bg-[#1C1917] transition-all shadow-xl shadow-[#1E3A1F]/20 active:scale-95 group"
               >
                 Commence Sizing Process <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
               </Link>
               <div className="flex items-center justify-center gap-2 text-[12px] text-[#78716C] font-bold uppercase tracking-widest pt-4">
                  <ShieldCheck size={14} className="text-[#1E3A1F]" />
                  Secure Satura Sizing Escrow Active
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";
import Link from 'next/link';
import { Scissors, Star, ShieldCheck, ArrowRight, Ruler, ChevronLeft } from 'lucide-react';
import Image from 'next/image';

export default function ProductDetails() {
  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-poppins">
      <div className="max-w-[1400px] mx-auto px-8 pt-12">
        <Link href="/customer/shops" className="inline-flex items-center gap-2 text-slate-400 text-[12px] font-black uppercase tracking-widest mb-10 hover:text-slate-900 transition-colors">
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
                <div className="bg-slate-900 text-blue-400 px-6 py-2 rounded-full text-[12px] font-black uppercase tracking-widest shadow-xl border border-white/10 backdrop-blur-md">
                   Bespoke Original
                </div>
             </div>
          </div>

          {/* Product Info Section */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
               <span className="px-4 py-1.5 bg-slate-900/5 text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-900/10">Davao Famous Tailoring</span>
               <div className="flex items-center gap-1.5">
                  <Star size={14} className="fill-blue-500 text-blue-500" />
                  <span className="text-[13px] font-black text-slate-900">4.9 (128 Reviews)</span>
               </div>
            </div>

            <h1 className="text-6xl font-black text-slate-900 tracking-tight mb-6 uppercase">Midnight Silk Gala</h1>
            <p className="text-xl text-slate-500 leading-relaxed mb-10 font-medium">
              An exquisite evening wear piece featuring fine Filipino silk and master-grade bespoke tailoring. Designed for grand galas and distinguished events.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-12">
               <div className="p-6 bg-white rounded-[32px] border border-slate-200 flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                     <Scissors size={20} />
                  </div>
                  <div>
                     <div className="text-[14px] font-black text-slate-900 uppercase">Handcrafted</div>
                     <div className="text-[12px] text-slate-400 font-bold">120+ hours of labor</div>
                  </div>
               </div>
               <div className="p-6 bg-white rounded-[32px] border border-slate-200 flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                     <Ruler size={20} />
                  </div>
                  <div>
                     <div className="text-[14px] font-black text-slate-900 uppercase">Bespoke Sizing</div>
                     <div className="text-[12px] text-slate-400 font-bold">Guided fitting process</div>
                  </div>
               </div>
            </div>

            <div className="space-y-4">
               <Link 
                 href={`/customer/shops/product/123/size`} 
                 className="h-20 bg-slate-900 text-blue-400 rounded-[24px] font-black text-[18px] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 group uppercase tracking-widest"
               >
                 Commence Sizing Process <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
               </Link>
               <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-black uppercase tracking-widest pt-4">
                  <ShieldCheck size={14} className="text-blue-600" />
                  Secure Satura Sizing Escrow Active
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

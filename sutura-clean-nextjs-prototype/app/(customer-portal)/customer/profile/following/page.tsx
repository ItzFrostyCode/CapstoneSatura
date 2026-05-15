'use client';

import { useERPStore } from "@/store/useERPStore";
import { useMemo } from 'react';
import { 
  Heart, ArrowLeft, Star, MapPin, 
  ChevronRight, Scissors, Store
} from 'lucide-react';
import Link from 'next/link';

export default function MyFollowingPage() {
  const { followedShops } = useERPStore();

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-32 animate-in fade-in duration-500">
      {/* ── HEADER ── */}
      <div className="bg-white border-b border-slate-100 px-6 pt-12 pb-8 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
           <Link href="/customer/dashboard" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
              <ArrowLeft size={20} />
           </Link>
           <div>
              <h1 className="text-[24px] font-black text-slate-900 tracking-tight">Following</h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Favorite Tailoring Studios</p>
           </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        
        {/* SHOP LIST */}
        <div className="space-y-4">
           {(followedShops || []).length === 0 ? (
             <div className="text-center py-20 bg-white border border-slate-100 rounded-[40px] border-dashed">
                <Store size={48} className="text-slate-100 mx-auto mb-4" />
                <p className="text-[13px] font-bold text-slate-300 uppercase tracking-widest">You aren't following any shops yet</p>
             </div>
           ) : (
             followedShops.map(shopId => (
               <div key={shopId} className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-all">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-slate-50 rounded-[22px] flex items-center justify-center text-slate-300 border border-slate-100 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                        <img src="/catalog/Golden Needle Tailoring LOGO.png" className="w-10 h-10 object-contain" />
                     </div>
                     <div>
                        <h4 className="text-[18px] font-black text-slate-900 tracking-tight">Golden Needle Tailoring</h4>
                        <div className="flex items-center gap-4 mt-1">
                           <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-500">
                              <Star size={14} className="fill-amber-500" /> 4.9
                           </div>
                           <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                              <MapPin size={14} /> Davao City
                           </div>
                        </div>
                     </div>
                  </div>
                  <Link href={`/customer/shops/${shopId}`} className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all">
                     <ChevronRight size={24} />
                  </Link>
               </div>
             ))
           )}
        </div>

        {/* EXPLORE SUGGESTION */}
        <div className="pt-8 border-t border-slate-50">
           <h3 className="text-[14px] font-black text-slate-900 mb-4 uppercase tracking-widest text-center">Discover More Studios</h3>
           <div className="grid grid-cols-1 gap-4">
              <Link href="/customer/shops" className="h-20 bg-white border border-slate-100 rounded-[28px] flex items-center justify-center gap-4 shadow-sm hover:border-slate-300 transition-all">
                 <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Scissors size={20} />
                 </div>
                 <span className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Browse Local Tailors</span>
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}

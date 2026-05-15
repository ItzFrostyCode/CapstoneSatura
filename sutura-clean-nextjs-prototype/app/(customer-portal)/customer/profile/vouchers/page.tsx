'use client';

import { useERPStore } from "@/store/useERPStore";
import { useMemo } from 'react';
import { 
  Ticket, ArrowLeft, Gift, Search, 
  ChevronRight, Clock, Star, Percent
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function MyVouchersPage() {
  const { currentUser } = useERPStore();

  const vouchers = [
    { id: 'SUT-WELCOME', title: 'Welcome Reward', desc: 'Special discount for first-time premium tailoring.', value: '₱500 OFF', color: 'bg-emerald-600', code: 'HELLO500' },
    { id: 'SUT-FITTING', title: 'Free Consultation', desc: 'Valid for one initial bespoke design session.', value: '100% OFF', color: 'bg-indigo-600', code: 'FREEFITTING' },
    { id: 'SUT-LOYAL', title: 'Loyalty Credit', desc: 'Active for customers with 2+ completed orders.', value: '₱1,500 OFF', color: 'bg-rose-600', code: 'LOYALTY15' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-32 animate-in fade-in duration-500">
      {/* ── HEADER ── */}
      <div className="bg-white border-b border-slate-100 px-6 pt-12 pb-8 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
           <Link href="/customer/profile" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
              <ArrowLeft size={20} />
           </Link>
           <div>
              <h1 className="text-[24px] font-black text-slate-900 tracking-tight">My Vouchers</h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Exclusive Benefits & Credits</p>
           </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        
        {/* PROMO INPUT */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-2 shadow-sm flex items-center overflow-hidden">
           <input placeholder="Enter promo code..." className="flex-1 h-14 bg-transparent px-6 text-[14px] font-medium outline-none" />
           <button className="h-14 px-8 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
              Claim
           </button>
        </div>

        {/* VOUCHER LIST */}
        <div className="space-y-6">
           {vouchers.map(v => (
             <div key={v.id} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex group hover:shadow-xl hover:border-slate-300 transition-all">
                <div className={`w-32 ${v.color} flex flex-col items-center justify-center p-4 text-white relative shrink-0`}>
                   <div className="absolute top-0 bottom-0 left-full w-4 flex flex-col justify-around py-4">
                      {[...Array(8)].map((_, j) => <div key={j} className="w-2 h-2 rounded-full bg-white -ml-1" />)}
                   </div>
                   <Percent size={24} className="mb-2" />
                   <span className="text-[9px] font-black uppercase tracking-tighter text-center leading-none">OFFICIAL<br/>REWARD</span>
                </div>
                <div className="flex-1 p-8">
                   <div className="flex justify-between items-start mb-1">
                      <h3 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">{v.value}</h3>
                      <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300 group-hover:text-slate-900 transition-all">
                         <ChevronRight size={20} />
                      </button>
                   </div>
                   <p className="text-[14px] font-black text-slate-900">{v.title}</p>
                   <p className="text-[12px] font-medium text-slate-400 mt-1 leading-relaxed">{v.desc}</p>
                   
                   <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                      <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-2">
                         <span className="text-[10px] font-black text-slate-400">CODE:</span>
                         <span className="text-[11px] font-black text-slate-900 tracking-widest">{v.code}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Exp: Jun 30</span>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

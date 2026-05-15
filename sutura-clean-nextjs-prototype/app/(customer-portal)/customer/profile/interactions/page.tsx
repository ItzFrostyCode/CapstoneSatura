'use client';

import { useERPStore } from "@/store/useERPStore";
import { useMemo } from 'react';
import { 
  Activity, ArrowLeft, Heart, MessageSquare, 
  Calendar, ShoppingBag, Search, Clock, ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

export default function MyInteractionsPage() {
  const { currentUser } = useERPStore();

  const activities = [
    { type: 'heart', label: "Hearted 'Classic Barong'", shop: "Elena Roxas Design", time: "2 hours ago", icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
    { type: 'book', label: "Booked Fitting Session", shop: "Golden Needle Studio", time: "Yesterday", icon: Calendar, color: "text-emerald-500", bg: "bg-emerald-50" },
    { type: 'message', label: "Inquired about Bespoke Suit", shop: "Lara Tailoring", time: "3 days ago", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-50" },
    { type: 'reserve', label: "Reserved Modern Piña RTW", shop: "Marco's Premium", time: "1 week ago", icon: ShoppingBag, color: "text-amber-500", bg: "bg-amber-50" },
    { type: 'view', label: "Viewed 'The Heritage' Collection", shop: "Elena Roxas Design", time: "2 weeks ago", icon: Activity, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-32 animate-in fade-in duration-500">
      {/* ── HEADER ── */}
      <div className="bg-white border-b border-slate-100 px-6 pt-12 pb-8 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
           <Link href="/customer/dashboard" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
              <ArrowLeft size={20} />
           </Link>
           <div>
              <h1 className="text-[24px] font-black text-slate-900 tracking-tight">Interactions</h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Platform Activity History</p>
           </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        
        {/* TIMELINE VIEW */}
        <div className="relative">
           {/* Timeline Line */}
           <div className="absolute left-10 top-0 bottom-0 w-px bg-slate-100" />
           
           <div className="space-y-12">
              {activities.map((act, i) => (
                <div key={i} className="relative flex items-start gap-8 group">
                   <div className={`w-20 h-20 rounded-[32px] ${act.bg} ${act.color} flex items-center justify-center shrink-0 shadow-sm border border-white z-10 group-hover:scale-110 transition-transform`}>
                      <act.icon size={28} />
                   </div>
                   <div className="flex-1 pt-2">
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="text-[17px] font-black text-slate-900 tracking-tight">{act.label}</h3>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock size={12} /> {act.time}
                         </span>
                      </div>
                      <p className="text-[13px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-4">{act.shop}</p>
                      
                      <button className="h-12 px-6 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm hover:border-slate-900 transition-all group/btn w-full md:w-auto md:inline-flex md:gap-8">
                         <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">View Details</span>
                         <ChevronRight size={16} className="text-slate-300 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

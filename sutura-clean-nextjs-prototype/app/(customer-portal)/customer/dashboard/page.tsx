'use client';

import { useERPStore } from "@/store/useERPStore";
import Link from 'next/link';
import { useMemo } from 'react';
import { 
  Calendar, Ruler, Ticket, Activity, 
  ChevronRight, Clock, Heart, Package, 
  Plus, Scissors, TrendingUp, 
  CreditCard, Shield, Map, ArrowUpRight,
  User, ShoppingBag
} from 'lucide-react';
import { resolveOrderState } from "@/features/orders/orderEngine";
import { format } from 'date-fns';

export default function NativeAppDashboard() {
  const { 
    currentUser, 
    orders, 
    appointments 
  } = useERPStore();

  // 1. DATA SUMMARY
  const activeOrders = useMemo(() => (orders || []).filter(o => o.customer_id === currentUser?.id && o.status !== 'RELEASED'), [orders, currentUser]);
  
  const latestOrderState = useMemo(() => {
    if (activeOrders.length === 0) return null;
    return resolveOrderState(activeOrders[0]);
  }, [activeOrders]);

  const nextAppointment = useMemo(() => (appointments || [])
    .filter(a => a.email === currentUser?.email && a.status === 'Scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0], [appointments, currentUser]);
  
  const totalBalance = useMemo(() => activeOrders.reduce((sum, o) => {
    const { balance } = resolveOrderState(o);
    return sum + balance;
  }, 0), [activeOrders]);

  const mainNav = [
    { label: 'Measurements', icon: User, href: '/customer/profile/sizes' },
    { label: 'Reservation', icon: ShoppingBag, href: '/customer/profile/reservations' },
    { label: 'Appointments', icon: Calendar, href: '/customer/profile/appointments' },
    { label: 'Job Orders', icon: Package, href: '/customer/profile/orders' },
  ];

  return (
    <div className="min-h-screen bg-white pb-32 animate-in fade-in duration-500">
      {/* ── NATIVE HEADER ── */}
      <div className="bg-white px-6 pt-12 pb-6 sticky top-0 z-[100]">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-[18px] font-black border-2 border-slate-50 overflow-hidden shadow-sm shrink-0">
             {currentUser?.avatar ? <img src={currentUser.avatar} className="w-full h-full object-cover" /> : currentUser?.name?.charAt(0)}
          </div>
          <div>
            <h1 className="text-[22px] font-black text-slate-900 tracking-tight leading-none">{currentUser?.name || 'John Clock'}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        {/* ── HIGHLIGHTS (ULTRA-COMPACT) ── */}
        <div className="px-6 py-4 space-y-2">
           {/* Active Order (Slim Bar) */}
           <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order:</span>
                 <span className="text-[12px] font-black text-slate-900">
                    {latestOrderState ? latestOrderState.customerMilestone : 'No active orders'}
                 </span>
              </div>
              {latestOrderState && (
                <span className="text-[11px] font-black text-emerald-600">{latestOrderState.progress}%</span>
              )}
           </div>

           {/* Next Fitting & Balance (Mini-Grid) */}
           <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex flex-col gap-0.5">
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Next Session</span>
                 <span className="text-[12px] font-black text-slate-900 leading-none">
                    {nextAppointment ? format(new Date(nextAppointment.date), 'MMM d') : 'None Set'}
                 </span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 flex flex-col gap-0.5">
                 <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">To Pay</span>
                 <span className="text-[12px] font-black text-emerald-600 leading-none">₱{totalBalance.toLocaleString()}</span>
              </div>
           </div>
        </div>

        {/* ── SECTION: MY TAILORING (COMPACT QUICK ACCESS) ── */}
        <div className="mt-4 pt-4 border-t border-slate-50">
           <div className="px-6 mb-4">
              <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">My Tailoring</h3>
           </div>
           <div className="flex justify-around items-center px-4 py-4">
              {mainNav.map(item => (
                <Link key={item.href} href={item.href} className="flex flex-col items-center gap-2.5 transition-all active:scale-90 px-3">
                   <div className="text-slate-400 group-hover:text-slate-900 transition-colors">
                      <item.icon size={22} strokeWidth={2.5} />
                   </div>
                   <span className="text-[11px] font-bold text-slate-400 tracking-tight">{item.label}</span>
                </Link>
              ))}
           </div>
        </div>

        {/* ── SECONDARY LINKS (LIST STYLE) ── */}
        <div className="mt-8 px-4 space-y-1">
           <SecondaryNavLink icon={Ticket} label="Support Tickets" href="/customer/profile/support" count={2} />
           <SecondaryNavLink icon={Scissors} label="Followed Shops" href="/customer/profile/following" />
           <SecondaryNavLink icon={Activity} label="Activity History" href="/customer/profile/interactions" />
        </div>

        {/* ── SETTINGS (MINIMALIST) ── */}
        <div className="mt-4 px-4 pt-4 border-t border-slate-50">
           <Link href="/customer/profile" className="flex items-center gap-5 p-4 rounded-[24px] hover:bg-slate-50 transition-all group">
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-colors">
                 <Shield size={18} />
              </div>
              <div className="flex-1">
                 <p className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Account & Security</p>
                 <p className="text-[10px] font-bold text-slate-400">Profile, password, and addresses</p>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
           </Link>
        </div>
      </div>
    </div>
  );
}

function SecondaryNavLink({ icon: Icon, label, href, count }: { icon: any; label: string; href: string; count?: number }) {
  return (
    <Link href={href} className="flex items-center justify-between p-5 rounded-[24px] hover:bg-slate-50 transition-all group">
       <div className="flex items-center gap-5">
          <div className="text-slate-400 group-hover:text-slate-900 transition-colors">
             <Icon size={20} />
          </div>
          <span className="text-[13px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{label}</span>
       </div>
       <div className="flex items-center gap-3">
          {count && <span className="w-5 h-5 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{count}</span>}
          <ChevronRight size={16} className="text-slate-300" />
       </div>
    </Link>
  );
}

'use client';

import React from 'react';
import { 
  Building2, Users, Receipt, 
  CreditCard, TrendingUp, ShieldCheck, 
  ArrowUpRight, Activity
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    { label: 'Monthly Recurring Revenue', value: '₱145,500', icon: <TrendingUp size={20} />, color: 'bg-emerald-50 text-emerald-600', trend: '+12% this month' },
    { label: 'Total Subscriptions', value: '48', icon: <Receipt size={20} />, color: 'bg-indigo-50 text-indigo-600', trend: 'Active plans' },
    { label: 'Active Tenants', value: '42', icon: <Building2 size={20} />, color: 'bg-amber-50 text-amber-600', trend: 'Shops & Designers' },
    { label: 'Premium Users', value: '18', icon: <CreditCard size={20} />, color: 'bg-slate-900 text-white', trend: 'Pro & Premium' },
  ];

  return (
    <div className="space-y-10 font-outfit pb-10">
      
      {/* ── DASHBOARD HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Platform Overview</h1>
          <p className="text-lg font-medium text-slate-500 mt-1">Subscription management and business oversight.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/verification">
            <button className="px-6 py-3.5 bg-white border-2 border-slate-100 rounded-2xl font-black text-sm hover:border-slate-900 transition-all flex items-center gap-2">
               <ShieldCheck size={18} /> Review Verifications
            </button>
          </Link>
        </div>
      </div>

      {/* ── KPI GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.trend}</div>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
            <div className="text-sm font-bold text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* ── LEFT: PENDING VERIFICATIONS ── */}
        <div className="lg:col-span-7 bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                 <ShieldCheck size={24} className="text-indigo-600" /> Pending Approvals
              </h2>
              <Link href="/admin/verification" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">View Queue</Link>
           </div>

           <div className="space-y-4">
              {[
                { name: 'Golden Needle Tailoring', type: 'Shop Owner', date: 'Submitted Today', status: 'Awaiting KYC' },
                { name: 'Elena Designs', type: 'Fashion Designer', date: 'Submitted Yesterday', status: 'Awaiting Portfolio Review' },
                { name: 'Luxe Stitch Studio', type: 'Shop Owner', date: '2 days ago', status: 'Awaiting KYC' }
              ].map((tenant, i) => (
                <div key={i} className="group p-5 bg-slate-50 rounded-[28px] border border-transparent hover:border-slate-100 hover:bg-white transition-all flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                         <Building2 size={20} />
                      </div>
                      <div>
                         <div className="font-black text-slate-900 text-sm">{tenant.name}</div>
                         <div className="text-xs font-bold text-slate-400 mt-0.5">{tenant.type}</div>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="hidden md:block text-right">
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{tenant.date}</div>
                         <div className="text-[10px] font-bold text-indigo-600 leading-none">{tenant.status}</div>
                      </div>
                      <button className="w-10 h-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                         <ArrowUpRight size={18} />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* ── RIGHT: PLATFORM SUMMARY ── */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="relative z-10">
                 <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                   <Activity size={14} /> System Operational
                 </div>
                 <h3 className="text-xl font-black mb-2">95% Renewal Rate</h3>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    Business retention is performing above the 90% benchmark. Subscription renewals are tracking on schedule for the current quarter.
                 </p>
                 <Link href="/admin/audit">
                   <button className="mt-6 px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-xs hover:bg-slate-50 transition-all flex items-center gap-2">
                      View Audit Logs <ArrowUpRight size={14} />
                   </button>
                 </Link>
              </div>
           </div>

           <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-black text-slate-900">Recent Subscriptions</h3>
                 <Receipt size={18} className="text-slate-300" />
              </div>
              <div className="space-y-6">
                 {[
                   { name: 'Metro Threads', plan: 'Premium Plan', amount: '₱4,999' },
                   { name: 'Studio S', plan: 'Pro Plan', amount: '₱2,499' }
                 ].map((sub, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                            <CreditCard size={16} className="text-slate-400" />
                         </div>
                         <div>
                            <div className="text-sm font-black text-slate-900">{sub.name}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{sub.plan}</div>
                         </div>
                      </div>
                      <div className="font-black text-sm text-indigo-600">{sub.amount}</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

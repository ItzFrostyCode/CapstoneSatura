'use client';

import { Check, CreditCard } from 'lucide-react';

export default function SubscriptionPage() {
  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none mb-2">Subscription & Billing</h1>
        <p className="text-[14px] text-slate-500 font-medium">Manage your plan, billing cycle, and payment methods.</p>
      </div>

      {/* ── CURRENT ACTIVE PLAN HEADER ── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 mb-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
            <CreditCard size={28} strokeWidth={2} />
          </div>
          <div>
            <div className="text-[12px] font-bold text-slate-500 mb-1">Current Active Plan</div>
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-black text-slate-900 leading-none tracking-tight">Pro Plan</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-10 md:gap-16">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Subscribed On</div>
            <div className="text-[15px] font-black text-slate-900">Mar 01, 2026</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Next Renewal</div>
            <div className="text-[15px] font-black text-slate-900">May 01, 2026</div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Monthly Cost</div>
            <div className="text-[16px] font-black text-indigo-600">₱749.00</div>
          </div>
        </div>
      </div>

      {/* ── PRICING TIERS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Basic Plan */}
        <div className="bg-white border-2 border-slate-200 rounded-[32px] p-8 flex flex-col hover:border-slate-300 transition-colors">
          <div className="mb-8">
            <h3 className="text-[22px] font-black text-slate-900 tracking-tight mb-4">Basic</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-[40px] font-black text-slate-900 tracking-tighter leading-none">₱249</span>
              <span className="text-[14px] font-bold text-slate-500">/ month</span>
            </div>
          </div>

          <div className="space-y-4 mb-10 flex-1">
            <div className="flex items-start gap-3">
              <Check size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={3} />
              <span className="text-[14px] font-medium text-slate-600">Unlimited orders</span>
            </div>
            <div className="flex items-start gap-3">
              <Check size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={3} />
              <span className="text-[14px] font-medium text-slate-600">Create/view customer profiles</span>
            </div>
            <div className="flex items-start gap-3">
              <Check size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={3} />
              <span className="text-[14px] font-medium text-slate-600">Manual job order tracking</span>
            </div>
            <div className="flex items-start gap-3">
              <Check size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={3} />
              <span className="text-[14px] font-medium text-slate-600">Physical receipt printing</span>
            </div>
          </div>

          <button className="w-full py-4 rounded-2xl border-2 border-slate-200 text-slate-900 text-[14px] font-black hover:bg-slate-50 transition-colors">
            Downgrade Plan
          </button>
        </div>

        {/* Pro Plan (Active) */}
        <div className="bg-white border-2 border-indigo-500 rounded-[32px] p-8 flex flex-col shadow-xl shadow-indigo-500/10 relative">
          {/* Active Glow */}
          <div className="absolute -top-4 -left-4 -right-4 -bottom-4 bg-indigo-500/5 rounded-[40px] -z-10 blur-xl"></div>
          
          <div className="mb-8">
            <h3 className="text-[22px] font-black text-slate-900 tracking-tight mb-4">Pro</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-[40px] font-black text-slate-900 tracking-tighter leading-none">₱749</span>
              <span className="text-[14px] font-bold text-slate-500">/ month</span>
            </div>
          </div>

          <div className="space-y-4 mb-10 flex-1">
            <div className="flex items-start gap-3">
              <Check size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={3} />
              <span className="text-[14px] font-medium text-slate-600">Unlimited orders</span>
            </div>
            <div className="flex items-start gap-3">
              <Check size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={3} />
              <span className="text-[14px] font-medium text-slate-600">All Basic features</span>
            </div>
            <div className="flex items-start gap-3">
              <Check size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={3} />
              <span className="text-[14px] font-medium text-slate-600">Inventory and supplier management</span>
            </div>
            <div className="flex items-start gap-3">
              <Check size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={3} />
              <span className="text-[14px] font-medium text-slate-600">Digital invoice generation</span>
            </div>
          </div>

          <button className="w-full py-4 rounded-2xl bg-slate-100 text-slate-400 text-[14px] font-black cursor-not-allowed">
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-white border-2 border-slate-200 border-t-[6px] border-t-indigo-500 rounded-[32px] p-8 flex flex-col hover:border-slate-300 transition-colors">
          <div className="mb-8">
            <h3 className="text-[22px] font-black text-slate-900 tracking-tight mb-4">Premium</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-[40px] font-black text-slate-900 tracking-tighter leading-none">₱1,299</span>
              <span className="text-[14px] font-bold text-slate-500">/ month</span>
            </div>
          </div>

          <div className="space-y-4 mb-10 flex-1">
            <div className="flex items-start gap-3">
              <Check size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={3} />
              <span className="text-[14px] font-medium text-slate-600">Unlimited orders</span>
            </div>
            <div className="flex items-start gap-3">
              <Check size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={3} />
              <span className="text-[14px] font-medium text-slate-600">All Pro features</span>
            </div>
            <div className="flex items-start gap-3">
              <Check size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={3} />
              <span className="text-[14px] font-medium text-slate-600">Multi-branch support</span>
            </div>
            <div className="flex items-start gap-3">
              <Check size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={3} />
              <span className="text-[14px] font-medium text-slate-600">Advanced analytics & audit logs</span>
            </div>
            <div className="flex items-start gap-3">
              <Check size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={3} />
              <span className="text-[14px] font-medium text-slate-600">SMS & email notifications</span>
            </div>
            <div className="flex items-start gap-3">
              <Check size={18} className="text-slate-400 shrink-0 mt-0.5" strokeWidth={3} />
              <span className="text-[14px] font-medium text-slate-600">Priority support</span>
            </div>
          </div>

          <button className="w-full py-4 rounded-2xl bg-indigo-500 text-white text-[14px] font-black hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20">
            Upgrade Plan
          </button>
        </div>

      </div>
    </div>
  );
}

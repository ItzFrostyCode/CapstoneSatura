"use client";
import { useState } from 'react';
import { 
  Check, 
  Zap, 
  Crown, 
  Clock,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState('premium');

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '149',
      description: 'The smallest usable shop version for core operations.',
      icon: <Clock className="text-stone-500" size={24} />,
      features: [
        'Create/view customer profiles',
        'Manual job order tracking',
        'Physical receipt printing',
        'Manual digital appointment calendar',
        'Daily sales summary',
        'Simple admin dashboard'
      ],
      color: 'stone'
    },
    {
      id: 'pro',
      name: 'Pro Plan',
      price: '299',
      description: 'Operational automation for the growing studio.',
      icon: <Zap className="text-emerald-700" size={24} />,
      features: [
        'Inventory & supplier management',
        'Automated email/SMS notifications',
        'Digital invoice generation',
        'Automated appointment reminders',
        'Detailed inventory & financial reports',
        'Role-based access control'
      ],
      popular: true,
      color: 'emerald'
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '499',
      description: 'Full ERP-style shop management for established brands.',
      icon: <Crown className="text-amber-500" size={24} />,
      features: [
        'Create/view posted products',
        'Customized shop profile',
        'Multi-branch support',
        'Multi-branch analytics',
        'Administrative audit logs'
      ],
      color: 'amber'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 max-w-[1400px] mx-auto px-10 pt-8">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-[36px] font-black text-slate-900 tracking-tight leading-none uppercase">SUBSCRIPTION TIERS</h1>
          <p className="text-[14px] text-slate-500 mt-3 font-bold">Scaling your craftsmanship with precision digital tools.</p>
        </div>
        <Link href="/shop-owner/production" className="inline-flex items-center gap-2 text-[13px] font-black text-slate-600 hover:text-slate-900 transition-all bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm">
          <ChevronLeft size={16} /> Back to Workshop
        </Link>
      </div>

      {/* ── PRICING GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`relative bg-white rounded-[48px] p-10 shadow-2xl border-4 transition-all duration-500 cursor-pointer hover:scale-[1.02] flex flex-col ${
              selectedPlan === plan.id ? 'border-indigo-600 shadow-indigo-100' : 'border-transparent hover:border-slate-100'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap z-10">
                Most Popular Choice
              </div>
            )}

            <div className="space-y-8 flex-1 text-left">
              <div className="flex items-center justify-between">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${plan.id === 'pro' ? 'bg-emerald-50' : plan.id === 'premium' ? 'bg-amber-50' : 'bg-slate-50'}`}>
                  {plan.icon}
                </div>
                {selectedPlan === plan.id && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-[40px] font-black text-slate-900">₱{plan.price}</span>
                  <span className="text-sm text-slate-400 font-bold">/ month</span>
                </div>
              </div>

              <p className="text-[15px] text-slate-500 leading-relaxed font-medium">
                {plan.description}
              </p>

              <div className="space-y-4 pt-8 border-t border-slate-50">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Check size={12} />
                    </div>
                    <span className="text-xs font-black text-slate-600 tracking-tight">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className={`w-full h-16 rounded-[24px] text-[15px] font-black transition-all mt-10 ${
                selectedPlan === plan.id
                  ? 'bg-slate-100 text-slate-400 cursor-default'
                  : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-xl shadow-slate-900/10 active:scale-95'
              }`}
            >
              {selectedPlan === plan.id ? 'Currently Active' : 'Upgrade to Plan'}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
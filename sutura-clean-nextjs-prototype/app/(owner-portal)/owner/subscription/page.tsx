'use client';

import { useState } from 'react';
import { 
  Check, 
  Zap, 
  Crown, 
  Rocket, 
  ShieldCheck, 
  TrendingUp,
  Clock,
  ChevronLeft,
  User
} from 'lucide-react';
import Link from 'next/link';

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState('premium');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'BASIC PLAN',
      price: '149',
      description: 'Essential toolkit for manual shop management.',
      icon: <Clock className="text-slate-400" size={24} />,
      features: [
        'Create/view customer profiles',
        'Manual job order tracking',
        'Physical receipt printing',
        'Manual digital appointment calendar',
        'Basic daily sales summaries & simple admin dashboard'
      ],
      color: 'slate',
      buttonText: 'Current Plan',
    },
    {
      id: 'pro',
      name: 'PRO PLAN',
      price: '299',
      description: 'Advanced automation for growing businesses.',
      icon: <Zap className="text-indigo-600" size={24} />,
      features: [
        'Includes everything in Basic Plan plus',
        'Inventory and supplier management',
        'Automated Email/SMS notifications',
        'Digital invoice generation',
        'Automated appointment reminders',
        'Detailed inventory/financial reports & role-based access control'
      ],
      popular: true,
      color: 'indigo',
      buttonText: 'Upgrade to Pro',
    },
    {
      id: 'premium',
      name: 'PREMIUM PLAN',
      price: '499',
      description: 'The ultimate enterprise solution.',
      icon: <Crown className="text-amber-500" size={24} />,
      features: [
        'Includes everything in Pro Plan plus ',
        'Create/view posted products',
        'Customized shop profile'
      ],
      color: 'amber',
      buttonText: 'Currently Active',
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* ── HEADER ── */}
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Subscription Plans</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Scale your tailoring business with our modular ERP solutions.</p>
        </div>
        <Link href="/owner/settings" className="inline-flex items-center gap-2 text-[13px] font-black text-slate-400 hover:text-slate-900 transition-colors group bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Settings
        </Link>
      </div>

      {/* ── PRICING GRID ── */}
      <div className="max-w-full pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-white rounded-[40px] p-8 shadow-xl border-2 transition-all duration-500 hover:scale-[1.02] flex flex-col ${
                plan.id === currentPlan 
                  ? 'border-indigo-600 shadow-indigo-100' 
                  : 'border-transparent hover:border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-indigo-200 whitespace-nowrap z-10">
                  Most Popular
                </div>
              )}

              <div className="space-y-6 flex-1">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    plan.id === 'pro' ? 'bg-indigo-50' : plan.id === 'premium' ? 'bg-amber-50' : 'bg-slate-100'
                  }`}>
                    {plan.icon}
                  </div>
                  {plan.id === currentPlan && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">
                      <ShieldCheck size={12} /> Active Plan
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-[20px] font-black text-slate-900 tracking-tight uppercase">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-[32px] font-black text-slate-900">₱{plan.price}</span>
                    <span className="text-[14px] text-slate-400 font-bold">/month</span>
                  </div>
                </div>

                <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                  {plan.description}
                </p>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        plan.id === 'pro' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Check size={12} />
                      </div>
                      <span className={`text-[13px] font-bold ${feature.includes('Everything in') ? 'text-indigo-600' : 'text-slate-600'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                disabled={plan.id === currentPlan}
                className={`w-full h-12 rounded-2xl text-[14px] font-black transition-all mt-8 ${
                  plan.id === currentPlan
                    ? 'bg-slate-100 text-slate-400 cursor-default'
                    : plan.id === 'pro'
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100'
                      : plan.id === 'premium'
                        ? 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200'
                        : 'bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50'
                }`}
              >
                {plan.id === currentPlan ? 'Currently Active' : plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* ── FOOTER INFO ── */}
        <div className="max-w-4xl mx-auto mt-20 text-center space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <TrendingUp size={20} />
              </div>
              <div>
                <div className="text-[14px] font-black text-slate-900">Scalable Infrastructure</div>
                <div className="text-[12px] text-slate-500 font-medium">Upgrade anytime as you grow.</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShieldCheck size={20} />
              </div>
              <div>
                <div className="text-[14px] font-black text-slate-900">Secure Payments</div>
                <div className="text-[12px] text-slate-500 font-medium">Encrypted billing cycles.</div>
              </div>
            </div>
          </div>
          
          <p className="text-[12px] text-slate-400 font-medium italic">
            Prices are inclusive of VAT. Subscriptions renew automatically. Cancel anytime before the next billing cycle.
          </p>
        </div>
      </div>

      {/* ── CONGRATULATIONS MODAL ── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white rounded-[40px] w-full max-w-xl p-12 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden text-center">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50" />
            
            <div className="relative z-10 space-y-8">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={40} />
              </div>

              <div className="space-y-4">
                <h2 className="text-[36px] font-black text-slate-900 tracking-tight leading-tight">
                  Congratulations!
                </h2>
                <p className="text-[16px] text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                  Your account has been successfully validated by our admin team. You are now part of the <span className="text-indigo-600 font-bold">Sutura premium network</span>.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4">
                <Link 
                  href="/setup/welcome"
                  className="w-full h-14 bg-indigo-600 text-white rounded-2xl text-[15px] font-black flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95"
                >
                  <User size={18} /> Set Up Your Team
                </Link>
                <Link 
                  href="/owner/dashboard"
                  className="w-full h-14 text-slate-500 rounded-2xl text-[14px] font-black flex items-center justify-center hover:bg-slate-50 transition-all"
                >
                  Skip to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
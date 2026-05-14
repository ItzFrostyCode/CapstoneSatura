'use client';
import { useState } from 'react';
import { Check, Crown, Zap, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export function SubscriptionTab() {
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
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            onClick={() => setSelectedPlan(plan.id)}
            className={`relative bg-white rounded-[40px] p-8 shadow-2xl border-4 transition-all duration-500 cursor-pointer hover:scale-[1.02] flex flex-col ${
              selectedPlan === plan.id ? 'border-indigo-600 shadow-indigo-100' : 'border-transparent hover:border-slate-100'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap z-10">
                Most Popular Choice
              </div>
            )}
            <div className="space-y-6 flex-1 text-left">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${plan.id === 'pro' ? 'bg-emerald-50' : plan.id === 'premium' ? 'bg-amber-50' : 'bg-slate-50'}`}>
                  {plan.icon}
                </div>
                {selectedPlan === plan.id && (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">₱{plan.price}</span>
                  <span className="text-sm text-slate-400 font-bold">/ month</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{plan.description}</p>
              <div className="space-y-4 pt-6 border-t border-slate-50">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Check size={10} />
                    </div>
                    <span className="text-xs font-bold text-slate-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className={`w-full h-14 rounded-2xl text-[14px] font-black transition-all mt-8 ${
                selectedPlan === plan.id
                  ? 'bg-slate-100 text-slate-400 cursor-default'
                  : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-md active:scale-95'
              }`}
            >
              {selectedPlan === plan.id ? 'Currently Active' : 'Switch to Plan'}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

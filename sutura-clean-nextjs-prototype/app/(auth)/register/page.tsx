'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Scissors,
  Building2, 
  ChevronLeft,
  ArrowRight, 
  Check, 
  ShieldCheck, 
  UserCircle, 
  Zap, 
  Clock, 
  Crown, 
  Rocket,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

function RegisterForm() {
  const router = useRouter();
  const steps = [
    { id: 1, title: 'Account', icon: <UserCircle size={18}/> },
    { id: 2, title: 'Business', icon: <Building2 size={18}/> },
    { id: 3, title: 'Plan', icon: <Zap size={18}/> },
    { id: 4, title: 'Launch', icon: <Rocket size={18}/> }
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '249',
      description: 'The smallest usable shop version for core operations.',
      icon: <Clock className="text-stone-500" size={20} />,
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
      price: '799',
      description: 'Operational automation for the growing studio.',
      icon: <Zap className="text-emerald-700" size={20} />,
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
      price: '1299',
      description: 'Full ERP-style shop management for established brands.',
      icon: <Crown className="text-amber-500" size={20} />,
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

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationStage, setValidationStage] = useState(0);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setShowValidationModal(true);
      setTimeout(() => setValidationStage(1), 1500);
      setTimeout(() => setValidationStage(2), 3000);
      setTimeout(() => setValidationStage(3), 4500);
      
      setTimeout(() => {
        setIsSubmitting(false);
      }, 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen font-outfit selection:bg-emerald-100 flex justify-center bg-slate-50">
      
      {/* MOBILE CANVAS (480px) */}
      <div className="w-full max-w-[480px] min-h-screen bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] flex flex-col relative overflow-x-hidden">
        
        {/* TOP DECORATIVE SECTION (Simplified Header) */}
        <div className="relative h-[180px] bg-emerald-700 flex flex-col items-center justify-center px-8 overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 rounded-full -mr-24 -mt-24 blur-3xl animate-pulse" />
          
          {/* BACK BUTTON */}
          <div className="absolute top-6 left-6 z-20">
            {currentStep > 1 ? (
              <button onClick={handleBack} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all active:scale-95 shadow-lg">
                <ChevronLeft size={20} />
              </button>
            ) : (
              <Link href="/login" className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all active:scale-95 shadow-lg">
                <ChevronLeft size={20} />
              </Link>
            )}
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <Link href="/" className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl mb-4 group active:scale-95 transition-all">
              <Scissors size={32} className="text-emerald-700 group-hover:rotate-12 transition-transform" />
            </Link>
            <h1 className="text-xl font-black text-white tracking-[0.1em] uppercase">SUTURA BUSINESS</h1>
          </div>
          
          {/* CURVE OVERLAY */}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-white rounded-t-[40px]" />
        </div>

        {/* STEP INDICATOR (Compact for Mobile) */}
        <div className="px-8 mb-6">
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-[24px] border border-slate-100">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${
                  currentStep >= step.id ? 'text-emerald-600' : 'text-slate-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${
                  currentStep >= step.id ? 'border-emerald-600 bg-white shadow-sm' : 'border-slate-100 bg-slate-50'
                }`}>
                  {currentStep > step.id ? <Check size={16} /> : step.icon}
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* REGISTRATION FORM SECTION */}
        <div className="flex-1 px-8 pb-12">
          
          {/* ── STEP 1: ACCOUNT ── */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="mb-8">
                <h2 className="text-[24px] font-black text-slate-900 tracking-tight">Create Account</h2>
                <p className="text-slate-500 mt-1 text-[13px] font-medium leading-relaxed">Establish your personal credentials to get started.</p>
              </div>
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">Full Name</label>
                  <input type="text" placeholder="John Clock" className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">Contact Number</label>
                  <input type="tel" placeholder="+63 9xx xxx xxxx" className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">Email Address</label>
                  <input type="email" placeholder="john@sutura.ph" className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">Password</label>
                  <input type="password" placeholder="••••••••" className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold shadow-inner" />
                </div>

                <button onClick={handleNext} className="w-full h-16 bg-emerald-600 text-white rounded-[24px] font-black text-[14px] uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all mt-6 flex items-center justify-center gap-3">
                  Continue <ArrowRight size={20}/>
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: BUSINESS ── */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="mb-8">
                <h2 className="text-[24px] font-black text-slate-900 tracking-tight">Business Details</h2>
                <p className="text-slate-500 mt-1 text-[13px] font-medium leading-relaxed">Verify your shop legitimacy to start operations.</p>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">Shop Name</label>
                  <input type="text" placeholder="SUTURA STUDIO" className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold shadow-inner" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">Business Email</label>
                    <input type="email" placeholder="shop@sutura.ph" className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold shadow-inner text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">Shop Contact</label>
                    <input type="tel" placeholder="09xx..." className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold shadow-inner text-xs" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">Business Address</label>
                  <input type="text" placeholder="Davao City, Philippines" className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold shadow-inner" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">Business TIN</label>
                    <input type="text" placeholder="XXX-XXX-XXX" className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold shadow-inner text-xs" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">Specialty</label>
                    <select className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold appearance-none shadow-inner text-xs">
                      <option>Tailoring</option>
                      <option>Bridal</option>
                      <option>Uniforms</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block truncate">BIR 2303</label>
                    <div className="relative group">
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      <div className="w-full h-16 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 group-hover:border-emerald-500 group-hover:bg-emerald-50 transition-all">
                        <CheckCircle size={14} className="text-slate-300" />
                        <span className="text-[7px] font-bold text-slate-400 mt-1">PDF</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block truncate">Mayor's Permit</label>
                    <div className="relative group">
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      <div className="w-full h-16 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 group-hover:border-emerald-500 group-hover:bg-emerald-50 transition-all">
                        <ShieldCheck size={14} className="text-slate-300" />
                        <span className="text-[7px] font-bold text-slate-400 mt-1">PDF</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block truncate">DTI/SEC</label>
                    <div className="relative group">
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                      <div className="w-full h-16 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 group-hover:border-emerald-500 group-hover:bg-emerald-50 transition-all">
                        <Building2 size={14} className="text-slate-300" />
                        <span className="text-[7px] font-bold text-slate-400 mt-1">PDF</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button onClick={handleBack} className="h-14 bg-slate-100 text-slate-600 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-slate-200 transition-all">Back</button>
                  <button onClick={handleNext} className="h-14 bg-emerald-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">Next <ArrowRight size={18}/></button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: PLAN ── */}
          {currentStep === 3 && (
            <div className="animate-in fade-in zoom-in-95 duration-700">
              <div className="mb-6">
                <h2 className="text-[24px] font-black text-slate-900 tracking-tight text-center">Choose Your Tier</h2>
                <p className="text-slate-500 mt-1 text-[13px] font-medium text-center">Select your workshop scale.</p>
              </div>

              {/* PLAN TABS */}
              <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-10">
                {plans.map((plan) => (
                  <button 
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`flex-1 h-16 flex flex-col items-center justify-center rounded-xl transition-all relative ${selectedPlan === plan.id ? 'bg-white text-emerald-700 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {plan.id === 'pro' && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[7px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-md z-10 whitespace-nowrap">Recommended</span>
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest">{plan.name.split(' ')[0]}</span>
                    <span className="text-[12px] font-black">₱{plan.price}</span>
                  </button>
                ))}
              </div>

              {/* UNIFIED FEATURE MATRIX CARD */}
              <div className="bg-white rounded-[32px] p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-sm border border-slate-50 overflow-hidden">
                <div className="mb-6">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-1">Comparison Matrix</p>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Feature Availability</h3>
                </div>

                <div className="overflow-x-auto -mx-6 px-6 pb-2">
                  <table className="w-full min-w-[320px]">
                    <thead>
                      <tr className="border-b border-slate-50">
                        <th className="text-left py-3 text-[10px] font-black text-slate-300 uppercase tracking-widest">Feature</th>
                        <th className={`py-3 text-[10px] font-black uppercase transition-all ${selectedPlan === 'basic' ? 'text-emerald-600' : 'text-slate-300'}`}>B</th>
                        <th className={`py-3 text-[10px] font-black uppercase transition-all ${selectedPlan === 'pro' ? 'text-emerald-600' : 'text-slate-300'}`}>P</th>
                        <th className={`py-3 text-[10px] font-black uppercase transition-all ${selectedPlan === 'premium' ? 'text-emerald-600' : 'text-slate-300'}`}>M</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[
                        { name: 'Customer Profiles', b: true, p: true, m: true },
                        { name: 'Job Order Tracking', b: true, p: true, m: true },
                        { name: 'Admin & Staff Roles', b: false, p: true, m: true },
                        { name: 'Billing & Payments', b: true, p: true, m: true },
                        { name: 'Financial Reports', b: false, p: true, m: true },
                        { name: 'Inventory Mgmt', b: false, p: true, m: true },
                        { name: 'Auto Notifications', b: false, p: true, m: true },
                        { name: 'Advanced Analytics', b: false, p: false, m: true },
                        { name: 'Multi-branch Support', b: false, p: false, m: true },
                        { name: 'Audit Logs', b: false, p: false, m: true }
                      ].map((item, i) => (
                        <tr key={i} className="group">
                          <td className="py-4 text-[12px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{item.name}</td>
                          <td className={`py-4 text-center transition-all ${selectedPlan === 'basic' ? 'bg-emerald-50/30' : ''}`}>
                            <div className="flex justify-center">{item.b ? <Check size={14} className="text-emerald-600" /> : <div className="w-2 h-[2px] bg-slate-200 rounded-full" />}</div>
                          </td>
                          <td className={`py-4 text-center transition-all ${selectedPlan === 'pro' ? 'bg-emerald-50/30' : ''}`}>
                            <div className="flex justify-center">{item.p ? <Check size={14} className="text-emerald-600" /> : <div className="w-2 h-[2px] bg-slate-200 rounded-full" />}</div>
                          </td>
                          <td className={`py-4 text-center transition-all ${selectedPlan === 'premium' ? 'bg-emerald-50/30' : ''}`}>
                            <div className="flex justify-center">{item.m ? <Check size={14} className="text-emerald-600" /> : <div className="w-2 h-[2px] bg-slate-200 rounded-full" />}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check size={12} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-[2px] bg-slate-200" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Not Included</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button onClick={handleBack} className="h-14 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-black text-[12px] uppercase tracking-widest">Back</button>
                <button onClick={handleNext} className="h-14 bg-emerald-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">Finalize <ArrowRight size={18}/></button>
              </div>
            </div>
          )}

          {/* ── STEP 4: LAUNCH ── */}
          {currentStep === 4 && (
            <div className="animate-in zoom-in-95 duration-700 text-center">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-inner"><Rocket size={40} /></div>
              <h2 className="text-[24px] font-black text-slate-900 tracking-tight leading-tight">Ready to Launch?</h2>
              <p className="text-slate-500 mt-2 text-[13px] font-medium leading-relaxed px-4">Digitize your craft today. Your 14-day free trial starts now.</p>
              
              <div className="mt-8 bg-slate-50 rounded-[32px] p-6 text-left border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Selected Plan</span>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[9px] font-black uppercase">Active Trial</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">{plans.find(p => p.id === selectedPlan)?.icon}</div>
                  <div>
                    <div className="font-black text-slate-900 text-sm">{plans.find(p => p.id === selectedPlan)?.name}</div>
                    <div className="text-xs font-bold text-emerald-600">₱{plans.find(p => p.id === selectedPlan)?.price} / month</div>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mt-10">
                <button type="button" onClick={handleBack} className="h-16 bg-slate-100 text-slate-600 rounded-[20px] font-black text-[12px] uppercase tracking-widest">Back</button>
                <button type="submit" disabled={isSubmitting} className="h-16 bg-emerald-600 text-white rounded-[20px] font-black text-[12px] uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-2">
                  {isSubmitting ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <>Launch <Rocket size={18}/></>}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* MOBILE FOOTER */}
        <div className="px-8 pb-10 mt-auto">
          <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">© 2026 SUTURA System</p>
            <div className="flex gap-4">
              <span className="text-[9px] font-bold text-slate-400 uppercase">Support</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Privacy</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── VALIDATION PROGRESS MODAL ── */}
      {showValidationModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-md rounded-[48px] p-10 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-500 text-center">
            <div className="relative w-32 h-32 mx-auto mb-10">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
              <div className="absolute inset-2 bg-emerald-500/10 rounded-full animate-pulse" />
              <div className="relative w-32 h-32 bg-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-600/30">
                {validationStage === 3 ? <CheckCircle size={56} className="text-white animate-in zoom-in duration-500" /> : <ShieldCheck size={56} className="text-white animate-pulse" />}
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{validationStage === 3 ? "Application Queued!" : "Verifying Documents..."}</h3>
            <p className="text-slate-500 font-medium mb-10 text-sm leading-relaxed">{validationStage === 3 ? "Your shop is now in the priority verification queue. Our admins will review your documents shortly." : "Our AI is currently scanning your uploaded business permits and identity for authenticity."}</p>
            <div className="space-y-4 mb-10 text-left bg-slate-50 p-6 rounded-3xl border border-slate-100">
              {[{ label: "Scanning Identity", stage: 0 }, { label: "Validating Business TIN", stage: 1 }, { label: "Document Authenticity Check", stage: 2 }, { label: "Admin Priority Queuing", stage: 3 }].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className={`flex items-center gap-3 text-xs font-bold ${validationStage >= item.stage ? 'text-slate-900' : 'text-slate-300'}`}>
                    <div className={`w-2 h-2 rounded-full ${validationStage > item.stage ? 'bg-emerald-500' : validationStage === item.stage ? 'bg-amber-400 animate-pulse' : 'bg-slate-200'}`} />
                    {item.label}
                  </div>
                  {validationStage > item.stage && <Check size={14} className="text-emerald-500" />}
                </div>
              ))}
            </div>
            {validationStage === 3 ? (
              <button onClick={() => router.push('/')} className="w-full h-16 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:-translate-y-1 active:translate-y-0">Finish & Go to Home</button>
            ) : (
              <div className="flex items-center justify-center gap-3 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]"><div className="w-4 h-4 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />Processing Security Layer...</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Register() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Initializing Onboarding...</p>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}

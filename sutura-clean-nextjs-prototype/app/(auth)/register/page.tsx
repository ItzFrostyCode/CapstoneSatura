'use client';

import { useState, Suspense } from 'react';
import { Sparkles } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Scissors, 
  Building2, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  UserCircle, 
  Zap, 
  Clock, 
  Crown, 
  Rocket,
  ChevronLeft,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDesigner = searchParams.get('role') === 'designer';

  const steps = isDesigner ? [
    { id: 1, title: 'Identity', icon: <UserCircle size={18}/> },
    { id: 2, title: 'Portfolio', icon: <Scissors size={18}/> },
    { id: 3, title: 'Plan', icon: <Zap size={18}/> },
    { id: 4, title: 'Review', icon: <Rocket size={18}/> }
  ] : [
    { id: 1, title: 'Account', icon: <UserCircle size={18}/> },
    { id: 2, title: 'Business', icon: <Building2 size={18}/> },
    { id: 3, title: 'Plan', icon: <Zap size={18}/> },
    { id: 4, title: 'Launch', icon: <Rocket size={18}/> }
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '149',
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
      price: '299',
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
      price: '499',
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
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* ── SIMPLE AUTH HEADER ── */}
      <header className="h-20 flex items-center border-b border-slate-100 bg-white">
        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <Scissors className="text-white" size={20}/>
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase text-slate-900">Sutura</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className={`flex items-center gap-2 transition-all duration-300 ${
                  currentStep >= step.id ? 'text-emerald-600' : 'text-slate-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  currentStep >= step.id ? 'border-emerald-600 bg-emerald-50 shadow-sm' : 'border-slate-100'
                }`}>
                  {currentStep > step.id ? <Check size={14} /> : step.icon}
                </div>
                <span className="text-xs font-black uppercase tracking-widest">{step.title}</span>
                {step.id < 4 && <div className={`w-8 h-[2px] ml-2 ${currentStep > step.id ? 'bg-emerald-600' : 'bg-slate-100'}`} />}
              </div>
            ))}
          </div>
          <Link href="#" className="text-sm font-bold text-emerald-600 hover:underline">Need help?</Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-6 md:px-12 bg-slate-50/50">
        <div className={`w-full transition-all duration-700 ease-out ${currentStep === 3 ? 'max-w-6xl' : 'max-w-2xl'}`}>
          
          {/* ── STEP 1: ACCOUNT ── */}
          {currentStep === 1 && (
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{isDesigner ? 'Designer Identity' : 'Create Account'}</h2>
                <p className="text-slate-500 mt-2 font-medium">Establish your personal credentials to get started.</p>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <input type="text" placeholder="John Clock" className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Number</label>
                    <input type="tel" placeholder="+63 9xx xxx xxxx" className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <input type="email" placeholder="john@sutura.ph" className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold" />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                  <input type="password" placeholder="••••••••" className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold" />
                </div>

                <button onClick={handleNext} className="w-full h-16 bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:-translate-y-1 transition-all active:translate-y-0 mt-8 flex items-center justify-center gap-3">
                  Continue to {isDesigner ? 'Portfolio' : 'Business'} <ArrowRight size={20}/>
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: SHOP / DESIGNER ── */}
          {currentStep === 2 && (
            isDesigner ? (
              /* Designer Step 2: Portfolio */
              <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="mb-10 text-center">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Designer Profile & Portfolio</h2>
                  <p className="text-slate-500 mt-2 font-medium">Submit your creative credibility for portfolio verification.</p>
                </div>
                <div className="space-y-5">
                  {/* Row 1: Brand + Specialization */}
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Designer / Brand Name</label>
                      <input type="text" placeholder="e.g. Aurelius Couture" className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Specialization</label>
                      <input type="text" placeholder="e.g. Bespoke, Bridal, Streetwear" className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold" />
                    </div>
                  </div>

                  {/* Row 2: Bio */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Bio</label>
                    <textarea placeholder="Tell us about your design philosophy and creative background..." className="w-full h-28 p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold resize-none" />
                  </div>

                  {/* Row 3: Portfolio Images + Sample Designs */}
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Portfolio Images</label>
                      <div className="relative group">
                        <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 group-hover:border-emerald-500 group-hover:bg-emerald-50 transition-all">
                          <Sparkles className="text-slate-300 group-hover:text-emerald-500 mb-1" size={20} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600">Upload Photos</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Sample Designs</label>
                      <div className="relative group">
                        <input type="file" multiple accept="image/*,.pdf" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 group-hover:border-emerald-500 group-hover:bg-emerald-50 transition-all">
                          <Scissors className="text-slate-300 group-hover:text-emerald-500 mb-1" size={20} />
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600">Upload Designs</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Social Links + Experience */}
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Social Links</label>
                      <input type="text" placeholder="Instagram / Behance / Website" className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Years of Experience</label>
                      <input type="number" min="0" placeholder="e.g. 5" className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5 mt-4">
                    <button onClick={handleBack} className="h-16 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Go Back</button>
                    <button onClick={handleNext} className="h-16 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3">Continue to Plan <ArrowRight size={20}/></button>
                  </div>
                </div>
              </div>
            ) : (
              /* Shop Owner Step 2: Business */
              <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="mb-10 text-center">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Business Details & Documents</h2>
                  <p className="text-slate-500 mt-2 font-medium">Verify your shop legitimacy to start operations.</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Shop Name</label>
                    <input type="text" placeholder="Davao Tailors PH" className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Business Address</label>
                    <input type="text" placeholder="G/F SM Megamall, Mandaluyong City" className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Specialty</label>
                      <select className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold appearance-none">
                        <option>Bespoke Tailoring</option>
                        <option>Bridal & Gowns</option>
                        <option>Corporate Uniforms</option>
                        <option>Alterations</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">BIR / Tax ID (TIN)</label>
                      <input type="text" placeholder="xxx-xxx-xxx-xxx" className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-semibold" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">BIR Form 2303</label>
                      <div className="relative group">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 group-hover:border-emerald-500 group-hover:bg-emerald-50 transition-all">
                          <Rocket size={18} className="text-slate-400 mb-1 group-hover:text-emerald-600" />
                          <span className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-700">Upload PDF</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Mayor's Permit</label>
                      <div className="relative group">
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="w-full h-24 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 group-hover:border-emerald-500 group-hover:bg-emerald-50 transition-all">
                          <ShieldCheck size={18} className="text-slate-400 mb-1 group-hover:text-emerald-600" />
                          <span className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-700">Upload PDF</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mt-8">
                    <button onClick={handleBack} className="h-16 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Go Back</button>
                    <button onClick={handleNext} className="h-16 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3">Continue to Plan <ArrowRight size={20}/></button>
                  </div>
                </div>
              </div>
            )
          )}

          {/* ── STEP 3: PLAN ── */}
          {currentStep === 3 && (
            isDesigner ? (
              /* Designer Step 3: Pro Plan ₱99 */
              <div className="animate-in fade-in zoom-in-95 duration-700 text-center">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Your Subscription</h2>
                <p className="text-slate-400 font-medium mb-10">All fashion designers are enrolled in the Pro Plan.</p>
                <div className="flex justify-center">
                  <div className="relative bg-white rounded-[48px] p-12 shadow-2xl border-4 border-emerald-600 max-w-md w-full">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Designer — Included</div>
                    <div className="flex flex-col items-center space-y-6">
                      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600"><Zap size={32} /></div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900">Pro Plan</h3>
                        <div className="mt-2 flex items-baseline gap-1 justify-center">
                          <span className="text-4xl font-black text-slate-900">₱99</span>
                          <span className="text-sm text-slate-400 font-bold">/ month</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">Curate your profile, showcase your products, and publish design posts to the Sutura marketplace.</p>
                      <div className="space-y-3 w-full pt-6 border-t border-slate-100 text-left">
                        {[
                          'Curate and manage your designer profile',
                          'Showcase products to the marketplace',
                          'Publish and manage design posts',
                          'Get discovered by local ateliers',
                          'Portfolio verification badge'
                        ].map((f, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><Check size={10} /></div>
                            <span className="text-xs font-bold text-slate-600">{f}</span>
                          </div>
                        ))}
                      </div>
                      <button onClick={handleNext} className="w-full h-16 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all mt-2">Confirm & Continue <ArrowRight size={18} className="inline ml-1" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Shop Owner Step 3: Multi-Plans */
              <div className="animate-in fade-in zoom-in-95 duration-700">
                <div className="mb-10 text-center">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Choose Your Tier</h2>
                  <p className="text-slate-500 mt-2 font-medium text-lg text-center mx-auto">Select the architecture that fits your Workshop scale.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {plans.map((plan) => (
                    <div 
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative bg-white rounded-[40px] p-8 shadow-2xl border-4 transition-all duration-500 cursor-pointer hover:scale-[1.02] flex flex-col ${
                        selectedPlan === plan.id ? 'border-emerald-600 shadow-emerald-100' : 'border-transparent hover:border-slate-100'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-700 text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg whitespace-nowrap z-10">Most Popular Choice</div>
                      )}
                      <div className="space-y-6 flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${plan.id === 'pro' ? 'bg-emerald-50' : plan.id === 'premium' ? 'bg-amber-50' : 'bg-slate-50'}`}>{plan.icon}</div>
                          {selectedPlan === plan.id && <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center"><Check size={12} className="text-white" /></div>}
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
                              <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><Check size={10} /></div>
                              <span className="text-xs font-bold text-slate-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-6 mt-12 max-w-2xl mx-auto">
                  <button onClick={handleBack} className="h-16 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all">Previous</button>
                  <button onClick={handleNext} className="h-16 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3">Finalize Registration <ArrowRight size={20}/></button>
                </div>
              </div>
            )
          )}

          {/* ── STEP 4: VERIFICATION / REVIEW ── */}
          {currentStep === 4 && (
            isDesigner ? (
              /* Designer Step 4: Review */
              <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 animate-in zoom-in-95 duration-700 text-center">
                 <div className="w-32 h-32 bg-indigo-50 text-indigo-600 rounded-[40px] flex items-center justify-center mx-auto mb-10 shadow-inner relative">
                    <div className="absolute inset-0 bg-indigo-600/10 rounded-[40px] animate-pulse" />
                    <Clock size={56} className="relative z-10" />
                 </div>
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight">Portfolio Under Review</h2>
                 <p className="text-slate-500 mt-4 font-medium text-lg max-w-md mx-auto leading-relaxed">Our creative directors are currently reviewing your portfolio for authenticity and style.</p>
                 <div className="mt-12 grid grid-cols-2 gap-4 max-w-sm mx-auto">
                    <button onClick={() => router.push('/')} className="h-14 bg-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Go Home</button>
                    <button className="h-14 bg-white border-2 border-slate-100 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all">Support</button>
                 </div>
              </div>
            ) : (
              /* Shop Owner Step 4: Launch */
              <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 animate-in zoom-in-95 duration-700 text-center">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner"><Rocket size={48} /></div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Ready to Launch?</h2>
                <p className="text-slate-500 mt-4 font-medium text-lg max-w-md mx-auto">Digitize your craft today. Your 14-day free trial starts the moment you hit submit.</p>
                <div className="mt-12 bg-slate-50 rounded-3xl p-8 text-left border border-slate-100 max-w-md mx-auto">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Selected Plan</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">Active Trial</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">{plans.find(p => p.id === selectedPlan)?.icon}</div>
                    <div>
                      <div className="font-black text-slate-900">{plans.find(p => p.id === selectedPlan)?.name}</div>
                      <div className="text-sm font-bold text-emerald-600">₱{plans.find(p => p.id === selectedPlan)?.price} / month</div>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 mt-12 max-w-md mx-auto">
                  <button type="button" onClick={handleBack} className="h-16 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Back</button>
                  <button type="submit" disabled={isSubmitting} className="h-16 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-70">{isSubmitting ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <>Submit & Join <Rocket size={20}/></>}</button>
                </form>
              </div>
            )
          )}
        </div>

        <div className="max-w-2xl w-full mt-12 flex justify-between items-center text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">
           <div>© 2026 Sutura Platform</div>
           <div className="flex gap-8"><span>Privacy</span><span>Terms</span><span>Support</span></div>
        </div>
      </main>

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

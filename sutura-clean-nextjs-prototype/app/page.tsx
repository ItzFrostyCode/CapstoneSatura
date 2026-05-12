'use client';

import { useState, useEffect } from 'react';
import { 
  Scissors, ShieldCheck, ChevronDown, Cpu, Database, Network, 
  Check, Star, Users, CheckCircle, X, Store, Palette, Lock
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="min-h-screen bg-white font-outfit selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-[2000] transition-all duration-300 border-b ${scrolled ? 'h-20 bg-white/80 backdrop-blur-md border-gray-200 shadow-sm' : 'h-24 bg-transparent border-transparent'}`}>
        <div className="max-w-[1440px] mx-auto px-10 md:px-20 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-2xl font-black text-gray-900 tracking-tighter">
            <Scissors className="text-blue-600 w-8 h-8" strokeWidth={2.5} />
            Sutura
          </Link>
          
          <ul className="hidden lg:flex items-center gap-10 list-none">
            <li><a href="#vp" className="text-[15px] font-bold text-gray-900 hover:text-blue-600 transition-colors">Value</a></li>
            <li><a href="#features" className="text-[15px] font-bold text-gray-900 hover:text-blue-600 transition-colors">Features</a></li>
            <li><a href="#how-it-works" className="text-[15px] font-bold text-gray-900 hover:text-blue-600 transition-colors">Process</a></li>
            <li><a href="#pricing" className="text-[15px] font-bold text-gray-900 hover:text-blue-600 transition-colors">Pricing</a></li>
          </ul>

          <div className="flex items-center gap-6">
            <Link href="/customer/designs" className="hidden sm:block text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors">Customer Portal</Link>
            <button 
              onClick={openLoginModal}
              className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 hover:-translate-y-0.5 transition-all shadow-lg shadow-gray-900/10 active:scale-95"
            >
              Log In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-48 pb-32 bg-[radial-gradient(circle_at_top_right,_#F0F7FF_0%,_#FFFFFF_60%)]">
        <div className="max-w-[1440px] mx-auto px-10 md:px-20">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[13px] font-black uppercase tracking-wider mb-8">
                <ShieldCheck className="w-4 h-4" />
                Enterprise-Grade Precision v1.0
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-[1.0] tracking-[-0.04em] mb-8 text-gray-900">
                Precision in Every Stitch. Mastery in Every Shop.
              </h1>
              <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-[600px] mx-auto lg:mx-0 leading-relaxed font-medium">
                Digitize measurements, automate production, and grow your tailoring business with 100% verified accuracy.
              </p>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
                  <button 
                    onClick={openRegisterModal}
                    className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-black text-[17px] hover:bg-gray-800 hover:-translate-y-1 transition-all shadow-2xl shadow-gray-900/20 active:scale-95 flex items-center gap-3"
                  >
                    Get Started Free
                  </button>
                  <a href="#demo" className="bg-white text-gray-900 border-2 border-gray-200 px-10 py-5 rounded-2xl font-black text-[17px] hover:border-gray-900 transition-all flex items-center gap-3 active:scale-95">
                    Watch Full Demo
                  </a>
                </div>
                <p className="text-[13px] text-gray-400 font-medium">* Mandatory verification for all Shop Owners & Designers</p>
              </div>

              {/* Trust Indicators */}
              <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap justify-center lg:justify-start gap-10">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> 4.9/5 Average Rating
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                  <Users className="w-5 h-5 text-blue-500" /> 50+ Local Shops
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                  <CheckCircle className="w-5 h-5 text-emerald-500" /> Verified Profiles
                </div>
              </div>
            </div>

            <div className="flex-1.2 w-full max-w-[700px]">
              <div className="bg-white p-2.5 rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.12)] border-[1.5px] border-gray-100 hover:-translate-y-3 transition-transform duration-500">
                <div className="rounded-[32px] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1558603668-6570496b66f8?auto=format&fit=crop&q=80&w=800" 
                    alt="Sutura in action"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Value Proposition */}
      <section id="vp" className="py-32 border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-10 md:px-20">
          <div className="text-center max-w-[800px] mx-auto mb-20">
            <span className="text-[13px] font-black uppercase tracking-widest text-blue-600 mb-4 block">Why Choose Sutura?</span>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6">The Operating System for Modern Fashion Creators.</h2>
            <p className="text-xl text-gray-500 font-medium">We solve the chaos of manual tailoring with a unified digital ecosystem built for scale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Cpu, title: 'Smart Workflow', desc: 'Automate everything from client intake to final fitting alerts.' },
              { icon: Database, title: 'Secure Data', desc: 'Your measurements and client history are encrypted and always available.' },
              { icon: Network, title: 'Designer Network', desc: 'Connect shops with verified designers for a seamless supply chain.' }
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-12 rounded-[32px] border border-transparent hover:border-blue-200 transition-all group">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <item.icon className="text-blue-600 w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black mb-4">{item.title}</h3>
                <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAS Section */}
      <section className="py-32 bg-gray-900 text-white overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-10 md:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-rose-500 mb-8 tracking-tight leading-tight">Lost notebooks are costing you thousands.</h3>
              <p className="text-xl text-white/70 leading-relaxed font-light mb-10">
                Every missing measurement, every delayed fitting, and every material miscalculation is a leak in your profit. Manual shops struggle to scale beyond a single branch.
              </p>
              <div className="bg-white/5 p-10 rounded-[32px] border border-white/10 backdrop-blur-sm">
                <h4 className="text-2xl font-black text-emerald-400 mb-6">The Sutura Advantage</h4>
                <p className="text-lg text-white/80 mb-8 leading-relaxed">
                  Our cloud-based system ensures that every detail—from the neck width to the delivery date—is tracked, verified, and accessible to your whole team instantly.
                </p>
                <ul className="space-y-4">
                  {[
                    '100% Digital Logs',
                    'Automated SMS Fitting Alerts',
                    'Real-time Inventory Audit'
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-4 text-[17px] font-bold">
                      <div className="bg-emerald-500/20 p-1 rounded-full">
                        <Check className="text-emerald-400 w-5 h-5" />
                      </div>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-10 bg-blue-600/20 blur-[100px] rounded-full" />
              <img 
                src="https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&q=80&w=800" 
                alt="Digital tools" 
                className="relative z-10 rounded-[40px] shadow-2xl rotate-3 border-4 border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-10 md:px-20 text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-20 tracking-tight">Transparent pricing for professionals.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                name: 'Basic Shop', price: '149', 
                features: ['Customer Profiles', 'Manual Job Tracking', 'Physical Receipt Printing'],
                link: '/register?plan=basic'
              },
              { 
                name: 'Pro Shop', price: '299', popular: true,
                features: ['Inventory & Suppliers', 'Automated Notifications', 'Smart Material Estimator'],
                link: '/register?plan=pro'
              },
              { 
                name: 'Premium Shop', price: '499',
                features: ['Multi-branch Support', 'Administrative Audit Logs', 'Marketplace Visibility'],
                link: '/register?plan=premium'
              },
              { 
                name: 'Designer', price: '99',
                features: ['Portfolio Showcase', 'Shop Collaboration', 'Custom Design Orders'],
                link: '/register/designer'
              }
            ].map((plan, i) => (
              <div key={i} className={`p-10 rounded-[32px] border ${plan.popular ? 'border-blue-600 shadow-2xl shadow-blue-600/10 scale-105 relative z-10' : 'border-gray-100 bg-gray-50'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <h4 className="text-xl font-black mb-6">{plan.name}</h4>
                <div className="flex items-baseline justify-center gap-1 mb-8">
                  <span className="text-4xl font-black tracking-tight">₱{plan.price}</span>
                  <span className="text-gray-500 text-sm font-bold">/mo</span>
                </div>
                <ul className="text-left space-y-4 mb-10">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-xs font-bold text-gray-600 leading-tight">
                      <Check className={`w-4 h-4 shrink-0 ${plan.popular ? 'text-blue-600' : 'text-emerald-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link 
                  href={plan.link}
                  className={`w-full py-4 rounded-xl font-black text-sm flex items-center justify-center transition-all ${plan.popular ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700' : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-900'}`}
                >
                  Choose {plan.name.split(' ')[0]}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-gray-900 text-white">
        <div className="max-w-[1440px] mx-auto px-10 md:px-20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10 border-b border-white/10 pb-12 mb-12">
            <div className="text-3xl font-black tracking-tighter">Sutura</div>
            <div className="flex gap-10 font-black text-sm opacity-60">
              <Link href="#" className="hover:opacity-100 transition-opacity">Privacy</Link>
              <Link href="#" className="hover:opacity-100 transition-opacity">Terms</Link>
              <Link href="#" className="hover:opacity-100 transition-opacity">Support</Link>
            </div>
          </div>
          <p className="text-center text-sm font-bold text-white/30 uppercase tracking-widest">
            &copy; 2026 Sutura Tailoring Management Systems. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={closeLoginModal} />
          <div className="bg-white w-full max-w-[480px] rounded-[40px] p-12 shadow-[0_40px_100px_rgba(0,0,0,0.3)] relative z-10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-300">
            <button onClick={closeLoginModal} className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 transition-colors">
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
              <Lock className="w-8 h-8" />
            </div>
            
            <h2 className="text-3xl font-black mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 font-medium mb-10">Select your account type to continue.</p>

            <div className="space-y-4">
              <Link href="/login?role=owner" className="flex items-center gap-5 p-6 bg-white border-2 border-gray-100 rounded-3xl hover:border-blue-600 hover:bg-blue-50 transition-all group">
                <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Store className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-black text-lg text-gray-900 mb-0.5">Shop & Staff Portal</div>
                  <div className="text-sm font-medium text-gray-500 leading-tight">Manage orders, staff, and production.</div>
                </div>
              </Link>

              <Link href="/login?role=designer" className="flex items-center gap-5 p-6 bg-white border-2 border-gray-100 rounded-3xl hover:border-blue-600 hover:bg-blue-50 transition-all group">
                <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Palette className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-black text-lg text-gray-900 mb-0.5">Fashion Designer</div>
                  <div className="text-sm font-medium text-gray-500 leading-tight">Access portfolio and collaborations.</div>
                </div>
              </Link>

              <Link href="/login?role=admin" className="flex items-center gap-4 p-4 border-2 border-dashed border-gray-200 rounded-2xl hover:border-gray-900 transition-colors group">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm text-gray-900">Sutura Admin</div>
                  <div className="text-[11px] font-bold text-gray-400">Platform-level management</div>
                </div>
              </Link>
            </div>

            <div className="mt-10 text-center text-[15px] font-bold text-gray-400">
              Don't have an account? <br/>
              <button 
                onClick={() => { closeLoginModal(); openRegisterModal(); }}
                className="text-blue-600 hover:underline mt-2"
              >
                Register now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={closeRegisterModal} />
          <div className="bg-white w-full max-w-[480px] rounded-[40px] p-12 shadow-[0_40px_100px_rgba(0,0,0,0.3)] relative z-10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-300">
            <button onClick={closeRegisterModal} className="absolute top-8 right-8 p-2 text-gray-400 hover:text-gray-900 transition-colors">
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
              <Users className="w-8 h-8" />
            </div>
            
            <h2 className="text-3xl font-black mb-2 tracking-tight">Join Sutura</h2>
            <p className="text-gray-500 font-medium mb-10">Select how you want to use the platform.</p>

            <div className="space-y-4">
              <Link href="/register" className="flex items-center gap-5 p-6 bg-white border-2 border-gray-100 rounded-3xl hover:border-blue-600 hover:bg-blue-50 transition-all group">
                <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Store className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-black text-lg text-gray-900 mb-0.5">Shop Owner / Staff</div>
                  <div className="text-sm font-medium text-gray-500 leading-tight">Digitize your tailoring business.</div>
                </div>
              </Link>

              <Link href="/register/designer" className="flex items-center gap-5 p-6 bg-white border-2 border-gray-100 rounded-3xl hover:border-blue-600 hover:bg-blue-50 transition-all group">
                <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Palette className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-black text-lg text-gray-900 mb-0.5">Fashion Designer</div>
                  <div className="text-sm font-medium text-gray-500 leading-tight">Showcase your portfolio & collab.</div>
                </div>
              </Link>
            </div>

            <div className="mt-10 text-center text-[15px] font-bold text-gray-400">
              Already have an account? <br/>
              <button 
                onClick={() => { closeRegisterModal(); openLoginModal(); }}
                className="text-blue-600 hover:underline mt-2"
              >
                Sign in here
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

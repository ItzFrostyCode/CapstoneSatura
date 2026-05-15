'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Scissors, Eye, EyeOff, Mail, Lock, ChevronRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useERPStore } from '@/store/useERPStore';

function LoginForm({ role }: { role: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent, destination: string, userRole: 'SHOP_OWNER' | 'STAFF' | 'CUSTOMER') => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      const mockUser = { 
        id: `${userRole}-001`, 
        name: userRole === 'SHOP_OWNER' ? 'Shop Owner' : userRole === 'STAFF' ? 'Staff Member' : 'John Clock', 
        email: userRole === 'SHOP_OWNER' ? 'owner@sutura.ph' : userRole === 'STAFF' ? 'staff@sutura.ph' : 'john@sutura.ph', 
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole}&backgroundColor=b6e3f4`, 
        role: userRole, 
        status: 'ACTIVE' as const, 
        createdAt: new Date().toISOString() 
      };
      
      useERPStore.getState().setCurrentUser(mockUser);
      router.push(destination);
    }, 1500);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <form className="w-full space-y-5">
        {/* EMAIL INPUT */}
        <div className="group">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block group-focus-within:text-emerald-600 transition-colors">Email Address</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              placeholder="name@example.com"
              className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-[20px] text-[15px] font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner"
              required
            />
          </div>
        </div>

        {/* PASSWORD INPUT */}
        <div className="group">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-2 block group-focus-within:text-emerald-600 transition-colors">Password</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
              <Lock size={18} />
            </div>
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full h-14 pl-12 pr-12 bg-slate-50 border border-slate-100 rounded-[20px] text-[15px] font-medium outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner"
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end px-2">
          <button type="button" className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest hover:underline underline-offset-4">Forgot Password?</button>
        </div>

        {/* SIGN IN BUTTONS */}
        {role === 'owner' ? (
          <div className="space-y-3 pt-4">
            <button 
              type="button"
              onClick={(e) => handleLogin(e, '/shop-owner/dashboard', 'SHOP_OWNER')}
              disabled={isLoading}
              className="w-full h-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center gap-3 text-[13px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-70 group"
            >
              {isLoading ? (
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
              ) : (
                <>
                  Sign In as Owner
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <button 
              type="button"
              onClick={(e) => handleLogin(e, '/customer', 'STAFF')}
              disabled={isLoading}
              className="w-full h-16 bg-emerald-600 text-white rounded-[24px] flex items-center justify-center gap-3 text-[13px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-70 group"
            >
              {isLoading ? (
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
              ) : (
                <>
                  Sign In as Staff
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        ) : (
          <button 
            type="button"
            onClick={(e) => handleLogin(e, '/customer', 'CUSTOMER')}
            disabled={isLoading}
            className="w-full h-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center gap-3 text-[13px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/20 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-70 group mt-4"
          >
            {isLoading ? (
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
              </div>
            ) : (
              <>
                Sign In as Customer
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        )}

        {/* DIVIDER & GOOGLE SIGN IN - ONLY FOR CUSTOMERS */}
        {role !== 'owner' && (
          <>
            <div className="flex items-center gap-4 my-8">
              <div className="h-px bg-slate-100 flex-1" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">OR</span>
              <div className="h-px bg-slate-100 flex-1" />
            </div>

            <button 
              type="button" 
              className="w-full h-14 bg-white border border-slate-200 rounded-[20px] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95 group shadow-sm"
            >
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                className="w-5 h-5 group-hover:scale-110 transition-transform"
              />
              <span className="text-[14px] font-bold text-slate-600">Continue with Google</span>
            </button>
          </>
        )}

      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
         <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'customer';

  return (
    <div className="min-h-screen font-outfit selection:bg-emerald-100 flex justify-center">
      {/* MOBILE CANVAS (480px) */}
      <div className="w-full max-w-[480px] min-h-[90vh] bg-white rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.1)] flex flex-col relative overflow-hidden">
        
        {/* TOP DECORATIVE SECTION */}
        <div className="relative h-[280px] bg-emerald-700 flex flex-col items-center justify-center px-8 overflow-hidden">
          {/* BACKGROUND DECO */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/10 rounded-full -ml-24 -mb-24 blur-3xl" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6 group animate-in zoom-in duration-500">
              <Scissors size={40} className="text-emerald-700 group-hover:rotate-12 transition-transform" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">SUTURA</h1>
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <Sparkles size={12} className="text-amber-400" />
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Davao Tailoring Hub</span>
            </div>
          </div>
          
          {/* CURVE OVERLAY */}
          <div className="absolute bottom-0 inset-x-0 h-12 bg-white rounded-t-[40px]" />
        </div>

        {/* LOGIN FORM SECTION */}
        <div className="flex-1 px-8 pb-12 pt-10">
          
          {/* LOGIN TYPE SWITCHER */}
          <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-10">
            <Link 
              href="/login?role=customer"
              className={`flex-1 h-12 flex items-center justify-center rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${role !== 'owner' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Customer Login
            </Link>
            <Link 
              href="/login?role=owner"
              className={`flex-1 h-12 flex items-center justify-center rounded-xl text-[12px] font-black uppercase tracking-widest transition-all ${role === 'owner' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Business Login
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-[26px] font-black text-slate-900 leading-tight">
              {role === 'owner' ? 'Tailoring Business Management' : 'Login'}
            </h2>
            <p className="text-slate-400 text-[14px] font-medium mt-2 leading-relaxed">
              {role === 'owner' 
                ? 'Access your shop management, staff analytics, and production pipeline.' 
                : 'Sign in to track your orders and book consultations with Davao\'s best tailors.'}
            </p>
          </div>

          <LoginForm role={role} />

          {/* BUSINESS REGISTRATION - ONLY FOR OWNER ROLE */}
          {role === 'owner' && (
            <div className="pt-10 text-center border-t border-slate-50 mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <p className="text-slate-400 text-[13px] font-medium italic">New tailoring business?</p>
              <Link 
                href="/register" 
                className="inline-block mt-3 text-indigo-600 text-[14px] font-black uppercase tracking-widest border-b-2 border-indigo-100 hover:border-indigo-500 transition-all pb-1 active:scale-95"
              >
                Register Business Management
              </Link>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}

'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Scissors, Eye, EyeOff, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useERPStore } from '@/store/useERPStore';

function LoginForm({ role }: { role: string }) {
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      // Generate mock user based on role
      const mockUser = role === 'customer' 
        ? { id: 'CUST-001', name: 'John Clock', email: 'john@sutura.ph', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=C9A84C', role: 'CUSTOMER' as const, status: 'ACTIVE' as const, createdAt: new Date().toISOString() }
        : { id: 'USR-001', name: 'John Clock', email: 'john@sutura.ph', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=b6e3f4', role: 'SHOP_OWNER' as const, status: 'ACTIVE' as const, createdAt: new Date().toISOString() };
      
      // Inject into global store
      useERPStore.getState().setCurrentUser(mockUser);

      document.cookie = `auth-role=${role}; path=/`;
      document.cookie = `sutura_role=${role}; path=/`;
      router.push(`/?login=success&role=${role}`);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl p-10 w-full max-w-[400px] border border-slate-100">
      <h2 className="text-2xl font-black text-slate-900 mb-8">
        {role === 'owner' ? "Log In Shop Owner / Staff" : "Log In"}
      </h2>
      
      <form onSubmit={handleLogin} className="space-y-4">
        {/* IDENTIFICATION */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Phone number / Username / Email"
            defaultValue={`${role}@satura.ph`}
            className="w-full h-12 px-4 border border-slate-200 rounded-lg text-sm font-medium focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            defaultValue="••••••••"
            className="w-full h-12 px-4 border border-slate-200 rounded-lg text-sm font-medium focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
            required
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* LOG IN BUTTON */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-lg text-[13px] uppercase tracking-widest shadow-lg shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : "Log In"}
        </button>

        <div className="flex justify-between items-center px-1">
          <Link href="#" className="text-[12px] text-emerald-700 font-bold hover:underline">Forgot Password</Link>
        </div>

        {/* DIVIDER */}
        <div className="flex items-center gap-4 my-6">
          <div className="h-px bg-slate-100 flex-1"/>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">OR</span>
          <div className="h-px bg-slate-100 flex-1"/>
        </div>

        {/* SOCIAL LOGINS */}
        <div className="grid grid-cols-2 gap-3">
          <button type="button" className="flex items-center justify-center gap-2 border border-slate-200 h-11 rounded-lg hover:bg-slate-50 transition-all group">
            <User size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-600">Facebook</span>
          </button>
          <button type="button" className="flex items-center justify-center gap-2 border border-slate-200 h-11 rounded-lg hover:bg-slate-50 transition-all group">
            <Mail size={18} className="text-red-500 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-600">Google</span>
          </button>
        </div>

        <div className="pt-8 border-t border-slate-100 space-y-3">
          <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest text-center">New to Sutura?</p>
          {role === 'designer' ? (
            <Link href="/register?role=designer" className="flex items-center justify-center gap-2 h-12 border-2 border-emerald-500 rounded-xl text-[12px] font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all w-full">
              🎨 Register as Fashion Designer
            </Link>
          ) : role === 'owner' ? (
            <Link href="/register" className="flex items-center justify-center gap-2 h-12 border-2 border-emerald-500 rounded-xl text-[12px] font-black text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all w-full">
              🏪 Register as Shop Owner
            </Link>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link href="/register" className="flex items-center justify-center gap-2 h-12 border-2 border-slate-200 rounded-xl text-[12px] font-black text-slate-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all">
                🏪 Shop Owner
              </Link>
              <Link href="/register?role=designer" className="flex items-center justify-center gap-2 h-12 border-2 border-slate-200 rounded-xl text-[12px] font-black text-slate-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all">
                🎨 Fashion Designer
              </Link>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-emerald-600">
         <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
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
    <div className="min-h-screen flex flex-col bg-white">
      {/* HEADER */}
      <header className="h-20 flex items-center px-6 md:px-12 border-b border-slate-100 bg-white">
        <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                <Scissors className="text-white" size={20}/>
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase text-slate-900">Sutura</span>
            </Link>
          </div>
          <Link href="#" className="text-xs font-bold text-emerald-600 hover:underline">Need help?</Link>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 relative flex items-center justify-center bg-emerald-600">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/assets/Workshopp-bespoke.png')] bg-cover bg-center opacity-30 mix-blend-overlay blur-[2px] scale-110" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 to-emerald-800/90" />
        </div>

        <div className="max-w-[1400px] mx-auto w-full px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between relative z-10 py-12">
          {/* BRAND PANEL */}
          <div className="hidden lg:flex flex-col items-start max-w-[500px]">
             <div className="w-48 h-48 bg-white/10 rounded-[60px] flex items-center justify-center backdrop-blur-xl border border-white/20 mb-12 animate-pulse">
               <Scissors size={80} className="text-white"/>
             </div>
             <h1 className="text-5xl font-black text-white leading-tight mb-8 tracking-tighter">
               The leading ecosystem for <br/>
               <span className="text-amber-400 italic">Bespoke Tailoring.</span>
             </h1>
             <p className="text-emerald-50 text-xl font-medium leading-relaxed opacity-80">
               Connecting you to the finest Workshopps and visionary designers in the Philippines.
             </p>
          </div>

          {/* LOGIN FORM */}
          <LoginForm role={role} />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              © 2026 SUTURA PLATFORM · TAILORING ECOSYSTEM
            </div>
            <div className="flex gap-8">
               {["Privacy Policy","Terms of Service","Help Centre"].map(l=><Link key={l} href="#" className="text-slate-500 text-xs font-bold hover:text-emerald-600 transition-colors uppercase tracking-widest">{l}</Link>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

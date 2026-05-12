'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Scissors, Eye, EyeOff, Store, Palette, ShieldCheck, Lock, UserCircle } from 'lucide-react';

import Link from 'next/link';

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get('role');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isDesigner = role === 'designer';
  const isAdmin = role === 'admin';
  const isCustomer = role === 'customer';

  
  let title = 'Shop & Staff Portal';
  let desc = 'Enter your shop credentials to continue.';
  
  if (isAdmin) {
    title = 'System Administration';
    desc = 'Enter admin credentials to manage platform operations.';
  } else if (isDesigner) {
    title = 'Designer Portal';
    desc = 'Access your portfolio and custom orders.';
  } else if (isCustomer) {
    title = 'Customer Studio';
    desc = 'Track orders, manage measurements, and browse designs.';
  }


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      // Set mock cookie for middleware
      document.cookie = `auth-role=${role || 'owner'}; path=/`;
      
      if (isAdmin) {
        router.push('/admin/dashboard');
      } else if (isDesigner) {
        router.push('/designer/dashboard');
      } else if (isCustomer) {
        router.push('/customer/dashboard');
      } else {
        router.push('/owner/dashboard'); // Go straight to dashboard for demo
      }

    }, 1000);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto font-outfit">
      <Link href="/" className="flex items-center gap-3 mb-12 text-gray-900 hover:opacity-80 transition-opacity w-fit">
        <div className="bg-[#1A1A1A] text-white w-11 h-11 flex items-center justify-center rounded-xl shadow-lg shadow-black/10">
          <Scissors className="w-6 h-6" />
        </div>
        <div className="text-[28px] font-bold tracking-tight">Sutura</div>
      </Link>
      
      <div className="mb-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${isAdmin ? 'bg-slate-900 text-white' : (isDesigner ? 'bg-purple-50 text-purple-600' : (isCustomer ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'))}`}>
          {isAdmin ? <ShieldCheck className="w-7 h-7" /> : (isDesigner ? <Palette className="w-7 h-7" /> : (isCustomer ? <UserCircle className="w-7 h-7" /> : <Store className="w-7 h-7" />))}
        </div>

        <h2 className="text-4xl font-extrabold mb-2 tracking-tight text-gray-900">{title}</h2>
        <p className="text-gray-500 text-base font-medium">{desc}</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Email address</label>
          <input 
            type="email" 
            defaultValue={isAdmin ? "admin@satura.com" : (isDesigner ? "designer@satura.com" : "admin@tailorshop.com")}
            className="w-full h-[54px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-gray-900 outline-none transition-all focus:border-[#2C6BED] focus:ring-4 focus:ring-[#2C6BED]/5 hover:border-gray-300"
            required
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
          <input 
            type={showPassword ? "text" : "password"}
            defaultValue="password123"
            className="w-full h-[54px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-white text-gray-900 outline-none transition-all focus:border-[#2C6BED] focus:ring-4 focus:ring-[#2C6BED]/5 hover:border-gray-300"
            required
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[38px] text-gray-400 hover:text-gray-900 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex justify-between items-center -mt-2 mb-2 text-sm">
          <label className="flex items-center gap-2.5 cursor-pointer text-gray-500 font-bold">
            <input type="checkbox" defaultChecked className="w-[18px] h-[18px] rounded-md accent-[#1A1A1A] cursor-pointer" />
            Keep me signed in
          </label>
          <Link href="#" className="text-[#2C6BED] font-bold hover:underline">Forgot password?</Link>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-[56px] bg-[#1A1A1A] text-white rounded-xl text-base font-bold transition-all hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:hover:translate-y-0 active:scale-[0.98]"
        >
          {isLoading ? 'Signing in...' : 'Sign In to Portal'}
        </button>
      </form>

      <div className="mt-10 pt-8 border-t border-gray-100">
        <div className="text-center text-[15px] font-medium leading-relaxed">
          <span className="text-gray-500 font-bold">Don&apos;t have an account?</span><br/>
          <div className="mt-3 flex items-center justify-center gap-4">
            <Link href="/register" className="text-[#2C6BED] font-bold hover:underline">Shop Owner</Link>
            <span className="text-gray-200">|</span>
            <Link href="/register/designer" className="text-[#2C6BED] font-bold hover:underline">Designer</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <div className="flex w-full min-h-screen bg-white font-outfit animate-in fade-in duration-500">
      <div className="hidden lg:block w-1/2 relative bg-[#1A1A1A] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&q=80&w=1440')] bg-cover bg-center transition-transform duration-[20s] hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-16 text-white">
          <div className="relative z-10">
            <h1 className="text-[56px] font-extrabold leading-[1.1] mb-5 tracking-[-1.5px]">Crafted with Precision.</h1>
            <p className="text-lg font-light opacity-90 max-w-[500px] leading-relaxed">
              Elevate your tailoring business with a platform designed for the perfect fit. Manage customers, orders, and your team seamlessly.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-10 bg-white">
        <Suspense fallback={<div className="text-gray-500 font-bold">Loading secure login...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

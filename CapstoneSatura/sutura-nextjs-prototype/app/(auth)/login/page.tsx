'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Scissors, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get('role');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const title = role === 'designer' ? 'Designer Portal' : 'Shop & Staff Portal';
  const desc = role === 'designer' 
    ? 'Access your portfolio and custom orders.' 
    : 'Enter your shop credentials to continue.';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      if (role === 'designer') {
        router.push('/designer/dashboard'); // Or appropriate designer path
      } else {
        router.push('/setup/welcome'); // As requested in the flow
      }
    }, 1000);
  };

  return (
    <div className="w-full max-w-[420px] mx-auto font-outfit">
      <Link href="/" className="flex items-center gap-3 mb-12 text-gray-900 hover:opacity-80 transition-opacity w-fit">
        <div className="bg-gray-900 text-white w-11 h-11 flex items-center justify-center rounded-xl shadow-sm">
          <Scissors className="w-6 h-6" />
        </div>
        <div className="text-[28px] font-bold tracking-tight">Sutura</div>
      </Link>
      
      <div className="mb-10">
        <h2 className="text-4xl font-bold mb-2 tracking-tight">{title}</h2>
        <p className="text-gray-500 text-base">{desc}</p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Email address</label>
          <input 
            type="email" 
            defaultValue="admin@tailorshop.com"
            className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none transition-all focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5 hover:border-gray-300"
            required
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
          <input 
            type={showPassword ? "text" : "password"}
            defaultValue="password123"
            className="w-full h-[52px] px-4 border-[1.5px] border-gray-200 rounded-xl bg-gray-50 text-gray-900 outline-none transition-all focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/5 hover:border-gray-300"
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
          <label className="flex items-center gap-2 cursor-pointer text-gray-500 font-medium">
            <input type="checkbox" defaultChecked className="w-[18px] h-[18px] rounded-md accent-gray-900 cursor-pointer" />
            Remember me
          </label>
          <Link href="#" className="text-blue-600 font-bold hover:underline">Forgot password?</Link>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-[54px] bg-gray-900 text-white rounded-xl text-base font-bold transition-all hover:bg-gray-800 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center mt-8 text-[15px] font-medium leading-relaxed">
        <span className="text-gray-500">Don't have an account?</span><br/>
        Register as <Link href="/register" className="text-blue-600 font-bold hover:underline">Shop Owner</Link> or <Link href="/register/designer" className="text-blue-600 font-bold hover:underline">Fashion Designer</Link>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <div className="flex w-full min-h-screen bg-white font-outfit animate-in fade-in duration-500">
      <div className="hidden lg:block w-1/2 relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&q=80&w=1440')] bg-cover bg-center animate-[slowZoom_20s_infinite_alternate]" style={{ transform: 'scale(1)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/80 flex flex-col justify-end p-16 text-white">
          <h1 className="text-[56px] font-bold leading-[1.1] mb-5 tracking-[-1.5px]">Crafted with Precision.</h1>
          <p className="text-lg font-light opacity-90 max-w-[500px] leading-relaxed">
            Elevate your tailoring business with a platform designed for the perfect fit. Manage customers, orders, and your team seamlessly.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-10 bg-white">
        <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

import { Lock, Store, Palette, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';

export default function LoginGateway() {
  return (
    <div className="min-h-screen font-outfit bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
      {/* Background to simulate modal on top of landing page */}
      <div className="fixed inset-0 z-[-1] bg-[url('https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&q=80&w=1440')] bg-cover bg-center opacity-20"></div>

      <div className="w-full max-w-[480px] bg-white rounded-[32px] p-12 text-center relative shadow-[0_40px_100px_rgba(0,0,0,0.3)] animate-in fade-in slide-in-from-bottom-10 duration-400">
        <Link href="/" className="absolute top-6 right-6 text-gray-500 hover:text-gray-900 transition-colors">
          <X className="w-6 h-6" />
        </Link>
        
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Lock className="w-7 h-7 text-blue-600" />
        </div>
        
        <h2 className="text-[28px] font-extrabold mb-2 tracking-tight text-gray-900">Welcome Back</h2>
        <p className="text-gray-500 mb-10 text-[15px]">Please select your account type to continue to your dashboard.</p>

        <Link 
          href="/login?role=owner" 
          className="w-full flex items-center gap-5 p-6 rounded-[20px] border-[1.5px] border-gray-200 bg-white text-gray-900 font-bold mb-4 transition-all duration-200 hover:border-blue-600 hover:bg-blue-50/50 hover:scale-[1.02] text-left group"
        >
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
            <Store className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-lg mb-1">Shop & Staff Portal</div>
            <div className="text-[13px] font-medium text-gray-500 leading-snug">Access your shop's dashboard to manage orders, staff, and production.</div>
          </div>
        </Link>

        <Link 
          href="/login?role=designer" 
          className="w-full flex items-center gap-5 p-6 rounded-[20px] border-[1.5px] border-gray-200 bg-white text-gray-900 font-bold mb-4 transition-all duration-200 hover:border-blue-600 hover:bg-blue-50/50 hover:scale-[1.02] text-left group"
        >
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
            <Palette className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="text-lg mb-1">Fashion Designer</div>
            <div className="text-[13px] font-medium text-gray-500 leading-snug">Access your portfolio and collaborations.</div>
          </div>
        </Link>

        <div className="text-center mt-6 text-sm text-gray-500">
          Don't have an account? <Link href="/register" className="text-blue-600 font-bold hover:underline">Register now</Link>
        </div>

        <Link 
          href="/admin/login" 
          className="w-full flex items-center gap-5 p-6 rounded-[20px] border-[1.5px] border-dashed border-gray-200 bg-gray-50 text-gray-900 font-bold mt-6 transition-all duration-200 hover:border-blue-600 hover:bg-blue-50/50 hover:scale-[1.02] text-left group"
        >
          <div className="shrink-0">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-base">Sutura Admin</div>
            <div className="text-xs text-gray-500 font-medium">Platform-level management</div>
          </div>
        </Link>

      </div>
    </div>
  );
}

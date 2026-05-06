'use client';

import { 
  ShieldCheck, 
  User, 
  ArrowRight,
  ChevronRight,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';

export default function WelcomeOnboarding() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden font-outfit">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[100px] -mr-64 -mt-64 opacity-40" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-50/50 rounded-full blur-[100px] -ml-32 -mb-32 opacity-40" />
      
      <div className="max-w-5xl w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          {/* Left Column: Content */}
          <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-500 rounded-full text-[11px] font-black uppercase tracking-[0.1em] border border-emerald-100/50">
              <ShieldCheck size={14} strokeWidth={3} /> Identity Validated
            </div>

            <div className="space-y-4">
              <h1 className="text-[52px] font-black text-[#0F172A] tracking-tight leading-[1.1]">
                Congratulations!
              </h1>
              <p className="text-[15px] font-bold text-[#6366F1]">
                Welcome to Sutura.
              </p>
              <p className="text-[16px] text-slate-500 font-medium leading-relaxed max-w-md pt-2">
                Your account has been successfully validated by our admin team. You are now part of the <span className="text-slate-900 font-bold underline decoration-slate-300 underline-offset-4">Sutura premium network</span>.
              </p>
            </div>

            <div className="flex flex-col gap-6 pt-2">
              <Link 
                href="/owner/staff?onboarding=true"
                className="group w-fit h-14 px-8 bg-[#0F172A] text-white rounded-2xl text-[15px] font-bold flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all active:scale-[0.98] shadow-xl shadow-slate-900/10"
              >
                <User size={18} strokeWidth={2.5} /> Set Up Your Team
                <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/owner/dashboard"
                className="group w-fit px-4 py-2 text-slate-400 rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 hover:text-indigo-600 transition-all"
              >
                Skip to Dashboard <ChevronRight size={14} strokeWidth={3} />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Component Mockup */}
          <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-200">
            {/* The Floating Card UI */}
            <div className="bg-white rounded-[40px] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 relative z-10 w-full max-w-[420px] mx-auto">
              <div className="flex items-center justify-between mb-10">
                <div className="w-12 h-12 bg-[#6366F1] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <Sparkles size={22} strokeWidth={2.5} />
                </div>
                <div className="flex gap-1.5 opacity-20">
                  <div className="w-2 h-2 rounded-full bg-slate-900" />
                  <div className="w-2 h-2 rounded-full bg-slate-900" />
                  <div className="w-2 h-2 rounded-full bg-slate-900" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-2.5 w-1/2 bg-slate-50 rounded-full" />
                <div className="h-2.5 w-full bg-slate-50 rounded-full" />
                <div className="h-2.5 w-3/4 bg-slate-50 rounded-full" />
                
                <div className="pt-10 grid grid-cols-2 gap-5">
                  <div className="p-5 rounded-[24px] bg-[#EEF2FF] border border-indigo-50 flex flex-col items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                      <LayoutDashboard size={18} />
                    </div>
                    <div className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Dashboard</div>
                  </div>
                  <div className="p-5 rounded-[24px] bg-slate-50 border border-slate-50 flex flex-col items-center gap-3 opacity-40">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-slate-300">
                      <User size={18} />
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle floating background effects */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
          </div>

        </div>
      </div>
    </div>
  );
}

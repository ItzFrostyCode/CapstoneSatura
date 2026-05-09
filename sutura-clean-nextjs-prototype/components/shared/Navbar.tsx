'use client';

import { 
  Search, Bell, ChevronDown, Calendar, Clock, 
  Settings, LogOut, Crown, Users 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface NavbarProps {
  currentUser: {
    name: string;
    email: string;
    avatar: string;
  };
  mounted: boolean;
  currentTime: Date;
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
}

export function Navbar({ 
  currentUser, 
  mounted, 
  currentTime, 
  isUserMenuOpen, 
  setIsUserMenuOpen,
  isNotificationsOpen,
  setIsNotificationsOpen
}: NavbarProps) {
  const pathname = usePathname();
  return (
    <header className="h-24 bg-slate-50 flex items-center justify-between px-10 shrink-0 z-40">
      {/* Left: Dynamic Title & Context */}
      <div className="flex items-center gap-8">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none uppercase">
            SUTURA
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px] tracking-tight bg-slate-100/50 px-2 py-0.5 rounded-lg">
              <Calendar size={12} className="text-indigo-500" />
              <span>{mounted ? currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '---'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px] tracking-tight bg-slate-100/50 px-2 py-0.5 rounded-lg">
              <Clock size={12} className="text-emerald-500" />
              <span className="tabular-nums">
                {mounted ? currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Search & Utilities */}
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search everything..." 
            className="w-64 h-11 pl-12 pr-6 bg-white border border-slate-200 rounded-full text-[13px] font-medium outline-none focus:border-slate-400 focus:shadow-md transition-all placeholder:text-slate-400 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-5">
          <button className="text-slate-400 hover:text-slate-900 transition-colors relative group">
            <div className="w-5 h-5 flex items-center justify-center">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
          </button>

          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="text-slate-400 hover:text-slate-900 transition-colors relative group"
          >
            <Bell size={20} className="transition-transform group-hover:rotate-[15deg] duration-300" />
            <span className="absolute -top-1 -right-1 bg-[#FF3B30] text-white text-[6px] font-black w-[16px] h-[16px] rounded-full flex items-center justify-center shadow-[0_2px_4px_rgba(255,59,48,0.2)]">13</span>
          </button>

          <div className="relative ml-2">
            <button 
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 transition-all group"
            >
              <span className="text-[14px] font-black text-slate-900 tracking-tight hidden sm:block">{currentUser.name}</span>
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                  <Image 
                    src={currentUser.avatar} 
                    alt={currentUser.name} 
                    width={40} 
                    height={40} 
                    unoptimized 
                    className="w-full h-full object-contain p-1" 
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                   <ChevronDown size={10} className={`transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </button>

            {isUserMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                  <div className="px-5 py-3 border-b border-slate-50">
                    <div className="text-[14px] font-black text-slate-900 leading-none">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500 mt-1 font-bold">{currentUser.email}</div>
                  </div>
                  <div className="p-2 space-y-1">
                    <Link href="/owner/settings" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-black text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
                      <Settings size={16} /> Settings
                    </Link>
                    {pathname.startsWith('/staff') ? (
                      <Link href="/owner/dashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-black text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm">
                        <Crown size={16} className="text-amber-400" /> Owner Portal
                      </Link>
                    ) : (
                      <Link href="/staff/tasks" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-black text-slate-900 bg-slate-100 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                        <Users size={16} /> Staff Workspace
                      </Link>
                    )}
                    <Link href="/owner/subscription" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-black text-indigo-600 hover:bg-indigo-50 transition-all">
                      <Crown size={16} /> Subscription
                    </Link>
                    <button 
                      onClick={() => window.location.href = '/'}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-black text-rose-600 hover:bg-rose-50 transition-all"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Scissors, Users, ShoppingBag, 
  PackageSearch, Receipt, BarChart3, 
  Search, Bell, Plus, ChevronDown, Building2,
  LayoutDashboard, Settings, LogOut
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isDevMenuOpen, setIsDevMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Strict Enterprise SaaS Navigation
  const navItems = [
    { name: 'My Portfolio', path: '/designer/portfolio', icon: <LayoutDashboard size={18} /> },
    { name: 'Profile Settings', path: '/designer/profile', icon: <Users size={18} /> },
  ];

  // Dynamic Title Generator based on path
  const getPageTitle = () => {
    const currentItem = navItems.find(item => pathname.startsWith(item.path));
    return currentItem ? currentItem.name : 'Dashboard Overview';
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      
      {/* ── SIDEBAR ── */}
      <aside className="w-[280px] bg-white border-r border-slate-100 flex flex-col shrink-0">
        <div className="h-20 flex items-center px-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Scissors size={22} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-[20px] font-black text-slate-900 tracking-tight">SUTURA</span>
              <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none">Designer Portal</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-8">
          <div>
            <div className="px-4 mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Creative Studio</div>
            <nav className="space-y-1">
              {navItems.map((item, idx) => {
                const isActive = pathname === item.path;
                return (
                  <Link 
                    key={idx} 
                    href={item.path}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-[14px] font-black transition-all group ${
                      isActive 
                        ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' 
                        : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {item.icon}
                    </div>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Dev Quick Access */}
          <div className="px-4">
            <div className="mb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">System Switcher</div>
            <button 
              onClick={() => setIsDevMenuOpen(!isDevMenuOpen)}
              className="w-full flex items-center justify-between bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl text-[12px] font-black text-slate-600 hover:bg-white hover:border-slate-200 transition-all shadow-sm group"
            >
              <span>Explore Portals</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isDevMenuOpen ? 'rotate-180 text-slate-900' : 'text-slate-300'}`} />
            </button>
            
            {isDevMenuOpen && (
              <div className="mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                <div className="flex flex-col py-1">
                  <Link href="/owner/dashboard" className="px-5 py-2.5 text-[12px] font-black text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">Shop Owner</Link>
                  <Link href="/customer/dashboard" className="px-5 py-2.5 text-[12px] font-black text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">Customer</Link>
                  <Link href="/staff/tasks" className="px-5 py-2.5 text-[12px] font-black text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">Staff Portal</Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Brand Banner */}
        <div className="p-6">
           <div className="bg-indigo-50 rounded-[32px] p-6 border border-indigo-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 bg-indigo-200/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-2">Designer Rank</div>
              <div className="text-[16px] font-black text-indigo-900 leading-none mb-1">Couturier</div>
              <div className="text-[10px] font-black text-indigo-400">Elite Designer</div>
           </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
        
        {/* ── TOP BAR ── */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-10 shrink-0 z-40 sticky top-0">
          <div className="flex items-center gap-8">
            <h1 className="text-[20px] font-black text-slate-900 tracking-tight leading-none uppercase">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group hidden lg:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search collection... (⌘K)" 
                className="w-80 h-11 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900 focus:ring-0 transition-all shadow-sm"
              />
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all relative shadow-sm">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
              </button>

              <div className="relative">
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-[22px] hover:bg-slate-50 transition-all group">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 border-2 border-white shadow-xl shadow-indigo-100 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Designer_Marc`} alt="" />
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-[14px] font-black text-slate-900 leading-none">Marc Jacobs</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Lead Designer</div>
                  </div>
                  <ChevronDown size={14} className={`text-slate-300 transition-transform ${isUserMenuOpen ? 'rotate-180 text-slate-900' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                      <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/50">
                        <div className="text-[14px] font-black text-slate-900">Marc Jacobs</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Lead Designer</div>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link href="/designer/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-black text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
                          <Settings size={16} /> Profile Settings
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

        {/* ── VIEWPORT ── */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-10 max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

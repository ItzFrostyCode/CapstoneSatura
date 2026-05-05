'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useERPStore } from './store/useERPStore';
import { 
  Scissors, Users, ShoppingBag, 
  PackageSearch, Receipt, BarChart3, 
  Search, Bell, Plus, ChevronDown, Building2,
  LayoutDashboard, Settings, LogOut, Calendar, UserPlus,
  Check, MapPin, ChevronLeft, ChevronRight, Zap, History, Clock, Crown
} from 'lucide-react';

// Moved navItems outside to prevent recreation on every render
const navItems = [
  { name: 'Dashboard', path: '/owner/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Customers', path: '/owner/customers', icon: <UserPlus size={20} /> },
  { name: 'Appointments', path: '/owner/appointments', icon: <Calendar size={20} /> },
  { name: 'Orders', path: '/owner/orders', icon: <ShoppingBag size={20} /> },
  { name: 'Inventory', path: '/owner/inventory', icon: <PackageSearch size={20} /> },
  { name: 'Suppliers', path: '/owner/suppliers', icon: <Building2 size={20} /> },
  { name: 'Staff', path: '/owner/staff', icon: <Users size={20} /> },
  { name: 'Billing', path: '/owner/billing', icon: <Receipt size={20} /> },
  { name: 'Reports', path: '/owner/reports', icon: <BarChart3 size={20} /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentPlan, currentUser } = useERPStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  // Clock Logic
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    setCurrentTime(new Date());

    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  // Dynamic Title Logic
  const getPageTitle = () => {
    const currentItem = navItems.find(item => pathname === item.path || pathname.startsWith(item.path + '/'));
    return currentItem ? currentItem.name : 'Overview';
  };

  // Disable layout for onboarding/welcome
  if (pathname === '/setup/welcome') {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-outfit text-slate-900">
      
      {/* ── ARTISAN RAIL (Floating Sidebar) ── */}
      <aside 
        className={`bg-white h-[calc(100vh-32px)] m-4 rounded-[32px] border border-slate-200/60 flex flex-col shrink-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative z-50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${
          isSidebarCollapsed ? 'w-[88px]' : 'w-[280px]'
        }`}
      >
        {/* Modern Tab Toggle */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute top-12 -right-3 w-6 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 shadow-sm transition-all z-[60] group"
        >
          {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Branding */}
        <div className={`h-24 flex items-center transition-all duration-300 ${isSidebarCollapsed ? 'justify-center' : 'px-8 gap-4'}`}>
          <div className="w-12 h-12 bg-white border border-slate-200/60 rounded-2xl flex items-center justify-center text-slate-900 shrink-0 shadow-sm">
            <Scissors size={24} strokeWidth={2.5} />
          </div>
          {!isSidebarCollapsed && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="text-[18px] font-black tracking-tight text-slate-900 flex items-center gap-2">
                 <span className="text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded ml-1">{currentPlan}</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-1.5 flex flex-col ${
          isSidebarCollapsed 
            ? 'items-center px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]' 
            : 'px-6 custom-scrollbar'
        }`}>
          {navItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center rounded-2xl transition-all group relative h-12 ${
                  isSidebarCollapsed ? 'justify-center w-12' : 'px-4 gap-4 w-full'
                } ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className={`shrink-0 transition-transform duration-200 ${isActive ? 'scale-110 text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
                  {item.icon}
                </div>
                {!isSidebarCollapsed && (
                  <span className="text-[14px] font-bold whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                    {item.name}
                  </span>
                )}
                {isSidebarCollapsed && (
                  <div className="absolute left-16 px-3 py-1.5 bg-slate-900 text-white text-[12px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] shadow-xl">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>

      </aside>

      {/* ── MAIN WORKSPACE ── */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* ── SEAMLESS HEADER (Borderless) ── */}
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
            {/* Search Pill - Clean & Rounded */}
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="w-64 h-11 pl-12 pr-6 bg-white border border-slate-200 rounded-full text-[13px] font-medium outline-none focus:border-slate-400 focus:shadow-md transition-all placeholder:text-slate-400 shadow-sm"
              />
            </div>

            {/* Utility Icons & Profile Cluster */}
            <div className="flex items-center gap-5">
              {/* Messages Icon */}
              <button className="text-slate-400 hover:text-slate-900 transition-colors relative group">
                <div className="w-5 h-5 flex items-center justify-center">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
              </button>

              {/* Notification Bell */}
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="text-slate-400 hover:text-slate-900 transition-colors relative group"
              >
                <Bell size={20} className="transition-transform group-hover:rotate-[15deg] duration-300" />
                <span className="absolute -top-1 -right-1 bg-[#FF3B30] text-white text-[6px] font-black w-[16px] h-[16px] rounded-full flex items-center justify-center shadow-[0_2px_4px_rgba(255,59,48,0.2)]">13</span>
              </button>

              {/* User Profile - Artisan Style */}
              <div className="relative ml-2">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 transition-all group"
                >
                  <span className="text-[14px] font-black text-slate-900 tracking-tight hidden sm:block">Joshua Wayman Arabejo</span>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                      <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                       <ChevronDown size={10} className={`transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </button>

                {/* User Dropdown */}
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

        {/* ── PAGE CONTENT (Scrollable) ── */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="p-10 pt-4 max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </main>

      {/* ── COMMAND PALETTE (UX Layer) ── */}
      <div className="fixed inset-0 z-[300] flex items-start justify-center pt-[10vh] pointer-events-none">
         <div className="w-full max-w-[650px] bg-white border border-slate-200 rounded-[32px] shadow-2xl p-4 opacity-0 scale-95 pointer-events-auto transform transition-all duration-300 translate-y-4 group-focus-within:opacity-100 group-focus-within:scale-100 group-focus-within:translate-y-0 hidden">
            <div className="flex items-center gap-4 px-4 py-3 border-b border-slate-100">
               <Search size={22} className="text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search for customers, orders, or run commands..." 
                 className="flex-1 bg-transparent border-none outline-none text-[16px] font-medium text-slate-900"
               />
               <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-black text-slate-400 uppercase tracking-widest">ESC</div>
            </div>
            
            <div className="p-4 space-y-6">
               <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Quick Actions</div>
                  <div className="grid grid-cols-2 gap-2">
                     <button className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left group">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all"><Plus size={18} /></div>
                        <div>
                           <div className="text-[13px] font-black text-slate-900">New Job Order</div>
                           <div className="text-[11px] text-slate-400 font-medium">Create a bespoke order</div>
                        </div>
                     </button>
                     <button className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-colors text-left group">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all"><UserPlus size={18} /></div>
                        <div>
                           <div className="text-[13px] font-black text-slate-900">Add Customer</div>
                           <div className="text-[11px] text-slate-400 font-medium">Register a new client</div>
                        </div>
                     </button>
                  </div>
               </div>

               <div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Recent Searches</div>
                  <div className="space-y-1">
                     {['#ORD-1024 (Suit Fitting)', 'Alexander McQueen', 'Inventory: Italian Wool'].map((s) => (
                       <button key={s} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-[13px] font-bold text-slate-600 transition-colors">
                          <History size={16} className="text-slate-300" /> {s}
                       </button>
                     ))}
                  </div>
               </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 rounded-b-[32px]">
               <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><ChevronDown size={14} /> Navigate</span>
                  <span className="flex items-center gap-1"><Zap size={14} /> Actions</span>
               </div>
               <span>Press ⌘K to focus search</span>
            </div>
         </div>
      </div>
    </div>
  );
}
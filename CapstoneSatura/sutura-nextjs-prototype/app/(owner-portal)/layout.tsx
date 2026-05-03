'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Scissors, Users, ShoppingBag, 
  PackageSearch, Receipt, BarChart3, 
  Search, Bell, Plus, ChevronDown, Building2,
  LayoutDashboard, Settings, LogOut, Calendar, UserPlus,
  Check, MapPin, ChevronLeft, ChevronRight, Zap, History, User, Sparkles
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/owner/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Customers', path: '/owner/clients', icon: <UserPlus size={20} /> },
    { name: 'Appointments', path: '/owner/appointments', icon: <Calendar size={20} /> },
    { name: 'Orders', path: '/owner/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Inventory', path: '/owner/inventory', icon: <PackageSearch size={20} /> },
    { name: 'Suppliers', path: '/owner/suppliers', icon: <Building2 size={20} /> },
    { name: 'Staff', path: '/owner/staff', icon: <Users size={20} /> },
    { name: 'Billing', path: '/owner/billing', icon: <Receipt size={20} /> },
    { name: 'Reports', path: '/owner/reports', icon: <BarChart3 size={20} /> },
    { name: 'Branches', path: '/owner/branches', icon: <MapPin size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* ── SIDEBAR (Collapsible) ── */}
      <aside 
        className="bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 relative z-50 w-[80px]"
      >


        {/* ── BRANDING & WORKSPACE DROPDOWN ── */}
        <div className="relative">
          <div 
            className="w-full h-24 flex items-center border-b border-slate-100 transition-colors group justify-center"
          >
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg group-hover:scale-105 transition-transform">
              <Scissors size={24} strokeWidth={2.5} />
            </div>
          </div>

          {/* Workspace Dropdown Modal */}
          {isWorkspaceMenuOpen && (
            <>
              <div className="fixed inset-0 z-[100]" onClick={() => setIsWorkspaceMenuOpen(false)}></div>
              <div className={`absolute top-[70px] ${isSidebarCollapsed ? 'left-20' : 'left-6'} w-[280px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 z-[110] p-2 animate-in fade-in slide-in-from-top-2 duration-200`}>
                
                {/* Subscription Info inside Dropdown */}
                <div className="bg-slate-50 rounded-xl p-4 mb-2 relative overflow-hidden border border-slate-100">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-[40px]"></div>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 border border-slate-200 shadow-sm">
                      <Zap size={20} className="fill-indigo-100" />
                    </div>
                    <div>
                      <div className="text-[8px] font-black text-slate-900 leading-tight uppercase tracking-[0.15em]">Pro Plan</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Link 
                    href="/owner/subscription"
                    onClick={() => setIsWorkspaceMenuOpen(false)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-[13px] font-bold text-slate-700"
                  >
                    <Settings size={16} className="text-slate-400" /> Subscription Settings
                  </Link>
                  <Link 
                    href="/owner/branches"
                    onClick={() => setIsWorkspaceMenuOpen(false)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-[13px] font-bold text-slate-700"
                  >
                    <Building2 size={16} className="text-slate-400" /> Manage Branches
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── NAVIGATION LIST ── */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5 custom-scrollbar flex flex-col items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center justify-center rounded-2xl transition-all group relative h-12 w-12 ${
                  isActive 
                    ? 'bg-slate-100 text-slate-900' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className={`shrink-0 transition-transform duration-200 ${isActive ? 'scale-110 text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>
                  {item.icon}
                </div>
                
                {/* Hover Tooltip */}
                <div className="absolute left-16 px-3 py-1.5 bg-slate-900 text-white text-[12px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] shadow-xl flex items-center gap-2">
                  {item.name}
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
                </div>
              </Link>
            );
          })}
        </div>

        {/* ── BOTTOM USER AREA ── */}
        <div className="p-4 border-t border-slate-100 relative flex justify-center pb-8">
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center justify-center p-1 rounded-2xl hover:bg-slate-50 transition-all group"
          >
            <div className="relative shrink-0">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-[15px] border-2 border-white shadow-md group-hover:border-indigo-200 transition-all">
                JA
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm"></div>
            </div>
          </button>

          {/* User Menu Modal */}
          {isUserMenuOpen && (
            <>
              <div className="fixed inset-0 z-[100]" onClick={() => setIsUserMenuOpen(false)}></div>
              <div className={`absolute bottom-[70px] ${isSidebarCollapsed ? 'left-20' : 'left-4 w-[248px]'} bg-white rounded-[24px] shadow-2xl border border-slate-100 py-2 z-[110] animate-in fade-in slide-in-from-bottom-2 duration-200 overflow-hidden`}>
                <div className="px-5 py-3 border-b border-slate-50">
                  <div className="text-[14px] font-black text-slate-900 leading-none">Joshua Arabejo</div>
                  <div className="text-[11px] text-slate-500 mt-1 font-bold">joshua@sutura.com</div>
                </div>
                <div className="p-2 space-y-1">
                  <Link href="/owner/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-black text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
                    <Settings size={16} /> Settings
                  </Link>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-black text-rose-600 hover:bg-rose-50 transition-all">
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* ── MAIN AREA (No Header) ── */}
      <main className="flex-1 overflow-y-auto bg-slate-50 relative custom-scrollbar">
        {/* Global Notification Bell Floating */}
        <div className="fixed top-8 right-10 z-[100] flex items-center gap-4">
           <button className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 shadow-xl shadow-slate-900/5 transition-all relative group active:scale-95">
              <Bell size={22} />
              <div className="absolute top-3 right-3 w-3 h-3 bg-rose-500 border-2 border-white rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
              
              {/* Dropdown Indicator on Hover */}
              <div className="absolute top-14 right-0 w-[300px] bg-white border border-slate-100 rounded-2xl shadow-2xl p-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all pointer-events-none">
                 <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Recent Alerts</div>
                 <div className="space-y-3">
                    <div className="flex gap-3">
                       <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0"></div>
                       <div>
                          <div className="text-[13px] font-bold text-slate-900 leading-tight">Low Stock: Silk Thread</div>
                          <div className="text-[11px] text-slate-500 font-medium">Only 2 cones remaining in main HQ.</div>
                       </div>
                    </div>
                 </div>
              </div>
           </button>
        </div>

        {/* Subtle background gradient to make up for removed header */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </div>
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

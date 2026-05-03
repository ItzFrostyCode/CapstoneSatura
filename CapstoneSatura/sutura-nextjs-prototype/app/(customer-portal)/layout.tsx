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
    { name: 'My Dashboard', path: '/customer/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Design Inspiration', path: '/customer/designs', icon: <ShoppingBag size={18} /> },
    { name: 'Find Shops', path: '/customer/shops', icon: <Building2 size={18} /> },
  ];

  // Dynamic Title Generator based on path
  const getPageTitle = () => {
    const currentItem = navItems.find(item => pathname.startsWith(item.path));
    return currentItem ? currentItem.name : 'Dashboard Overview';
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* 1. Left Sidebar (Solid, Clean, Minimal) */}
      <aside className="w-[260px] bg-white border-r border-slate-200 flex flex-col shrink-0 z-20">
        {/* Branding */}
        <div className="h-[64px] flex items-center px-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center shrink-0">
              <Scissors size={18} strokeWidth={2.5} />
            </div>
            <div className="font-bold text-[18px] tracking-tight text-slate-900">Sutura</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/');
            return (
              <Link 
                key={idx} 
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-[14px] font-medium transition-colors ${
                  isActive 
                    ? 'bg-slate-100 text-slate-900' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className={`shrink-0 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                  {item.icon}
                </div>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Developer Quick Links Dropdown */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 relative">
          <button 
            onClick={() => setIsDevMenuOpen(!isDevMenuOpen)}
            className="w-full flex items-center justify-between bg-white border border-slate-200 px-3 py-2 rounded-md text-[13px] font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <span>Dev Portals</span>
            <ChevronDown size={14} className={`transition-transform ${isDevMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDevMenuOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-slate-900 rounded-lg shadow-xl border border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-50">
              <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">Test Navigation</div>
              <div className="flex flex-col py-1">
                <Link href="/" className="px-4 py-2 text-[12px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Landing Page</Link>
                <Link href="/login" className="px-4 py-2 text-[12px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Login</Link>
                <Link href="/register" className="px-4 py-2 text-[12px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Register (Shopowner)</Link>
                <Link href="/designer/portfolio" className="px-4 py-2 text-[12px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Register (Designer)</Link>
                <Link href="/customer/dashboard" className="px-4 py-2 text-[12px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Customer Portal</Link>
                <Link href="/staff/tasks" className="px-4 py-2 text-[12px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Staff (Tailor)</Link>
                <Link href="/owner/dashboard" className="px-4 py-2 text-[12px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Shop Owner</Link>
                <Link href="/admin/dashboard" className="px-4 py-2 text-[12px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Admin Portal</Link>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        
        {/* 2. Top App Bar */}
        <header className="h-[64px] bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
          <h1 className="text-[18px] font-bold text-slate-900 tracking-tight">
            {getPageTitle()}
          </h1>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search orders, customers..." 
                className="w-64 h-9 pl-9 pr-4 rounded-md bg-slate-100 border-transparent focus:bg-white focus:border-slate-300 focus:ring-2 focus:ring-slate-200 text-[13px] outline-none transition-all placeholder:text-slate-500"
              />
            </div>

            {/* Quick Action */}
            <Link href="/orders/new" className="hidden sm:flex items-center gap-2 bg-slate-900 text-white h-9 px-4 rounded-md text-[13px] font-semibold hover:bg-slate-800 transition-colors shadow-sm">
              <Plus size={16} /> New Order
            </Link>

            <div className="w-px h-6 bg-slate-200"></div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="text-slate-500 hover:text-slate-900 transition-colors relative group"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>

              {isNotificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}></div>
                  <div className="absolute right-0 mt-4 w-[400px] bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                       <h3 className="text-[16px] font-black text-slate-900 tracking-tight">System Alerts</h3>
                       <span className="text-[10px] font-black text-indigo-600 bg-white px-3 py-1 rounded-full border border-slate-200">6 NEW</span>
                    </div>
                    <div className="max-h-[500px] overflow-y-auto">
                      {[
                        { cat: "Inventory", title: "Material Shortage", msg: "Premium Silk is below 2m threshold at Makati.", type: "alert", time: "2m ago" },
                        { cat: "Orders", title: "Delayed Fitting", msg: "Elena Rostova (Fitting) is 15m overdue.", type: "warning", time: "15m ago" },
                        { cat: "Billing", title: "Subscription Renewing", msg: "Pro Plan will auto-renew on May 24, 2026.", type: "info", time: "2h ago" },
                        { cat: "Branches", title: "Branch Milestone", msg: "BGC Branch exceeded weekly revenue target.", type: "success", time: "5h ago" },
                        { cat: "Customers", title: "New Profile", msg: "Alexander McQueen registered via portal.", type: "info", time: "1d ago" },
                        { cat: "Reports", title: "EOM Report Ready", msg: "April Operational Audit is ready for review.", type: "success", time: "2d ago" },
                      ].map((n, i) => (
                        <div key={i} className="px-8 py-5 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
                           <div className="flex items-center justify-between mb-1">
                              <span className={`text-[9px] font-black uppercase tracking-widest ${
                                n.type === 'alert' ? 'text-rose-600' : 
                                n.type === 'warning' ? 'text-amber-600' : 
                                n.type === 'success' ? 'text-emerald-600' : 
                                'text-indigo-600'
                              }`}>{n.cat}</span>
                              <span className="text-[10px] font-bold text-slate-400">{n.time}</span>
                           </div>
                           <h4 className="text-[14px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{n.title}</h4>
                           <p className="text-[12px] text-slate-500 font-medium leading-relaxed mt-1">{n.msg}</p>
                        </div>
                      ))}
                    </div>
                    <button className="w-full py-4 text-[12px] font-black text-slate-400 hover:text-slate-900 transition-colors bg-slate-50/50">
                      View All Notifications
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center font-bold text-[13px] text-white border border-slate-900 shadow-sm">
                  JA
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsUserMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-3 border-b border-slate-50">
                      <div className="text-[13px] font-black text-slate-900">Joshua Arabejo</div>
                      <div className="text-[11px] font-medium text-slate-500">Shop Owner</div>
                    </div>
                    <div className="py-1">
                      <Link href="/settings" className="flex items-center gap-3 px-4 py-2 text-[13px] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <Settings size={16} /> Platform Settings
                      </Link>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-[13px] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                        <Users size={16} /> Staff Accounts
                      </button>
                    </div>
                    <div className="border-t border-slate-50 mt-1 pt-1">
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-[13px] font-black text-rose-600 hover:bg-rose-50 transition-colors">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

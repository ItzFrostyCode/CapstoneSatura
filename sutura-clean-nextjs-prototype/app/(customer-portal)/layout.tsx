'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useERPStore } from "@/store/useERPStore";
import { 
  Scissors, Bell, UserCircle, Home, Menu, 
  HelpCircle, LogIn, LogOut, Store as ShopIcon, X,
  Search, Package, Calendar, MessageSquare
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Home", path: "/", icon: Home },
  { name: "Notification", path: "/customer/notifications", icon: Bell },
  { name: "Me", path: "/customer/dashboard", icon: UserCircle },
];

export default function CustomerPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser } = useERPStore();
  const [scrolled, setScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const isDiscoveryPage = pathname.includes('/customer/shops/') || pathname.includes('/customer/book');

  return (
    <div className="min-h-screen font-poppins overflow-x-hidden selection:bg-slate-100 bg-[#FAF8F5]">
      
      {/* MOBILE-FIRST CENTERED CANVAS (480px) */}
      <div className="max-w-[480px] mx-auto min-h-screen bg-[#FAF8F5] shadow-[0_0_50px_rgba(0,0,0,0.05)] flex flex-col relative border-x border-slate-100/50">
        
        {/* SIDEBAR NAVIGATION (Global) */}
        {isSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[6000] animate-in fade-in duration-300"
              onClick={() => setIsSidebarOpen(false)}
            />
            <div className="fixed left-1/2 -translate-x-[240px] top-0 bottom-0 w-[280px] bg-white z-[6001] shadow-2xl flex flex-col animate-in slide-in-from-left duration-300 max-w-[480px]">
              <div className="p-8 bg-[#069668] text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                    <Scissors size={20} className="text-[#069668]" />
                  </div>
                  <span className="text-xl font-black tracking-tighter uppercase">SUTURA</span>
                </div>
                <p className="text-emerald-50 text-[11px] font-bold uppercase tracking-widest opacity-60">Davao Tailoring Hub</p>
              </div>

              <nav className="flex-1 px-4 py-8 space-y-2">
                {[
                  { name: "Home", icon: Home, path: "/" },
                  { name: "Shops", icon: ShopIcon, path: "/shops" },
                  { name: "How It Works", icon: HelpCircle, path: "/how-it-works" },
                ].map((item, i) => (
                  <Link 
                    key={i} 
                    href={item.path}
                    className="flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all group"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[15px] font-bold">{item.name}</span>
                  </Link>
                ))}

                <div className="h-px bg-slate-100 my-4 mx-4" />

                <Link 
                  href="/login?role=owner"
                  className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-slate-50 text-slate-900 hover:bg-slate-100 transition-all group"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <ShopIcon size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-black uppercase tracking-widest leading-tight">Login Shop/Staff Owner Portal</span>
                </Link>

                {currentUser ? (
                  <button 
                    onClick={() => {
                      setIsSidebarOpen(false);
                      window.location.href = '/login';
                    }}
                    className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-rose-600 hover:bg-rose-50 transition-all group text-left"
                  >
                    <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[15px] font-bold">Logout</span>
                  </button>
                ) : (
                  <Link 
                    href="/login"
                    className="flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all group"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <LogIn size={20} className="group-hover:scale-110 transition-transform" />
                    <span className="text-[15px] font-bold">Sign In</span>
                  </Link>
                )}

              </nav>

              <div className="p-8 border-t border-slate-50">
                <div className="text-[11px] font-black text-slate-900 uppercase">SUTURA</div>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">© 2026 SUTURA System</p>
              </div>
            </div>
          </>
        )}

        {/* HEADER (Two-Row Design to match Home) */}
        {!pathname.includes('/customer/appointments') && (
          <header className="sticky top-0 z-[3000] bg-[#069668] pt-6 pb-4 px-4 shadow-xl">
            {/* TOP ROW: BRANDING ONLY */}
            <div className="flex items-center mb-5 px-2 gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="text-white/80 hover:text-white active:scale-90 transition-all"
              >
                <Menu size={24} />
              </button>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Scissors size={14} className="text-[#069668]" />
                </div>
                <span className="text-lg font-black text-white tracking-tighter uppercase">SUTURA</span>
              </Link>
            </div>
            
            {/* SECOND ROW: SEARCH + ACTIONS */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative group cursor-pointer">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                  <Search size={18} />
                </div>
                <input 
                  readOnly
                  type="text" 
                  placeholder="Search tailors, shops..." 
                  className="w-full h-11 pl-11 pr-4 bg-white rounded-2xl text-[14px] font-medium outline-none cursor-pointer shadow-inner border border-white/5"
                />
              </div>
              
              <div className="flex items-center gap-2.5">
                <Link href="/customer/appointments" className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 active:scale-90 transition-all">
                  <MessageSquare size={20} className="text-white" />
                </Link>
                <button className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 active:scale-90 transition-all relative">
                  <Package size={20} className="text-white" />
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full border-2 border-[#069668]" />
                </button>
              </div>
            </div>
          </header>
        )}

        {/* MAIN CONTENT AREA */}
        <main className={`flex-1 flex flex-col ${isDiscoveryPage || pathname.includes('/customer/appointments') ? '' : ''} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
          {children}
        </main>

        {/* BOTTOM NAVIGATION (Fixed & Centered) */}
        {!isDiscoveryPage && (
          <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/95 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around py-3 px-4 z-[4000] pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
            {NAV_ITEMS.map((item, i) => {
               const Icon = item.icon;
               const isActive = pathname === item.path;
               return (
                 <Link 
                  key={i} 
                  href={item.path} 
                  className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-slate-900' : 'text-slate-400'}`}
                 >
                   <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-slate-50 scale-110' : 'hover:bg-slate-50'}`}>
                    <Icon size={20} />
                   </div>
                   <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                    {item.name}
                   </span>
                 </Link>
               );
            })}
          </nav>
        )}
      </div>

    </div>
  );
}

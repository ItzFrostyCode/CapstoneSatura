"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useERPStore } from "@/store/useERPStore";
import { 
  Scissors, Home, Ruler, Calendar, History, Bell, User, LogOut, ChevronRight, Menu, X, Star, UserCircle, Store, HelpCircle, Globe, Check, Search, Map
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Production Status", path: "/customer/dashboard", icon: Home },
  { name: "Appointments", path: "/customer/appointments", icon: Calendar },
  { name: "Measurements", path: "/customer/measurements", icon: Ruler },
  { name: "Order History", path: "/customer/history", icon: History },
  { name: "Profile Settings", path: "/customer/profile", icon: UserCircle },
];

export default function CustomerPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { currentUser, currentShop } = useERPStore();
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isDiscoveryPage = pathname.includes('/customer/shops/') || 
                          pathname.includes('/customer/designers/') || 
                          pathname.includes('/customer/book');

  // Auto-close sidebar on discovery pages
  useEffect(() => {
    if (isDiscoveryPage) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isDiscoveryPage]);

  // Theme Overrides (matching homepage)
  const primaryColor = currentShop?.themeColor || '#059669'; // Emerald-600 fallback

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-slate-900 overflow-x-hidden flex flex-col" style={{fontFamily:"'Inter', sans-serif"}}>
      
      {/* ===== 3-TIER SHOPEE-STYLE HEADER (From Homepage) ===== */}
      <header className="fixed top-0 w-full z-[1000]">
        {/* TIER 1 — UTILITY BAR */}
        <div className="bg-emerald-800 text-white text-[11px] font-bold transition-colors">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-9 flex items-center justify-between">
            <div className="flex items-center gap-6 text-white/70">
              <Link href="/login?role=owner" className="hover:text-white transition-colors flex items-center gap-1.5"><Store size={12}/> Log In Shop Owner / Staff</Link>
              <span className="text-white/20">|</span>
              <Link href="/login?role=designer" className="hover:text-white transition-colors flex items-center gap-1.5"><Scissors size={12}/> For Designers</Link>
              <span className="text-white/20">|</span>
              <span className="text-white/50">Follow us:</span>
              <span className="hover:text-white cursor-pointer">Facebook</span>
              <span className="hover:text-white cursor-pointer">Instagram</span>
            </div>
            <div className="flex items-center gap-6 text-white/70">
              {/* NOTIFICATIONS */}
              <div 
                className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={12}/> Notifications
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full border border-emerald-800" />
                
                {showNotifications && (
                  <div className="absolute top-6 right-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 text-slate-900 animate-in fade-in slide-in-from-top-2 duration-300 z-[2000]">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-50">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Notifications</span>
                      <span className="text-[9px] font-bold text-emerald-600 cursor-pointer">Mark all as read</span>
                    </div>
                    <div className="flex gap-3 items-start p-2 bg-emerald-50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
                        <Check size={14} className="text-white"/>
                      </div>
                      <div>
                        <div className="text-[11px] font-black leading-tight">System Notification</div>
                        <div className="text-[10px] font-medium text-slate-500 mt-1">Your order #SUT-2024 is now in production.</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                <HelpCircle size={12}/> Help
              </div>
              <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                <Globe size={12}/> English
              </div>

              {/* PROFILE DROPDOWN */}
              {currentUser ? (
                <div 
                  className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors pl-4 border-l border-white/20 relative"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center overflow-hidden border-2 border-white/50 shadow-sm">
                      <img src={currentUser.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=ffdfbf"} alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <span className="tracking-tight text-[11px] font-black">{currentUser.name}</span>
                  
                  {showProfileMenu && (
                    <div className="absolute top-8 right-0 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden text-slate-900 animate-in fade-in slide-in-from-top-2 duration-300 z-[2000]">
                      <div className="p-2">
                        <Link 
                          href="/customer/profile" 
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm">
                            <UserCircle size={16} className="text-slate-500" />
                          </div>
                          <span className="text-xs font-bold text-slate-700">My Account</span>
                        </Link>
                        
                        <Link 
                          href="/owner/dashboard" 
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 transition-all">
                            <Store size={16} className="text-emerald-600 group-hover:text-white" />
                          </div>
                          <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-700">Shop Owner Portal</span>
                        </Link>

                        <Link 
                          href="/designer/dashboard" 
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 transition-all">
                            <Scissors size={16} className="text-indigo-600 group-hover:text-white" />
                          </div>
                          <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700">Fashion Designer Portal</span>
                        </Link>

                        <div className="h-[1px] bg-slate-50 my-1" />
                        
                        <Link href="/login" className="flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 transition-all group text-rose-600">
                          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center group-hover:bg-rose-600 transition-all">
                            <LogOut size={16} className="text-rose-600 group-hover:text-white" />
                          </div>
                          <span className="text-xs font-bold">Logout</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors pl-4 border-l border-white/20">
                  <span className="uppercase tracking-widest text-[10px] font-black">Login / Register</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* TIER 2 — MAIN BRAND BAR */}
        <div className={`bg-emerald-700 transition-all duration-300 ${scrolled ? "py-3 shadow-xl" : "py-4"}`}>
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center gap-8">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                {currentShop?.logoUrl ? (
                  <img src={currentShop.logoUrl} alt="Shop Logo" className="w-full h-full object-cover" />
                ) : (
                  <Scissors className="w-5 h-5 text-emerald-700" />
                )}
              </div>
              <span className="text-2xl font-black tracking-tighter text-white uppercase">{currentShop?.shopName || 'SUTURA'}</span>
            </Link>

            {/* SEARCH BAR */}
            <div className="flex-1 flex max-w-[700px]">
              <div className="flex-1 flex items-center bg-white rounded-l-2xl overflow-hidden">
                <div className="px-4 text-slate-300"><Search size={18}/></div>
                <input
                  type="text"
                  placeholder="Search For Shop Owners, designers, or garment types..."
                  className="flex-1 bg-transparent border-none outline-none text-slate-700 font-semibold py-3.5 pr-4 text-sm placeholder:text-slate-300"
                />
              </div>
              <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 px-6 rounded-r-2xl font-black transition-all active:scale-95">
                <Search size={20}/>
              </button>
            </div>

            {/* MAP BUTTON */}
            <Link
              href="/#map"
              className="flex items-center gap-2 h-12 px-5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white rounded-2xl font-bold text-[13px] transition-all active:scale-95 backdrop-blur-sm shrink-0 group"
            >
              <Map size={18} className="group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline text-[12px] font-black uppercase tracking-widest">Map</span>
            </Link>
          </div>
        </div>

        {/* TIER 3 — QUICK LINKS BAR */}
        <div 
          className="border-t transition-colors"
          style={{ backgroundColor: primaryColor, borderTopColor: 'rgba(255,255,255,0.1)' }}
        >
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-9 flex items-center gap-8 overflow-x-auto scrollbar-hide">
            {!isDiscoveryPage ? (
              <>
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="text-white/70 hover:text-white flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider"
                >
                  <Menu size={14} /> Menu
                </button>
                <div className="h-4 w-[1px] bg-white/10" />
                {NAV_ITEMS.map((item, i) => (
                  <Link 
                    key={i} 
                    href={item.path} 
                    className={`text-white/70 hover:text-white text-[11px] font-bold whitespace-nowrap transition-colors uppercase tracking-wider ${pathname === item.path ? 'text-white' : ''}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </>
            ) : (
              ["🎩 Custom Barong","🕴️ Bespoke Suits","👰 Bridal Couture","👗 Filipiniana","👟 Streetwear","🏢 Corporate Uniforms","✦ PREMIUM Workshops","✦ Featured Designers"].map((item,i) => (
                <Link key={i} href="/#discover" className="text-white/70 hover:text-white text-[11px] font-bold whitespace-nowrap transition-colors uppercase tracking-wider">
                  {item}
                </Link>
              ))
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-[180px]">
        {!isDiscoveryPage && (
          <aside style={{ 
            width: sidebarOpen ? 280 : 0, 
            opacity: sidebarOpen ? 1 : 0,
            background: "transparent", 
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            position: "sticky",
            top: 180,
            height: "calc(100vh - 180px)",
            zIndex: 100,
            borderRight: "1px solid rgba(0,0,0,0.05)"
          }}>
            <nav className="p-4 flex flex-col gap-2 overflow-y-auto overflow-x-hidden scrollbar-hide flex-1">
              {NAV_ITEMS.map((item) => {
                const isActive = item.path === '/customer' 
                  ? (pathname === '/customer' || pathname === '/customer/' || pathname.startsWith('/customer/profile'))
                  : pathname.startsWith(item.path);
                const Icon = item.icon;
                return (
                  <Link key={item.path} href={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}>
                    <Icon size={18} />
                    <span className="text-sm font-bold">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}

        <main className={`flex-1 p-8 md:p-12 transition-all ${isDiscoveryPage ? 'max-w-[1400px] mx-auto' : ''}`}>
          {children}
        </main>
      </div>

    </div>
  );
}


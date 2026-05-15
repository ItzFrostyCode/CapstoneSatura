'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { 
  Search, MessageSquare, ShoppingCart, Scissors, 
  Star, Activity, Calendar, Ruler, MapPin,
  User, Store, Sparkles, Filter, Package, ArrowRight, Home, UserCircle,
  ChevronLeft, Trash2, X, Bell, Menu, Info, LogIn, LogOut, Store as ShopIcon, HelpCircle, Heart
} from 'lucide-react';
import { useERPStore } from "@/store/useERPStore";

const NAV_ITEMS = [
  { name: "Home", path: "/", icon: Home },
  { name: "Notification", path: "/customer/notifications", icon: Bell },
  { name: "Me", path: "/customer/dashboard", icon: UserCircle },
];

// CUSTOM SCROLL INDICATOR COMPONENT
const ScrollIndicator = ({ scrollRef }: { scrollRef: React.RefObject<HTMLDivElement | null> }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const current = el.scrollLeft;
      setProgress((current / max) * 100);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [scrollRef]);

  return (
    <div className="flex justify-center mt-4">
      <div className="w-[120px] h-[2px] bg-slate-100 rounded-full overflow-hidden relative">
        <div 
          className="absolute h-full bg-emerald-500 rounded-full transition-all duration-75"
          style={{ 
            width: '30%', 
            left: `${progress * 0.7}%` 
          }}
        />
      </div>
    </div>
  );
};

export default function SuturaStorefront() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { currentUser } = useERPStore();
  
  const specialtyRef = useRef<HTMLDivElement>(null);
  const artisanRef = useRef<HTMLDivElement>(null);

  // Mock data for search
  const recentSearches = ["Custom Barong", "Nursing Uniform", "Wedding Suit", "Davao Tailors"];
  const suggestions = [
    { name: "Golden Needle", img: "/catalog/Golden Needle Tailoring LOGO.png" },
    { name: "Hiyas Studio", img: "/catalog/Hiyas Tailoring Studio LOGO.png" },
    { name: "Davao Uniform", img: "/catalog/Davao Tailoring Shop LOGO.png" },
    { name: "Barong Specialist", img: "/catalog/Classsic Barong Tagalog.png" },
  ];

  return (
    <div className="min-h-screen font-poppins selection:bg-emerald-100 flex justify-center">
      
      {/* MOBILE CANVAS (480px) */}
      <div className="w-full max-w-[480px] min-h-screen bg-[#FAF8F5] shadow-[0_0_50px_rgba(0,0,0,0.1)] flex flex-col relative overflow-x-hidden">
        
        {/* SIDEBAR NAVIGATION */}
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-[6000] animate-in fade-in duration-300"
              onClick={() => setIsSidebarOpen(false)}
            />
            {/* Drawer */}
            <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white z-[6001] shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
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
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">© 2026 SUTURA System</p>
              </div>
            </div>
          </>
        )}

        {/* SEARCH OVERLAY */}
        {isSearching && (
          <div className="absolute inset-0 bg-white z-[5000] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="pt-6 pb-4 px-4 bg-[#069668] flex items-center gap-3 shadow-lg">
              <button 
                onClick={() => setIsSearching(false)}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-100/40">
                  <Search size={18} />
                </div>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search tailors, shops..." 
                  className="w-full h-11 pl-12 pr-4 bg-white rounded-2xl text-[14px] font-medium outline-none focus:ring-2 focus:ring-[#069668] transition-all shadow-inner"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* Recent Search Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Recent Searches</h3>
                  <button className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, i) => (
                    <div 
                      key={i} 
                      className="px-4 py-2 bg-slate-100 rounded-xl text-[13px] font-bold text-slate-600 active:bg-slate-200 active:text-slate-900 transition-all cursor-pointer border-none"
                    >
                      {term}
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-10" />

              {/* Search Suggestions */}
              <div>
                <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest mb-4">Search Suggestions</h3>
                <div className="grid grid-cols-2 gap-4">
                  {suggestions.map((item, i) => (
                    <div key={i} className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm flex flex-col gap-3 group active:scale-95 transition-all">
                      <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-50">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <span className="text-[12px] font-black text-slate-900 text-center px-1">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1. TOP HEADER */}
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
            <div 
              className="flex-1 relative group cursor-pointer"
              onClick={() => setIsSearching(true)}
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                <Search size={18} />
              </div>
              <input 
                readOnly
                type="text" 
                placeholder="Search tailors, shops..." 
                className="w-full h-11 pl-11 pr-4 bg-white rounded-2xl text-[14px] font-medium outline-none cursor-pointer shadow-inner border border-white/5"
                value={searchQuery}
              />
            </div>
            
            <div className="flex items-center gap-2.5">
              <Link href="/customer/appointments" className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 active:scale-90 transition-all">
                <MessageSquare size={20} className="text-white" />
              </Link>
              <button className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 active:scale-90 transition-all relative">
                <Package size={20} className="text-white" />
                <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-slate-400 rounded-full border-2 border-slate-900" />
              </button>
            </div>
          </div>
        </header>


        {/* 3. CATEGORY SECTION */}
        <section className="px-6 pt-8 pb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[17px] font-black text-slate-900 tracking-tight">Tailoring Services</h2>
          </div>
          <div 
            ref={specialtyRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide -mx-6 px-6"
          >
            {[
              { name: "Custom Tailoring", icon: "🕴️" },
              { name: "Bulk Order (Uniforms)", icon: "🏢" },
              { name: "Repair & Alterations", icon: "🧵" },
            ].map((cat, i) => (
              <div key={i} className="min-w-[85px] flex flex-col items-center gap-2 group cursor-pointer">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-2xl shadow-sm border border-slate-100 group-hover:bg-slate-50 group-hover:border-slate-200 transition-all">
                  {cat.icon}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">{cat.name}</span>
              </div>
            ))}
          </div>
          <ScrollIndicator scrollRef={specialtyRef} />
        </section>

        {/* 4. PREMIUM SHOPS */}
        <section className="bg-slate-50/50 py-8 px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[19px] font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Store size={20} className="text-slate-900" />
              Premium Shops
            </h2>
            <Link href="/shops" className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">View All</Link>
          </div>
          
          <div className="space-y-3">
            {[
              { name: "Golden Needle Tailoring", rating: 4.9, specialty: "Wedding & Formal", address: "Quirino Ave", distance: "1.2km", img: "/catalog/Golden Needle Tailoring LOGO.png" },
              { name: "Davao Uniform Center", rating: 4.8, specialty: "Corporate Uniforms", address: "Ponciano St", distance: "2.5km", img: "/catalog/Davao Tailoring Shop LOGO.png" },
              { name: "Hiyas Tailoring Studio", rating: 4.7, specialty: "Filipiniana & Terno", address: "Torres St", distance: "3.1km", img: "/catalog/Hiyas Tailoring Studio LOGO.png" },
            ].map((shop, i) => (
              <Link href="/customer/shops/1" key={i} className="bg-white rounded-[24px] p-3 border border-slate-100 shadow-sm hover:shadow-md hover:translate-x-1 transition-all cursor-pointer group flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100 p-2 group-hover:scale-105 transition-transform">
                  <img src={shop.img} alt={shop.name} className="w-full h-full object-contain" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="text-[14px] font-black text-slate-900 truncate group-hover:text-slate-900 transition-colors">{shop.name}</h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-black text-slate-900">{shop.rating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-[11px] font-medium text-slate-500 truncate">{shop.specialty}</p>
                    <div className="w-1 h-1 bg-slate-200 rounded-full" />
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Open</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 h-8 bg-slate-50 text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100 hover:bg-slate-900 hover:text-white transition-all">
                      Inquire
                    </button>
                    <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                      <Store size={12} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>


        {/* 6. READY-TO-WEAR SECTION */}
        <section className="py-8 px-6 bg-slate-50/50 border-t border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[19px] font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Package size={20} className="text-slate-900" />
                Ready-to-Wear
              </h2>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1">Available for fitting today</p>
            </div>
            <Link href="/catalog" className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
              <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pb-4">
            {[
              { name: "Classic Barong", price: "₱4,500", sizes: "S, M, L", stock: 12, img: "/catalog/Classsic Barong Tagalog.png", rating: 4.8, reviews: 24, likes: 156 },
              { name: "Nursing Uniform", price: "₱1,200", sizes: "XS - XL", stock: 45, img: "/catalog/Nursing Uniform.png", rating: 4.5, reviews: 18, likes: 92 },
              { name: "Modern Filipiniana", price: "₱8,900", sizes: "M, L", stock: 5, img: "/catalog/Modern Filipiniana.png", rating: 4.9, reviews: 42, likes: 312 },
              { name: "Wedding Tuxedo", price: "₱12,000", sizes: "Custom", stock: 2, img: "/catalog/Wedding Tuxedo.png", rating: 4.9, reviews: 12, likes: 58 },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm group hover:shadow-md transition-all cursor-pointer">
                <div className="aspect-4/5 bg-slate-50 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
                   <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-[14px] font-black text-slate-900 leading-tight">{item.name}</h4>
                  <p className="text-blue-600 text-[13px] font-black">{item.price}</p>
                </div>
                
                {/* SOCIAL ROW */}
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-black text-slate-900">{item.rating}</span>
                    <span className="text-[9px] font-bold text-slate-400">({item.reviews})</span>
                  </div>
                  <div className="h-3 w-px bg-slate-100" />
                  <div className="flex items-center gap-1">
                    <Heart size={10} className="text-rose-500 fill-rose-500" />
                    <span className="text-[9px] font-black text-rose-500">{item.likes}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Stock: {item.stock}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{item.sizes}</span>
                </div>
                <button className="w-full h-11 mt-4 bg-[#069668] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                  Reserve & Fit
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 7. NEARBY STUDIOS */}
        <section className="py-8 px-6 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[19px] font-black text-slate-900 tracking-tight flex items-center gap-2">
              <MapPin size={20} className="text-rose-500" />
              Tailoring Shops Near You
            </h2>
            <button className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">Open Map</button>
          </div>
          
          <div className="relative h-72 bg-slate-100 rounded-[32px] overflow-hidden border border-slate-100 shadow-inner group">
             <iframe 
               src="https://www.google.com/maps?q=Davao+City&output=embed" 
               className="absolute inset-0 w-full h-full border-0 grayscale-[0.2] opacity-60 pointer-events-none" 
               allowFullScreen={true} 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
             ></iframe>
             <div className="absolute inset-0 bg-linear-to-t from-slate-900/10 to-transparent pointer-events-none" />
             {[
               { t: '20%', l: '30%' }, { t: '40%', l: '60%' }, 
               { t: '65%', l: '25%' }, { t: '15%', l: '70%' }, 
               { t: '55%', l: '80%' }, { t: '30%', l: '45%' }, 
               { t: '75%', l: '55%' }
             ].map((pos, i) => (
               <div key={i} style={{ top: pos.t, left: pos.l }} className="absolute -translate-x-1/2 -translate-y-1/2 group/pin">
                  <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white scale-90 group-hover/pin:scale-110 transition-transform">
                    <Scissors size={14} />
                  </div>
               </div>
             ))}
             <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping" />
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl border-2 border-white relative z-10">
                    <User size={18} />
                  </div>
                </div>
                <div className="bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[8px] font-black uppercase text-blue-600 border border-blue-100 shadow-sm mt-1 mx-auto w-fit">Me</div>
             </div>
          </div>
        </section>

        {/* 8. FOOTER ACTION */}
        <div className="p-8 text-center bg-[#069668] border-t border-white/5 pb-24">
           <h3 className="text-white text-[18px] font-black mb-2">Build your wardrobe today.</h3>
           <p className="text-white/40 text-sm mb-6 max-w-[240px] mx-auto leading-relaxed">Connect with Davao&apos;s trusted tailors and designers.</p>
           <Link href="/register" className="inline-flex h-14 px-8 bg-white text-[#069668] rounded-2xl items-center justify-center text-[13px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/40">
             Get Started
           </Link>
        </div>

        {/* BOTTOM NAVIGATION */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white/95 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around py-3 px-4 z-[4000] pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
          {NAV_ITEMS.map((item, i) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              const isMe = item.name === "Me";

              return (
                <Link 
                key={i} 
                href={item.path} 
                className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-[#069668]' : 'text-slate-400'}`}
                >
                  <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-emerald-50 scale-110' : 'hover:bg-slate-50'}`}>
                    {isMe ? (
                      <div className={`w-5 h-5 rounded-full overflow-hidden border ${isActive ? 'border-[#069668]' : 'border-slate-200'}`}>
                        <img 
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=John%20Clock&backgroundColor=b6e3f4" 
                          alt="Me"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <Icon size={20} />
                    )}
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                  {item.name}
                  </span>
                </Link>
              );
          })}
        </nav>

      </div>
    </div>
  );
}

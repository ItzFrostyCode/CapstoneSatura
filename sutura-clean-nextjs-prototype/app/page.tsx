"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useERPStore } from "@/store/useERPStore";
import { Scissors, MapPin, Map, Star, ChevronRight, X, Lock, Store, UserCircle, ShieldCheck, ShoppingBag, Zap, Search, ArrowRight, TrendingUp, Heart, Notebook, Ruler, Package, CheckCircle, Bell, HelpCircle, Globe, Check, LogOut } from "lucide-react";

const SHOPS = [
  { id:1, name:"Davao Tailors PH", loc:"Makati", spec:"Bespoke Suits & Barong", rating:4.9, tag:"Premium Workshop", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80" },
  { id:2, name:"La Costura BGC", loc:"Taguig", spec:"Bridal Couture & Gowns", rating:4.8, tag:"Bridal House", img:"https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80" },
  { id:3, name:"Tela Collective", loc:"Cebu", spec:"Filipiniana & Haute Couture", rating:4.9, tag:"Designer Studio", img:"https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80" },
  { id:4, name:"Studio Hiyas", loc:"QC", spec:"Corporate & Bulk Uniforms", rating:4.7, tag:"Corporate Tailor", img:"https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80" },
];

const DESIGNERS = [
  { id:1, name:"Reyna Villanueva", style:"Neo-Filipiniana", works:24, img:"https://images.unsplash.com/photo-1621784564114-6eea05b89863?w=600&q=80", service:"Couture Direction" },
  { id:2, name:"Marco Salazar", style:"Bespoke Menswear", works:18, img:"https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80", service:"Suit Blueprint" },
  { id:3, name:"Lara Santos", style:"Couture & Bridal", works:31, img:"https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80", service:"Bridal Design" },
  { id:4, name:"Ana Reyes", style:"Resort & Filipiniana", works:22, img:"https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80", service:"Custom Illustration" },
];

const CATS = [
  { name:"Custom Barong & Formalwear", icon:"🎩", count:"120+ Tailors" },
  { name:"Bespoke Made-to-Measure Suits", icon:"🕴️", count:"85+ Master Tailors" },
  { name:"Bridal Couture & Gowns", icon:"👰", count:"45+ Fashion Designers" },
  { name:"Filipiniana & Haute Couture", icon:"👗", count:"60+ Designers" },
  { name:"Urban & Custom Streetwear", icon:"👟", count:"30+ Indie Designers" },
  { name:"Corporate & Bulk Uniforms", icon:"🏢", count:"50+ Tailoring Shops" },
];

const HOW_IT_WORKS = [
  { step:"01", icon:<Search size={24}/>, label:"Browse", desc:"Explore verified Tailoring Shops and fashion designers in your area." },
  { step:"02", icon:<Notebook size={24}/>, label:"Consult", desc:"Book a consultation slot with your chosen Workshop or designer." },
  { step:"03", icon:<Ruler size={24}/>, label:"Design & Measure", desc:"Collaborate on the garment blueprint and submit your measurements." },
  { step:"04", icon:<Scissors size={24}/>, label:"Tailoring", desc:"Your Workshop begins crafting — tracked in real-time on your dashboard." },
  { step:"05", icon:<Package size={24}/>, label:"Track", desc:"Monitor every production milestone from cutting to finishing." },
  { step:"06", icon:<CheckCircle size={24}/>, label:"Pickup", desc:"Receive your bespoke garment, perfectly crafted to your vision." },
];

export default function Home() {
  const router = useRouter();
  const { currentUser, currentShop } = useERPStore();
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mapTab, setMapTab] = useState<'all'|'shops'|'designers'>('all');

  const MAP_ENTRIES = [
    { id:1, type:'shop',     name:'Davao Tailors PH',   loc:'Bajada, Davao City',     rating:4.9, spec:'Bespoke Suits & Barong',      img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80',    pin:{ top:'42%', left:'48%' } },
    { id:2, type:'shop',     name:'La Costura BGC',      loc:'San Pedro St., Davao',   rating:4.8, spec:'Bridal Couture & Gowns',       img:'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&q=80',     pin:{ top:'55%', left:'52%' } },
    { id:3, type:'shop',     name:'Tela Collective',     loc:'Ponciano St., Davao',    rating:4.9, spec:'Filipiniana & Haute Couture',  img:'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=200&q=80',pin:{ top:'36%', left:'44%' } },
    { id:4, type:'shop',     name:'Studio Hiyas',        loc:'Ilustre St., Davao',     rating:4.7, spec:'Corporate & Bulk Uniforms',   img:'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200&q=80',   pin:{ top:'62%', left:'56%' } },
    { id:5, type:'designer', name:'Reyna Villanueva',    loc:'Davao City',             rating:5.0, spec:'Neo-Filipiniana',              img:'https://images.unsplash.com/photo-1621784564114-6eea05b89863?w=200&q=80',  pin:{ top:'48%', left:'40%' } },
    { id:6, type:'designer', name:'Marco Salazar',       loc:'Davao City',             rating:4.9, spec:'Bespoke Menswear',             img:'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=200&q=80',    pin:{ top:'58%', left:'60%' } },
    { id:7, type:'designer', name:'Lara Santos',         loc:'Davao City',             rating:4.8, spec:'Couture & Bridal',             img:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=200&q=80',     pin:{ top:'34%', left:'58%' } },
    { id:8, type:'designer', name:'Ana Reyes',           loc:'Davao City',             rating:4.7, spec:'Resort & Filipiniana',         img:'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&q=80',pin:{ top:'68%', left:'45%' } },
  ];

  const filteredEntries = MAP_ENTRIES.filter(e =>
    mapTab === 'all' ? true : mapTab === 'shops' ? e.type === 'shop' : e.type === 'designer'
  );
  
  // Theme Overrides
  const primaryColor = currentShop?.themeColor || '#059669'; // Emerald-600 fallback
  const accentColor = currentShop?.accentColor || '#10b981';

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-slate-900 overflow-x-hidden" style={{fontFamily:"'Inter', sans-serif"}}>

      {/* ===== 3-TIER SHOPEE-STYLE HEADER ===== */}
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
                        <div className="text-[11px] font-black leading-tight">Application Approved!</div>
                        <div className="text-[10px] font-medium text-slate-500 mt-1">Welcome to Sutura, {currentUser?.name || 'Guest'}. Your shop is now live.</div>
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
                <select className="border-l border-slate-100 text-slate-500 text-xs font-bold px-3 bg-slate-50 h-full outline-none">
                  <option>All</option>
                  <option>Tailoring Shops</option>
                  <option>Designers</option>
                  <option>Specialties</option>
                </select>
              </div>
              <button className="bg-amber-400 hover:bg-amber-300 text-slate-900 px-6 rounded-r-2xl font-black transition-all active:scale-95">
                <Search size={20}/>
              </button>
            </div>

            {/* MAP BUTTON — scrolls to Find Them Near You */}
            <a
              href="#map"
              title="Find Them Near You"
              className="flex items-center gap-2 h-12 px-5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white rounded-2xl font-bold text-[13px] transition-all active:scale-95 backdrop-blur-sm shrink-0 group"
            >
              <Map size={18} className="group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline text-[12px] font-black uppercase tracking-widest">Map</span>
            </a>
          </div>
        </div>

        {/* TIER 3 — QUICK LINKS BAR */}
        <div 
          className="border-t transition-colors"
          style={{ backgroundColor: primaryColor, borderTopColor: 'rgba(255,255,255,0.1)' }}
        >
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-9 flex items-center gap-8 overflow-x-auto scrollbar-hide">
            {["🎩 Custom Barong","🕴️ Bespoke Suits","👰 Bridal Couture","👗 Filipiniana","👟 Streetwear","🏢 Corporate Uniforms","✦ PREMIUM Tailoring Shops","✦ Featured Designers"].map((item,i) => (
              <a key={i} href="#discover" className="text-white/70 hover:text-white text-[11px] font-bold whitespace-nowrap transition-colors uppercase tracking-wider">{item}</a>
            ))}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-44 pb-24 overflow-hidden bg-slate-900">
        <div className="absolute inset-0">
          <img 
            src={currentShop?.bannerUrl || "/assets/Workshop-bespoke.png"} 
            className="w-full h-full object-cover opacity-25 scale-110 blur-[1px]" 
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"/>
        </div>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10 flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full backdrop-blur-md">
              <Zap className="w-4 h-4 text-amber-400"/>
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">PREMIUM SHOWCASE 2026</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter">
              {currentShop?.shopName || 'SUTURA'}
            </h1>
            <p className="text-slate-300 text-lg max-w-[500px] font-medium leading-relaxed mx-auto lg:mx-0">
              {currentShop?.tagline || "Precision in every stitch, excellence in every fit. Experience the Philippines' premier bespoke tailoring ecosystem."}
            </p>
            <div className="flex gap-4 justify-center lg:justify-start">
              <div className="bg-white p-1 rounded-2xl flex items-center max-w-[400px] w-full shadow-2xl">
                <div className="px-4 text-slate-400"><Search size={20}/></div>
                <input type="text" placeholder="Search Workshop or Designer..." className="flex-1 bg-transparent border-none outline-none text-slate-900 font-bold py-3"/>
                <button 
                  className="text-white px-6 py-3 rounded-xl font-black uppercase text-[12px] transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="flex gap-8 justify-center lg:justify-start text-white">
              <div><div className="text-2xl font-black">500+</div><div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Verified Tailoring Shops</div></div>
              <div className="w-px bg-white/10"/>
              <div><div className="text-2xl font-black">200+</div><div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Fashion Designers</div></div>
              <div className="w-px bg-white/10"/>
              <div><div className="text-2xl font-black">12k+</div><div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Consultations</div></div>
            </div>
          </div>

          {/* FEATURED CONSULTATION SLOT */}
          <div className="w-full lg:w-[420px]">
            <div className="bg-white rounded-[40px] p-2 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 group">
              <div className="bg-slate-50 rounded-[34px] overflow-hidden">
                <div className="relative h-56">
                  <img src="/assets/flash-promo-barong.png" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Aura Barong Series"/>
                  <div 
                    className="absolute top-6 left-6 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest"
                    style={{ backgroundColor: accentColor }}
                  >
                    ✦ Seasonal Collection
                  </div>
                </div>
                <div className="p-8">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Featured Workshop Showcase</div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 italic">Aura Barong Series</h3>
                  <p className="text-slate-500 font-medium text-sm mb-6">Limited consultation slots for the 2026 summer wedding season.</p>
                  <Link 
                    href="/login?role=customer" 
                    className="w-full text-white h-14 rounded-2xl font-black uppercase tracking-widest text-[13px] transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Book Consultation <ArrowRight size={18}/>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="mb-12">
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-4 italic uppercase tracking-tighter">
            <ShoppingBag className="text-emerald-500"/> Tailoring Specialties
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {CATS.map((c,i)=>(
            <div key={i} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer group text-center">
              <div className="text-4xl mb-3 group-hover:scale-125 transition-transform">{c.icon}</div>
              <div className="text-[13px] font-black text-slate-900 mb-1 leading-tight">{c.name}</div>
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{c.count}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED Tailoring Shops */}
      <section id="discover" className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div 
                className="font-black text-[12px] uppercase tracking-[0.2em] mb-3 flex items-center gap-2"
                style={{ color: accentColor }}
              >
                <TrendingUp size={14}/> Verified Partners
              </div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">Trending Tailoring Shops.</h2>
            </div>
            <button className="h-14 px-8 bg-slate-50 text-slate-900 rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-200">See All Tailoring Shops</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SHOPS.map(shop=>(
              <div key={shop.id} className="group relative">
                <div className="bg-slate-100 aspect-[4/5] rounded-[36px] overflow-hidden mb-5 relative">
                  <img src={shop.img} alt={shop.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                  <span className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900">{shop.tag}</span>
                  <button className="absolute top-5 right-5 w-10 h-10 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-rose-500 transition-all"><Heart size={18}/></button>
                  <div className="absolute bottom-6 left-6 right-6 translate-y-10 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                    <Link 
                      href={currentUser?.role === 'CUSTOMER' ? `/customer/shops/${shop.id}` : "/login?role=customer"} 
                      className="w-full h-12 bg-white text-slate-900 rounded-xl flex items-center justify-center text-[12px] font-black uppercase tracking-widest"
                    >
                      View Shop
                    </Link>
                  </div>
                </div>
                <div className="px-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-black text-slate-900 italic">{shop.name}</h3>
                    <div className="flex items-center gap-1 font-black text-amber-500 text-sm"><Star size={13} fill="currentColor"/>{shop.rating}</div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-sm"><MapPin size={13}/>{shop.loc} · {shop.spec}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DESIGNERS */}
      <section id="designers" className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full"/>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <div className="text-emerald-400 font-black text-[12px] uppercase tracking-[0.2em] mb-4">The Creative Engine</div>
            <h2 className="text-5xl font-black text-white tracking-tighter mb-5 italic">Featured Designers.</h2>
            <p className="text-slate-400 font-medium text-lg leading-relaxed">Commission the Philippines' top creative talent for bespoke couture direction, digital blueprints, and custom illustrations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {DESIGNERS.map(d=>(
              <div key={d.id} className="bg-white/5 border border-white/10 rounded-[36px] overflow-hidden hover:bg-white/10 transition-all group">
                <div className="h-48 overflow-hidden">
                  <img src={d.img} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-black text-white mb-1 italic">{d.name}</h3>
                  <div className="text-emerald-400 font-black text-[11px] uppercase tracking-widest mb-5">{d.style}</div>
                  <div className="space-y-3 mb-7">
                    <div className="flex items-center justify-between text-slate-400 text-sm font-bold">
                      <span>Portfolio Works</span><span className="text-white">{d.works}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400 text-sm font-bold">
                      <span>Custom Design Services</span><span className="text-white text-xs font-black">{d.service}</span>
                    </div>
                  </div>
                  <Link 
                    href={`/customer/designers/${d.id}`}
                    className="w-full h-12 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[12px] hover:bg-emerald-400 transition-all flex items-center justify-center"
                  >
                    View Portfolio
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* INTERACTIVE MAP SECTION                            */}
      {/* ═══════════════════════════════════════════════════ */}
      <section id="map" className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">

          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="text-emerald-400 font-black text-[12px] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <MapPin size={14}/> Partner Network
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter italic">Find Them Near You.</h2>
              <p className="text-slate-400 font-medium mt-2 text-sm">Locate verified tailoring shops and fashion designers on the map.</p>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-1.5 gap-1.5 backdrop-blur-sm">
              {([['all','All Partners'],['shops','Shop Owners'],['designers','Fashion Designers']] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setMapTab(val)}
                  className={`h-10 px-5 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-all ${
                    mapTab === val
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Map + List Layout */}
          <div className="flex flex-col lg:flex-row gap-6 h-[560px]">

            {/* ── Left: Map ── */}
            <div className="flex-1 relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
              <iframe
                src="https://maps.google.com/maps?q=Davao+City,+Philippines&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%" height="100%"
                style={{ border: 0, filter: 'grayscale(20%) contrast(1.1)' }}
                allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />

              {/* Overlay gradient for readability */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-slate-900/20" />

              {/* Floating Pin Markers */}
              <div className="absolute inset-0 pointer-events-none">
                {filteredEntries.map((e) => (
                  <div key={e.id} className="absolute group pointer-events-auto" style={{ top: e.pin.top, left: e.pin.left }}>
                    {/* Pin */}
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white cursor-pointer transition-transform hover:scale-125 ${
                      e.type === 'shop' ? 'bg-emerald-600' : 'bg-amber-500'
                    }`}>
                      {e.type === 'shop' ? <Scissors size={16} className="text-white" /> : <Star size={16} className="text-white" fill="white" />}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl border border-white/10">
                      <div className={`text-[9px] font-black uppercase tracking-widest mb-1 ${ e.type === 'shop' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {e.type === 'shop' ? '✦ Shop Owner' : '✦ Fashion Designer'}
                      </div>
                      <div className="text-[13px] font-bold leading-tight">{e.name}</div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1"><MapPin size={10}/>{e.loc}</div>
                      <div className="text-[11px] text-amber-400 font-bold mt-1 flex items-center gap-1"><Star size={10} fill="currentColor"/>{e.rating}</div>
                    </div>
                  </div>
                ))}

                {/* You Are Here dot */}
                <div className="absolute" style={{ top: '50%', left: '50%' }}>
                  <div className="w-5 h-5 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center gap-5 border border-white/10">
                <span className="flex items-center gap-2 text-[11px] font-bold text-white">
                  <span className="w-3 h-3 rounded bg-emerald-500 inline-block"/> Shop Owner
                </span>
                <span className="flex items-center gap-2 text-[11px] font-bold text-white">
                  <span className="w-3 h-3 rounded bg-amber-500 inline-block"/> Fashion Designer
                </span>
                <span className="flex items-center gap-2 text-[11px] font-bold text-white">
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"/> You
                </span>
              </div>
            </div>

            {/* ── Right: List Panel ── */}
            <div className="w-full lg:w-[360px] flex flex-col gap-3 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">
                {filteredEntries.length} {mapTab === 'all' ? 'Partners' : mapTab === 'shops' ? 'Shop Owners' : 'Fashion Designers'} in Davao
              </div>
              {filteredEntries.map((e) => (
                <Link 
                  key={e.id} 
                  href={currentUser?.role === 'CUSTOMER' ? `/customer/shops/${e.id}` : "/login?role=customer"}
                  className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/8 hover:border-emerald-500/40 rounded-2xl p-4 cursor-pointer transition-all duration-300 group"
                >
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border-2 border-white/10 group-hover:border-emerald-500/50 transition-colors">
                    <img src={e.img} alt={e.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${ e.type === 'shop' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {e.type === 'shop' ? '✦ Shop Owner' : '✦ Fashion Designer'}
                    </div>
                    <h4 className="text-[14px] font-bold text-white truncate">{e.name}</h4>
                    <p className="text-[12px] text-slate-400 truncate">{e.spec}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] text-slate-500 flex items-center gap-1"><MapPin size={10}/>{e.loc}</span>
                      <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1"><Star size={10} fill="currentColor"/>{e.rating}</span>
                    </div>
                  </div>
                  {/* Arrow */}
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-emerald-400 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-[#FAF8F5]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-[600px] mx-auto mb-20">
            <div className="text-emerald-600 font-black text-[12px] uppercase tracking-[0.2em] mb-4">The Sutura Process</div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">How It Works.</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {HOW_IT_WORKS.map((step, i)=>(
              <div key={i} className="relative text-center group">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-full h-px bg-slate-200 z-0"/>
                )}
                <div className="relative z-10 w-20 h-20 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:border-emerald-400 group-hover:shadow-emerald-100 transition-all text-emerald-600">
                  {step.icon}
                </div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{step.step}</div>
                <div className="text-[15px] font-black text-slate-900 mb-2">{step.label}</div>
                <div className="text-slate-400 text-xs font-medium leading-relaxed">{step.desc}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <Link href="/login?role=customer" className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[14px] hover:bg-emerald-600 transition-all shadow-2xl">
              Start Your Journey <ArrowRight size={20}/>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 pt-24 pb-12 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center"><Scissors className="w-5 h-5 text-slate-900"/></div>
                <span className="text-2xl font-black tracking-tighter text-white uppercase">Sutura</span>
              </div>
              <p className="text-slate-400 font-medium leading-relaxed text-sm">Empowering the future of Filipino craftsmanship through digital transformation.</p>
            </div>
            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-[11px] mb-7">Ecosystem</h4>
              <ul className="space-y-4 text-slate-400 font-bold text-sm">
                {["Find an Workshop","Browse Designers","Fabric Catalog","Measurement Guide"].map(l=><li key={l} className="hover:text-emerald-400 transition-colors cursor-pointer">{l}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-[11px] mb-7">For Partners</h4>
              <ul className="space-y-4 text-slate-400 font-bold text-sm">
                {["Sutura For Shop Owners","Designer Studio Access","ERP Training","Partner Program"].map(l=><li key={l} className="hover:text-emerald-400 transition-colors cursor-pointer">{l}</li>)}
              </ul>
            </div>
            <div className="bg-white/5 p-7 rounded-[32px] border border-white/10">
              <h4 className="text-white font-black text-lg mb-2 italic">Stay Updated.</h4>
              <p className="text-slate-400 text-sm mb-5 font-medium">Get notified of new Tailoring Shops and designer showcases.</p>
              <input type="text" placeholder="Your email..." className="w-full bg-slate-800 rounded-xl px-5 py-3 text-white font-bold outline-none ring-1 ring-white/10 focus:ring-emerald-400 transition-all text-sm"/>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-4">
            <div className="text-slate-500 text-[11px] font-black uppercase tracking-widest">© 2026 Sutura Platform · Tailoring Ecosystem</div>
            <div className="flex gap-8 text-slate-500 text-[11px] font-black uppercase tracking-widest">
              {["Privacy","Terms","Status"].map(l=><span key={l} className="hover:text-white transition-colors cursor-pointer">{l}</span>)}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useERPStore } from '@/store/useERPStore';
import { 
  User, 
  Bell, 
  Ticket,
  Save,
  Lock,
  Mail,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Store,
  Scissors,
  HelpCircle,
  Globe,
  UserCircle,
  X,
  Check,
  Search
} from 'lucide-react';

export default function CustomerProfilePage() {
  const router = useRouter();
  const { currentUser, currentShop, pushNotification } = useERPStore();
  
  const [activeTab, setActiveTab] = useState('account');
  const [showPassword, setShowPassword] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Theme Overrides for header (matching homepage)
  const primaryColor = currentShop?.themeColor || '#059669'; // Emerald-600 fallback

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const tabs = [
    { id: 'account', name: 'My Account', icon: <User size={18} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
    { id: 'vouchers', name: 'My Vouchers', icon: <Ticket size={18} /> },
  ];

  const handleSave = () => {
    pushNotification("Profile updated successfully", "success");
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-slate-900 overflow-x-hidden" style={{fontFamily:"'Inter', sans-serif"}}>
      
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
                        <div className="text-[11px] font-black leading-tight">Application Approved!</div>
                        <div className="text-[10px] font-medium text-slate-500 mt-1">Welcome to Sutura, {currentUser?.name || 'Guest'}.</div>
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
                          href={currentUser.role === 'CUSTOMER' ? '/customer-profile' : '/owner/settings'} 
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm">
                            <UserCircle size={16} className="text-slate-500" />
                          </div>
                          <span className="text-xs font-bold text-slate-700">
                            {currentUser.role === 'CUSTOMER' ? 'Profile Settings' : 'My Account'}
                          </span>
                        </Link>
                        
                        <Link 
                          href={currentUser.role === 'CUSTOMER' ? '/customer/dashboard' : '/owner/dashboard'} 
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-all group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-600 transition-all">
                            <Store size={16} className="text-emerald-600 group-hover:text-white" />
                          </div>
                          <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-700">
                            {currentUser.role === 'CUSTOMER' ? 'Customer Portal' : 'Shop Owner Portal'}
                          </span>
                        </Link>
                        <div className="h-[1px] bg-slate-50 my-1" />
                        <Link href="/login" className="flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 transition-all group text-rose-600">
                          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center group-hover:bg-rose-600 transition-all">
                            <X size={16} className="text-rose-600 group-hover:text-white" />
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
              <span className="text-2xl font-black tracking-tighter text-white uppercase">{currentShop?.shopName || 'Sutura'}</span>
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
          </div>
        </div>

        {/* TIER 3 — QUICK LINKS BAR */}
        <div 
          className="border-t transition-colors"
          style={{ backgroundColor: primaryColor, borderTopColor: 'rgba(255,255,255,0.1)' }}
        >
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-9 flex items-center gap-8 overflow-x-auto scrollbar-hide">
            {["🎩 Custom Barong","🕴️ Bespoke Suits","👰 Bridal Couture","👗 Filipiniana","👟 Streetwear","🏢 Corporate Uniforms","✦ PREMIUM Tailoring Shops","✦ Featured Designers"].map((item,i) => (
              <Link key={i} href="/#discover" className="text-white/70 hover:text-white text-[11px] font-bold whitespace-nowrap transition-colors uppercase tracking-wider">{item}</Link>
            ))}
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT (SETTINGS) ── */}
      <main className="pt-44 pb-24 max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-[36px] font-bold font-serif text-[#1E3A1F] tracking-tight leading-none">Profile Settings</h1>
            <p className="text-[14px] text-[#78716C] mt-3">Manage your personal details, order updates, and exclusive vouchers.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              className="h-12 px-8 bg-emerald-600 text-white rounded-xl flex items-center gap-3 text-[14px] font-bold shadow-lg hover:shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 group" 
              onClick={handleSave}
            >
              <Save size={18} className="group-hover:scale-110 transition-transform" /> Save Changes
            </button>
          </div>
        </div>

        {/* ── CAPSULE TABS ── */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-[8px] w-fit border border-slate-200 shadow-sm mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-2.5 rounded-[4px] text-[13px] font-bold transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* ── SETTINGS CONTENT ── */}
        <div className="pb-20">
          
          {/* ACCOUNT TAB */}
          {activeTab === 'account' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 max-w-[1000px] animate-in fade-in slide-in-from-bottom-2">
              
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">My Profile</h2>
                <p className="text-[14px] text-slate-500 mt-1">Manage and protect your account</p>
              </div>
              
              <div className="p-8 flex flex-col-reverse md:flex-row gap-12">
                {/* Left Column - Form */}
                <div className="flex-1 space-y-6">
                  
                  {/* Username */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <label className="text-[14px] font-medium text-slate-500 sm:w-32 sm:text-right">Username</label>
                    <div className="flex-1">
                      <input type="text" defaultValue="johnclock_25" className="w-full h-10 px-4 border border-slate-300 rounded-md text-[14px] text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
                      <p className="text-[12px] text-slate-400 mt-1.5">Username can only be changed once.</p>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <label className="text-[14px] font-medium text-slate-500 sm:w-32 sm:text-right">Name</label>
                    <div className="flex-1">
                      <input type="text" defaultValue={currentUser?.name || ''} className="w-full h-10 px-4 border border-slate-300 rounded-md text-[14px] text-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <label className="text-[14px] font-medium text-slate-500 sm:w-32 sm:text-right">Email</label>
                    <div className="flex-1 flex items-center gap-3">
                      <span className="text-[14px] text-slate-800">jo*************@gmail.com</span>
                      <button className="text-[13px] text-emerald-600 font-semibold hover:underline">Change</button>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <label className="text-[14px] font-medium text-slate-500 sm:w-32 sm:text-right">Phone Number</label>
                    <div className="flex-1 flex items-center gap-3">
                      <span className="text-[14px] text-slate-800">********83</span>
                      <button className="text-[13px] text-emerald-600 font-semibold hover:underline">Change</button>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <label className="text-[14px] font-medium text-slate-500 sm:w-32 sm:text-right">Gender</label>
                    <div className="flex-1 flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-4 h-4 rounded-full border-2 border-emerald-600 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                        </div>
                        <span className="text-[14px] text-slate-800">Male</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center group-hover:border-emerald-500 transition-colors"></div>
                        <span className="text-[14px] text-slate-800">Female</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center group-hover:border-emerald-500 transition-colors"></div>
                        <span className="text-[14px] text-slate-800">Other</span>
                      </label>
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 pt-2">
                    <label className="text-[14px] font-medium text-slate-500 sm:w-32 sm:text-right sm:pt-1">Date of birth</label>
                    <div className="flex-1">
                      <span className="text-[14px] text-slate-800">**/**/1990</span>
                      <p className="text-[12px] text-slate-500 mt-1.5">You have already done KYC. Changing your birthday is not permitted.</p>
                      
                      <div className="mt-8">
                        <button 
                          onClick={handleSave}
                          className="h-10 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-[14px] font-bold rounded shadow-sm transition-colors active:scale-95"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column - Avatar */}
                <div className="md:w-[280px] flex flex-col items-center md:border-l border-slate-100 md:pl-12 pt-4">
                  <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-100 border border-slate-200 mb-6">
                    <img src={currentUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=John&backgroundColor=ffdfbf"} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <button className="h-10 px-6 border border-slate-300 rounded text-[14px] font-medium text-slate-700 hover:bg-slate-50 transition-colors mb-4">
                    Select Image
                  </button>
                  <div className="text-center">
                    <p className="text-[12px] text-slate-400">File size: maximum 1 MB</p>
                    <p className="text-[12px] text-slate-400">File extension: .JPEG, .PNG</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm max-w-4xl animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Bell size={20} className="text-emerald-600"/> Order & System Updates</h2>
              
              <div className="space-y-4">
                {[
                  { title: "Measurements Approved", desc: "Your tailored suit measurements have been verified by the Master Tailor.", time: "2 hours ago", read: false },
                  { title: "Consultation Reminder", desc: "You have an upcoming fitting consultation tomorrow at 2:00 PM.", time: "1 day ago", read: false },
                  { title: "Order Shipped", desc: "Your bespoke Barong has been shipped via standard delivery.", time: "3 days ago", read: true },
                  { title: "Welcome to Sutura", desc: "Your customer account has been successfully created. Explore our premium Tailoring Shops.", time: "1 week ago", read: true },
                ].map((notif, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${notif.read ? 'bg-slate-50 border-slate-100' : 'bg-emerald-50/50 border-emerald-100'} flex gap-4 items-start transition-all hover:shadow-md`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.read ? 'bg-slate-200 text-slate-500' : 'bg-emerald-600 text-white'}`}>
                      <Bell size={18} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-[14px] ${notif.read ? 'font-semibold text-slate-700' : 'font-bold text-slate-900'}`}>{notif.title}</h4>
                      <p className="text-[13px] text-slate-500 mt-1">{notif.desc}</p>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2 block">{notif.time}</span>
                    </div>
                    {!notif.read && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mt-2" /> }
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VOUCHERS TAB */}
          {activeTab === 'vouchers' && (
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm max-w-4xl animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Ticket size={20} className="text-emerald-600"/> My Exclusive Vouchers</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "First Bespoke Suit", discount: "₱2,000 OFF", code: "WELCOME2K", min: "Min. spend ₱15,000", expiry: "Valid until Dec 2026", type: "welcome" },
                  { title: "Bridal Consultation", discount: "100% FREE", code: "BRIDE100", min: "No minimum spend", expiry: "Valid until Aug 2026", type: "promo" },
                  { title: "Premium Alterations", discount: "15% OFF", code: "ALTER15", min: "Min. spend ₱1,500", expiry: "Valid for 30 days", type: "loyalty" },
                ].map((voucher, i) => (
                  <div key={i} className="relative border border-emerald-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group cursor-pointer">
                    <div className="absolute left-0 top-0 bottom-0 w-3 bg-emerald-600" />
                    <div className="p-5 pl-8">
                      <div className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded mb-3">
                        {voucher.type}
                      </div>
                      <h3 className="text-[18px] font-black text-slate-900 mb-1">{voucher.discount}</h3>
                      <p className="text-[14px] font-bold text-slate-700 mb-2">{voucher.title}</p>
                      <p className="text-[12px] text-slate-500">{voucher.min}</p>
                      <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-400">{voucher.expiry}</span>
                        <button className="text-[12px] font-black text-emerald-600 group-hover:text-emerald-700">Use Now</button>
                      </div>
                    </div>
                    <div className="absolute left-3 top-0 bottom-0 w-[1px] border-l-2 border-dashed border-emerald-100" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ===== FOOTER (From Homepage) ===== */}
      <footer className="bg-slate-900 pt-24 pb-12 border-t border-white/5 mt-auto">
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

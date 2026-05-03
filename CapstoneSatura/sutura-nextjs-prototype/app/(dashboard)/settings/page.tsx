'use client';

import { 
  Settings, 
  UserPlus, 
  CreditCard, 
  Lock, 
  Palette, 
  X, 
  Plus, 
  CheckCircle2, 
  BadgeCheck, 
  Database, 
  FileJson, 
  FileSpreadsheet, 
  History, 
  Upload, 
  Globe, 
  Mail, 
  Phone,
  ChevronRight,
  ShieldCheck,
  Building2,
  Trash2
} from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General');

  return (
    <div className="p-8 max-w-[1200px] mx-auto w-full animate-in fade-in duration-500">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
              <Settings size={22} />
            </div>
            <h1 className="text-[36px] font-black text-slate-900 tracking-tight leading-none">System Settings</h1>
          </div>
          <p className="text-[16px] text-slate-500 font-medium">Configure your enterprise preferences, staff accounts, and security protocols.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[12px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
            <ShieldCheck size={16} /> All Systems Nominal
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        
        {/* ── NAVIGATION SIDEBAR ── */}
        <div className="col-span-12 lg:col-span-3 space-y-2">
          {[
            { label: "General", icon: Settings, desc: "Shop identity & localization" },
            { label: "Staff & Accounts", icon: UserPlus, desc: "Team roles & permissions" },
            { label: "Subscription", icon: CreditCard, desc: "Plans & billing history" },
            { label: "Security & Logs", icon: Lock, desc: "Data recovery & audit trails" },
            { label: "Shop Branding", icon: Palette, desc: "Customer portal identity" },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => setActiveTab(item.label)}
              className={`w-full text-left p-6 rounded-[32px] transition-all relative group ${
                activeTab === item.label 
                ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20 translate-x-2' 
                : 'bg-white border border-slate-100 text-slate-600 hover:border-indigo-200 hover:translate-x-1'
              }`}
            >
              <div className="flex items-center gap-4 mb-1">
                <item.icon size={20} className={activeTab === item.label ? 'text-indigo-400' : 'text-slate-400'} />
                <span className="text-[15px] font-black tracking-tight">{item.label}</span>
              </div>
              <p className={`text-[11px] font-medium leading-tight ${activeTab === item.label ? 'text-slate-400' : 'text-slate-500'}`}>
                {item.desc}
              </p>
              {activeTab === item.label && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-indigo-400">
                  <ChevronRight size={18} />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* ── CONTENT AREA ── */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white border-4 border-white rounded-[56px] shadow-sm overflow-hidden min-h-[700px] flex flex-col">
            <div className="bg-slate-50/50 border-b border-slate-100 px-12 py-10">
               <h2 className="text-[24px] font-black text-slate-900 tracking-tight">{activeTab} Configuration</h2>
               <p className="text-[14px] text-slate-500 font-medium mt-1">Manage all {activeTab.toLowerCase()} related settings for your shop.</p>
            </div>

            <div className="flex-1 p-12">
              
              {/* GENERAL TAB */}
              {activeTab === 'General' && (
                <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-2 gap-10">
                    <div className="col-span-2 space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Shop Name</label>
                      <input type="text" defaultValue="Sutura Manila" className="w-full h-18 bg-slate-50 border border-slate-200 rounded-[28px] px-8 text-[18px] font-black outline-none focus:bg-white focus:border-slate-900 transition-all shadow-sm" />
                    </div>
                    <div className="col-span-2 space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Official Address</label>
                      <textarea defaultValue="123 Makati Avenue, Makati City, Metro Manila, 1200 Philippines" className="w-full h-36 bg-slate-50 border border-slate-200 rounded-[32px] p-8 text-[18px] font-medium text-slate-600 outline-none focus:bg-white focus:border-slate-900 transition-all resize-none shadow-sm"></textarea>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Business Email</label>
                      <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input type="email" defaultValue="hello@suturamanila.com" className="w-full h-18 bg-slate-50 border border-slate-200 rounded-[28px] pl-16 pr-8 text-[18px] font-black outline-none focus:bg-white shadow-sm" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Contact Number</label>
                      <div className="relative">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input type="text" defaultValue="+63 917 123 4567" className="w-full h-18 bg-slate-50 border border-slate-200 rounded-[28px] pl-16 pr-8 text-[18px] font-black outline-none focus:bg-white shadow-sm" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Primary Currency</label>
                      <select className="w-full h-18 bg-slate-50 border border-slate-200 rounded-[28px] px-8 text-[18px] font-black outline-none focus:bg-white shadow-sm appearance-none cursor-pointer">
                        <option>₱ (PHP) - Philippine Peso</option>
                        <option>$ (USD) - US Dollar</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">System Timezone</label>
                      <select className="w-full h-18 bg-slate-50 border border-slate-200 rounded-[28px] px-8 text-[18px] font-black outline-none focus:bg-white shadow-sm appearance-none cursor-pointer">
                        <option>(GMT+08:00) Manila, Philippines</option>
                        <option>(GMT+00:00) UTC</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STAFF & ACCOUNTS TAB */}
              {activeTab === 'Staff & Accounts' && (
                <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-[18px] font-black text-slate-900 tracking-tight">Active Team Members</h4>
                      <p className="text-[13px] text-slate-500 font-medium">Currently 3 staff members have system access.</p>
                    </div>
                    <button className="bg-slate-900 text-white h-14 px-8 rounded-2xl text-[13px] font-black hover:bg-indigo-600 transition-all flex items-center gap-3 shadow-lg">
                      <UserPlus size={18} /> Register Staff
                    </button>
                  </div>

                  <div className="space-y-4">
                    {[
                      { name: "Juan dela Cruz", role: "Master Tailor", email: "juan@sutura.com", status: "Active" },
                      { name: "Maria Clara", role: "Shop Manager", email: "maria@sutura.com", status: "Active" },
                      { name: "Crisostomo Ibarra", role: "Junior Cutter", email: "ibarra@sutura.com", status: "On Leave" },
                    ].map((staff, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-[32px] hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-slate-100 transition-all group">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all">
                            {staff.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-[17px] font-black text-slate-900">{staff.name}</div>
                            <div className="flex items-center gap-3 text-[12px] font-bold text-slate-500">
                              <span className="text-indigo-600 uppercase tracking-widest">{staff.role}</span>
                              <span className="opacity-20">|</span>
                              <span>{staff.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${staff.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                            {staff.status}
                          </div>
                          <button className="p-3 rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-rose-600 hover:border-rose-100 transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBSCRIPTION TAB */}
              {activeTab === 'Subscription' && (
                <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-slate-900 rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-16 opacity-10 rotate-12"><CreditCard size={160} /></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                      <div className="space-y-6">
                        <div className="px-5 py-2 bg-indigo-600 text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] w-fit shadow-lg shadow-indigo-500/20">
                          Active Professional Plan
                        </div>
                        <h3 className="text-[48px] font-black tracking-tighter leading-none">₱749.00 <span className="text-[18px] text-slate-400 font-medium">/ month</span></h3>
                        <p className="text-[15px] text-slate-400 font-medium max-w-md">Next billing cycle: <span className="text-white font-black">May 24, 2026</span>. Access to multi-branch management and digital invoices is enabled.</p>
                      </div>
                      <div className="flex flex-col gap-3">
                         <button className="h-14 px-10 bg-white text-slate-900 rounded-2xl text-[14px] font-black shadow-xl hover:bg-slate-100 transition-all">Update Billing Method</button>
                         <button className="h-14 px-10 bg-white/10 text-white rounded-2xl text-[14px] font-black hover:bg-white/20 transition-all border border-white/10">View Invoices</button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { name: "Pro Plan", price: "749", features: ["Unlimited Orders", "Inventory Management", "Digital Invoicing", "Multi-Branch Support"], status: "Current" },
                      { name: "Enterprise", price: "1,499", features: ["Everything in Pro", "Advanced Audit Logs", "Custom API Access", "24/7 Dedicated Support"], status: "Upgrade" },
                    ].map((plan, i) => (
                      <div key={i} className={`p-10 rounded-[44px] border-2 flex flex-col justify-between ${plan.status === 'Current' ? 'border-slate-900 bg-slate-50/50' : 'border-slate-100 bg-white'}`}>
                        <div className="space-y-8">
                           <div className="flex items-center justify-between">
                              <h5 className="text-[20px] font-black text-slate-900">{plan.name}</h5>
                              {plan.status === 'Current' && <CheckCircle2 className="text-emerald-500" size={24} />}
                           </div>
                           <ul className="space-y-4">
                              {plan.features.map((f, j) => (
                                <li key={j} className="flex items-center gap-3 text-[14px] font-bold text-slate-600">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> {f}
                                </li>
                              ))}
                           </ul>
                        </div>
                        <div className="mt-12">
                          <div className="text-[28px] font-black text-slate-900 mb-6">₱{plan.price} <span className="text-[13px] text-slate-400 font-medium">/ month</span></div>
                          <button className={`w-full h-14 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all ${plan.status === 'Current' ? 'bg-slate-200 text-slate-500 cursor-default' : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-xl shadow-slate-900/10'}`}>
                            {plan.status === 'Current' ? 'Your Current Plan' : 'Upgrade Now'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECURITY & LOGS TAB */}
              {activeTab === 'Security & Logs' && (
                <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-2 gap-8">
                     <div className="bg-slate-50 rounded-[44px] p-10 border border-slate-100 space-y-8">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-[24px] bg-white text-indigo-600 flex items-center justify-center shadow-sm"><Database size={32}/></div>
                          <div>
                            <h4 className="text-[18px] font-black text-slate-900">System Data Archive</h4>
                            <p className="text-[13px] text-slate-500 font-medium leading-tight">Create a high-integrity JSON backup of all business records.</p>
                          </div>
                        </div>
                        <button className="w-full h-16 bg-slate-900 text-white rounded-[24px] text-[14px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-3 shadow-xl">
                          <FileJson size={20}/> Generate Archive (JSON)
                        </button>
                     </div>
                     <div className="bg-slate-50 rounded-[44px] p-10 border border-slate-100 space-y-8">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-[24px] bg-white text-emerald-600 flex items-center justify-center shadow-sm"><FileSpreadsheet size={32}/></div>
                          <div>
                            <h4 className="text-[18px] font-black text-slate-900">Administrative CSV Export</h4>
                            <p className="text-[13px] text-slate-500 font-medium leading-tight">Export raw transaction logs and customer lists for reporting.</p>
                          </div>
                        </div>
                        <button className="w-full h-16 bg-slate-900 text-white rounded-[24px] text-[14px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 shadow-xl">
                          <FileSpreadsheet size={20}/> Export Business Data
                        </button>
                     </div>
                  </div>

                  <div className="bg-white border-2 border-slate-50 rounded-[48px] p-10 space-y-10 shadow-sm">
                    <h4 className="text-[16px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-3"><History size={20} className="text-indigo-600"/> Audit Trail Configuration</h4>
                    <div className="space-y-6">
                      {[
                        { title: "Terminal delta logging", desc: "Record exact changes in measurement values and prices.", active: true },
                        { title: "IP access monitoring", desc: "Log IP addresses for every staff login session.", active: true },
                        { title: "Two-Factor Auth (2FA)", desc: "Require OTP for all administrative accounts.", active: false, badge: "COMING SOON" },
                      ].map((s, i) => (
                        <div key={i} className={`flex items-center justify-between p-8 rounded-[32px] border border-slate-100 ${s.active ? 'bg-slate-50/50' : 'bg-slate-50 opacity-50'}`}>
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <h5 className="text-[17px] font-black text-slate-900">{s.title}</h5>
                              {s.badge && <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg uppercase">{s.badge}</span>}
                            </div>
                            <p className="text-[13px] text-slate-500 font-medium">{s.desc}</p>
                          </div>
                          <button className={`w-14 h-8 rounded-full relative transition-all ${s.active ? 'bg-slate-900' : 'bg-slate-200'}`}>
                            <div className={`absolute top-1.5 w-5 h-5 rounded-full bg-white shadow-md transition-all ${s.active ? 'right-1.5' : 'left-1.5'}`}></div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SHOP BRANDING TAB */}
              {activeTab === 'Shop Branding' && (
                <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-12 gap-10">
                    <div className="col-span-12 md:col-span-4 space-y-6">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-2">Shop Logo</label>
                      <div className="aspect-square bg-slate-50 rounded-[48px] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-indigo-50/50 hover:border-indigo-100 transition-all relative overflow-hidden shadow-inner">
                         <Upload size={40} className="text-slate-300 group-hover:text-indigo-600 transition-transform group-hover:-translate-y-2" />
                         <div className="text-center">
                            <span className="text-[13px] font-black text-slate-400 group-hover:text-indigo-900">UPLOAD LOGO</span>
                            <p className="text-[10px] text-slate-400 font-medium mt-1">Recommended: 512x512 PNG</p>
                         </div>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-8 space-y-8">
                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-2">Public Shop Name</label>
                          <input type="text" defaultValue="La Belle Couture" className="w-full h-18 bg-slate-50 border border-slate-200 rounded-[28px] px-8 text-[18px] font-black outline-none focus:bg-white focus:border-slate-900 transition-all shadow-sm" />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-2">Physical Location</label>
                          <div className="relative">
                            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                            <input type="text" defaultValue="123 Fashion Ave, Makati City, Metro Manila" className="w-full h-18 bg-slate-50 border border-slate-200 rounded-[28px] pl-16 pr-8 text-[18px] font-black outline-none focus:bg-white shadow-sm" />
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-4">
                             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-2">Customer Portal Phone</label>
                             <input type="text" defaultValue="+63 912 345 6789" className="w-full h-18 bg-slate-50 border border-slate-200 rounded-[28px] px-8 text-[18px] font-black shadow-sm outline-none" />
                          </div>
                          <div className="space-y-4">
                             <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block ml-2">Google Maps Integration</label>
                             <input type="text" defaultValue="https://goo.gl/maps/la-belle-couture" className="w-full h-18 bg-slate-50 border border-slate-200 rounded-[28px] px-8 text-[18px] font-black shadow-sm outline-none" />
                          </div>
                       </div>
                    </div>
                  </div>
                  
                  <div className="p-10 bg-indigo-50/50 rounded-[48px] border border-indigo-100 flex items-center gap-8">
                     <div className="w-20 h-20 bg-white rounded-[32px] flex items-center justify-center text-indigo-600 shadow-xl shrink-0"><BadgeCheck size={40}/></div>
                     <div>
                       <h5 className="text-[20px] font-black text-indigo-900 leading-tight">Portal Sync Active</h5>
                       <p className="text-[15px] text-indigo-700 font-medium mt-1 leading-relaxed">This branding information is synchronized with your public customer tracking portal and mobile applications.</p>
                     </div>
                  </div>
                </div>
              )}

            </div>

            <div className="px-12 py-10 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-6 shrink-0">
               <button className="h-18 px-12 rounded-[28px] text-[16px] font-black text-slate-400 hover:text-slate-900 transition-all bg-white border border-slate-100 shadow-sm">DISCARD CHANGES</button>
               <button className="bg-slate-900 text-white h-18 px-16 rounded-[32px] text-[18px] font-black hover:bg-indigo-600 transition-all shadow-2xl active:scale-95">SAVE PLATFORM CONFIG</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Users, 
  Globe, 
  Save, 
  Camera,
  Mail,
  Smartphone,
  Lock,
  Building2
} from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: <User size={18} /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell size={18} /> },
    { id: 'security', name: 'Security', icon: <Shield size={18} /> },
    { id: 'team', name: 'Team', icon: <Users size={18} /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Settings</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Configure your account, business details, and system preferences.</p>
        </div>
        
        <button className="bg-slate-900 text-white h-11 px-6 rounded-xl text-[13px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2">
          <Save size={16} /> Save Changes
        </button>
      </div>

      {/* ── CAPSULE TABS ── */}
      <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* ── SETTINGS CONTENT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Sections */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Section */}
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <h3 className="text-[18px] font-black text-slate-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-slate-400" /> Public Profile
            </h3>
            
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="relative group cursor-pointer">
                  <div className="w-24 h-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-white overflow-hidden shadow-xl shadow-indigo-100 border-4 border-white">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Joshua" alt="Avatar" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Camera size={20} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input type="text" defaultValue="Joshua Arabejo" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-slate-900 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input type="email" defaultValue="joshua@sutura.com" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-slate-900 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Title</label>
                    <input type="text" defaultValue="Shop Owner" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-slate-900 transition-all outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input type="text" defaultValue="+63 912 345 6789" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-slate-900 transition-all outline-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <h3 className="text-[18px] font-black text-slate-900 mb-6 flex items-center gap-2">
              <Building2 size={20} className="text-slate-400" /> Business Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Shop Name</label>
                <input type="text" defaultValue="Sutura Tailoring HQ" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-slate-900 transition-all outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Website</label>
                <input type="text" defaultValue="www.sutura.com" className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-slate-900 transition-all outline-none" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Headquarters Address</label>
                <textarea 
                  rows={3} 
                  defaultValue="123 Tailor Street, Manila, Philippines"
                  className="w-full p-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium focus:bg-white focus:border-slate-900 transition-all outline-none resize-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Preferences & Helpers */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <Globe size={24} />
              </div>
              <h4 className="text-[18px] font-black tracking-tight mb-2">Regional Settings</h4>
              <p className="text-[13px] text-slate-400 font-medium mb-6">Set your preferred language, timezone, and currency for the entire system.</p>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Timezone</label>
                  <select className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-[13px] font-bold outline-none px-3">
                    <option>GMT+8 (Manila)</option>
                    <option>GMT+0 (UTC)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Currency</label>
                  <select className="w-full h-10 bg-white/5 border border-white/10 rounded-lg text-[13px] font-bold outline-none px-3">
                    <option>Philippine Peso (₱)</option>
                    <option>US Dollar ($)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <h4 className="text-[16px] font-black text-slate-900 mb-4 flex items-center gap-2">
              <Mail size={18} className="text-slate-400" /> Account Emails
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-bold text-slate-700">Billing Alerts</div>
                  <div className="text-[11px] text-slate-400">Receive invoice summaries</div>
                </div>
                <div className="w-10 h-5 bg-indigo-600 rounded-full flex items-center px-1">
                  <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-bold text-slate-700">Stock Alerts</div>
                  <div className="text-[11px] text-slate-400">Low inventory notifications</div>
                </div>
                <div className="w-10 h-5 bg-slate-200 rounded-full flex items-center px-1">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

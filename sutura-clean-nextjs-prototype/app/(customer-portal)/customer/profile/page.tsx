'use client';

import { useState } from 'react';
import { useERPStore } from '@/store/useERPStore';
import {
  Camera, ArrowLeft, ChevronRight,
  CheckCircle2, Mail, Smartphone, Key, Shield
} from 'lucide-react';
import Link from 'next/link';

export default function CustomerProfilePortalPage() {
  const { currentUser, pushNotification } = useERPStore();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile Details' },
    { id: 'security', name: 'Security' },
    { id: 'notifications', name: 'Notifications' },
  ];

  const handleSave = () => {
    pushNotification('Changes saved successfully', 'success');
  };

  return (
    <div className="min-h-screen bg-white pb-32 animate-in fade-in duration-500">
      
      {/* ── MINIMALIST HEADER ── */}
      <div className="px-6 py-12 sticky top-0 bg-white z-[100]">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link href="/customer/dashboard" className="text-slate-400 hover:text-slate-900 transition-all">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-[20px] font-black text-slate-900 tracking-tight uppercase">Account</h1>
          <button 
            onClick={handleSave}
            className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto">
        
        {/* ── TAB NAVIGATION (FLAT BOTTOM LINE) ── */}
        <div className="px-6 flex border-b border-slate-100 mb-12">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 pb-4 text-[11px] font-black uppercase tracking-[0.15em] transition-all relative ${
                activeTab === tab.id 
                  ? 'text-slate-900' 
                  : 'text-slate-300 hover:text-slate-500'
              }`}
            >
              {tab.name}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900" />
              )}
            </button>
          ))}
        </div>

        {/* ── CONTENT AREA (RAW MINIMALISM) ── */}
        <div className="px-6 space-y-12">
          
          {activeTab === 'profile' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-12">
              {/* Photo Section (No background/border) */}
              <div className="flex flex-col items-center py-4">
                <div className="w-24 h-24 rounded-full bg-slate-50 overflow-hidden relative group">
                   <img 
                    src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'} 
                    className="w-full h-full object-cover" 
                   />
                </div>
                <button className="mt-4 text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">Change Photo</button>
              </div>

              {/* Form Fields (Flat Stack) */}
              <div className="space-y-10">
                 <FormGroup label="Username" value="joshua_arabejo" disabled />
                 <FormGroup label="Full Name" value={currentUser?.name || ''} />
                 <FormGroup label="Email Address" value={currentUser?.email || ''} isVerified />
                 <FormGroup label="Phone Number" value="+63 912 345 6789" />
                 
                 <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Gender</label>
                       <select className="w-full bg-transparent border-b border-slate-100 py-2 text-[14px] font-bold outline-none appearance-none cursor-pointer">
                          <option>Male</option>
                          <option>Female</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Birthday</label>
                       <input type="date" defaultValue="1995-10-15" className="w-full bg-transparent border-b border-slate-100 py-2 text-[14px] font-bold outline-none" />
                    </div>
                 </div>
              </div>

              {/* Quick Security Action */}
              <div className="pt-6 border-t border-slate-50">
                 <SecurityItem icon={Key} title="Change Password" desc="Last updated 3 months ago" />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-8">
              <SecurityItem icon={Key} title="Change Password" desc="Last updated 3 months ago" />
              <SecurityItem icon={Smartphone} title="Two-Factor Auth" desc="Secure your account with SMS" />
              <SecurityItem icon={Shield} title="Active Sessions" desc="Manage logged in devices" />
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10">
              <NotificationItem title="Order Ready" desc="Your bespoke barong is ready for fitting." time="2h ago" />
              <NotificationItem title="New Voucher" desc="You received a 'Welcome Reward' credit." time="1d ago" />
              <NotificationItem title="System Update" desc="Maintenance scheduled for Sunday." time="3d ago" />
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

function FormGroup({ label, value, disabled, isVerified }: { label: string; value: string; disabled?: boolean; isVerified?: boolean }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{label}</label>
      <div className="relative">
        <input 
          defaultValue={value} 
          disabled={disabled}
          className="w-full bg-transparent border-b border-slate-100 py-2 text-[15px] font-bold outline-none focus:border-slate-900 transition-all disabled:opacity-30"
        />
        {isVerified && <CheckCircle2 size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-emerald-500" />}
      </div>
    </div>
  );
}

function SecurityItem({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex items-center justify-between py-6 border-b border-slate-50 group cursor-pointer hover:border-slate-200 transition-all">
      <div className="flex items-center gap-6">
        <div className="text-slate-300 group-hover:text-slate-900 transition-colors">
          <Icon size={20} />
        </div>
        <div>
          <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-tight">{title}</h4>
          <p className="text-[11px] font-bold text-slate-400 mt-0.5">{desc}</p>
        </div>
      </div>
      <ChevronRight size={16} className="text-slate-200 group-hover:text-slate-900 transition-colors" />
    </div>
  );
}

function NotificationItem({ title, desc, time }: { title: string; desc: string; time: string }) {
  return (
    <div className="pb-8 border-b border-slate-50 last:border-none">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-tight">{title}</h4>
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{time}</span>
      </div>
      <p className="text-[13px] font-medium text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useERPStore } from '@/store/useERPStore';
import { 
  User, 
  Globe, 
  Save, 
  Lock, 
  Palette
} from 'lucide-react';

// Modular Components
import { GeneralTab } from '@/components/settings/GeneralTab';
import { AccountTab } from '@/components/settings/AccountTab';
import { BrandingTab } from '@/components/settings/BrandingTab';
import { SystemTab } from '@/components/settings/SystemTab';
import { PasswordModal } from '@/components/settings/PasswordModal';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { currentUser } = useERPStore();

  if (!currentUser) return null;

  const tabs = [
    { id: 'general', name: 'General', icon: <User size={18} /> },
    { id: 'account', name: 'Account Settings', icon: <Lock size={18} /> },
    { id: 'branding', name: 'Shop Branding', icon: <Palette size={18} /> },
    { id: 'system', name: 'System', icon: <Globe size={18} /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-none">Settings</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-2">Manage your luxury tailoring shops global configuration and profile.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="h-12 px-6 rounded-2xl text-[13px] font-black text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all">
            Discard
          </button>
          <button className="bg-slate-900 text-white h-12 px-8 rounded-2xl text-[13px] font-black hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2 group">
            <Save size={18} className="group-hover:scale-110 transition-transform" /> Save Changes
          </button>
        </div>
      </div>

      {/* ── CAPSULE TABS ── */}
      <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-[20px] w-fit border border-slate-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-[14px] text-[13px] font-black transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-white text-slate-900 shadow-md shadow-slate-200/50 translate-y-[-1px]' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
            }`}
          >
            <span className={activeTab === tab.id ? 'text-indigo-600' : ''}>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* ── CONTENT AREA ── */}
      <div className="pb-20">
        {activeTab === 'general' && <GeneralTab currentUser={currentUser} />}
        {activeTab === 'account' && (
          <AccountTab 
            currentUser={currentUser} 
            onOpenPasswordModal={() => setIsPasswordModalOpen(true)} 
          />
        )}
        {activeTab === 'branding' && <BrandingTab />}
        {activeTab === 'system' && <SystemTab />}
      </div>

      {/* --- PASSWORD CHANGE MODAL --- */}
      <PasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </div>
  );
}

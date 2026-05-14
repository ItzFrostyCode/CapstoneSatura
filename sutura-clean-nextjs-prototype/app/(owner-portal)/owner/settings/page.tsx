'use client';

import { useState } from 'react';
import { useERPStore } from '@/store/useERPStore';
import { 
  User, 
  Globe, 
  Save, 
  Lock, 
  Palette,
  Crown
} from 'lucide-react';

// Modular Components
import { GeneralTab } from '@/components/settings/GeneralTab';
import { AccountTab } from '@/components/settings/AccountTab';
import { BrandingTab } from '@/components/settings/BrandingTab';
import { SystemTab } from '@/components/settings/SystemTab';
import { SubscriptionTab } from '@/components/settings/SubscriptionTab';
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
    { id: 'subscription', name: 'Subscription', icon: <Crown size={18} /> },
    { id: 'system', name: 'System', icon: <Globe size={18} /> },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-[36px] font-bold font-sans text-[#1C1917] tracking-tight leading-none">Configuration</h1>
          <p className="text-[14px] text-[#78716C] mt-3">Refining the operational and aesthetic settings of your couture house.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="h-12 px-6 rounded-xl text-[13px] font-bold text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5] transition-all">
            Discard
          </button>
          <button className="h-12 px-8 bg-slate-900 text-white rounded-xl flex items-center gap-3 text-[14px] font-bold shadow-lg hover:shadow-slate-900/20 transition-all active:scale-95 group">
            <Save size={18} className="group-hover:scale-110 transition-transform" /> Commit Changes
          </button>
        </div>
      </div>

      {/* ── CAPSULE TABS ── */}
      <div className="flex items-center gap-2 bg-white p-1 rounded-[8px] w-fit border border-slate-200 mx-2 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-2.5 rounded-[4px] text-[13px] font-bold transition-all duration-200 ${
              activeTab === tab.id 
                ? 'bg-[#1e3a8a] text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
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
        {activeTab === 'subscription' && <SubscriptionTab />}
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

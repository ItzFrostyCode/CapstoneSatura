'use client';

import { User, Shield, Lock, Smartphone, Globe, LogOut, Mail, AlertCircle, Key } from 'lucide-react';
import { User as UserType } from '@/types/erp';

interface AccountTabProps {
  currentUser: UserType;
  onOpenPasswordModal: () => void;
}

export function AccountTab({ currentUser, onOpenPasswordModal }: AccountTabProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-[8px] shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      {/* ── HEADER ── */}
      <div className="p-8 border-b border-slate-100">
        <h3 className="text-[18px] font-bold text-slate-900 leading-none">Account Settings</h3>
        <p className="text-[14px] text-slate-500 mt-2">Manage your security and login preferences</p>
      </div>

      <div className="p-8 space-y-10">
        
        {/* LOGIN SECURITY SECTION */}
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 pb-4">Login Security</div>
          
          {/* PASSWORD */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <label className="text-[14px] text-slate-500 text-right">Password</label>
            <div className="flex items-center justify-between group">
              <div className="text-[14px] text-slate-900 flex items-center gap-3">
                 <div className="flex gap-1 text-slate-400 tracking-[0.3em]">••••••••</div>
                 <span className="text-[12px] text-slate-400 font-medium">(Last changed 3 months ago)</span>
              </div>
              <button 
                onClick={onOpenPasswordModal}
                className="text-blue-600 text-[14px] font-bold hover:underline"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* TWO-FACTOR */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <label className="text-[14px] text-slate-500 text-right">Two-Step Verification</label>
            <div className="flex items-center justify-between">
              <div className="text-[14px] text-slate-400 font-medium">Extra security for your workshop account</div>
              <button className="px-4 py-2 border border-slate-200 rounded-[4px] text-[12px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                Enable 2FA
              </button>
            </div>
          </div>
        </div>

        {/* ACTIVE SESSIONS */}
        <div className="space-y-6 max-w-4xl mx-auto pt-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4">
             <div className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">Active Sessions</div>
             <button className="text-[11px] font-black text-rose-600 hover:underline uppercase tracking-widest">Logout All Other Devices</button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[8px] border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 shadow-sm">
                  <Globe size={18} />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-slate-900">Chrome on macOS (Current)</div>
                  <div className="text-[11px] text-slate-400">Manila, Philippines • 192.168.1.1</div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">
                 <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" />
                 This Device
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-[8px] border border-slate-100">
              <div className="flex items-center gap-4 opacity-60">
                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                  <Smartphone size={18} />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-slate-900">iPhone 15 Pro Max</div>
                  <div className="text-[11px] text-slate-400">Davao, Philippines • 2 days ago</div>
                </div>
              </div>
              <button className="text-slate-300 hover:text-rose-500 transition-colors p-2">
                <AlertCircle size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex items-center gap-4 pt-10 border-t border-slate-50 max-w-4xl mx-auto w-full">
          <button className="w-[150px] h-[48px] bg-[#1e3a8a] hover:bg-[#172554] text-white rounded-[2px] text-[14px] font-medium transition-all shadow-sm active:scale-95">
            Commit Changes
          </button>
        </div>

      </div>
    </div>
  );
}

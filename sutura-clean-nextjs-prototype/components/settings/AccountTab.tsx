'use client';

import { User, Shield, Lock, Smartphone, Globe, LogOut, Mail, AlertCircle } from 'lucide-react';
import { User as UserType } from '@/types/erp';

interface AccountTabProps {
  currentUser: UserType;
  onOpenPasswordModal: () => void;
}

export function AccountTab({ currentUser, onOpenPasswordModal }: AccountTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Account Details */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
        <h3 className="text-[18px] font-black text-slate-900 mb-6 flex items-center gap-2">
          <User size={20} className="text-slate-400" /> Account Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                defaultValue={currentUser.email} 
                className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900" 
              />
              <Mail className="absolute right-4 top-3.5 text-slate-300" size={18} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <input 
              type="text" 
              defaultValue={currentUser.name.toLowerCase().replace(' ', '_')} 
              className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900" 
            />
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
        <h3 className="text-[18px] font-black text-slate-900 mb-6 flex items-center gap-2">
          <Shield size={20} className="text-slate-400" /> Account Security
        </h3>
        <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm">
              <Lock size={20} />
            </div>
            <div>
              <div className="text-[15px] font-black text-slate-900">Change Password</div>
              <div className="text-[12px] text-slate-500 font-medium">Last changed 3 months ago</div>
            </div>
          </div>
          <button 
            onClick={onOpenPasswordModal}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-[13px] font-black hover:bg-slate-50 transition-all shadow-sm"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Session Control */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[18px] font-black text-slate-900 flex items-center gap-2">
            <Smartphone size={20} className="text-slate-400" /> Active Sessions
          </h3>
          <button className="text-[12px] font-black text-rose-600 hover:text-rose-700 flex items-center gap-1">
            <LogOut size={14} /> Log out all devices
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                <Globe size={18} />
              </div>
              <div>
                <div className="text-[13px] font-black text-slate-900">Chrome on macOS (Current)</div>
                <div className="text-[11px] text-slate-400 font-medium">Manila, PH • 192.168.1.1</div>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                <Smartphone size={18} />
              </div>
              <div>
                <div className="text-[13px] font-black text-slate-900">iPhone 15 Pro</div>
                <div className="text-[11px] text-slate-400 font-medium">Manila, PH • 2 days ago</div>
              </div>
            </div>
            <button className="text-slate-300 hover:text-rose-500 transition-colors">
              <AlertCircle size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

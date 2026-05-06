'use client';

import { ChevronRight } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasswordModal({ isOpen, onClose }: PasswordModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[24px] font-black text-slate-900 tracking-tight">Change Password</h3>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <ChevronRight size={20} className="rotate-180" />
          </button>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] outline-none focus:bg-white focus:border-slate-900" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] outline-none focus:bg-white focus:border-slate-900" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] outline-none focus:bg-white focus:border-slate-900" 
            />
          </div>
        </div>
        
        <div className="mt-10 flex flex-col gap-3">
          <button className="w-full h-12 bg-slate-900 text-white rounded-2xl text-[14px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10">
            Update Security Credentials
          </button>
          <button 
            onClick={onClose}
            className="w-full h-12 text-slate-400 text-[13px] font-black hover:text-slate-600 transition-all"
          >
            Cancel and Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

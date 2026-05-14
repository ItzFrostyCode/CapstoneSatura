'use client';

import { useState } from 'react';
import Image from 'next/image';
import { User, Camera, ShieldCheck, HelpCircle } from 'lucide-react';
import { User as UserType } from '@/types/erp';
import { useERPStore } from '@/store/useERPStore';

interface GeneralTabProps {
  currentUser: UserType;
}

export function GeneralTab({ currentUser }: GeneralTabProps) {
  const { updateUserAvatar } = useERPStore();
  const [gender, setGender] = useState('male');

  return (
    <div className="bg-white border border-slate-200 rounded-[8px] shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      {/* ── HEADER ── */}
      <div className="p-8 border-b border-slate-100">
        <h3 className="text-[18px] font-bold text-slate-900 leading-none">My Profile</h3>
        <p className="text-[14px] text-slate-500 mt-2">Manage and protect your account</p>
      </div>

      <div className="flex flex-col lg:flex-row p-8 gap-12">
        {/* ── LEFT COLUMN: FORM ── */}
        <div className="flex-1 space-y-8">
          
          {/* USERNAME */}
          <div className="grid grid-cols-[140px_1fr] items-start gap-4">
            <label className="text-[14px] text-slate-500 pt-3 text-right">Username</label>
            <div className="space-y-2">
              <input 
                type="text" 
                defaultValue="johnclock.master" 
                className="w-full h-12 px-3 border border-slate-200 rounded-[4px] text-[14px] outline-none focus:border-slate-400 transition-all" 
              />
              <p className="text-[12px] text-slate-400">Username can only be changed once.</p>
            </div>
          </div>

          {/* NAME */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <label className="text-[14px] text-slate-500 text-right">Name</label>
            <input 
              type="text" 
              defaultValue="John Clock" 
              className="w-full h-12 px-3 border border-slate-200 rounded-[4px] text-[14px] outline-none focus:border-slate-400 transition-all" 
            />
          </div>

          {/* EMAIL */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <label className="text-[14px] text-slate-500 text-right">Email</label>
            <div className="text-[14px] text-slate-900 flex items-center gap-2">
              johncl********@sutura.ph
              <button className="text-blue-600 hover:underline">Change</button>
            </div>
          </div>

          {/* PHONE */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <label className="text-[14px] text-slate-500 text-right">Phone Number</label>
            <div className="text-[14px] text-slate-900 flex items-center gap-2">
              *********88
              <button className="text-blue-600 hover:underline">Change</button>
            </div>
          </div>

          {/* GENDER */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <div className="flex items-center gap-1 justify-end">
               <label className="text-[14px] text-slate-500">Gender</label>
               <HelpCircle size={14} className="text-slate-300 cursor-help" />
            </div>
            <div className="flex items-center gap-6">
              {['male', 'female', 'other'].map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <input 
                      type="radio" 
                      name="gender" 
                      value={opt} 
                      checked={gender === opt}
                      onChange={() => setGender(opt)}
                      className="peer sr-only" 
                    />
                    <div className="w-5 h-5 border-2 border-slate-200 rounded-full peer-checked:border-[#1e3a8a] transition-all" />
                    <div className="absolute w-2.5 h-2.5 bg-[#1e3a8a] rounded-full scale-0 peer-checked:scale-100 transition-transform" />
                  </div>
                  <span className="text-[14px] text-slate-800 capitalize group-hover:text-slate-900">{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* BIRTHDAY */}
          <div className="grid grid-cols-[140px_1fr] items-start gap-4 pb-4">
            <div className="flex items-center gap-1 justify-end pt-3">
               <label className="text-[14px] text-slate-500">Date of birth</label>
               <HelpCircle size={14} className="text-slate-300 cursor-help" />
            </div>
            <div className="space-y-2">
              <div className="h-12 flex items-center text-[14px] text-slate-900">
                **/**/1985
              </div>
              <p className="text-[12px] text-slate-400">You have already done KYC. Changing your birthday is not permitted.</p>
            </div>
          </div>

          {/* SUBSCRIPTION INFO (Added Back) */}
          <div className="pt-8 border-t border-slate-50 space-y-8">
             <div className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400">Subscription & Plan</div>
             
             {/* PLAN LEVEL */}
             <div className="grid grid-cols-[140px_1fr] items-center gap-4">
               <label className="text-[14px] text-slate-500 text-right">Current Plan</label>
               <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-slate-900 text-white text-[11px] font-black uppercase rounded-[2px]">Premium Plan</div>
                  <div className="text-[14px] text-emerald-600 font-bold flex items-center gap-1">
                     <ShieldCheck size={16} /> Active
                  </div>
               </div>
             </div>

             {/* BILLING PERIOD */}
             <div className="grid grid-cols-[140px_1fr] items-center gap-4">
               <label className="text-[14px] text-slate-500 text-right">Billing Period</label>
               <div className="flex items-center gap-8 text-[14px]">
                  <div className="space-y-1">
                     <div className="text-slate-400 text-[11px] font-bold uppercase">Started</div>
                     <div className="text-slate-900 font-medium">May 1, 2026</div>
                  </div>
                  <div className="space-y-1">
                     <div className="text-slate-400 text-[11px] font-bold uppercase">Next Renewal</div>
                     <div className="text-[#1e3a8a] font-bold">June 1, 2026</div>
                  </div>
               </div>
             </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex items-center gap-4 pt-10 border-t border-slate-50">
            <button className="w-[100px] h-[48px] bg-[#1e3a8a] hover:bg-[#172554] text-white rounded-[2px] text-[14px] font-medium transition-all shadow-sm active:scale-95">
              Save
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN: IMAGE UPLOAD ── */}
        <div className="w-full lg:w-[300px] flex flex-col items-center justify-start border-l border-slate-100 pt-8 lg:pl-12">
          <div className="w-[120px] h-[120px] rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden mb-6 group relative cursor-pointer">
            <img 
              src={currentUser.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=John"} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
          
          <button className="px-6 h-[40px] border border-slate-200 rounded-[2px] text-[14px] text-slate-600 hover:bg-slate-50 transition-all mb-4">
            Select Image
          </button>
          
          <div className="space-y-1 text-center">
            <p className="text-[14px] text-slate-400 leading-tight">File size: maximum 1 MB</p>
            <p className="text-[14px] text-slate-400 leading-tight">File extension: .JPEG, .PNG</p>
          </div>
        </div>

      </div>
    </div>
  );
}

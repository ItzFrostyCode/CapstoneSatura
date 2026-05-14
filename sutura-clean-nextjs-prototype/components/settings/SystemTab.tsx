'use client';

import { Building2, Globe, ChevronDown, Bell, ShieldCheck } from 'lucide-react';

export function SystemTab() {
  return (
    <div className="bg-white border border-slate-200 rounded-[8px] shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden">
      {/* ── HEADER ── */}
      <div className="p-8 border-b border-slate-100">
        <h3 className="text-[18px] font-bold text-slate-900 leading-none">System Settings</h3>
        <p className="text-[14px] text-slate-500 mt-2">Manage your operational preferences and regional controls</p>
      </div>

      <div className="p-8 space-y-10">
        
        {/* FINANCIALS SECTION */}
        <div className="space-y-8 max-w-4xl">
          <div className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 pb-4">Financial Controls</div>
          
          {/* VAT RATE */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <label className="text-[14px] text-slate-500 text-right">VAT / Tax Rate (%)</label>
            <div className="relative w-32">
               <input 
                 type="number" 
                 defaultValue="12" 
                 className="w-full h-10 px-3 border border-slate-200 rounded-[4px] text-[14px] outline-none focus:border-slate-400" 
               />
               <span className="absolute right-3 top-2.5 text-slate-400 text-[12px] font-bold">%</span>
            </div>
          </div>

          {/* CURRENCY */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <label className="text-[14px] text-slate-500 text-right">Default Currency</label>
            <div className="relative w-64">
              <select className="w-full h-10 px-3 border border-slate-200 rounded-[4px] text-[14px] outline-none appearance-none bg-white cursor-pointer focus:border-slate-400 transition-all">
                 <option>Philippine Peso (₱)</option>
                 <option>US Dollar ($)</option>
                 <option>Euro (€)</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>

        </div>

        {/* REGIONAL SECTION */}
        <div className="space-y-8 max-w-4xl pt-4">
          <div className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-50 pb-4">Regional & Notifications</div>
          
          {/* TIMEZONE */}
          <div className="grid grid-cols-[140px_1fr] items-center gap-4">
            <label className="text-[14px] text-slate-500 text-right">System Timezone</label>
            <div className="relative w-64">
              <select className="w-full h-10 px-3 border border-slate-200 rounded-[4px] text-[14px] outline-none appearance-none bg-white cursor-pointer focus:border-slate-400 transition-all">
                 <option>GMT+8 (Manila, Philippines)</option>
                 <option>GMT+0 (London, UK)</option>
                 <option>GMT-5 (New York, USA)</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 text-slate-400 pointer-events-none" size={14} />
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div className="grid grid-cols-[140px_1fr] items-start gap-4">
            <label className="text-[14px] text-slate-500 pt-1 text-right">Notifications</label>
            <div className="space-y-4">
               <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative w-10 h-5 bg-emerald-500 rounded-full transition-all">
                     <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full transition-all" />
                  </div>
                  <span className="text-[14px] text-slate-800">Email notifications for new orders</span>
               </label>
               <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative w-10 h-5 bg-slate-200 rounded-full transition-all">
                     <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-all" />
                  </div>
                  <span className="text-[14px] text-slate-500">SMS alerts for urgent fittings</span>
               </label>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex items-center gap-4 pt-10 border-t border-slate-50">
          <button className="w-[150px] h-[48px] bg-[#1e3a8a] hover:bg-[#172554] text-white rounded-[2px] text-[14px] font-medium transition-all shadow-sm active:scale-95">
            Save System
          </button>
        </div>

      </div>
    </div>
  );
}

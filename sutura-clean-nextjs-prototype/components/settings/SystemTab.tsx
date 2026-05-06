'use client';

import { Building2, Globe, ChevronRight } from 'lucide-react';

export function SystemTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Financial Settings */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
        <h3 className="text-[18px] font-black text-slate-900 mb-6 flex items-center gap-2">
          <Building2 size={20} className="text-slate-400" /> Financial Settings
        </h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">VAT / Tax Rate (%)</label>
            <div className="relative">
              <input 
                type="number" 
                defaultValue="12" 
                className="w-full h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-black outline-none focus:bg-white focus:border-slate-900" 
              />
              <span className="absolute right-5 top-3.5 text-slate-400 font-black">%</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Invoice Prefix</label>
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                defaultValue="SUT" 
                className="w-32 h-12 px-5 bg-slate-50 border border-slate-100 rounded-xl text-[14px] font-black outline-none focus:bg-white focus:border-slate-900 uppercase" 
              />
              <div className="flex-1 h-12 bg-slate-100 rounded-xl flex items-center px-4 text-[12px] font-bold text-slate-400 italic">
                Example: SUT-2024-001
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Default Pricing Rules</label>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-slate-600">Auto-include Labor in Tax</span>
                <button className="w-10 h-5 bg-slate-900 rounded-full relative">
                  <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full" />
                </button>
              </div>
              <div className="flex items-center justify-between group relative">
                <span className="text-[13px] font-bold text-slate-600 flex items-center gap-2">
                  Rounding (Up to nearest 10)
                </span>
                <button className="w-10 h-5 bg-slate-900 rounded-full relative">
                  <div className="absolute top-1 left-6 w-3 h-3 bg-white rounded-full" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Localization Settings */}
      <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/20 h-fit">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
            <Globe size={24} />
          </div>
          <h4 className="text-[18px] font-black tracking-tight mb-2">Regional Controls</h4>
          <p className="text-[13px] text-slate-400 font-medium mb-8">System-wide timezone and currency preferences.</p>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Timezone</label>
              <div className="relative">
                <select className="w-full h-12 bg-white/5 border border-white/10 rounded-xl text-[14px] font-black outline-none px-5 appearance-none cursor-pointer hover:bg-white/10 transition-all">
                  <option className="bg-slate-900">GMT+8 (Manila)</option>
                  <option className="bg-slate-900">GMT+0 (UTC)</option>
                  <option className="bg-slate-900">EST (New York)</option>
                </select>
                <ChevronRight className="absolute right-4 top-4 text-slate-500 rotate-90" size={16} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Currency</label>
              <div className="relative">
                <select className="w-full h-12 bg-white/5 border border-white/10 rounded-xl text-[14px] font-black outline-none px-5 appearance-none cursor-pointer hover:bg-white/10 transition-all">
                  <option className="bg-slate-900">Philippine Peso (₱)</option>
                  <option className="bg-slate-900">US Dollar ($)</option>
                  <option className="bg-slate-900">Euro (€)</option>
                </select>
                <ChevronRight className="absolute right-4 top-4 text-slate-500 rotate-90" size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

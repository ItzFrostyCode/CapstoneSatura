'use client';

import React from 'react';
import { 
  ArrowUpRight, ArrowDownRight, TrendingUp, 
  AlertCircle, CheckCircle2, Clock, Package,
  ArrowRight
} from 'lucide-react';

// --- BRANCH PERFORMANCE COMPARISON ---
export const BranchPerformance = ({ branches, branchData }: any) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-black text-slate-900 uppercase tracking-tight">Branch Performance Index</h3>
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Revenue vs Target</span>
      </div>
      <div className="space-y-4">
        {branches.map((branch: any) => {
          const data = branchData[branch.id] || { revenue: 0, target: 100000 };
          const percent = Math.min(100, (data.revenue / data.target) * 100);
          
          return (
            <div key={branch.id} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${branch.isMain ? 'bg-indigo-500' : 'bg-emerald-500'}`} />
                  <span className="text-[13px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{branch.branchName}</span>
                </div>
                <div className="text-[13px] font-black text-slate-900">₱{data.revenue.toLocaleString()}</div>
              </div>
              <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                <div 
                  className={`h-full transition-all duration-1000 ${branch.isMain ? 'bg-indigo-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${percent}%` }} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- FINANCIAL AGING (AR) ---
export const ReceivablesAging = ({ agingData }: any) => {
  return (
    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
      <div className="flex items-center gap-2 text-rose-600 text-[11px] font-black uppercase tracking-widest mb-6">
        <AlertCircle size={14} /> Receivables Risk Profile
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Current', val: agingData.current, color: 'bg-emerald-500' },
          { label: '30 Days', val: agingData.overdue30, color: 'bg-amber-500' },
          { label: '60 Days', val: agingData.overdue60, color: 'bg-orange-500' },
          { label: '90+ Days', val: agingData.overdue90, color: 'bg-rose-500' },
        ].map(item => (
          <div key={item.label} className="text-center">
            <div className="text-[14px] font-black text-slate-900 mb-1">₱{(item.val / 1000).toFixed(0)}k</div>
            <div className={`h-1.5 w-full ${item.color} rounded-full mb-2 opacity-80`} />
            <div className="text-[8px] font-black text-slate-400 uppercase tracking-tighter whitespace-nowrap">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- PRODUCTION EFFICIENCY ---
export const ProductionEfficiency = ({ stats }: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-white border border-slate-100 rounded-[28px] shadow-sm">
        <div className="flex items-center gap-3 text-indigo-500 mb-4">
          <Clock size={20} />
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Avg Lead Time</span>
        </div>
        <div className="text-[28px] font-black text-slate-900">4.2 <span className="text-[14px] text-slate-400">Days</span></div>
        <div className="flex items-center gap-1 text-emerald-500 text-[11px] font-bold mt-2">
          <ArrowUpRight size={14} /> 12% faster
        </div>
      </div>

      <div className="p-6 bg-white border border-slate-100 rounded-[28px] shadow-sm">
        <div className="flex items-center gap-3 text-emerald-500 mb-4">
          <CheckCircle2 size={20} />
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Throughput</span>
        </div>
        <div className="text-[28px] font-black text-slate-900">88% <span className="text-[14px] text-slate-400">Rate</span></div>
        <div className="flex items-center gap-1 text-slate-400 text-[11px] font-bold mt-2">
          Stable vs Last Month
        </div>
      </div>

      <div className="p-6 bg-white border border-slate-100 rounded-[28px] shadow-sm">
        <div className="flex items-center gap-3 text-amber-500 mb-4">
          <Package size={20} />
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Quality Index</span>
        </div>
        <div className="text-[28px] font-black text-slate-900">96.5%</div>
        <div className="flex items-center gap-1 text-rose-500 text-[11px] font-bold mt-2">
          <ArrowDownRight size={14} /> 2.1% Revisions
        </div>
      </div>
    </div>
  );
};

// --- ALERT CARD ---
export const ExecutiveAlert = ({ title, desc, action, type = 'warning' }: any) => {
  const colors = {
    warning: 'bg-amber-50 border-amber-100 text-amber-900 icon-amber-600',
    critical: 'bg-rose-50 border-rose-100 text-rose-900 icon-rose-600',
    info: 'bg-indigo-50 border-indigo-100 text-indigo-900 icon-indigo-600'
  }[type as 'warning' | 'critical' | 'info'];

  return (
    <div className={`p-5 rounded-3xl border flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-all ${colors}`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center shrink-0`}>
          <AlertCircle size={20} />
        </div>
        <div>
          <div className="text-[14px] font-black tracking-tight">{title}</div>
          <div className="text-[12px] font-medium opacity-70">{desc}</div>
        </div>
      </div>
      <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
    </div>
  );
};

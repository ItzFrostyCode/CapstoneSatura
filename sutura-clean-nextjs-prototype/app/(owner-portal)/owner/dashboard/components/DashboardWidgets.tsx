'use client';

import React from 'react';
import { 
  ArrowUpRight, ArrowDownRight, TrendingUp, 
  AlertCircle, CheckCircle2, Clock, Package,
  ArrowRight, Activity, Wallet, Scissors
} from 'lucide-react';

// --- BRANCH PERFORMANCE COMPARISON ---
export const BranchPerformance = ({ branches, branchData }: any) => {
  const sortedBranches = [...branches].sort((a, b) => {
    const revA = branchData[a.id]?.revenue || 0;
    const revB = branchData[b.id]?.revenue || 0;
    return revB - revA;
  });

  const topBranch = sortedBranches[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-black text-slate-900 uppercase tracking-tight">Branch Performance Index</h3>
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Revenue vs Target</span>
      </div>

      {topBranch && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <TrendingUp size={20} className="text-emerald-500" />
            </div>
            <div>
              <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Top Performing</div>
              <div className="text-[14px] font-black text-slate-900">{topBranch.branchName}</div>
            </div>
          </div>
          <div className="text-[16px] font-black text-emerald-600">
            ₱{(branchData[topBranch.id]?.revenue || 0).toLocaleString()}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {branches.map((branch: any) => {
          const data = branchData[branch.id] || { revenue: 0, target: 100000 };
          const percent = Math.min(100, (data.revenue / data.target) * 100);
          
          return (
            <div key={branch.id} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${branch.isMain ? 'bg-indigo-500' : 'bg-slate-400'}`} />
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

// --- STAFF STATUS TRACKER ---
export const StaffStatusWidget = ({ staff }: { staff: any[] }) => {
  const sortedStaff = [...staff].sort((a, b) => {
    const aIsOnline = a.status === 'Online' || a.status === 'Active';
    const bIsOnline = b.status === 'Online' || b.status === 'Active';
    if (aIsOnline && !bIsOnline) return -1;
    if (!aIsOnline && bIsOnline) return 1;
    return 0;
  });

  const onlineCount = sortedStaff.filter(s => s.status === 'Online' || s.status === 'Active').length;

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm flex flex-col max-h-[420px]">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h3 className="text-[16px] font-black text-slate-900 uppercase tracking-tight">Staff Availability</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">{onlineCount} Online Now</p>
        </div>
      </div>
      
      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {sortedStaff.map((member, i) => {
          const isOnline = member.status === 'Online' || member.status === 'Active';
          return (
            <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-[12px] font-black text-slate-500">{member.name.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-black text-slate-900 truncate">{member.name}</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest truncate">{member.roles?.[0] || 'Staff'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${isOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          );
        })}
        {sortedStaff.length === 0 && (
           <div className="text-center py-6 text-slate-400 italic text-[12px]">No staff found</div>
        )}
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
export const ExecutiveAlert = ({ title, desc, action, type = 'warning', count }: any) => {
  const colors = {
    warning: 'bg-amber-50 border-amber-100 text-amber-900 icon-amber-600',
    critical: 'bg-rose-50 border-rose-100 text-rose-900 icon-rose-600',
    info: 'bg-indigo-50 border-indigo-100 text-indigo-900 icon-indigo-600',
    success: 'bg-emerald-50 border-emerald-100 text-emerald-900 icon-emerald-600'
  }[type as 'warning' | 'critical' | 'info' | 'success'];

  return (
    <div className={`p-5 rounded-3xl border flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-all ${colors}`}>
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center shrink-0`}>
          {type === 'critical' ? <AlertCircle size={20} className="text-rose-600" /> : 
           type === 'warning' ? <Clock size={20} className="text-amber-600" /> : 
           <Activity size={20} className="text-indigo-600" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <div className="text-[14px] font-black tracking-tight">{title}</div>
            {count !== undefined && (
              <span className="px-2 py-0.5 rounded-md bg-white/50 text-[10px] font-black">{count}</span>
            )}
          </div>
          <div className="text-[12px] font-medium opacity-70">{desc}</div>
        </div>
      </div>
      <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
    </div>
  );
};

// --- STOCK RISK QUEUE ---
export const StockRiskQueue = ({ items }: { items: any[] }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
       <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-[16px] font-black text-slate-900 uppercase tracking-tight">Stock Risks</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Critical materials monitor</p>
        </div>
        <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
          <AlertCircle size={20} />
        </div>
      </div>

      <div className="space-y-3">
        {items.slice(0, 3).map((item, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-rose-200 transition-colors gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                <Package size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] font-black text-slate-900 truncate">{item.item_name || item.item}</div>
                <div className="text-[11px] font-bold text-rose-500 uppercase tracking-widest">{item.stock || 0} {item.unit_of_measure || 'units'} left</div>
              </div>
            </div>
            <button className="h-8 px-3 bg-white border border-slate-200 text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shrink-0">
              Reorder
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-6 text-slate-400 italic text-[12px]">
            Inventory healthy. No critical stockouts.
          </div>
        )}
      </div>
    </div>
  );
};

// --- RECENT ACTIVITY (LIVE FEED) ---
export const SystemPulse = ({ activities }: any) => {
  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm flex flex-col max-h-[420px]">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h3 className="text-[16px] font-black text-slate-900 uppercase tracking-tight">Recent Activity</h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Latest shop updates</p>
        </div>
        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
          <Activity size={20} />
        </div>
      </div>
      
      <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {activities.length > 0 ? activities.map((act: any, i: number) => (
          <div key={i} className="flex gap-4 group">
            <div className="flex flex-col items-center shrink-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                act.type === 'PAYMENT' ? 'bg-emerald-50 text-emerald-600' :
                act.type === 'STATUS' ? 'bg-indigo-50 text-indigo-600' :
                'bg-amber-50 text-amber-600'
              }`}>
                {act.type === 'PAYMENT' ? <Wallet size={18} /> : 
                 act.type === 'STATUS' ? <TrendingUp size={18} /> : 
                 <AlertCircle size={18} />}
              </div>
              {i < activities.length - 1 && <div className="flex-1 w-px bg-slate-100 my-2" />}
            </div>
            <div className="pb-4 min-w-0">
              <div className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight truncate">{act.title}</div>
              <div className="text-[12px] font-medium text-slate-500 line-clamp-1 leading-snug">{act.desc}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{act.time}</div>
            </div>
          </div>
        )) : (
          <div className="text-center py-10 text-slate-300 italic text-[13px]">
            No recent activity.
          </div>
        )}
      </div>
    </div>
  );
};

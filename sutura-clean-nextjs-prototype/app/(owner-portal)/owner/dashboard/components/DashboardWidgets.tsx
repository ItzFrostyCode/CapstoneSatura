'use client';

import React from 'react';
import { 
  ArrowUpRight, ArrowDownRight, TrendingUp, 
  AlertCircle, CheckCircle2, Clock, Package,
  ArrowRight, Activity, Wallet, Shield, Sparkles, Megaphone
} from 'lucide-react';
import { ShopBranch, Staff, InventoryItem } from '@/types/erp';

// --- BRANCH PERFORMANCE COMPARISON ---
interface BranchPerformanceProps {
  branches: ShopBranch[];
  branchData: Record<string, { revenue: number; target: number }>;
}

export const BranchPerformance = ({ branches, branchData }: BranchPerformanceProps) => {
  const sortedBranches = [...branches].sort((a, b) => {
    const revA = branchData[a.id]?.revenue || 0;
    const revB = branchData[b.id]?.revenue || 0;
    return revB - revA;
  });

  const topBranch = sortedBranches[0];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-black text-slate-900 uppercase tracking-tight">Branch Performance Index</h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Telemetry</span>
      </div>

      {topBranch && (
        <div className="p-5 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[28px] flex items-center justify-between shadow-lg shadow-indigo-200 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -mr-16 -mt-16" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <div className="text-[10px] font-black text-indigo-100 uppercase tracking-widest opacity-80">Leading Location</div>
              <div className="text-[16px] font-black text-white">{topBranch.branchName}</div>
            </div>
          </div>
          <div className="text-[20px] font-black text-white relative z-10">
            ₱{(branchData[topBranch.id]?.revenue || 0).toLocaleString()}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {branches.map((branch: ShopBranch) => {
          const data = branchData[branch.id] || { revenue: 0, target: 100000 };
          const percent = Math.min(100, (data.revenue / data.target) * 100);
          
          return (
            <div key={branch.id} className="group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${branch.isMain ? 'bg-indigo-500 shadow-lg shadow-indigo-200' : 'bg-slate-300'}`} />
                  <span className="text-[14px] font-black text-slate-800 group-hover:text-indigo-600 transition-colors">{branch.branchName}</span>
                </div>
                <div className="text-[14px] font-black text-slate-900">₱{data.revenue.toLocaleString()}</div>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50 relative">
                <div 
                  className={`h-full transition-all duration-1000 relative z-10 ${branch.isMain ? 'bg-indigo-600' : 'bg-emerald-500'}`} 
                  style={{ width: `${percent}%` }} 
                />
                <div className="absolute inset-0 bg-slate-200/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- STAFF STATUS TRACKER ---
export const StaffStatusWidget = ({ staff }: { staff: Staff[] }) => {
  const sortedStaff = [...staff].sort((a, b) => {
    const aIsOnline = a.status === 'Online' || a.status === 'Active';
    const bIsOnline = b.status === 'Online' || b.status === 'Active';
    if (aIsOnline && !bIsOnline) return -1;
    if (!aIsOnline && bIsOnline) return 1;
    return 0;
  });

  const onlineCount = sortedStaff.filter(s => s.status === 'Online' || s.status === 'Active').length;

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 shadow-xl shadow-slate-200/30 flex flex-col max-h-[420px] group">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h3 className="text-[16px] font-black text-slate-900 tracking-tight">Active Personnel</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">{onlineCount} Sessions Online</p>
        </div>
        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 ring-1 ring-emerald-100">
           <Shield size={18} />
        </div>
      </div>
      
      <div className="space-y-4 overflow-y-auto pr-3 custom-scrollbar flex-1">
        {sortedStaff.map((member, i) => {
          const isOnline = member.status === 'Online' || member.status === 'Active';
          return (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-300">
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative">
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                    <span className="text-[14px] font-black text-slate-500">{member.name.charAt(0)}</span>
                  </div>
                  {isOnline && <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full shadow-sm" />}
                </div>
                <div className="min-w-0">
                  <div className="text-[14px] font-black text-slate-900 truncate">{member.name}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate mt-0.5">{member.roles?.[0] || 'Staff'}</div>
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${isOnline ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                {isOnline ? 'Active' : 'Offline'}
              </div>
            </div>
          );
        })}
        {sortedStaff.length === 0 && (
           <div className="text-center py-12">
             <Activity size={24} className="text-slate-200 mx-auto mb-3" />
             <p className="text-slate-300 font-bold text-[12px] uppercase tracking-widest">No staff records</p>
           </div>
        )}
      </div>
    </div>
  );
};

// --- FINANCIAL AGING (AR) ---
interface ReceivablesAgingProps {
  agingData: {
    current: number;
    overdue30: number;
    overdue60: number;
    overdue90: number;
  };
}

export const ReceivablesAging = ({ agingData }: ReceivablesAgingProps) => {
  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Current', val: agingData.current, color: 'bg-emerald-400 shadow-emerald-400/20' },
          { label: '30 Days', val: agingData.overdue30, color: 'bg-amber-400 shadow-amber-400/20' },
          { label: '60 Days', val: agingData.overdue60, color: 'bg-orange-400 shadow-orange-400/20' },
          { label: '90+ Days', val: agingData.overdue90, color: 'bg-rose-400 shadow-rose-400/20' },
        ].map(item => (
          <div key={item.label} className="text-center group">
            <div className="text-[16px] font-black text-white mb-2 group-hover:scale-110 transition-transform">₱{(item.val / 1000).toFixed(0)}k</div>
            <div className={`h-2.5 w-full ${item.color} rounded-full mb-3 shadow-lg transition-all group-hover:opacity-100 opacity-60`} />
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- PRODUCTION EFFICIENCY ---
export const ProductionEfficiency = ({ stats }: { stats: Record<string, unknown> }) => {
  const cards = [
    { label: 'Avg Lead Time', val: '4.2', unit: 'Days', trend: '12% faster', icon: Clock, bg: 'bg-indigo-50', text: 'text-indigo-600' },
    { label: 'Throughput', val: '88', unit: '% Rate', trend: 'Stable', icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { label: 'Quality Index', val: '96.5', unit: '% Success', trend: '2.1% Revisions', icon: Package, bg: 'bg-amber-50', text: 'text-amber-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {cards.map((card, i) => (
        <div key={i} className="p-8 bg-white/80 backdrop-blur-md border border-white/60 rounded-[32px] shadow-xl shadow-slate-200/40 group hover:bg-white transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className={`w-12 h-12 rounded-2xl ${card.bg} flex items-center justify-center ${card.text} group-hover:scale-110 transition-transform duration-500`}>
              <card.icon size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{card.label}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-[36px] font-black text-slate-900 tracking-tight leading-none">{card.val}</div>
            <div className="text-[14px] font-bold text-slate-400 uppercase tracking-widest">{card.unit}</div>
          </div>
          <div className="flex items-center gap-2 text-[12px] font-bold text-slate-500 mt-4 bg-slate-50 px-3 py-1 rounded-full w-max">
            <Activity size={14} className="text-indigo-400" /> {card.trend}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- ALERT CARD ---
interface ExecutiveAlertProps {
  title: string;
  desc: string;
  type?: 'warning' | 'critical' | 'info' | 'success';
  count?: number;
}

export const ExecutiveAlert = ({ title, desc, type = 'warning', count }: ExecutiveAlertProps) => {
  const colors = {
    warning: 'bg-amber-50/80 border-amber-100 text-amber-900 icon-amber-600 shadow-amber-500/5',
    critical: 'bg-rose-50/80 border-rose-100 text-rose-900 icon-rose-600 shadow-rose-500/5',
    info: 'bg-indigo-50/80 border-indigo-100 text-indigo-900 icon-indigo-600 shadow-indigo-500/5',
    success: 'bg-emerald-50/80 border-emerald-100 text-emerald-900 icon-emerald-600 shadow-emerald-500/5'
  }[type];

  return (
    <div className={`p-6 rounded-[28px] border backdrop-blur-md flex items-center justify-between group cursor-pointer hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 ${colors}`}>
      <div className="flex items-center gap-5">
        <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm ring-1 ring-black/5`}>
          {type === 'critical' ? <AlertCircle size={22} className="text-rose-600" /> : 
           type === 'warning' ? <Clock size={22} className="text-amber-600" /> : 
           <Activity size={22} className="text-indigo-600" />}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-0.5">
            <div className="text-[15px] font-black tracking-tight">{title}</div>
            {count !== undefined && (
              <span className="px-2 py-0.5 rounded-lg bg-white/80 text-[10px] font-black ring-1 ring-black/5">{count} Units</span>
            )}
          </div>
          <div className="text-[12px] font-medium opacity-60 leading-tight">{desc}</div>
        </div>
      </div>
      <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
        <ArrowRight size={18} className="translate-x-[-4px] group-hover:translate-x-0 transition-transform" />
      </div>
    </div>
  );
};

// --- STOCK RISK QUEUE ---
export const StockRiskQueue = ({ items }: { items: InventoryItem[] }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 shadow-xl shadow-slate-200/30 group">
       <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Stock Vulnerabilities</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">Critical Supply Audit</p>
        </div>
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0 ring-1 ring-rose-100 group-hover:scale-110 transition-transform">
          <AlertCircle size={24} />
        </div>
      </div>

      <div className="space-y-4">
        {items.slice(0, 3).map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white/50 rounded-[24px] border border-transparent hover:border-rose-100 hover:bg-white hover:shadow-lg transition-all duration-300 gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shadow-inner shrink-0 group-hover:bg-rose-50 group-hover:text-rose-400 transition-colors">
                <Package size={20} />
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-black text-slate-900 truncate">{item.item_name || item.item}</div>
                <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-0.5 leading-none">
                  Only {item.stock || 0} {item.unit_of_measure || 'units'} Remaining
                </div>
              </div>
            </div>
            <button className="h-9 px-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shrink-0 shadow-lg shadow-slate-900/10">
              Replenish
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-12 bg-slate-50/50 rounded-[24px] border border-dashed border-slate-200">
            <CheckCircle2 size={32} className="text-emerald-300 mx-auto mb-4" />
            <p className="text-slate-400 font-bold text-[12px] uppercase tracking-widest">Inventory Levels Optimal</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- RECENT ACTIVITY (LIVE FEED) ---
interface ActivityItem {
  type: 'PAYMENT' | 'STATUS' | 'ALERT';
  title: string;
  desc: string;
  time: string;
}

export const RecentActivity = ({ activities }: { activities: ActivityItem[] }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 shadow-xl shadow-slate-200/30 flex flex-col max-h-[420px] group">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Recent Activity</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">Latest Shop Updates</p>
        </div>
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 ring-1 ring-indigo-100 group-hover:rotate-12 transition-transform">
          <Activity size={24} />
        </div>
      </div>
      
      <div className="space-y-8 overflow-y-auto pr-3 custom-scrollbar flex-1 relative">
        {activities.length > 0 ? activities.map((act: ActivityItem, i: number) => (
          <div key={i} className="flex gap-5 group/item">
            <div className="flex flex-col items-center shrink-0">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ring-1 ring-black/5 transition-all duration-300 group-hover/item:scale-110 ${
                act.type === 'PAYMENT' ? 'bg-emerald-50 text-emerald-600' :
                act.type === 'STATUS' ? 'bg-indigo-50 text-indigo-600' :
                'bg-rose-50 text-rose-600'
              }`}>
                {act.type === 'PAYMENT' ? <Wallet size={20} /> : 
                 act.type === 'STATUS' ? <TrendingUp size={20} /> : 
                 <AlertCircle size={20} />}
              </div>
              {i < activities.length - 1 && <div className="flex-1 w-px bg-slate-100 my-3 group-hover/item:bg-indigo-200 transition-colors" />}
            </div>
            <div className="pb-6 min-w-0">
              <div className="text-[15px] font-black text-slate-900 group-hover/item:text-indigo-600 transition-colors tracking-tight truncate">{act.title}</div>
              <div className="text-[13px] font-medium text-slate-500 line-clamp-2 leading-relaxed mt-1 opacity-80">{act.desc}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 bg-slate-50 px-2 py-1 rounded-md w-max border border-slate-100">{act.time}</div>
            </div>
          </div>
        )) : (
          <div className="text-center py-20">
            <Clock size={32} className="text-slate-200 mx-auto mb-4" />
            <p className="text-slate-300 font-bold text-[12px] uppercase tracking-widest">Awaiting system events...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- SYSTEM ANNOUNCEMENTS (HQ BROADCAST) ---
interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'feature' | 'update' | 'alert' | 'Platform Update' | 'News';
  author: string;
}

export const SystemAnnouncements = ({ announcements }: { announcements: Announcement[] }) => {
  if (announcements.length === 0) return null;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-2 px-2">
         <div className="w-2 h-2 bg-indigo-500 rounded-full" />
         <span className="text-[12px] font-bold text-slate-900 uppercase tracking-widest">Platform News</span>
      </div>

      {announcements.map((ann, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          {/* Header */}
          <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                <Megaphone size={18} />
              </div>
              <div>
                <div className="text-[14px] font-black text-slate-900 leading-tight">Sutura Admin</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">System Administrator</div>
              </div>
            </div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
              {ann.date}
            </div>
          </div>

          {/* Content */}
          <div className="p-10 pt-6 space-y-4">
            <h4 className="text-[18px] font-black text-slate-900 tracking-tight">{ann.title}</h4>
            <div className="text-[14px] text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
              {ann.message}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

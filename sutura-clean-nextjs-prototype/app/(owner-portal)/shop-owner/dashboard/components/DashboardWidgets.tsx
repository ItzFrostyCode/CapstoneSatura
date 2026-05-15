"use client";
import React from "react";
import { 
  ArrowUpRight, ArrowDownRight, TrendingUp, 
  AlertCircle, CheckCircle2, Clock, Package,
  ArrowRight, Activity, Wallet, Shield, Sparkles, Megaphone
} from "lucide-react";
import { ShopBranch, Staff, InventoryItem } from "@/types/erp";

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
    <div className="flex flex-col gap-8 font-poppins">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Branch Analytics</h3>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Telemetry</span>
      </div>

      {topBranch && (
        <div className="p-6 bg-slate-900 rounded-[32px] flex items-center justify-between text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Leaderboard</div>
              <div className="text-[18px] font-black tracking-tight">{topBranch.branchName}</div>
            </div>
          </div>
          <div className="text-[24px] font-black text-white relative z-10">
            ₱{(branchData[topBranch.id]?.revenue || 0).toLocaleString()}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {branches.map((branch: ShopBranch) => {
          const data = branchData[branch.id] || { revenue: 0, target: 100000 };
          const percent = Math.min(100, (data.revenue / data.target) * 100);
          
          return (
            <div key={branch.id}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${branch.isMain ? 'bg-slate-900' : 'bg-slate-200'}`} />
                  <span className="text-[14px] font-bold text-slate-700">{branch.branchName}</span>
                </div>
                <div className="text-[14px] font-black text-slate-900">₱{data.revenue.toLocaleString()}</div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${branch.isMain ? 'bg-slate-900' : 'bg-slate-400'}`}
                  style={{ width: percent + "%" }} 
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
export const StaffStatusWidget = ({ staff }: { staff: Staff[] }) => {
  const onlineCount = staff.filter(s => s.status === "Online" || s.status === "Active").length;

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-8 flex flex-col gap-8 font-poppins">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Personnel Telemetry</h3>
          <p className="text-[12px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{onlineCount} Team members active</p>
        </div>
        <div className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-900">
           <Shield size={20} />
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        {staff.map((member, i) => {
          const isOnline = member.status === "Online" || member.status === "Active";
          return (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl transition-all hover:bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-black text-slate-400">
                    {member.name.charAt(0)}
                  </div>
                  {isOnline && <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />}
                </div>
                <div>
                  <div className="text-[14px] font-black text-slate-900">{member.name}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{member.roles?.[0] || "Artisan"}</div>
                </div>
              </div>
              <div className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${isOnline ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {isOnline ? "Online" : "Offline"}
              </div>
            </div>
          );
        })}
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
    <div className="grid grid-cols-4 gap-3 mt-6 font-poppins">
      {[
        { label: "Current", val: agingData.current, color: "bg-emerald-500" },
        { label: "30d", val: agingData.overdue30, color: "bg-slate-400" },
        { label: "60d", val: agingData.overdue60, color: "bg-slate-600" },
        { label: "90d+", val: agingData.overdue90, color: "bg-rose-500" },
      ].map(item => (
        <div key={item.label} className="text-center">
          <div className="text-[13px] font-black text-white mb-2 tracking-tight">₱{(item.val / 1000).toFixed(0)}k</div>
          <div className="h-1 w-full bg-white/10 rounded-full mb-2 overflow-hidden">
            <div className={`h-full w-full ${item.color}`} />
          </div>
          <div className="text-[9px] font-black text-white/40 uppercase tracking-widest">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

// --- PRODUCTION EFFICIENCY ---
export const ProductionEfficiency = ({ stats }: { stats: Record<string, unknown> }) => {
  const cards = [
    { label: "Cycle Time", val: "4.2", unit: "Days", trend: "-12%", icon: Clock, color: "text-slate-900" },
    { label: "Throughput", val: "88", unit: "%", trend: "Stable", icon: CheckCircle2, color: "text-slate-900" },
    { label: "Fulfillment", val: "96.5", unit: "%", trend: "+2.1%", icon: Package, color: "text-slate-900" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-poppins">
      {cards.map((card, i) => (
        <div key={i} className="p-6 bg-white border border-slate-200 rounded-[24px] hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className={`w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 ${card.color} flex items-center justify-center`}>
              <card.icon size={20} />
            </div>
            <div className="text-[10px] font-black px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full uppercase tracking-widest">{card.trend}</div>
          </div>
          <div className="flex items-baseline gap-1">
            <div className="text-[28px] font-black text-slate-900 tracking-tight">{card.val}</div>
            <div className="text-[14px] font-black text-slate-400 uppercase tracking-widest">{card.unit}</div>
          </div>
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mt-1">{card.label}</div>
        </div>
      ))}
    </div>
  );
};

// --- ALERT CARD ---
interface ExecutiveAlertProps {
  title: string;
  desc: string;
  type?: "warning" | "critical" | "info" | "success";
  count?: number;
}

export const ExecutiveAlert = ({ title, desc, type = "warning", count }: ExecutiveAlertProps) => {
  const configs = {
    warning: { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-900", icon: "text-amber-600" },
    critical: { bg: "bg-rose-50", border: "border-rose-100", text: "text-rose-900", icon: "text-rose-600" },
    info: { bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-900", icon: "text-blue-600" },
    success: { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-900", icon: "text-emerald-600" }
  }[type];

  return (
    <div className={`p-5 ${configs.bg} border ${configs.border} rounded-[24px] flex items-center justify-between cursor-pointer group font-poppins`}>
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
          <AlertCircle size={20} className={configs.icon} />
        </div>
        <div>
          <div className={`text-[15px] font-black tracking-tight ${configs.text}`}>{title}</div>
          <div className={`text-[12px] font-bold ${configs.text} opacity-60`}>{desc}</div>
        </div>
      </div>
      {count !== undefined && (
        <div className="text-[12px] font-black px-3 py-1 bg-white/50 border border-white/20 rounded-full text-slate-900">{count}</div>
      )}
    </div>
  );
};

// --- STOCK RISK QUEUE ---
export const StockRiskQueue = ({ items }: { items: InventoryItem[] }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-8 flex flex-col gap-6 font-poppins">
       <div className="flex justify-between items-center">
        <div>
          <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Critical Inventory</h3>
          <p className="text-[12px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Supplies below safety threshold</p>
        </div>
        <div className="w-11 h-11 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center text-rose-600">
          <Package size={20} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {items.slice(0, 3).map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-2xl transition-all hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-rose-600">
                <Activity size={16} />
              </div>
              <div>
                <div className="text-[14px] font-black text-slate-900">{item.item_name || item.item}</div>
                <div className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{item.stock || 0} left</div>
              </div>
            </div>
            <button className="h-9 px-4 bg-slate-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95">Replenish</button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-6 text-slate-400">
            <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
            <div className="text-[12px] font-black uppercase tracking-widest">All levels optimal</div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- RECENT ACTIVITY (LIVE FEED) ---
interface ActivityItem {
  type: "PAYMENT" | "STATUS" | "ALERT";
  title: string;
  desc: string;
  time: string;
}

export const RecentActivity = ({ activities }: { activities: ActivityItem[] }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-8 flex flex-col gap-8 font-poppins">
      <div className="flex justify-between items-center">
        <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Operational Log</h3>
        <Activity size={20} className="text-slate-400" />
      </div>
      
      <div className="flex flex-col gap-6">
        {activities.map((act, i) => (
          <div key={i} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border-2 border-white ring-1 ring-slate-200 z-10 transition-transform group-hover:scale-125" />
              {i < activities.length - 1 && <div className="flex-1 w-px bg-slate-100 my-1" />}
            </div>
            <div className={i < activities.length - 1 ? "pb-6" : ""}>
              <div className="text-[14px] font-black text-slate-900 leading-none">{act.title}</div>
              <div className="text-[12px] font-medium text-slate-500 mt-2">{act.desc}</div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">{act.time}</div>
            </div>
          </div>
        ))}
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
  type: "feature" | "update" | "alert" | "Platform Update" | "News";
  author: string;
}

export const SystemAnnouncements = ({ announcements }: { announcements: Announcement[] }) => {
  return (
    <div className="flex flex-col gap-6 font-poppins">
      {announcements.map((ann, i) => (
        <div key={i} className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-900">
              <Megaphone size={20} />
            </div>
            <div>
              <div className="text-[14px] font-black text-slate-900 tracking-tight">{ann.author}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ann.date}</div>
            </div>
          </div>
          <h4 className="text-[20px] font-black text-slate-900 tracking-tight mb-3">{ann.title}</h4>
          <p className="text-[15px] text-slate-600 leading-relaxed">{ann.message}</p>
        </div>
      ))}
    </div>
  );
};

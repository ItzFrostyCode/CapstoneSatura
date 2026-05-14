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
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1C1917", textTransform: "uppercase", letterSpacing: "0.1em" }}>Branch Analytics</h3>
        <span style={{ fontSize: 10, fontWeight: 600, color: "#78716C", textTransform: "uppercase", letterSpacing: "0.2em" }}>Live Telemetry</span>
      </div>

      {topBranch && (
        <div style={{ 
          padding: 24, 
          background: "linear-gradient(135deg, #1E3A1F, #2D5016)", 
          borderRadius: 24, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          color: "#FAF8F5",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(30,58,31,0.2)"
        }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, background: "rgba(201,168,76,0.1)", borderRadius: "50%", filter: "blur(30px)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}>
            <div style={{ width: 48, height: 48, background: "rgba(250,248,245,0.1)", border: "1px solid rgba(250,248,245,0.2)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={24} color="#C9A84C" />
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.1em" }}>Leaderboard</div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "serif" }}>{topBranch.branchName}</div>
            </div>
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#C9A84C", position: "relative", zIndex: 1 }}>
            ₱{(branchData[topBranch.id]?.revenue || 0).toLocaleString()}
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {branches.map((branch: ShopBranch) => {
          const data = branchData[branch.id] || { revenue: 0, target: 100000 };
          const percent = Math.min(100, (data.revenue / data.target) * 100);
          
          return (
            <div key={branch.id}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: branch.isMain ? "#C9A84C" : "#E2DDD7" }} />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{branch.branchName}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>₱{data.revenue.toLocaleString()}</div>
              </div>
              <div style={{ height: 8, background: "#F0EDE8", borderRadius: 10, overflow: "hidden" }}>
                <div 
                  style={{ height: "100%", width: percent + "%", background: branch.isMain ? "#1E3A1F" : "#C9A84C", borderRadius: 10, transition: "width 1s" }} 
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
    <div style={{ background: "#fff", border: "1px solid #E2DDD7", borderRadius: 24, padding: 32, display: "flex", flexDirection: "column", gap: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: "serif" }}>Personnel Telemetry</h3>
          <p style={{ fontSize: 12, color: "#78716C", marginTop: 4 }}>{onlineCount} Team members active</p>
        </div>
        <div style={{ width: 44, height: 44, background: "#ECFDF5", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#059669" }}>
           <Shield size={20} />
        </div>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {staff.map((member, i) => {
          const isOnline = member.status === "Online" || member.status === "Active";
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#FAF8F5", borderRadius: 16, border: "1px solid #F0EDE8" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: 40, height: 40, background: "#fff", border: "1px solid #E2DDD7", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#78716C" }}>
                    {member.name.charAt(0)}
                  </div>
                  {isOnline && <div style={{ position: "absolute", bottom: -2, right: -2, width: 10, height: 10, background: "#059669", borderRadius: "50%", border: "2px solid #FAF8F5" }} />}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{member.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.05em" }}>{member.roles?.[0] || "Artisan"}</div>
                </div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, padding: "4px 8px", borderRadius: 100, background: isOnline ? "#ECFDF5" : "#F5F5F4", color: isOnline ? "#059669" : "#A8A29E", textTransform: "uppercase" }}>
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
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 24 }}>
      {[
        { label: "Current", val: agingData.current, color: "#059669" },
        { label: "30d", val: agingData.overdue30, color: "#C9A84C" },
        { label: "60d", val: agingData.overdue60, color: "#D97706" },
        { label: "90d+", val: agingData.overdue90, color: "#DC2626" },
      ].map(item => (
        <div key={item.label} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#FAF8F5", marginBottom: 8 }}>₱{(item.val / 1000).toFixed(0)}k</div>
          <div style={{ height: 4, width: "100%", background: "rgba(250,248,245,0.1)", borderRadius: 10, marginBottom: 8, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "100%", background: item.color }} />
          </div>
          <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(250,248,245,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

// --- PRODUCTION EFFICIENCY ---
export const ProductionEfficiency = ({ stats }: { stats: Record<string, unknown> }) => {
  const cards = [
    { label: "Cycle Time", val: "4.2", unit: "Days", trend: "-12%", icon: Clock, color: "#1E3A1F" },
    { label: "Throughput", val: "88", unit: "%", trend: "Stable", icon: CheckCircle2, color: "#C9A84C" },
    { label: "Fulfillment", val: "96.5", unit: "%", trend: "+2.1%", icon: Package, color: "#2D5016" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
      {cards.map((card, i) => (
        <div key={i} style={{ padding: 24, background: "#fff", border: "1px solid #E2DDD7", borderRadius: 24, position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#F0EDE8", color: card.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <card.icon size={20} />
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, padding: "4px 8px", background: "#ECFDF5", color: "#059669", borderRadius: 100 }}>{card.trend}</div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "serif" }}>{card.val}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#78716C" }}>{card.unit}</div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#78716C", marginTop: 4 }}>{card.label}</div>
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
  const colors = {
    warning: { bg: "#FFFBEB", border: "#FEF3C7", text: "#92400E", icon: "#D97706" },
    critical: { bg: "#FEF2F2", border: "#FEE2E2", text: "#991B1B", icon: "#DC2626" },
    info: { bg: "#EFF6FF", border: "#DBEAFE", text: "#1E40AF", icon: "#2563EB" },
    success: { bg: "#ECFDF5", border: "#D1FAE5", text: "#065F46", icon: "#059669" }
  }[type];

  return (
    <div style={{ 
      padding: 20, 
      background: colors.bg, 
      border: "1px solid " + colors.border, 
      borderRadius: 20, 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between",
      cursor: "pointer"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 44, height: 44, background: "#fff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <AlertCircle size={20} color={colors.icon} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: colors.text }}>{title}</div>
          <div style={{ fontSize: 12, color: colors.text, opacity: 0.7 }}>{desc}</div>
        </div>
      </div>
      {count !== undefined && (
        <div style={{ fontSize: 12, fontWeight: 800, padding: "4px 10px", background: "rgba(0,0,0,0.05)", borderRadius: 100 }}>{count}</div>
      )}
    </div>
  );
};

// --- STOCK RISK QUEUE ---
export const StockRiskQueue = ({ items }: { items: InventoryItem[] }) => {
  return (
    <div style={{ background: "#fff", border: "1px solid #E2DDD7", borderRadius: 24, padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: "serif" }}>Critical Inventory</h3>
          <p style={{ fontSize: 12, color: "#78716C", marginTop: 4 }}>Supplies below safety threshold</p>
        </div>
        <div style={{ width: 44, height: 44, background: "#FEF2F2", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#DC2626" }}>
          <Package size={20} />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.slice(0, 3).map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#FAF8F5", borderRadius: 16, border: "1px solid #F0EDE8" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, background: "#fff", borderRadius: 8, border: "1px solid #E2DDD7", display: "flex", alignItems: "center", justifyContent: "center", color: "#DC2626" }}>
                <Activity size={16} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{item.item_name || item.item}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#DC2626" }}>{item.stock || 0} left</div>
              </div>
            </div>
            <button style={{ height: 32, padding: "0 12px", background: "#1E3A1F", color: "#C9A84C", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Replenish</button>
          </div>
        ))}
        {items.length === 0 && (
          <div style={{ textAlign: "center", padding: "20px 0", color: "#78716C" }}>
            <CheckCircle2 size={32} color="#059669" style={{ margin: "0 auto 8px" }} />
            <div style={{ fontSize: 12, fontWeight: 600 }}>All levels optimal</div>
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
    <div style={{ background: "#fff", border: "1px solid #E2DDD7", borderRadius: 24, padding: 32, display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: "serif" }}>Operational Log</h3>
        <Activity size={20} color="#78716C" />
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {activities.map((act, i) => (
          <div key={i} style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#C9A84C", border: "2px solid #fff", outline: "1px solid #E2DDD7", zIndex: 1 }} />
              {i < activities.length - 1 && <div style={{ flex: 1, width: 1, background: "#E2DDD7", margin: "4px 0" }} />}
            </div>
            <div style={{ paddingBottom: i < activities.length - 1 ? 24 : 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{act.title}</div>
              <div style={{ fontSize: 12, color: "#78716C", marginTop: 4 }}>{act.desc}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#C9A84C", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 8 }}>{act.time}</div>
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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {announcements.map((ann, i) => (
        <div key={i} style={{ background: "#fff", border: "1px solid #E2DDD7", borderRadius: 24, padding: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, background: "#F0EDE8", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#1E3A1F" }}>
              <Megaphone size={20} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{ann.author}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#C9A84C", textTransform: "uppercase" }}>{ann.date}</div>
            </div>
          </div>
          <h4 style={{ fontSize: 20, fontWeight: 700, fontFamily: "serif", marginBottom: 12 }}>{ann.title}</h4>
          <p style={{ fontSize: 15, color: "#1C1917", lineHeight: 1.6, opacity: 0.8 }}>{ann.message}</p>
        </div>
      ))}
    </div>
  );
};

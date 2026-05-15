"use client";
import { useState, useEffect, useMemo } from "react";
import { 
  LayoutGrid, Activity, AlertCircle, Sparkles, Megaphone
} from "lucide-react";
import { useERPStore } from "@/store/useERPStore";
import Link from "next/link";

import { 
  BranchPerformance, 
  ReceivablesAging, 
  ProductionEfficiency, 
  ExecutiveAlert,
  RecentActivity,
  StockRiskQueue,
  StaffStatusWidget
} from "./components/DashboardWidgets";

export default function DashboardPage() {
  const { 
    staff, 
    branches, 
    invoices, 
    payments,
    inventory,
    inventoryStock,
    purchaseOrders,
    getEnrichedOrders,
    orderStatusLogs,
    currentPlan
  } = useERPStore();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'news' | 'welcome'>('dashboard');
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const orders = getEnrichedOrders();
  const activeOrders = orders.filter(o => !['RELEASED', 'CANCELLED'].includes(o.status));
  const totalRevenue = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const receivablesRisk = Math.max(0, invoices.reduce((s,i) => s + i.total_amount, 0) - totalRevenue);
  
  const criticalStockItems = useMemo(() => {
    return inventory.filter(i => {
      const stock = inventoryStock.filter(s => s.inventory_item_id === i.id).reduce((sum, s) => sum + s.on_hand_qty, 0);
      return stock <= (i.reorder_level || 5);
    });
  }, [inventory, inventoryStock]);

  const pulseActivities = useMemo(() => {
    const statusActivities = (orderStatusLogs || []).map(log => ({
      type: 'STATUS' as const,
      title: 'Workflow Advancement',
      desc: log.remarks || "Order " + log.order_id + " moved to " + log.new_status,
      time: new Date(log.changed_at).toLocaleString(),
    }));
    const paymentActivities = (payments || []).map(p => ({
      type: 'PAYMENT' as const,
      title: 'Cash Receipt',
      desc: "₱" + p.amount.toLocaleString() + " received",
      time: new Date(p.paid_at).toLocaleString(),
    }));
    return [...statusActivities, ...paymentActivities].slice(0, 5);
  }, [orderStatusLogs, payments]);

  if (!mounted) return null;

  return (
    <div className="space-y-6 pb-20 max-w-[1450px] mx-auto animate-in fade-in duration-500 font-poppins">
      <main className="max-w-[1450px] mx-auto px-10 pt-8 space-y-10">
        {/* INTEGRATED HEADER: TABS */}
        {/* TABS (LEFT) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200/60 shadow-inner mb-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid size={14} /> },
            { id: 'news', label: 'News', icon: <Megaphone size={14} /> },
            { id: 'welcome', label: 'Welcome', icon: <Sparkles size={14} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-2.5 text-[11px] font-black rounded-xl transition-all duration-300 uppercase tracking-widest ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-400 hover:text-slate-600 hover:bg-white/40'}`}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-10">
        {/* KPI GRID */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", val: "₱" + (totalRevenue/1000).toFixed(0) + "k", sub: "Actual cash flow", color: "slate" },
            { label: "Staffs", val: staff.length, sub: "Active personnel", color: "slate" },
            { label: "Active Orders", val: activeOrders.length, sub: "In production", color: "slate" },
            { label: "Stock Alerts", val: criticalStockItems.length, sub: "Reorder needed", color: "rose" },
          ].map((kpi, i) => (
            <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</div>
              <div className="text-[24px] font-black text-slate-900 tracking-tight">{kpi.val}</div>
              <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* ── CORE OPERATIONS SPLIT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* PRODUCTION & PERFORMANCE */}
          <div className="lg:col-span-2 space-y-10">
            <section className="bg-white p-10 rounded-[48px] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-emerald-50 text-[#069668] rounded-xl flex items-center justify-center"><Activity size={20}/></div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">Production Efficiency</h2>
                </div>
                <Link href="/shop-owner/orders" className="text-[11px] font-black text-slate-900 uppercase tracking-widest hover:underline">Full Pipeline →</Link>
              </div>
              <ProductionEfficiency stats={{}} />
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm">
                 <BranchPerformance branches={branches} branchData={{}} />
              </div>

              <div className="bg-[#069668] rounded-[40px] p-10 text-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                 <div className="relative z-10">
                    <h3 className="text-xl font-black mb-1">Accounts Receivable</h3>
                    <p className="text-slate-300 text-[12px] font-medium mb-8">Risk assessment of outstanding invoices</p>
                    <ReceivablesAging agingData={{ current: receivablesRisk * 0.5, overdue30: receivablesRisk * 0.3, overdue60: receivablesRisk * 0.15, overdue90: receivablesRisk * 0.05 }} />
                    
                    <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
                       <div>
                          <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Total Exposure</div>
                          <div className="text-2xl font-black">₱{receivablesRisk.toLocaleString()}</div>
                       </div>
                       <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-all">Reconcile</button>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* ALERTS & MANAGEMENT */}
          <div className="space-y-10">
            <div className="flex flex-col gap-4">
               <div className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] flex items-center gap-3 mb-2 px-2">
                  <AlertCircle size={16} /> Executive Alerts
               </div>
               <ExecutiveAlert title="Delayed Production" desc="3 Orders past due date" type="critical" count={3} />
               <ExecutiveAlert title="Low Fabric Stock" desc="Italian Silk (Navy) below 5m" type="warning" count={1} />
            </div>

            <StockRiskQueue items={criticalStockItems} />
            <StaffStatusWidget staff={staff} />
            <RecentActivity activities={pulseActivities as any} />
          </div>
          </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="bg-white border border-slate-200 p-20 rounded-[48px] shadow-sm flex flex-col items-center justify-center text-center font-poppins">
            <Megaphone className="text-slate-300 mb-6" size={48} />
            <h2 className="text-2xl font-black text-slate-900">System News & Updates</h2>
            <p className="text-slate-500 mt-2 max-w-md">Stay tuned for upcoming features, maintenance schedules, and platform announcements.</p>
          </div>
        )}

        {activeTab === 'welcome' && (
          <div className="bg-white border border-slate-200 p-20 rounded-[48px] shadow-sm flex flex-col items-center justify-center text-center font-poppins">
            <Sparkles className="text-slate-900 mb-6" size={48} />
            <h2 className="text-2xl font-black text-slate-900">Welcome to SUTURA</h2>
            <p className="text-slate-500 mt-2 max-w-md">Your premier tailoring management platform. Use the dashboard to monitor your workshop&apos;s pulse.</p>
          </div>
        )}
      </main>
    </div>
  );
}

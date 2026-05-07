'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, Users, ShoppingBag, AlertCircle, 
  PackageSearch, Calendar, Clock, ChevronRight, 
  Wallet, Truck, Activity, CheckCircle2,
  Scissors, BarChart3, Plus, ArrowUpRight, ArrowDownRight,
  Star, LayoutGrid, Ruler, PenTool, Layout, PieChart,
  ShieldCheck, Zap, Layers, Briefcase
} from 'lucide-react';
import { useERPStore } from '@/store/useERPStore';
import { resolveOrderState } from '@/features/orders/orderEngine';

// Widgets
import { 
  BranchPerformance, 
  ReceivablesAging, 
  ProductionEfficiency, 
  ExecutiveAlert 
} from './components/DashboardWidgets';

export default function DashboardPage() {
  const { 
    staff, 
    inventory, 
    payments, 
    invoices, 
    getEnrichedOrders,
    customers,
    appointments,
    suppliers,
    branches,
    inventoryStock
  } = useERPStore();
  
  const orders = getEnrichedOrders();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // --- EXECUTIVE DATA AGGREGATION ---
  
  // 1. Financials
  const totalRevenue = useMemo(() => payments?.reduce((sum, p) => sum + p.amount, 0) || 0, [payments]);
  const totalInvoiced = useMemo(() => invoices?.filter(i => i.status !== 'VOID').reduce((sum, inv) => sum + inv.total_amount, 0) || 0, [invoices]);
  const accountsReceivable = Math.max(0, totalInvoiced - totalRevenue);
  const collectionRate = Math.round((totalRevenue / totalInvoiced) * 100) || 0;

  // 2. Branch Performance
  const branchPerformanceData = useMemo(() => {
    const data: Record<string, { revenue: number; target: number }> = {};
    branches.forEach(b => {
      const branchRevenue = invoices
        .filter(i => i.branch_id === b.id && i.status === 'PAID')
        .reduce((sum, inv) => sum + inv.total_amount, 0);
      data[b.id] = { 
        revenue: branchRevenue, 
        target: b.isMain ? 500000 : 250000 
      };
    });
    return data;
  }, [branches, invoices]);

  // 3. Receivables Aging (Mock Logic)
  const agingData = {
    current: accountsReceivable * 0.4,
    overdue30: accountsReceivable * 0.3,
    overdue60: accountsReceivable * 0.2,
    overdue90: accountsReceivable * 0.1,
  };

  // 4. Global Inventory
  const totalInventoryValue = useMemo(() => 
    inventoryStock.reduce((acc, stock) => {
      const item = inventory.find(i => i.id === stock.inventory_item_id);
      return acc + (stock.on_hand_qty * (item?.unit_cost || 0));
    }, 0)
  , [inventoryStock, inventory]);

  // 5. Global Efficiency
  const activeOrders = orders.filter(o => !['COMPLETED', 'DELIVERED', 'CANCELLED'].includes(o.status));
  const delayedOrders = activeOrders.filter(o => new Date(o.due_date) < new Date()).length;
  const criticalStockouts = inventory.filter(i => (i.stock ?? 0) <= i.reorder_level).length;

  const formatPHP = (num: number) => new Intl.NumberFormat('en-PH', { 
    style: 'currency', 
    currency: 'PHP',
    maximumFractionDigits: 0 
  }).format(num);

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 max-w-[1600px] mx-auto">
      
      {/* ── COMMAND CENTER HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             
             <h1 className="text-[36px] font-black text-slate-900 tracking-tight leading-none">Dashboard</h1>
          </div>
          <p className="text-[15px] text-slate-500 font-bold uppercase tracking-[0.1em] flex items-center gap-2">
            Oversight <span className="w-1 h-1 rounded-full bg-slate-300" /> Multi-Branch Network Health
          </p>
        </div>

        
      </div>

      {/* ── TOP KPI RIBBON ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Network Revenue (MTD)', val: formatPHP(totalRevenue), icon: Wallet, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+14.2%', trendUp: true },
          { label: 'Inventory Liquidity', val: formatPHP(totalInventoryValue), icon: PackageSearch, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Stable', trendUp: true },
          { label: 'Accounts Receivable', val: formatPHP(accountsReceivable), icon: BarChart3, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Risk: Moderate', trendUp: false },
          { label: 'Booking Conversion', val: '84%', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+5.4%', trendUp: true },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-8 rounded-[36px] border border-slate-200 shadow-sm relative overflow-hidden group hover:border-slate-400 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <kpi.icon size={28} />
              </div>
              <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${
                kpi.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
              }`}>
                {kpi.trend}
              </span>
            </div>
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</div>
            <div className="text-[28px] font-black text-slate-900 tracking-tight leading-none">{kpi.val}</div>
            <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-slate-50 rounded-full blur-2xl group-hover:bg-slate-100 transition-colors" />
          </div>
        ))}
      </div>

      {/* ── MAIN INTELLIGENCE GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: FINANCIAL & NETWORK (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Branch Comparison */}
            <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
               <BranchPerformance branches={branches} branchData={branchPerformanceData} />
            </div>

            {/* AR Risk Aging */}
            <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm flex flex-col justify-between">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[16px] font-black text-slate-900 uppercase tracking-tight">Credit & Collections</h3>
                  <span className="text-[20px] font-black text-emerald-500">{collectionRate}%</span>
               </div>
               <ReceivablesAging agingData={agingData} />
               <div className="mt-6 p-4 bg-slate-900 rounded-2xl text-white text-[12px] font-bold flex items-center justify-between">
                  <span>Run Collection Report</span>
                  <ChevronRight size={16} />
               </div>
            </div>
          </div>

          {/* Efficiency Stats */}
          <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <div>
                   <h3 className="text-[18px] font-black text-slate-900 uppercase tracking-tight">Global Operational Efficiency</h3>
                   <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1">Cross-branch production performance</p>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <Zap size={20} />
                   </div>
                </div>
             </div>
             <ProductionEfficiency />
          </div>

        </div>

        {/* RIGHT: EXECUTIVE ALERTS (4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm h-full">
            <div className="flex items-center gap-3 text-rose-500 mb-8">
               <Activity size={24} />
               <h3 className="text-[18px] font-black text-slate-900 uppercase tracking-tight">Alerts</h3>
            </div>

            <div className="space-y-4">
               {delayedOrders > 0 && (
                 <ExecutiveAlert 
                   type="critical" 
                   title="Delayed Work Orders" 
                   desc={`${delayedOrders} orders are past their promised release date.`}
                 />
               )}
               {criticalStockouts > 0 && (
                 <ExecutiveAlert 
                   type="warning" 
                   title="Critical Stockouts" 
                   desc={`${criticalStockouts} core fabrics are below reorder levels.`}
                 />
               )}
               <ExecutiveAlert 
                 type="info" 
                 title="Procurement Review" 
                 desc="3 Purchase Orders are awaiting final HQ authorization."
               />
               <ExecutiveAlert 
                 type="info" 
                 title="New Branch Insight" 
                 desc="Davao Tailors shows 15% higher efficiency than network avg."
               />
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100">
               <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Staffing Overview</h4>
               <div className="space-y-4">
                  {[
                    { label: 'Total Workforce', val: staff.length, icon: Users },
                    { label: 'Manager Coverage', val: '100%', icon: ShieldCheck },
                    { label: 'Workload Balance', val: 'Optimal', icon: Layers }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                             <item.icon size={16} />
                          </div>
                          <span className="text-[13px] font-bold text-slate-600">{item.label}</span>
                       </div>
                       <span className="text-[14px] font-black text-slate-900">{item.val}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── RECENT HIGH-VALUE ACTIVITY ── */}
      <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-md">
               <div className="flex items-center gap-2 text-indigo-400 text-[11px] font-black uppercase tracking-widest mb-4">
                  <Briefcase size={16} /> Business Growth
               </div>
               <h3 className="text-[28px] font-black tracking-tight leading-tight mb-4">
                  Your network is expanding efficiently.
               </h3>
               <p className="text-slate-400 font-medium leading-relaxed">
                  Overall customer retention is up by 8% this quarter. The automation of procurement has reduced material waste by 12.5% across all branches.
               </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
                  <div className="text-[32px] font-black mb-1 text-indigo-400">{customers.length}</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Total Clients</div>
               </div>
               <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
                  <div className="text-[32px] font-black mb-1 text-emerald-400">{appointments.length}</div>
                  <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Global Bookings</div>
               </div>
            </div>
         </div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      </div>

    </div>
  );
}

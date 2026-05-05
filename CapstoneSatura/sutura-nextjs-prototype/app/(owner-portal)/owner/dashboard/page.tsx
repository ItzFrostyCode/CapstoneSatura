'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, ShoppingBag, AlertCircle, 
  PackageSearch, Calendar, Clock, ChevronRight, 
  Wallet, Truck, Activity, CheckCircle2, Circle,
  Scissors, BarChart3, UserCheck, MessageCircle,
  Plus, Search, Filter, ArrowUpRight, ArrowDownRight,
  PackageCheck, UserPlus, FileText, Star, Settings2,
  LayoutGrid, ListFilter, Ruler, PenTool, Layout, PieChart
} from 'lucide-react';
import { useERPStore } from '../../store/useERPStore';
import { resolveOrderState } from '../../logic/orderEngine';

export default function DashboardPage() {
  const { 
    staff, 
    inventory, 
    purchaseOrders, 
    suppliers, 
    payments, 
    invoices, 
    orders, 
    customers,
    appointments 
  } = useERPStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Breaking the synchronous render cycle to avoid cascading render warnings
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  // --- 1. BILLING & REPORTS ---
  const totalRevenue = payments?.reduce((sum, p) => sum + p.amount_paid, 0) || 0;
  // Fix: statusSnapshot instead of computedStatus
  const totalInvoiced = invoices?.filter(i => i.statusSnapshot !== 'Draft').reduce((sum, inv) => sum + inv.total_amount, 0) || 0;
  const accountsReceivable = Math.max(0, totalInvoiced - totalRevenue);
  const collectionRate = Math.round((totalRevenue / totalInvoiced) * 100) || 0;
  
  // --- 2. PRODUCTION ---
  const activeOrders = orders.filter(o => {
    const stage = resolveOrderState(o).productionStage;
    return !['COMPLETED', 'DELIVERED'].includes(stage);
  });

  const suturaStats = {
    onHold: activeOrders.filter(o => resolveOrderState(o).productionStage === 'ON_HOLD').length,
    measurement: activeOrders.filter(o => {
      const state = resolveOrderState(o);
      if (state.productionStage !== 'IN_PRODUCTION') return false;
      return o.tasks.find(t => t.status !== 'Completed')?.title === 'Initial Measurement';
    }).length,
    drafting: activeOrders.filter(o => {
      const state = resolveOrderState(o);
      if (state.productionStage !== 'IN_PRODUCTION') return false;
      return o.tasks.find(t => t.status !== 'Completed')?.title === 'Pattern Drafting';
    }).length,
    cutting: activeOrders.filter(o => {
      const state = resolveOrderState(o);
      if (state.productionStage !== 'IN_PRODUCTION') return false;
      return o.tasks.find(t => t.status !== 'Completed')?.title === 'Fabric Cutting';
    }).length,
    sewing: activeOrders.filter(o => {
      const state = resolveOrderState(o);
      if (state.productionStage !== 'IN_PRODUCTION') return false;
      return o.tasks.find(t => t.status !== 'Completed')?.title === 'Main Sewing';
    }).length,
    inspection: activeOrders.filter(o => resolveOrderState(o).productionStage === 'QUALITY_CHECK').length,
    ironing: activeOrders.filter(o => {
      const state = resolveOrderState(o);
      if (state.productionStage !== 'IN_PRODUCTION') return false;
      return o.tasks.find(t => t.status !== 'Completed')?.title === 'Final Ironing & Prep';
    }).length,
    revision: activeOrders.filter(o => resolveOrderState(o).productionStage === 'REVISION_REQUIRED').length,
  };

  // --- 4. APPOINTMENTS ---
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments
    .filter(a => a.date === todayStr)
    // Fix: startTime instead of time
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // --- 5. INVENTORY & SUPPLIERS ---
  const lowStockItems = inventory.filter(i => i.stock <= i.minStock);
  const verifiedSuppliers = suppliers.filter(s => s.status === 'Verified' || s.status === 'Preferred').length;

  const formatPHP = (num: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(num);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto">
      
      {/* ── TOP NAVIGATION ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-none flex items-center gap-3">
            Dashboard
          </h1>
          <p className="text-[14px] text-slate-500 font-medium mt-2">Welcome back. Monitoring your production pipeline in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl text-[12px] font-black text-slate-400 uppercase tracking-widest">
            <Clock size={14} className="text-indigo-500" /> {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <button className="bg-slate-900 text-white h-12 px-6 rounded-2xl text-[13px] font-black shadow-xl shadow-slate-900/10 hover:bg-indigo-600 transition-all flex items-center gap-2 active:scale-95">
            <Plus size={18} /> New Transaction
          </button>
        </div>
      </div>

      {/* ── SYMMETRIC BENTO GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-4 gap-6 min-h-[900px]">
        
        {/* 1. BILLING: FINANCIAL COMMAND (2x2) */}
        <div className="md:col-span-2 md:row-span-2 bg-white border border-slate-200 rounded-[40px] p-10 shadow-sm relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000">
            <BarChart3 size={240} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-indigo-500 text-[11px] font-black uppercase tracking-[0.2em]">
                <Wallet size={16} /> Financial Intelligence
              </div>
              <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full text-[12px] font-black">
                <ArrowUpRight size={14} /> +18.4%
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[56px] font-black text-slate-900 tracking-tighter leading-none">
                {formatPHP(totalRevenue)}
              </div>
              <p className="text-[14px] text-slate-400 font-bold uppercase tracking-widest">Gross Revenue (MTD)</p>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-8 pt-10 mt-10 border-t border-slate-100">
            <div>
              <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Accounts Receivable</div>
              <div className="text-[24px] font-black text-slate-900">{formatPHP(accountsReceivable)}</div>
              <div className="w-full bg-slate-100 h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-amber-500 h-full w-[45%]" />
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Collection Rate</div>
              <div className="text-[24px] font-black text-slate-900">{collectionRate}%</div>
              <div className="w-full bg-slate-100 h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-indigo-500 h-full" style={{ width: `${collectionRate}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* 2. APPOINTMENTS: FOCUS (1x2) */}
        <div className="lg:col-span-1 lg:row-span-2 bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Scheduling</div>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <h3 className="text-[20px] font-black text-slate-900 mb-6">Todays Focus</h3>
          <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-10 opacity-40">
                <Clock className="mx-auto mb-2" size={32} />
                <p className="text-[12px] font-bold">No bookings today</p>
              </div>
            ) : todayAppointments.slice(0, 4).map(apt => (
              <div key={apt.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2 group hover:bg-white hover:border-slate-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-black text-slate-900">{apt.startTime}</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black rounded-lg uppercase tracking-tighter">{apt.type}</span>
                </div>
                <div className="text-[12px] font-bold text-slate-500">{apt.customer}</div>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-4 text-[12px] font-black text-slate-400 border border-dashed border-slate-200 rounded-2xl hover:border-slate-900 hover:text-slate-900 transition-all flex items-center justify-center gap-2">
            View Calendar <ChevronRight size={14} />
          </button>
        </div>

        {/* 3. STAFF: TEAM STATUS (1x2) */}
        <div className="lg:col-span-1 lg:row-span-2 bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Team Presence</div>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <UserCheck size={16} />
            </div>
          </div>
          <h3 className="text-[20px] font-black text-slate-900 mb-6">Staff Status</h3>
          <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
            {[...staff]
              .sort((a, b) => {
                const isAOnline = parseInt(a.id.split('-')[1]) % 2 !== 0;
                const isBOnline = parseInt(b.id.split('-')[1]) % 2 !== 0;
                if (isAOnline === isBOnline) return 0;
                return isAOnline ? -1 : 1;
              })
              .map((s) => {
                const isOnline = parseInt(s.id.split('-')[1]) % 2 !== 0;
                return (
                  <div key={s.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:bg-white hover:border-slate-200 transition-all cursor-default">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 font-black text-[11px] shadow-sm">
                          {s.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      </div>
                      <div>
                        <div className="text-[12px] font-bold text-slate-900">{s.name}</div>
                        <div className="text-[9px] text-slate-400 font-medium tracking-tight uppercase">{s.roles[0]}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <button className="mt-6 w-full py-4 text-[12px] font-black text-slate-400 border border-dashed border-slate-200 rounded-2xl hover:border-slate-900 hover:text-slate-900 transition-all flex items-center justify-center gap-2">
            Manage Staff <ChevronRight size={14} />
          </button>
        </div>

        {/* 4. PRODUCTION ENGINE (2x2) */}
        <div className="md:col-span-2 md:row-span-2 bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute bottom-0 right-0 p-10 opacity-10">
            <Scissors size={200} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-[20px] font-black tracking-tight mb-1 text-white">Production</h3>
                <p className="text-[13px] text-indigo-300 font-medium tracking-tight">Active Work Orders: {activeOrders.length}</p>
              </div>
              <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl">
                 <div className="text-rose-500 flex items-center gap-1.5 text-[11px] font-black bg-rose-500/10 px-3 py-1 rounded-xl">
                   <AlertCircle size={12} /> {suturaStats.onHold} ON HOLD
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-6">
              {[
                { label: 'Initial Measurement', val: suturaStats.measurement, icon: <Ruler size={14} />, color: 'bg-blue-500' },
                { label: 'Pattern Drafting', val: suturaStats.drafting, icon: <PenTool size={14} />, color: 'bg-purple-500' },
                { label: 'Fabric Cutting', val: suturaStats.cutting, icon: <Scissors size={14} />, color: 'bg-indigo-500' },
                { label: 'Main Sewing Phase', val: suturaStats.sewing, icon: <Activity size={14} />, color: 'bg-emerald-500' },
                { label: 'Quality Inspection', val: suturaStats.inspection, icon: <CheckCircle2 size={14} />, color: 'bg-amber-500' },
                { label: 'Final Ironing & Prep', val: suturaStats.ironing, icon: <Layout size={14} />, color: 'bg-teal-500' },
              ].map(stage => (
                <div key={stage.label} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${stage.color} text-white`}>{stage.icon}</div>
                      <span className="text-[12px] font-bold text-slate-400 group-hover:text-white transition-colors">{stage.label}</span>
                    </div>
                    <span className="text-[16px] font-black">{stage.val}</span>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                    <div className={`${stage.color} h-full transition-all duration-1000`} style={{ width: activeOrders.length > 0 ? `${(stage.val/activeOrders.length)*100}%` : '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-between pt-8 border-t border-white/10 mt-6">
             <div className="flex items-center gap-3">
               <span className="text-[11px] text-slate-500 font-black uppercase tracking-widest">Revision Items:</span>
               <span className="text-[14px] font-black text-rose-400">{suturaStats.revision}</span>
             </div>
            <button className="text-[12px] font-black text-white hover:text-indigo-300 flex items-center gap-2 transition-all">
              Production Workflow <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* 5. INVENTORY & SUPPLIERS (1x2) */}
        <div className="lg:col-span-1 lg:row-span-2 bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Supply Chain</div>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Truck size={16} />
            </div>
          </div>
          
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {/* Inventory Alerts */}
            <div>
              <h3 className="text-[14px] font-black text-slate-900 mb-3 flex items-center gap-2">
                <AlertCircle size={14} className="text-rose-500" /> Restock Alerts
              </h3>
              <div className="space-y-3">
                {lowStockItems.slice(0, 3).map(item => (
                  <div key={item.sku} className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-slate-500 truncate max-w-[100px]">{item.item}</span>
                    <span className="text-[12px] font-black text-rose-600">{item.stock} {item.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Suppliers */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-[14px] font-black text-slate-900 mb-3 flex items-center gap-2">
                <Star size={14} className="text-amber-500" /> Key Partners
              </h3>
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Verified</span>
                <span className="text-[20px] font-black text-slate-900">{verifiedSuppliers}</span>
              </div>
            </div>
          </div>

          <button className="mt-6 w-full py-4 text-[12px] font-black text-white bg-slate-900 rounded-2xl hover:bg-rose-600 shadow-lg shadow-slate-900/10 transition-all flex items-center justify-center gap-2">
            Order Supplies <ChevronRight size={16} />
          </button>
        </div>

        {/* 6. CUSTOMERS: GROWTH (1x1) */}
        <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm flex flex-col justify-between group hover:border-emerald-500 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users size={24} />
            </div>
            <ArrowUpRight size={20} className="text-emerald-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <div>
            <div className="text-[32px] font-black text-slate-900 leading-none">{customers.length}</div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">Customers</p>
          </div>
        </div>

        {/* 7. REPORTS: EFFICIENCY (1x1) */}
        <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm flex flex-col justify-between hover:bg-indigo-50/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <PieChart size={18} />
            </div>
            <div className="text-[20px] font-black text-indigo-600">{collectionRate}%</div>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4">
             <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
               Collection Efficiency
             </div>
          </div>
        </div>

      </div>

    </div>
  );
}

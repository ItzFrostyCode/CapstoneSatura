'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Users, Calendar, ShoppingBag, PackageSearch, 
  Truck, Briefcase, LayoutGrid, Wallet, BarChart3, 
  ArrowRight, Activity, TrendingUp, Scissors, AlertCircle
} from 'lucide-react';
import { useERPStore } from '@/store/useERPStore';
import { resolveOrderState } from '@/features/orders/orderEngine';

import { 
  BranchPerformance, 
  ReceivablesAging, 
  ProductionEfficiency, 
  ExecutiveAlert,
  SystemPulse,
  StockRiskQueue,
  StaffStatusWidget
} from './components/DashboardWidgets';

export default function DashboardPage() {
  const { 
    customers, 
    appointments, 
    getEnrichedOrders, 
    inventory, 
    suppliers, 
    staff, 
    branches, 
    invoices, 
    payments,
    inventoryStock,
    orderStatusLogs,
    inventoryMovements,
    purchaseOrders
  } = useERPStore();

  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const orders = getEnrichedOrders();

  // --- Data Calculations ---
  const today = new Date().toISOString().split('T')[0];
  const pendingAppointments = appointments.filter(a => a.status === 'Pending Review').length;
  const todaySchedule = appointments.filter(a => a.status === 'Scheduled' && a.date === today);
  const activeOrders = orders.filter(o => !['RELEASED', 'CANCELLED'].includes(o.status));
  const delayedOrders = activeOrders.filter(o => new Date(o.due_date) < new Date()).length;
  
  const criticalStockItems = useMemo(() => {
    return inventory.filter(i => {
      const stock = inventoryStock.filter(s => s.inventory_item_id === i.id).reduce((sum, s) => sum + s.on_hand_qty, 0);
      return stock <= (i.reorder_level || 5);
    });
  }, [inventory, inventoryStock]);

  const totalRevenue = useMemo(() => payments?.reduce((sum, p) => sum + p.amount, 0) || 0, [payments]);
  const receivablesRisk = Math.max(0, invoices.reduce((s,i) => s + i.total_amount, 0) - totalRevenue);
  
  const pendingPOs = purchaseOrders?.filter(po => po.status === 'SENT' || po.status === 'DRAFT').length || 0;

  // Mock branch data for widget
  const mockBranchData = useMemo(() => {
    const data: any = {};
    branches.forEach(b => {
      data[b.id] = { revenue: totalRevenue / branches.length, target: 50000 };
    });
    return data;
  }, [branches, totalRevenue]);

  const mockAging = { current: receivablesRisk * 0.4, overdue30: receivablesRisk * 0.3, overdue60: receivablesRisk * 0.2, overdue90: receivablesRisk * 0.1 };

  const pulseActivities = useMemo(() => {
    const statusActivities = (orderStatusLogs || []).map(log => ({
      type: 'STATUS',
      title: 'Workflow Advancement',
      desc: log.remarks || `Order ${log.order_id} moved to ${log.new_status}`,
      time: new Date(log.changed_at).toLocaleString(),
      rawTime: new Date(log.changed_at).getTime()
    }));
    const paymentActivities = (payments || []).map(p => ({
      type: 'PAYMENT',
      title: 'Cash Receipt',
      desc: `₱${p.amount.toLocaleString()} received`,
      time: new Date(p.paid_at).toLocaleString(),
      rawTime: new Date(p.paid_at).getTime()
    }));
    return [...statusActivities, ...paymentActivities].sort((a, b) => b.rawTime - a.rawTime).slice(0, 5);
  }, [orderStatusLogs, payments]);

  const formatPHP = (num: number) => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(num);

  if (!mounted) return null;

  return (
    <div className="max-w-[1600px] mx-auto pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-none mb-2">Dashboard</h1>
          <p className="text-[14px] text-slate-500 font-bold uppercase tracking-widest">
            Overview of your tailoring business
          </p>
        </div>
      </div>

      {/* ── ALIGNED DOMAINS ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Operations & Customers (Orders, Appointments, Customers) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Section: Orders & Production */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[14px] font-black text-slate-900 uppercase tracking-widest">
              <ShoppingBag size={18} className="text-indigo-500" /> Orders & Production
            </div>
            {/* Workshop Flow removed per user request */}
            <ProductionEfficiency stats={{}} />
          </section>

          {/* Section: Appointments & Customers */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[14px] font-black text-slate-900 uppercase tracking-widest">
                <Calendar size={18} className="text-amber-500" /> Appointments & Customers
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Appointments List */}
              <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[16px] font-black text-slate-900">Today's Schedule</h3>
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {todaySchedule.length} Fittings
                  </span>
                </div>
                <div className="space-y-3">
                  {todaySchedule.slice(0, 4).map((apt, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                      <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-black text-[12px] shadow-sm">
                        {apt.startTime?.split(':')[0]}:{apt.startTime?.split(':')[1]}
                      </div>
                      <div>
                        <div className="text-[14px] font-black text-slate-900 leading-tight">{apt.customer}</div>
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{apt.type || 'Fitting Session'}</div>
                      </div>
                    </div>
                  ))}
                  {todaySchedule.length === 0 && (
                    <div className="text-center py-6 text-slate-400 italic text-[12px]">No appointments today</div>
                  )}
                </div>
              </div>

              {/* Customer Snapshot - Clean Light Mode */}
              <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-200 relative overflow-hidden flex flex-col justify-between">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                    <Users size={24} className="text-blue-600" />
                  </div>
                  <div className="text-[40px] font-black text-slate-900 tracking-tight leading-none mb-1">{customers.length}</div>
                  <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-6">Total Registered Customers</div>
                  
                  {pendingAppointments > 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-between">
                      <span className="text-[12px] font-bold text-amber-700">Pending Booking Requests</span>
                      <span className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-[10px] font-black text-white">{pendingAppointments}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Section: Finance & Billing */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[14px] font-black text-slate-900 uppercase tracking-widest">
              <Wallet size={18} className="text-emerald-500" /> Finance & Billing
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm flex flex-col justify-center relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Collected Revenue</div>
                  <div className="text-[40px] font-black text-slate-900 tracking-tight leading-none mb-4">{formatPHP(totalRevenue)}</div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[85%]" />
                  </div>
                </div>
                <TrendingUp size={140} className="absolute -bottom-10 -right-10 text-emerald-50 opacity-50" />
              </div>
              <ReceivablesAging agingData={mockAging} />
            </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Supply Chain, Management & Alerts */}
        <div className="space-y-8">
          
          {/* Actionable Alerts */}
          {(delayedOrders > 0 || criticalStockItems.length > 0) && (
            <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
              <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <AlertCircle size={16} className="text-rose-500" /> Requires Attention
              </h3>
              <div className="space-y-3">
                {delayedOrders > 0 && (
                  <ExecutiveAlert type="critical" title="Delayed Orders" desc="Past promised release dates." count={delayedOrders} />
                )}
                {criticalStockItems.length > 0 && (
                  <ExecutiveAlert type="warning" title="Low Inventory" desc="Items below reorder level." count={criticalStockItems.length} />
                )}
              </div>
            </div>
          )}

          {/* Section: Supply Chain (Inventory & Suppliers) */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[14px] font-black text-slate-900 uppercase tracking-widest">
              <PackageSearch size={18} className="text-rose-500" /> Supply Chain
            </div>
            <StockRiskQueue items={criticalStockItems} />
            <div className="bg-white border border-slate-200 rounded-[24px] p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 shadow-sm"><Truck size={18}/></div>
                <div>
                  <div className="text-[13px] font-black text-slate-900">Active Purchase Orders</div>
                  <div className="text-[11px] font-bold text-slate-500">To {suppliers?.length || 0} Suppliers</div>
                </div>
              </div>
              <span className="text-[20px] font-black text-slate-900">{pendingPOs}</span>
            </div>
          </section>

          {/* Section: Management (Branches & Staff) */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-[14px] font-black text-slate-900 uppercase tracking-widest">
              <Briefcase size={18} className="text-cyan-500" /> Branches & Staff
            </div>
            
            <StaffStatusWidget staff={staff} />

            <div className="bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm">
              <BranchPerformance branches={branches} branchData={mockBranchData} />
            </div>
          </section>
          
          <SystemPulse activities={pulseActivities} />

        </div>
      </div>
    </div>
  );
}

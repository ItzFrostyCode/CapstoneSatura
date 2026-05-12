'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Users, Calendar, ShoppingBag, PackageSearch, 
  Truck, Briefcase, Home, Wallet, BarChart3, LayoutGrid,
  ArrowRight, Activity, TrendingUp, Scissors, AlertCircle,
  Sparkles, Zap, ShieldCheck, Megaphone, Plus
} from 'lucide-react';
import { useERPStore } from '@/store/useERPStore';
import { resolveOrderState } from '@/features/orders/orderEngine';
import Link from 'next/link';

import { 
  BranchPerformance, 
  ReceivablesAging, 
  ProductionEfficiency, 
  ExecutiveAlert,
  RecentActivity,
  StockRiskQueue,
  StaffStatusWidget,
  SystemAnnouncements
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'news' | 'welcome'>('dashboard');
  
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const orders = getEnrichedOrders();

  // --- System Broadcast Announcements ---
  const announcements = [
    {
      id: 'platform-launch',
      title: 'Welcome to the New Sutura ERP Experience',
      message: 'The SUTURA Platform has been upgraded to Version 2.0. We have introduced a high-fidelity dashboard, enhanced inventory telemetry, and a specialized staff management engine. These tools are designed to provide professional-grade control over your tailoring operations.',
      date: 'May 9, 2026',
      type: 'Platform Update' as const,
      author: 'Sutura Admin'
    }
  ];

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
  
  const pendingPOs = purchaseOrders?.filter(po => ['PENDING', 'CONFIRMED', 'IN_TRANSIT'].includes(po.status)).length || 0;

  const mockBranchData = useMemo(() => {
    const data: Record<string, { revenue: number; target: number }> = {};
    branches.forEach(b => {
      data[b.id] = { revenue: totalRevenue / branches.length, target: 50000 };
    });
    return data;
  }, [branches, totalRevenue]);

  const mockAging = { current: receivablesRisk * 0.4, overdue30: receivablesRisk * 0.3, overdue60: receivablesRisk * 0.2, overdue90: receivablesRisk * 0.1 };

  const pulseActivities = useMemo(() => {
    const statusActivities = (orderStatusLogs || []).map(log => ({
      type: 'STATUS' as const,
      title: 'Workflow Advancement',
      desc: log.remarks || `Order ${log.order_id} moved to ${log.new_status}`,
      time: new Date(log.changed_at).toLocaleString(),
      rawTime: new Date(log.changed_at).getTime()
    }));
    const paymentActivities = (payments || []).map(p => ({
      type: 'PAYMENT' as const,
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
    <div className="relative min-h-full pb-20 overflow-x-hidden">
      
      {/* ── MESH GRADIENT BACKGROUND ── */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-[5%] -left-[5%] w-[60%] h-[50%] bg-indigo-50/50 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[5%] -right-[5%] w-[50%] h-[40%] bg-emerald-50/40 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 pt-10">
        
        {/* ── PREMIUM TAB SWITCHER ── */}
        <div className="flex items-center gap-1 p-1 bg-slate-100/50 backdrop-blur-md border border-slate-200 w-max rounded-3xl">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
            { id: 'news', label: 'News', icon: Megaphone },
            { id: 'welcome', label: 'Welcome', icon: Activity },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'dashboard' | 'news' | 'welcome')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[14px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === tab.id 
                  ? 'bg-white text-slate-900 shadow-xl shadow-slate-200/50' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ── KPI GRID ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Annual Revenue', val: formatPHP(totalRevenue), sub: '+12.5% vs Last Period', icon: Wallet, bg: 'bg-indigo-50', text: 'text-indigo-600', sparkle: 'text-indigo-400', zap: 'text-indigo-200' },
                { label: 'Active Personnel', val: staff.length, sub: `${staff.filter(s => s.status === 'Online').length} Online Now`, icon: Users, bg: 'bg-emerald-50', text: 'text-emerald-600', sparkle: 'text-indigo-400', zap: 'text-indigo-200' },
                { label: 'Open Job Orders', val: activeOrders.length, sub: `${delayedOrders} Delayed Tasks`, icon: ShoppingBag, bg: 'bg-blue-50', text: 'text-blue-600', sparkle: 'text-indigo-400', zap: 'text-indigo-200' },
                { label: 'Inventory Value', val: '₱245k', sub: `${criticalStockItems.length} Low Stock Alerts`, icon: PackageSearch, bg: 'bg-rose-50', text: 'text-rose-600', sparkle: 'text-indigo-400', zap: 'text-indigo-200' },
              ].map((kpi, i) => (
                <div key={i} className="group relative bg-white/70 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-1">
                  <div className={`w-12 h-12 mb-6 rounded-2xl ${kpi.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    <kpi.icon size={22} className={kpi.text} />
                  </div>
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</div>
                  <div className="text-[32px] font-black text-slate-900 tracking-tight leading-none mb-2">{kpi.val}</div>
                  <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                    <Sparkles size={12} className={kpi.sparkle} /> {kpi.sub}
                  </div>
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Zap size={16} className={kpi.zap} />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              <div className="xl:col-span-2 space-y-10">
                
                {/* ── DESIGNER HANDOFF: ARCHITECT TO BUILDER ── */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-amber-100">
                        <Scissors size={16} />
                      </div>
                      <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Incoming Designer Projects</h2>
                    </div>
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                       Requires Builder Review
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Mock Proposal 1 */}
                     <div className="bg-white border border-slate-100 rounded-[32px] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                        <div className="flex items-center justify-between mb-6">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs">JA</div>
                              <div>
                                 <div className="text-sm font-black text-slate-900">John Clock</div>
                                 <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Lead Designer</div>
                              </div>
                           </div>
                           <div className="text-right">
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Project ID</div>
                              <div className="text-xs font-black text-slate-900">DS-2026-001</div>
                           </div>
                        </div>
                        <h3 className="text-md font-black text-slate-900 mb-2">Modern Filipiniana Gown</h3>
                        <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-6">High-low hemline with structured butterfly sleeves and hand-embroidered floral patterns.</p>
                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                           <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Review</span>
                           </div>
                           <Link href="/owner/design-proposals/DS-2026-001">
                              <button className="h-9 px-4 bg-slate-900 text-white rounded-xl text-[11px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
                                 Review Blueprint
                              </button>
                           </Link>
                        </div>
                     </div>

                     {/* Add empty state placeholder if needed */}
                     <div className="border-2 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center justify-center p-8 opacity-40">
                        <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 mb-2">
                           <Plus size={16} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Waiting for architect proposals</p>
                     </div>
                  </div>
                </section>

                {/* ── PRODUCTION FLOW ── */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <LayoutGrid size={16} />
                      </div>
                      <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Production Efficiency</h2>
                    </div>
                    <button className="text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors">View detailed reports →</button>
                  </div>
                  <ProductionEfficiency stats={{}} />
                </section>

                {/* ── APPOINTMENTS & CUSTOMERS ── */}
                <section className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Appointments */}
                    <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[40px] p-8 shadow-xl shadow-slate-200/30 group">
                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Daily Schedule</h3>
                          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Confirmed Fittings</p>
                        </div>
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:rotate-12 transition-transform duration-500">
                          <Calendar size={24} />
                        </div>
                      </div>
                      <div className="space-y-4">
                        {todaySchedule.slice(0, 4).map((apt, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-white/50 rounded-[24px] border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:border-indigo-100">
                                <span className="text-[14px] font-black text-slate-900">{apt.startTime?.split(':')[0]}</span>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">PM</span>
                              </div>
                              <div>
                                <div className="text-[15px] font-black text-slate-900 leading-tight">{apt.customer}</div>
                                <div className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">{apt.type || 'Fitting Session'}</div>
                              </div>
                            </div>
                            <ArrowRight size={16} className="text-slate-300" />
                          </div>
                        ))}
                        {todaySchedule.length === 0 && (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                              <Calendar size={24} className="text-slate-300" />
                            </div>
                            <p className="text-slate-400 font-bold text-[13px] uppercase tracking-widest">No scheduled fittings</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Receivables */}
                    <div className="bg-slate-900 rounded-[40px] p-8 shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] -mr-32 -mt-32" />
                      <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-8">
                            <div>
                              <h3 className="text-[18px] font-black text-white tracking-tight">Aging Receivables</h3>
                              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Credit Risk Analysis</p>
                            </div>
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white ring-1 ring-white/20">
                              <BarChart3 size={24} />
                            </div>
                          </div>
                          <ReceivablesAging agingData={mockAging} />
                        </div>
                        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                          <div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Outstanding</div>
                            <div className="text-[24px] font-black text-white">{formatPHP(receivablesRisk)}</div>
                          </div>
                          <button className="h-10 px-5 bg-white text-slate-900 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all">
                            Collect
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* ── RIGHT COLUMN: MANAGEMENT ── */}
              <div className="space-y-10">
                
                {/* Alerts */}
                {(delayedOrders > 0 || criticalStockItems.length > 0) && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[12px] font-black text-slate-900 uppercase tracking-widest px-1">
                      <AlertCircle size={16} className="text-rose-600" /> Urgent Action Required
                    </div>
                    <div className="space-y-3">
                      {delayedOrders > 0 && (
                        <ExecutiveAlert type="critical" title="Delayed Production" desc="Orders past promised release date." count={delayedOrders} />
                      )}
                      {criticalStockItems.length > 0 && (
                        <ExecutiveAlert type="warning" title="Inventory Warning" desc="Materials below critical threshold." count={criticalStockItems.length} />
                      )}
                    </div>
                  </div>
                )}

                {/* Supply Chain */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-[12px] font-black text-slate-900 uppercase tracking-widest px-1">
                    <PackageSearch size={16} className="text-indigo-600" /> Supply Network
                  </div>
                  <StockRiskQueue items={criticalStockItems} />
                  <div className="group bg-white/80 backdrop-blur-md border border-white/60 rounded-[28px] p-6 flex items-center justify-between shadow-xl shadow-slate-200/30 hover:shadow-indigo-500/5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 shadow-inner group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <Truck size={22}/>
                      </div>
                      <div>
                        <div className="text-[14px] font-black text-slate-900 tracking-tight">Active Procurements</div>
                        <div className="text-[11px] font-bold text-slate-500">Inbound from {suppliers?.length || 0} Vendors</div>
                      </div>
                    </div>
                    <div className="text-[24px] font-black text-slate-900 bg-slate-50 px-4 py-2 rounded-2xl">{pendingPOs}</div>
                  </div>
                </section>

                {/* Staff & Activity */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-[12px] font-black text-slate-900 uppercase tracking-widest px-1">
                    <Activity size={16} className="text-emerald-600" /> Recent Updates
                  </div>
                  <StaffStatusWidget staff={staff} />
                  <RecentActivity activities={pulseActivities} />
                </section>
                
              </div>
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SystemAnnouncements announcements={announcements} />
          </div>
        )}

        {activeTab === 'welcome' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-[500px] flex items-center justify-center bg-white/40 backdrop-blur-xl border border-dashed border-slate-200 rounded-[48px]">
             <div className="text-center opacity-20">
                <LayoutGrid size={48} className="mx-auto mb-4" />
                <div className="text-[14px] font-black uppercase tracking-[0.3em]">Welcome Portal</div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { 
  Building2, Users, ShoppingBag, ArrowLeft, 
  TrendingUp, Clock, AlertCircle, Package,
  FileText, CreditCard, BarChart3, ChevronRight,
  ArrowUpRight, ArrowDownRight, MapPin, UserPlus
} from 'lucide-react';
import { useERPStore } from '@/store/useERPStore';
import Link from 'next/link';

type TabType = 'overview' | 'operations' | 'inventory' | 'billings' | 'reports';

export default function BranchWorkspacePage() {
  const { id } = useParams();
  const router = useRouter();
  const { branches, orders, inventoryStock, inventory, staff, payments, invoices } = useERPStore();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const branch = branches.find(b => b.id === id);
  const branchManager = staff.find(s => s.id === branch?.managerUserId);

  // ── DATA ENGINE: HQ OVERSIGHT FILTERING ──
  const branchOrders = useMemo(() => orders.filter(o => o.branch_id === id), [orders, id]);
  const branchInvoices = useMemo(() => invoices.filter(i => i.branch_id === id), [invoices, id]);
  const branchStock = useMemo(() => inventoryStock.filter(s => s.branch_id === id), [inventoryStock, id]);
  
  const revenue = useMemo(() => 
    branchInvoices.reduce((acc, inv) => acc + (inv.status === 'PAID' ? inv.total_amount : 0), 0)
  , [branchInvoices]);

  const receivables = useMemo(() => 
    branchInvoices.reduce((acc, inv) => acc + (inv.status === 'UNPAID' || inv.status === 'PARTIAL' ? inv.total_amount : 0), 0)
  , [branchInvoices]);

  const activeOrdersCount = branchOrders.filter(o => !['RELEASED', 'CANCELLED'].includes(o.status)).length;
  const delayedOrders = branchOrders.filter(o => {
    const due = new Date(o.due_date);
    return due < new Date() && !['RELEASED', 'CANCELLED'].includes(o.status);
  }).length;

  // ── MOCK DATA GENERATION (STABILIZED) ──
  const operationalMetrics = useMemo(() => {
    return ['Bespoke Suits', 'Bulk Uniforms', 'Alterations'].map(cat => ({
      cat,
      items: Math.floor(Math.random() * 20) + 5,
      days: Math.floor(Math.random() * 5) + 3
    }));
  }, []);

  const inventoryValueData = useMemo(() => {
    return ['Fabrics', 'Trims', 'Boutique Items', 'Finished Goods'].map(cat => ({
      cat,
      value: Math.floor(Math.random() * 500000 + 100000),
      percent: Math.floor(Math.random() * 60) + 20
    }));
  }, []);

  if (!branch) return <div>Branch not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── BACK NAVIGATION & IDENTITY ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none uppercase">
                {branch.branchName}
              </h1>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                branch.isMain ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {branch.branch_type}
              </span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-bold text-[12px] uppercase tracking-wider">
              <MapPin size={14} className="text-slate-300" />
              {branch.branchCode} • {branch.address}
            </div>
          </div>
        </div>

        {/* Manager Badge / Assign CTA */}
        <div className="flex items-center gap-4 px-6 py-3 bg-white border border-slate-200 rounded-3xl shadow-sm">
          {branchManager ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shadow-inner">
                {branchManager.avatar ? (
                  <img src={branchManager.avatar} alt={branchManager.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 uppercase font-black text-[10px]">
                    {branchManager.name.slice(0, 2)}
                  </div>
                )}
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Manager</div>
                <div className="text-[14px] font-bold text-slate-900 leading-none">{branchManager.name}</div>
              </div>
            </div>
          ) : (
            <Link 
              href="/owner/staff?onboarding=true"
              className="flex items-center gap-3 text-indigo-600 hover:text-indigo-700 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserPlus size={18} />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Unassigned</div>
                <div className="text-[13px] font-black leading-none">Assign Manager</div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* ── EXECUTIVE KPI GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
            <span className="text-[11px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">+12.5%</span>
          </div>
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Revenue</div>
          <div className="text-[28px] font-black text-slate-900 tracking-tight leading-none">
            ₱{revenue.toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <ShoppingBag size={24} />
            </div>
          </div>
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Production</div>
          <div className="text-[28px] font-black text-slate-900 tracking-tight leading-none">
            {activeOrdersCount} <span className="text-slate-400 text-[14px]">Jobs</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
            {delayedOrders > 0 && (
              <span className="text-[11px] font-black text-rose-500 bg-rose-50 px-2 py-1 rounded-lg">Action Needed</span>
            )}
          </div>
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Delayed Orders</div>
          <div className="text-[28px] font-black text-slate-900 tracking-tight leading-none">
            {delayedOrders} <span className="text-slate-400 text-[14px]">Items</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <CreditCard size={24} />
            </div>
          </div>
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Receivables</div>
          <div className="text-[28px] font-black text-slate-900 tracking-tight leading-none">
            ₱{receivables.toLocaleString()}
          </div>
        </div>
      </div>

      {/* ── EXECUTIVE TABS ── */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-[24px] w-max shadow-sm">
        {(['overview', 'operations', 'inventory', 'billings', 'reports'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab 
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-105' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT: HQ PERSPECTIVE ── */}
      <div className="animate-in fade-in slide-in-from-top-2 duration-500">
        
        {/* OVERVIEW: BRANCH HEALTH */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[18px] font-black text-slate-900 uppercase tracking-tight">Performance Index</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-slate-200" />
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Actual Sales</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-indigo-500" />
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Growth Forecast</span>
                    </div>
                  </div>
                </div>
                <div className="h-[300px] flex items-end gap-6 px-4 pb-4">
                  {[
                    { label: 'W1', actual: 45, forecast: 50 },
                    { label: 'W2', actual: 60, forecast: 55 },
                    { label: 'W3', actual: 40, forecast: 60 },
                    { label: 'W4', actual: 85, forecast: 75 },
                    { label: 'W5', actual: 70, forecast: 85 },
                    { label: 'W6', actual: 95, forecast: 90 },
                    { label: 'W7', actual: 0, forecast: 95 }, // Next week forecast
                  ].map((data, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                      <div className="w-full flex items-end justify-center gap-1.5 h-full">
                        {/* Actual Bar */}
                        {data.actual > 0 && (
                          <div 
                            className="w-full max-w-[20px] bg-slate-100 rounded-t-lg relative group-hover:bg-slate-200 transition-all duration-500"
                            style={{ height: `${data.actual}%` }}
                          />
                        )}
                        {/* Forecast Bar */}
                        <div 
                          className="w-full max-w-[20px] bg-indigo-500 rounded-t-lg relative group-hover:bg-indigo-600 transition-all duration-700 delay-100"
                          style={{ height: `${data.forecast}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {data.forecast}%
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-[16px] font-black uppercase tracking-widest mb-6 opacity-60">Operational Health</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-[13px] font-black mb-2 uppercase tracking-widest">
                        <span>Production Efficiency</span>
                        <span>92%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[13px] font-black mb-2 uppercase tracking-widest">
                        <span>Staff Productivity</span>
                        <span>78%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400 rounded-full" style={{ width: '78%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[13px] font-black mb-2 uppercase tracking-widest">
                        <span>Inventory Turnover</span>
                        <span>65%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        )}

        {/* OPERATIONS: SUMMARIZED EXECUTION */}
        {activeTab === 'operations' && (
          <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-black text-slate-900 uppercase tracking-tight">Tailoring Progress</h3>
                <p className="text-[12px] text-slate-500 font-bold uppercase tracking-widest mt-1">High-level bottleneck monitoring</p>
              </div>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Order Category</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Volume</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Avg. Lead Time</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Bottlenecks</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {operationalMetrics.map(metric => (
                  <tr key={metric.cat} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-6 font-black text-slate-900">{metric.cat}</td>
                    <td className="px-8 py-6 text-[14px] font-bold text-slate-600">{metric.items} Items</td>
                    <td className="px-8 py-6 text-[14px] font-bold text-slate-600">{metric.days} Days</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-100">Fabric Delay</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-indigo-600 text-[12px] font-black uppercase tracking-widest hover:underline">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* BILLINGS: FINANCIAL HUB */}
        {activeTab === 'billings' && (
          <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-emerald-600 rounded-[32px] p-8 text-white shadow-xl shadow-emerald-100">
                   <h4 className="text-[11px] font-black uppercase tracking-widest opacity-70 mb-1">Cash on Hand (Daily)</h4>
                   <div className="text-[32px] font-black leading-none mb-4">₱45,200.00</div>
                   <div className="flex items-center gap-2 text-[12px] font-bold">
                      <span className="px-2 py-0.5 bg-white/20 rounded-lg">Yesterday: ₱38k</span>
                   </div>
                </div>
                <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-xl shadow-indigo-100">
                   <h4 className="text-[11px] font-black uppercase tracking-widest opacity-70 mb-1">Pending Receivables</h4>
                   <div className="text-[32px] font-black leading-none mb-4">₱128,500.00</div>
                   <div className="flex items-center gap-2 text-[12px] font-bold">
                      <span className="px-2 py-0.5 bg-white/20 rounded-lg">12 Overdue Invoices</span>
                   </div>
                </div>
                <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl shadow-slate-100">
                   <h4 className="text-[11px] font-black uppercase tracking-widest opacity-70 mb-1">Branch Expenses</h4>
                   <div className="text-[32px] font-black leading-none mb-4">₱12,400.00</div>
                   <div className="flex items-center gap-2 text-[12px] font-bold">
                      <span className="px-2 py-0.5 bg-white/20 rounded-lg">Rent & Utilities</span>
                   </div>
                </div>
             </div>

             <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100">
                  <h3 className="text-[18px] font-black text-slate-900 uppercase tracking-tight">Recent Sales Transactions</h3>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Invoice</th>
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {branchInvoices.slice(0, 5).map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6 font-black text-slate-900">{inv.invoice_no}</td>
                        <td className="px-8 py-6 text-[14px] font-bold text-slate-600">{inv.customer || 'Guest'}</td>
                        <td className="px-8 py-6 font-black text-slate-900">₱{inv.total_amount.toLocaleString()}</td>
                        <td className="px-8 py-6">
                           <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                             inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                           }`}>
                             {inv.status}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right text-[13px] font-bold text-slate-400">
                           {new Date(inv.issued_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {/* INVENTORY: OVERSIGHT */}
        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
              <h3 className="text-[18px] font-black text-slate-900 uppercase tracking-tight mb-8">Stock Value Distribution</h3>
              <div className="space-y-6">
                {inventoryValueData.map(data => (
                  <div key={data.cat}>
                    <div className="flex justify-between text-[13px] font-black mb-2 uppercase tracking-widest">
                      <span className="text-slate-600">{data.cat}</span>
                      <span className="text-slate-900">₱{data.value.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-900 rounded-full" style={{ width: `${data.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
               <h3 className="text-[18px] font-black text-slate-900 uppercase tracking-tight mb-8">Asset Alerts</h3>
               <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                       <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                          <Package size={20} />
                       </div>
                       <div>
                          <div className="text-[13px] font-black text-slate-900">Critical Low Stock: Charcoal Wool</div>
                          <div className="text-[11px] font-bold text-rose-600 uppercase tracking-widest">Below Reorder Level (12m remaining)</div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {/* REPORTS: DEEP ANALYTICS */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Sales Performance', icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { title: 'Inventory Aging', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { title: 'Staff Efficiency', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
              { title: 'Procurement Audit', icon: FileText, color: 'text-slate-600', bg: 'bg-slate-50' }
            ].map((report, i) => (
              <button 
                key={i}
                className="bg-white border border-slate-200 rounded-[32px] p-8 text-left hover:border-slate-400 transition-all group shadow-sm"
              >
                <div className={`w-14 h-14 ${report.bg} ${report.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <report.icon size={28} />
                </div>
                <h4 className="text-[16px] font-black text-slate-900 leading-tight uppercase tracking-tight mb-2">{report.title}</h4>
                <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest">Generate Analysis</p>
                <ChevronRight className="mt-4 text-slate-300 group-hover:text-slate-900 transition-colors" size={20} />
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

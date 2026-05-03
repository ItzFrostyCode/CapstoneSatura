'use client';

import { 
  Search, 
  Plus, 
  Copy, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Receipt,
  Truck,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  Activity
} from 'lucide-react';
import { useState } from 'react';
import billingData from '@/data/billing.json';

interface Invoice {
  id: string;
  customer: string;
  email: string;
  date: string;
  amount: string;
  status: string;
  subject: string;
  color: string;
}

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  
  const invoices = (billingData || []) as Invoice[];

  const filteredInvoices = invoices.filter(inv => 
    inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Revenue", val: "₱425,000", trend: "+12.5%", color: "indigo" },
    { label: "Outstanding", val: "₱85,400", trend: "5 Invoices", color: "amber" },
    { label: "Paid This Month", val: "₱128,200", trend: "18 Invoices", color: "emerald" },
    { label: "Drafted", val: "₱12,500", trend: "3 Invoices", color: "sky" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Billing & Invoices</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Manage client payments, invoices, and financial tracking.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="bg-white text-slate-600 h-11 px-5 rounded-xl text-[13px] font-bold border border-slate-200 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            <FileText size={16} /> Export Financials
          </button>
          <button className="bg-slate-900 text-white h-11 px-6 rounded-xl text-[13px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2">
            <Plus size={18} /> Create New Invoice
          </button>
        </div>
      </div>

      {/* ── KPI GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[12px] font-bold text-slate-500">{stat.label}</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                {stat.trend}
              </span>
            </div>
            <div className="text-[28px] font-black text-slate-900 tracking-tight">{stat.val}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Navigation & Search */}
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 backdrop-blur-sm">
          <div className="flex flex-wrap bg-slate-100/80 p-1.5 rounded-full w-max gap-1 border border-slate-200/50">
            {[
              { id: 'invoices', name: 'Sales Invoices', icon: <ArrowUpRight size={14} /> },
              { id: 'bills', name: 'Supplier Bills', icon: <ArrowDownLeft size={14} /> },
              { id: 'settlements', name: 'Settlements', icon: <Activity size={14} /> },
            ].map((tab) => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full text-[12px] font-black transition-all uppercase tracking-widest whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-white text-slate-900 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {tab.icon} {tab.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-1 md:max-w-md">
            <div className="relative group flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${activeTab}...`} 
                className="h-11 w-full pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900 transition-all shadow-sm"
              />
            </div>
            <button className="h-11 w-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shadow-sm">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredInvoices.map((inv, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-all group cursor-pointer border-b border-slate-50 last:border-0">
                  <td className="px-6 py-5">
                    <div>
                      <div className="text-[14px] font-black text-slate-900 tracking-tight leading-none mb-1">{inv.id}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Digital Invoice</div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div>
                      <div className="text-[14px] font-black text-slate-900 leading-none mb-1">{inv.customer}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{inv.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-[16px] font-black text-slate-900 tracking-tight">{inv.amount}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gross Total</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      inv.status === 'Past Due' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      inv.status === 'Draft' ? 'bg-slate-50 text-slate-500 border-slate-200' :
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {inv.status === 'Paid' ? <CheckCircle2 size={12} /> : 
                       inv.status === 'Past Due' ? <AlertCircle size={12} /> : 
                       inv.status === 'Draft' ? <FileText size={12} /> : 
                       <Clock size={12} />}
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-[13px] font-black text-slate-700">{inv.date}</div>
                    <div className="text-[10px] text-slate-400 font-medium">Issue Date</div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="h-10 px-5 rounded-xl bg-slate-900 text-white text-[12px] font-black hover:bg-indigo-600 transition-all shadow-md">
                        Review
                      </button>
                      <button className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shadow-sm">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[12px] text-slate-500 font-medium">Monitoring <span className="font-bold text-slate-900">{filteredInvoices.length}</span> invoices in record</p>
          <div className="flex items-center gap-2">
            <button className="h-9 px-4 rounded-lg bg-white border border-slate-200 text-[12px] font-bold text-slate-400 cursor-not-allowed">Previous</button>
            <button className="h-9 px-4 rounded-lg bg-white border border-slate-200 text-[12px] font-bold text-slate-900 hover:bg-slate-50 transition-colors">Next <ChevronRight size={14} className="inline ml-1"/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

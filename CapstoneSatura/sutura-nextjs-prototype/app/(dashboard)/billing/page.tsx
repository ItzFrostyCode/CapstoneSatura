'use client';

import { useState } from 'react';
import { Search, Plus, FileText, CheckCircle2, AlertTriangle, Clock, MoreHorizontal, Download, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function BillingPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const invoices = [
    { id: "INV-2024-001", orderId: "ORD-1045", customer: "Maria Garcia", total: 45000, paid: 45000, date: "Apr 28, 2024", status: "Paid", method: "GCash" },
    { id: "INV-2024-002", orderId: "ORD-1044", customer: "Alexander McQueen", total: 32000, paid: 17000, date: "Apr 30, 2024", status: "Partial", method: "Bank Transfer" },
    { id: "INV-2024-003", orderId: "ORD-1041", customer: "Sofia Andres", total: 4500, paid: 3500, date: "May 01, 2024", status: "Partial", method: "Cash" },
    { id: "INV-2024-004", orderId: "ORD-1039", customer: "Roberto Gomez", total: 12500, paid: 7500, date: "May 02, 2024", status: "Partial", method: "GCash" },
    { id: "INV-2024-005", orderId: "ORD-1037", customer: "Lucia Santos", total: 15000, paid: 15000, date: "May 02, 2024", status: "Paid", method: "Cash" },
    { id: "INV-2024-006", orderId: "ORD-1042", customer: "David Torres", total: 12000, paid: 0, date: "May 03, 2024", status: "Unpaid", method: "-" },
  ];

  const stats = [
    { label: "Total Collections", value: "₱145,200", trend: "+12.5%", isPositive: true, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Accounts Receivable", value: "₱32,000", trend: "-5.2%", isPositive: true, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Overdue Invoices", value: "₱8,500", trend: "+2.1%", isPositive: false, icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Monthly Revenue", value: "₱210,400", trend: "+18.4%", isPositive: true, icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Billing & Invoices</h1>
          <p className="text-[16px] text-slate-500 mt-1">Track payments, issue receipts, and manage accounts receivable.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 h-10 px-4 rounded-lg text-[13px] font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Download size={16} /> Export CSV
          </button>
          <button className="flex items-center gap-2 bg-slate-900 text-white h-10 px-4 rounded-lg text-[13px] font-bold hover:bg-slate-800 transition-all shadow-sm">
            <Plus size={16} /> Create Invoice
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-[12px] font-bold ${stat.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.trend}
              </div>
            </div>
            <div className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
            <div className="text-[28px] font-black text-slate-900 mt-1">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Filters */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {['all', 'paid', 'partial', 'unpaid'].map((filter) => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-lg text-[13px] font-bold capitalize transition-all ${activeFilter === filter ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search by Invoice #, Order ID, or Customer..." className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-[13px] outline-none focus:border-indigo-500 transition-all shadow-sm" />
          </div>
        </div>

        {/* Invoice Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-slate-50/80 border-b border-slate-200 sticky top-0">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-600">Invoice Number</th>
                <th className="px-6 py-4 font-bold text-slate-600">Order ID</th>
                <th className="px-6 py-4 font-bold text-slate-600">Customer</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-right">Total Amount</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-right">Balance Due</th>
                <th className="px-6 py-4 font-bold text-slate-600">Date Issued</th>
                <th className="px-6 py-4 font-bold text-slate-600">Status</th>
                <th className="px-6 py-4 font-bold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{inv.id}</div>
                    <div className="text-[11px] text-slate-400 font-medium">via {inv.method}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 text-[11px]">{inv.orderId}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">{inv.customer}</td>
                  <td className="px-6 py-4 text-right font-black text-slate-900">₱{inv.total.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className={`font-black ${inv.total - inv.paid > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                      ₱{(inv.total - inv.paid).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{inv.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      inv.status === 'Partial' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm transition-all hover:scale-105" title="Download PDF">
                        <FileText size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm transition-all hover:scale-105" title="More Actions">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[12px] text-slate-500 font-medium">
          <div>Showing 6 of 152 invoices</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-white transition-all">Previous</button>
            <button className="px-3 py-1 bg-slate-900 text-white rounded shadow-sm">1</button>
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-white transition-all">2</button>
            <button className="px-3 py-1 border border-slate-300 rounded hover:bg-white transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

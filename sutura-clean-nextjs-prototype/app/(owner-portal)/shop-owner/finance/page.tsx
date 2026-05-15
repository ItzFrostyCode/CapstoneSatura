"use client";
import { TrendingUp, CreditCard, DollarSign, Download, Filter, Plus, ArrowUpRight, ArrowDownRight, Wallet, Receipt } from "lucide-react";

export default function Finance() {
  const stats = [
    { label: "Revenue (MTD)", value: "₱425,000", trend: "+14.5%", isPositive: true, color: "#0f172a" },
    { label: "Outstanding", value: "₱85,200", trend: "4 Pending", isPositive: false, color: "#3b82f6" },
    { label: "Avg. Ticket", value: "₱42,500", trend: "+2.1%", isPositive: true, color: "#334155" },
  ];

  const transactions = [
    { id: "TXN-8902", customer: "Maria Santos", date: "Oct 24, 2026", amount: "₱45,000", status: "Paid", method: "GCash" },
    { id: "TXN-8901", customer: "Carlos Reyes", date: "Oct 22, 2026", amount: "₱60,000", status: "Pending", method: "Bank Transfer" },
    { id: "TXN-8900", customer: "Elena Cruz", date: "Sep 15, 2026", amount: "₱35,000", status: "Paid", method: "Cash" },
    { id: "TXN-8899", customer: "Roberto Lim", date: "Sep 12, 2026", amount: "₱12,500", status: "Paid", method: "Maya" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-20 font-poppins">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-none uppercase">Financial Ledger</h1>
          <p className="text-[14px] text-slate-500 mt-2 font-medium">Executive telemetry of Satura's capital and cash flow.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="h-11 px-6 bg-slate-50 border border-slate-200 rounded-xl text-[12px] font-black uppercase tracking-widest text-slate-500 hover:border-slate-900 hover:text-slate-900 transition-all flex items-center gap-2 shadow-sm">
            <Download size={16} /> Export Audit
          </button>
          <button className="h-11 px-6 bg-slate-900 text-white rounded-xl text-[12px] font-black uppercase tracking-widest shadow-lg hover:shadow-slate-900/20 transition-all flex items-center gap-2 active:scale-95">
            <Plus size={18} /> New Settlement
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
        {stats.map((metric, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform">
                {i === 0 ? <TrendingUp size={20} /> : i === 1 ? <Receipt size={20} /> : <Wallet size={20} />}
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                metric.isPositive ? "text-slate-900 bg-slate-900/5" : "text-blue-600 bg-blue-50"
              }`}>
                {metric.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {metric.trend}
              </div>
            </div>
            <div className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-1">{metric.label}</div>
            <div className="text-[36px] font-black text-slate-900 tracking-tight">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
        {/* Ledger Table */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-[20px] font-black text-slate-900 uppercase">Revenue Stream</h2>
            <div className="flex gap-2">
               <button className="h-10 w-10 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors">
                <Filter size={18} />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Source</th>
                  <th className="px-8 py-5">Client</th>
                  <th className="px-8 py-5 text-right">Settlement</th>
                  <th className="px-8 py-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                    <td className="px-8 py-6">
                       <div className="text-[13px] font-black text-slate-900">{txn.id}</div>
                       <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{txn.method}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-[14px] font-black text-slate-900 uppercase">{txn.customer}</div>
                      <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{txn.date}</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="text-[15px] font-black text-slate-900">{txn.amount}</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        txn.status === "Paid" ? "bg-slate-900 text-white border-slate-900" : "bg-blue-50 text-blue-600 border-blue-100"
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Distribution */}
        <div className="space-y-8">
           <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-xl shadow-slate-900/10">
              <h3 className="text-[20px] font-black mb-6 uppercase">Collection Strategy</h3>
              <div className="space-y-6">
                 {[
                   { label: "Direct Settlements", val: 72, color: "#3b82f6" },
                   { label: "Instalment Aging", val: 18, color: "rgba(255,255,255,0.2)" },
                   { label: "Retention Funds", val: 10, color: "rgba(255,255,255,0.1)" }
                 ].map((item, i) => (
                   <div key={i}>
                      <div className="flex justify-between text-[13px] mb-2 font-black uppercase tracking-widest">
                         <span className="opacity-60">{item.label}</span>
                         <span>{item.val}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                         <div style={{ width: `${item.val}%`, background: item.color }} className="h-full rounded-full" />
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 h-14 bg-blue-600 text-white rounded-2xl font-black text-[13px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-blue-600/20">
                 Review AR Aging Report
              </button>
           </div>

           <div className="bg-white rounded-[32px] border border-slate-200 p-8">
              <h3 className="text-[18px] font-black mb-6 uppercase">Payout Schedule</h3>
              <div className="space-y-4">
                 {[
                   { label: "Fabric Suppliers", amount: "₱120k", date: "Oct 30" },
                   { label: "Operational Lease", amount: "₱45k", date: "Nov 01" },
                   { label: "Staff Payroll", amount: "₱180k", date: "Nov 05" },
                 ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0">
                      <div>
                         <div className="text-[14px] font-black text-slate-900 uppercase">{item.label}</div>
                         <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Due {item.date}</div>
                      </div>
                      <div className="text-[15px] font-black text-slate-500">{item.amount}</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

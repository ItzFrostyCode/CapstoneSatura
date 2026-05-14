"use client";
import { TrendingUp, CreditCard, DollarSign, Download, Filter, Plus, ArrowUpRight, ArrowDownRight, Wallet, Receipt } from "lucide-react";

export default function Finance() {
  const stats = [
    { label: "Revenue (MTD)", value: "₱425,000", trend: "+14.5%", isPositive: true, color: "#1E3A1F" },
    { label: "Outstanding", value: "₱85,200", trend: "4 Pending", isPositive: false, color: "#C9A84C" },
    { label: "Avg. Ticket", value: "₱42,500", trend: "+2.1%", isPositive: true, color: "#2D5016" },
  ];

  const transactions = [
    { id: "TXN-8902", customer: "Maria Santos", date: "Oct 24, 2026", amount: "₱45,000", status: "Paid", method: "GCash" },
    { id: "TXN-8901", customer: "Carlos Reyes", date: "Oct 22, 2026", amount: "₱60,000", status: "Pending", method: "Bank Transfer" },
    { id: "TXN-8900", customer: "Elena Cruz", date: "Sep 15, 2026", amount: "₱35,000", status: "Paid", method: "Cash" },
    { id: "TXN-8899", customer: "Roberto Lim", date: "Sep 12, 2026", amount: "₱12,500", status: "Paid", method: "Maya" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-[32px] font-bold font-sans text-[#1C1917] tracking-tight leading-none">Financial Ledger</h1>
          <p className="text-[14px] text-[#78716C] mt-2">Executive telemetry of Satura's capital and cash flow.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="h-11 px-6 bg-[#FAF8F5] border border-[#E2DDD7] rounded-xl text-[13px] font-bold text-[#78716C] hover:border-slate-900 hover:text-slate-900 transition-all flex items-center gap-2 shadow-sm">
            <Download size={16} /> Export Audit
          </button>
          <button className="h-11 px-6 bg-slate-900 text-white rounded-xl text-[13px] font-bold shadow-lg hover:shadow-slate-900/20 transition-all flex items-center gap-2 active:scale-95">
            <Plus size={18} /> New Settlement
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
        {stats.map((metric, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] border border-[#E2DDD7] shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#F0EDE8] flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform">
                {i === 0 ? <TrendingUp size={20} /> : i === 1 ? <Receipt size={20} /> : <Wallet size={20} />}
              </div>
              <div className={`flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full ${
                metric.isPositive ? "text-slate-900 bg-slate-900/5" : "text-white bg-indigo-600/5"
              }`}>
                {metric.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {metric.trend}
              </div>
            </div>
            <div className="text-[12px] font-bold text-[#78716C] uppercase tracking-widest mb-1">{metric.label}</div>
            <div className="text-[36px] font-bold text-[#1C1917] tracking-tight">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-2">
        {/* Ledger Table */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-[#E2DDD7] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-[#F0EDE8] flex justify-between items-center">
            <h2 className="text-[20px] font-bold font-sans text-[#1C1917]">Revenue Stream</h2>
            <div className="flex gap-2">
               <button className="h-10 w-10 flex items-center justify-center rounded-full border border-[#E2DDD7] text-[#78716C] hover:text-slate-900 transition-colors">
                <Filter size={18} />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] font-bold text-[#78716C] uppercase tracking-widest">
                  <th className="px-8 py-5">Source</th>
                  <th className="px-8 py-5">Client</th>
                  <th className="px-8 py-5 text-right">Settlement</th>
                  <th className="px-8 py-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE8]">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-[#FAF8F5] transition-colors group cursor-pointer">
                    <td className="px-8 py-6">
                       <div className="text-[13px] font-bold text-[#1C1917]">{txn.id}</div>
                       <div className="text-[11px] text-[#78716C]">{txn.method}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-[14px] font-bold text-[#1C1917]">{txn.customer}</div>
                      <div className="text-[12px] text-[#78716C]">{txn.date}</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="text-[15px] font-bold text-slate-900">{txn.amount}</div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        txn.status === "Paid" ? "bg-slate-900/5 text-slate-900 border-slate-900/10" : "bg-indigo-600/5 text-white border-indigo-600/10"
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
           <div className="bg-slate-900 rounded-[40px] p-8 text-[#FAF8F5] shadow-xl shadow-slate-900/10">
              <h3 className="text-[20px] font-bold font-sans mb-6">Collection Strategy</h3>
              <div className="space-y-6">
                 {[
                   { label: "Direct Settlements", val: 72, color: "#C9A84C" },
                   { label: "Instalment Aging", val: 18, color: "rgba(250,248,245,0.3)" },
                   { label: "Retention Funds", val: 10, color: "rgba(250,248,245,0.1)" }
                 ].map((item, i) => (
                   <div key={i}>
                      <div className="flex justify-between text-[13px] mb-2 font-bold">
                         <span className="opacity-60">{item.label}</span>
                         <span>{item.val}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                         <div style={{ width: `${item.val}%`, background: item.color }} className="h-full rounded-full" />
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 h-14 bg-indigo-600 text-slate-900 rounded-2xl font-bold text-[14px] hover:scale-[1.02] transition-all">
                 Review AR Aging Report
              </button>
           </div>

           <div className="bg-white rounded-[32px] border border-[#E2DDD7] p-8">
              <h3 className="text-[18px] font-bold font-sans mb-6">Payout Schedule</h3>
              <div className="space-y-4">
                 {[
                   { label: "Fabric Suppliers", amount: "₱120k", date: "Oct 30" },
                   { label: "Operational Lease", amount: "₱45k", date: "Nov 01" },
                   { label: "Staff Payroll", amount: "₱180k", date: "Nov 05" },
                 ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center py-4 border-b border-[#F0EDE8] last:border-0">
                      <div>
                         <div className="text-[14px] font-bold text-[#1C1917]">{item.label}</div>
                         <div className="text-[12px] text-[#78716C]">Due {item.date}</div>
                      </div>
                      <div className="text-[15px] font-bold text-[#78716C]">{item.amount}</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

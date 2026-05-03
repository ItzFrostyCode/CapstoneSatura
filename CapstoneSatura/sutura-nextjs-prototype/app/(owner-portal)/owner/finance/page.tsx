import { TrendingUp, CreditCard, DollarSign, Download, Filter, Plus } from 'lucide-react';

export default function Finance() {
  const stats = [
    { label: 'Total Revenue (MTD)', value: '₱425,000', trend: '+14.5%', isPositive: true, color: 'indigo' },
    { label: 'Outstanding Receivables', value: '₱85,200', trend: '4 Pending', isPositive: false, color: 'amber' },
    { label: 'Avg. Deal Size', value: '₱42,500', trend: '+2.1%', isPositive: true, color: 'emerald' },
  ];

  const transactions = [
    { id: 'TXN-8902', client: 'Maria Santos', date: 'Oct 24, 2026', amount: '₱45,000', status: 'Paid' },
    { id: 'TXN-8901', client: 'Carlos Reyes', date: 'Oct 22, 2026', amount: '₱60,000', status: 'Pending' },
    { id: 'TXN-8900', client: 'Elena Cruz', date: 'Sep 15, 2026', amount: '₱35,000', status: 'Paid' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Financial Overview</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Track billings, invoices, and financial analytics.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="bg-white text-slate-600 h-11 px-5 rounded-xl text-[13px] font-bold border border-slate-200 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            <Download size={16} /> Export CSV
          </button>
          <button className="bg-slate-900 text-white h-11 px-6 rounded-xl text-[13px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2">
            <Plus size={18} /> Log Payment
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((metric, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">{metric.label}</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                metric.isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'
              }`}>
                {metric.trend}
              </span>
            </div>
            <div className="text-[28px] font-black text-slate-900 tracking-tight">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <h2 className="text-[16px] font-black text-slate-900">Recent Transactions Ledger</h2>
          <button className="h-9 px-4 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-900 transition-colors">
            <Filter size={16} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-8 py-4">Transaction ID</th>
                <th className="px-8 py-4">Client</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4 text-right">Amount</th>
                <th className="px-8 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 text-[13px] font-black text-slate-900">{txn.id}</td>
                  <td className="px-8 py-5 text-[14px] font-bold text-slate-600">{txn.client}</td>
                  <td className="px-8 py-5 text-[13px] text-slate-500 font-medium">{txn.date}</td>
                  <td className="px-8 py-5 text-[14px] font-black text-slate-900 text-right">{txn.amount}</td>
                  <td className="px-8 py-5 text-right">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      txn.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
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
    </div>
  );
}

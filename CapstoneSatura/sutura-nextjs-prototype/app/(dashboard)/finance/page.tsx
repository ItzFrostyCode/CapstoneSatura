export default function Finance() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financial Overview</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Pro Feature</span>
            Track billings, invoices, and analytics.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition shadow-sm">
            Generate Invoice
          </button>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition shadow-sm shadow-emerald-600/20">
            Log Payment
          </button>
        </div>
      </header>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Revenue (MTD)', value: '₱425,000', trend: '+14.5%', isPositive: true },
          { label: 'Outstanding Receivables', value: '₱85,200', trend: '4 Pending Invoices', isPositive: false, isWarning: true },
          { label: 'Avg. Deal Size', value: '₱42,500', trend: '+2.1%', isPositive: true },
        ].map((metric, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{metric.label}</h3>
            <div className="flex items-end justify-between mt-auto">
              <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
              <span className={`text-xs font-semibold ${
                metric.isPositive ? 'text-emerald-600 bg-emerald-50' : 
                metric.isWarning ? 'text-amber-600 bg-amber-50' : 'text-slate-500 bg-slate-100'
              } px-2 py-1 rounded-md`}>
                {metric.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-slate-800">Recent Transactions Ledger</h2>
          <button className="text-sm font-semibold text-slate-600 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition">
            Export CSV
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-white">
              <th className="p-4 font-semibold">Transaction ID</th>
              <th className="p-4 font-semibold">Client</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Amount</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { id: 'TXN-8902', client: 'Maria Santos', date: 'Oct 24, 2026', amount: '₱45,000', status: 'Paid', statusColor: 'bg-emerald-100 text-emerald-700' },
              { id: 'TXN-8901', client: 'Carlos Reyes', date: 'Oct 22, 2026', amount: '₱60,000', status: 'Pending', statusColor: 'bg-amber-100 text-amber-700' },
              { id: 'TXN-8900', client: 'Elena Cruz', date: 'Sep 15, 2026', amount: '₱35,000', status: 'Paid', statusColor: 'bg-emerald-100 text-emerald-700' },
            ].map((txn) => (
              <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-sm font-medium text-slate-900">{txn.id}</td>
                <td className="p-4 text-sm text-slate-600">{txn.client}</td>
                <td className="p-4 text-sm text-slate-600">{txn.date}</td>
                <td className="p-4 text-sm font-bold text-slate-900">{txn.amount}</td>
                <td className="p-4">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${txn.statusColor}`}>
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

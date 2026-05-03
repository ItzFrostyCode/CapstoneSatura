export default function ClientsCRM() {
  const clients = [
    { id: 'CUS-001', name: 'Maria Santos', email: 'maria.s@example.com', lastOrder: 'Oct 24, 2026', status: 'Measurements Complete', statusColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { id: 'CUS-002', name: 'Carlos Reyes', email: 'carlos.r@example.com', lastOrder: 'Oct 22, 2026', status: 'Pending Fitting', statusColor: 'bg-amber-100 text-amber-700 border-amber-200' },
    { id: 'CUS-003', name: 'Elena Cruz', email: 'elena.c@example.com', lastOrder: 'Sep 15, 2026', status: 'Ready for Pickup', statusColor: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'CUS-004', name: 'David Lee', email: 'd.lee@example.com', lastOrder: 'Aug 01, 2026', status: 'Archived', statusColor: 'bg-slate-100 text-slate-600 border-slate-200' },
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Clients CRM</h1>
          <p className="text-slate-500 mt-1">Manage customer profiles and sizing history.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition shadow-sm shadow-slate-900/20 flex items-center gap-2">
            <span>+</span> Add Client
          </button>
        </div>
      </header>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <input 
            type="text" 
            placeholder="Search clients..." 
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-shadow"
          />
          <button className="text-sm font-semibold text-slate-600 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition">
            Filter Results
          </button>
        </div>

        {/* Data Table */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 bg-slate-50">
              <th className="p-4 font-semibold">Client Name</th>
              <th className="p-4 font-semibold">Contact</th>
              <th className="p-4 font-semibold">Last Order</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{client.name}</p>
                      <p className="text-xs text-slate-500">{client.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-slate-600">{client.email}</td>
                <td className="p-4 text-sm text-slate-600 font-medium">{client.lastOrder}</td>
                <td className="p-4">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${client.statusColor}`}>
                    {client.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-slate-400 hover:text-slate-900 font-bold px-2 py-1 transition-colors">
                    •••
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
          <p className="text-xs text-slate-500 font-medium">Showing 1 to 4 of 48 clients</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded text-sm font-medium text-slate-400 cursor-not-allowed">Prev</button>
            <button className="px-3 py-1 border border-slate-200 rounded text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

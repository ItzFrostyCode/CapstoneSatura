export default function SupplyChain() {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Supply Chain & Inventory</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Pro Feature</span>
            Manage materials and track supplier requests.
          </p>
        </div>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition shadow-sm shadow-slate-900/20">
          Request Supplies
        </button>
      </header>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Inventory Status */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4">Fabric Inventory Status</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">Premium Navy Wool</span>
                <span className="text-slate-500">120m / 500m</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">Italian White Linen</span>
                <span className="text-red-600 font-bold">15m / 200m (Critical)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full animate-pulse" style={{ width: '7.5%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 mb-4">Pending Supplier Deliveries</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border border-slate-200 rounded-lg">
              <div>
                <p className="font-bold text-sm text-slate-900">Silk Threads Inc.</p>
                <p className="text-xs text-slate-500">ETA: Tomorrow</p>
              </div>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">In Transit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

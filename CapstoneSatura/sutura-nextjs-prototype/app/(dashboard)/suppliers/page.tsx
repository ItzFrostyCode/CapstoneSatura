import { Truck, Plus } from 'lucide-react';

export default function SuppliersPage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">Supplier Requests</h1>
          <p className="text-[13px] text-slate-500 mt-1">Manage material requests and vendor orders.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-900 text-white h-9 px-4 rounded-md text-[13px] font-semibold hover:bg-slate-800 transition-colors shadow-sm">
          <Plus size={16} /> New Request
        </button>
      </div>
      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500 text-[13px] shadow-sm">
        Supplier requests and tracking table will be populated here.
      </div>
    </div>
  );
}

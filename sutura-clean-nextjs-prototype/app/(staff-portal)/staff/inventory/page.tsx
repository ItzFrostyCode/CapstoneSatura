'use client';

import React, { useState } from 'react';
import { 
  PackageSearch, AlertTriangle, CheckCircle2, History, Info, 
  Search, Filter, Plus, Minus, ArrowRightLeft, AlertCircle,
  ChevronRight, Box, Scissors
} from 'lucide-react';
import { useERPStore } from '@/store/useERPStore';

export default function StaffInventoryPage() {
  const { inventory, currentUser } = useERPStore();
  const [search, setSearch] = useState('');
  const isInventoryStaff = currentUser?.role === 'INVENTORY' || currentUser?.role === 'ADMIN' || currentUser?.role === 'MANAGER';

  const filteredInventory = inventory.filter(i => 
    (i.item || i.item_name || '').toLowerCase().includes(search.toLowerCase()) || 
    i.sku.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    lowStock: inventory.filter(i => (i.stock || 0) <= (i.reorder_level || 5) && (i.stock || 0) > 0).length,
    outOfStock: inventory.filter(i => (i.stock || 0) <= 0).length,
    totalSKUs: inventory.length
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-black text-slate-900 tracking-tight leading-none">Stock Management</h1>
          <p className="text-[12px] text-slate-500 font-bold mt-1.5 uppercase tracking-widest leading-none">Inventory Control & Availability</p>
        </div>
        <div className="flex items-center gap-3">
          {isInventoryStaff && (
            <button className="h-10 px-4 bg-slate-900 text-white rounded-xl flex items-center gap-2 text-[12px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95">
              <Plus size={16} /> Quick Stock-In
            </button>
          )}
          <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-2">
            <Box size={16} className="text-indigo-600" />
            <span className="text-[11px] font-black text-indigo-900 uppercase tracking-widest">
              {isInventoryStaff ? 'Write Access Enabled' : 'Read-Only View'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Low Stock Items', value: stats.lowStock.toString(), color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Out of Stock', value: stats.outOfStock.toString(), color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Total SKUs', value: stats.totalSKUs.toString(), color: 'text-slate-600', bg: 'bg-slate-50' },
          { label: 'Active Materials', value: inventory.filter(i => i.item_type !== 'FINISHED_GOOD').length.toString(), color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((s, i) => (
          <div key={i} className={`p-4 rounded-2xl border border-slate-100 shadow-sm ${s.bg}`}>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</div>
            <div className={`text-[20px] font-black ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search by SKU, Name, or Bin Location..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-6 bg-white border border-slate-200 rounded-xl text-[14px] font-medium outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="h-12 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[13px] font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={16} /> All Categories
          </button>
          <button className="h-12 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[13px] font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <History size={16} /> Audit Log
          </button>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Item & SKU</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Bin / Rack</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">In Stock</th>
              <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              {isInventoryStaff && <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredInventory.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-slate-400">
                  <PackageSearch size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="text-[14px] font-bold">No inventory items found</p>
                  <p className="text-[12px]">Try adjusting your search or filters</p>
                </td>
              </tr>
            ) : (
              filteredInventory.map((item) => {
                const stock = item.stock || 0;
                const status = stock <= 0 ? 'Out of Stock' : stock <= (item.reorder_level || 5) ? 'Low Stock' : 'In Stock';
                
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="text-[14px] font-black text-slate-900 leading-tight">{item.item || item.item_name}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5 tracking-tighter">{item.sku}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {item.category || item.cat}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> {item.location || 'Main Storage'}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="text-[16px] font-black text-slate-900 tracking-tight">
                        {stock} <span className="text-[11px] text-slate-400 font-bold uppercase ml-0.5">{item.unit || item.unit_of_measure}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        status === 'In Stock' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        status === 'Low Stock' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-rose-50 text-rose-700 border-rose-100'
                      }`}>
                        {status}
                      </span>
                    </td>
                    {isInventoryStaff && (
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button title="Add Stock" className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100">
                            <Plus size={14} />
                          </button>
                          <button title="Deduct Stock" className="w-8 h-8 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all border border-rose-100">
                            <Minus size={14} />
                          </button>
                          <button title="Transfer" className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100">
                            <ArrowRightLeft size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Production Integration Card */}
      <div className="bg-slate-900 rounded-[32px] p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative shadow-xl shadow-slate-900/10">
         <div className="relative z-10">
            <h3 className="text-[18px] font-black tracking-tight flex items-center gap-2">
               <Scissors size={20} className="text-indigo-400" /> Critical for Production
            </h3>
            <p className="text-[13px] text-white/60 font-bold mt-1">There are 3 pending restock requests for active job orders. Approve these to resume cutting.</p>
         </div>
         <button className="relative z-10 h-11 px-6 bg-white text-slate-900 rounded-xl text-[12px] font-black hover:bg-indigo-400 hover:text-white transition-all active:scale-95 shadow-lg">
            Review Production Requests
         </button>
         
         {/* Background Decoration */}
         <div className="absolute right-0 top-0 bottom-0 w-64 bg-indigo-600/10 blur-3xl rounded-full translate-x-1/2 pointer-events-none"></div>
      </div>

    </div>
  );
}

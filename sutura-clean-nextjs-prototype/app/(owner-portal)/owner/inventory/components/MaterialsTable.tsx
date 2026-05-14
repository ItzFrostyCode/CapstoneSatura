'use client';

import React from 'react';
import { Search, MapPin, MoreVertical, Eye, ClipboardList, Archive, Inbox, ArrowRightLeft, CheckCircle, AlertTriangle, PackageX, Plus, Minus, History, Box } from 'lucide-react';
import { InventoryItem, Supplier } from '@/store/useERPStore';

interface MaterialsTableProps {
  materials: InventoryItem[];
  suppliers: Supplier[];
  onViewItem: (item: InventoryItem) => void;
  onMovement: (item: InventoryItem, mode: 'in' | 'out') => void;
  activeActionRow: string | null;
  setActiveActionRow: (id: string | null) => void;
}

export function MaterialsTable({ 
  materials, 
  suppliers, 
  onViewItem, 
  onMovement, 
  activeActionRow,
  setActiveActionRow
}: MaterialsTableProps) {

  const getStatus = (item: InventoryItem) => {
    const stock = item.stock || 0;
    const minStock = item.reorder_level || 0;
    if (stock <= 0) return 'Out of Stock';
    if (stock <= minStock) return 'Low Stock';
    return 'In Stock';
  };

  const formatStock = (stock: number) => {
    if (stock >= 1000000) return `${(stock / 1000000).toFixed(1)}M`;
    if (stock >= 10000) return `${(stock / 1000).toFixed(1)}k`;
    return stock.toLocaleString();
  };

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'In Stock': return { label: 'Available', icon: <CheckCircle size={12} />, classes: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
      case 'Low Stock': return { label: 'Low Stock', icon: <AlertTriangle size={12} />, classes: 'text-amber-600 bg-amber-50 border-amber-100' };
      case 'Out of Stock': return { label: 'Out of Stock', icon: <PackageX size={12} />, classes: 'text-rose-600 bg-rose-50 border-rose-100' };
      default: return { label: 'Unknown', icon: <Inbox size={12} />, classes: 'text-slate-400 bg-slate-50 border-slate-200' };
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
              <th className="px-10 py-5">Item Specification</th>
              <th className="px-10 py-5 text-center">Stock Level</th>
              <th className="px-10 py-5 text-center">Health Status</th>
              <th className="px-10 py-5">Storage Location</th>
              <th className="px-10 py-5 text-right">Inventory Value</th>
              <th className="px-10 py-5 text-right pr-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {materials.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-10 py-24 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                      <Box size={32} />
                    </div>
                    <div className="text-[14px] font-bold text-slate-400 italic">No materials found in current filter.</div>
                  </div>
                </td>
              </tr>
            ) : (
              materials.map((item) => {
                const isFinishedGood = item.cat === 'Finished Goods' || item.item_type === 'FINISHED_GOOD';
                const health = getHealthBadge(getStatus(item));
                const unitCost = item.weighted_average_cost || item.unit_cost || 0;
                const itemValue = (item.stock || 0) * unitCost;

                return (
                  <tr key={item.sku} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-[18px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                          <History size={20} />
                        </div>
                        <div>
                          <div className="text-[15px] font-black text-slate-900 tracking-tight">{item.item || item.item_name}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{item.sku}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-10 py-7 text-center">
                      <div className="inline-flex flex-col items-center">
                         <span className="text-[16px] font-black text-slate-900 leading-none tabular-nums">{formatStock(item.stock || 0)}</span>
                         <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{item.unit || item.unit_of_measure}</span>
                      </div>
                    </td>

                    <td className="px-10 py-7 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest whitespace-nowrap ${health.classes}`}>
                         {health.icon}
                         <span>{health.label}</span>
                      </div>
                    </td>

                    <td className="px-10 py-7">
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-slate-300" />
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                          {isFinishedGood ? (item.location || 'Showroom') : (item.location || 'Warehouse A')}
                        </span>
                      </div>
                    </td>

                    <td className="px-10 py-7 text-right">
                       <div className="flex flex-col">
                         <span className="text-[15px] font-black text-slate-900 tabular-nums">₱{itemValue.toLocaleString()}</span>
                         <span className="text-[10px] text-slate-400 font-bold uppercase">₱{unitCost.toLocaleString()}/unit</span>
                       </div>
                    </td>

                    <td className="px-10 py-7 text-right">
                      <div className="flex justify-end gap-2 items-center">
                        <button 
                          onClick={() => onMovement(item, 'in')}
                          className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all active:scale-95 border border-emerald-100 shadow-sm"
                          title="Stock In"
                        >
                          <Plus size={16} />
                        </button>
                        <button 
                          onClick={() => onMovement(item, 'out')}
                          className="h-10 w-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all active:scale-95 border border-rose-100 shadow-sm"
                          title="Stock Out"
                        >
                          <Minus size={16} />
                        </button>
                        
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveActionRow(activeActionRow === item.sku ? null : item.sku);
                            }}
                            className="h-10 w-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {activeActionRow === item.sku && (
                            <>
                              <div className="fixed inset-0 z-[60]" onClick={() => setActiveActionRow(null)}></div>
                              <div className="absolute bottom-full mb-2 right-0 z-[70] w-52 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 animate-in fade-in slide-in-from-bottom-2 duration-200 origin-bottom-right">
                                <button 
                                  onClick={() => { onViewItem(item); setActiveActionRow(null); }}
                                  className="w-full px-5 py-3 text-left text-[12px] font-black text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors uppercase tracking-widest"
                                >
                                  <Eye size={16} className="text-indigo-500" /> Inspect Asset
                                </button>
                                <button className="w-full px-5 py-3 text-left text-[12px] font-black text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors uppercase tracking-widest">
                                  <ClipboardList size={16} className="text-slate-400" /> Usage History
                                </button>
                                <div className="h-px bg-slate-100 my-2"></div>
                                <button className="w-full px-5 py-3 text-left text-[12px] font-black text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors uppercase tracking-widest">
                                  <Archive size={16} /> Decommission
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

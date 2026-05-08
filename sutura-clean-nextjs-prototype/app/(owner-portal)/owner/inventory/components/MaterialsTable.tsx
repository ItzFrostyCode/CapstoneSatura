'use client';

import React from 'react';
import { Search, MapPin, MoreVertical, Eye, ClipboardList, Archive, Inbox, ArrowRightLeft, CheckCircle, AlertTriangle, PackageX, Plus, Minus } from 'lucide-react';
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
      case 'Low Stock': return { label: 'Low', icon: <AlertTriangle size={12} />, classes: 'text-amber-600 bg-amber-50 border-amber-100' };
      case 'Out of Stock': return { label: 'Out', icon: <PackageX size={12} />, classes: 'text-rose-600 bg-rose-50 border-rose-100' };
      default: return { label: 'Unknown', icon: <Inbox size={12} />, classes: 'text-slate-400 bg-slate-50 border-slate-200' };
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-2 duration-500">
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
        <div>
          <p className="text-[12px] text-slate-500 italic font-medium">
            Master ledger for all fabrics, accessories, and finished garment styles.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10">
              <th className="px-6 py-4">Product Details</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4">Storage / Location</th>
              <th className="px-6 py-4 text-right">Value</th>
              <th className="px-6 py-4">Last Audit</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {materials.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                      <Inbox size={24} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[14px] font-bold text-slate-900">No records found</p>
                      <p className="text-[12px] text-slate-500 font-medium">Add a new item or adjust your filters.</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              materials.map((item) => {
                const isFinishedGood = item.cat === 'Finished Goods' || item.item_type === 'FINISHED_GOOD';
                const health = getHealthBadge(getStatus(item));
                const itemValue = (item.stock || 0) * (item.unit_cost || 1850); // Mocking cost for demo

                return (
                  <tr key={item.sku} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-6 py-3">
                      <div className="flex flex-col">
                        <span className="text-[14px] font-black text-slate-900">{item.item || item.item_name}</span>
                        <span className="text-[11px] font-bold text-slate-400">{item.sku}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-3 text-center">
                      <div className="inline-flex flex-col items-center">
                         <span className="text-[15px] font-black text-slate-900 leading-none">{formatStock(item.stock || 0)}</span>
                         <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{item.unit || item.unit_of_measure}</span>
                      </div>
                    </td>

                    <td className="px-6 py-3 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-tight ${health.classes}`}>
                         {health.icon}
                         <span>{health.label}</span>
                      </div>
                    </td>

                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-slate-300" />
                        <span className="text-[12px] font-bold text-slate-600 uppercase tracking-tight">
                          {isFinishedGood ? (item.location || 'Showroom') : (item.location || 'Warehouse A')}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-3 text-right">
                      <span className="text-[14px] font-black text-slate-900">₱{itemValue.toLocaleString()}</span>
                    </td>

                    <td className="px-6 py-3">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-slate-900">May 08, 2026</span>
                        <span className="text-[10px] text-slate-400 font-medium italic">by {isFinishedGood ? 'Production' : 'Stock In'}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right pr-10">
                      <div className="flex justify-end gap-2 items-center relative">
                        <button 
                          onClick={() => onMovement(item, 'in')}
                          className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all active:scale-95 border border-emerald-100 shadow-sm"
                          title="Stock In / Add"
                        >
                          <Plus size={16} />
                        </button>
                        <button 
                          onClick={() => onMovement(item, 'out')}
                          className="w-9 h-9 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all active:scale-95 border border-rose-100 shadow-sm"
                          title={isFinishedGood ? "Instant Sale" : "Stock Out"}
                        >
                          <Minus size={16} />
                        </button>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveActionRow(activeActionRow === item.sku ? null : item.sku);
                          }}
                          className="h-9 w-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-200"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {activeActionRow === item.sku && (
                          <>
                            <div className="fixed inset-0 z-[60]" onClick={() => setActiveActionRow(null)}></div>
                            <div className="absolute top-full mt-2 right-0 z-[70] w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                              <button 
                                onClick={() => { onViewItem(item); setActiveActionRow(null); }}
                                className="w-full px-4 py-2 text-left text-[13px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Eye size={16} className="text-slate-400" /> View Details
                              </button>
                              <button className="w-full px-4 py-2 text-left text-[13px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                                <ClipboardList size={16} className="text-slate-400" /> Tailoring History
                              </button>
                              <div className="h-px bg-slate-100 my-2"></div>
                              <button className="w-full px-4 py-2 text-left text-[13px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                                <Archive size={16} /> Archive Product
                              </button>
                            </div>
                          </>
                        )}
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

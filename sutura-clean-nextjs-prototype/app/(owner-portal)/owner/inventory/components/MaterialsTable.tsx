'use client';

import React from 'react';
import { Search, MapPin, MoreVertical, Eye, ClipboardList, Archive, Inbox, ArrowRightLeft } from 'lucide-react';
import { InventoryItem, Supplier } from '@/store/useERPStore';

interface MaterialsTableProps {
  materials: InventoryItem[];
  suppliers: Supplier[];
  onViewItem: (item: InventoryItem) => void;
  onMovement: (item: InventoryItem) => void;
  renderAvatar: (name: string, size?: number, imageUrl?: string) => React.ReactNode;
  activeActionRow: string | null;
  setActiveActionRow: (id: string | null) => void;
}

export function MaterialsTable({ 
  materials, 
  suppliers, 
  onViewItem, 
  onMovement, 
  renderAvatar,
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

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'In Stock': return { label: 'Healthy', classes: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500' };
      case 'Low Stock': return { label: 'Low', classes: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500' };
      case 'Out of Stock': return { label: 'Critical', classes: 'bg-rose-50 text-rose-700 border-rose-100', dot: 'bg-rose-500' };
      default: return { label: 'Unknown', classes: 'bg-slate-100 text-slate-600 border-slate-200', dot: 'bg-slate-500' };
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-2 duration-500">
      <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[12px] text-slate-500 italic font-medium">Fabrics, threads, and accessory master records.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
              <th className="px-6 py-4">Item Details</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Primary Supplier</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {materials.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
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
                const health = getHealthBadge(getStatus(item));
                return (
                  <tr key={item.sku} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-5">
                      <div 
                        className="flex items-center gap-4 cursor-pointer group/item"
                        onClick={() => onViewItem(item)}
                      >
                        {renderAvatar(item.item || item.item_name || '', 44, item.image)}
                        <div>
                          <div className="text-[15px] font-bold text-slate-900 leading-none mb-1 group-hover/item:text-indigo-600 transition-colors">{item.item || item.item_name}</div>
                          <div className="flex items-center gap-2">
                            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{item.sku}</div>
                            {item.location && (
                              <div className="flex items-center gap-1 text-[9px] font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-widest border border-slate-200/50">
                                <MapPin size={10} /> {item.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/50 uppercase tracking-wide">
                         {item.cat || item.category}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[13px] font-bold text-indigo-600/80">{item.supplier_id ? suppliers.find(s => s.id === item.supplier_id)?.name || 'Unlinked' : 'Unlinked'}</span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/60 shadow-sm">
                         <span className="text-[14px] font-black text-slate-900">{item.stock}</span>
                         <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.unit || item.unit_of_measure}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${health.classes}`}>
                         <div className={`w-1.5 h-1.5 rounded-full ${health.dot}`} />
                         {health.label}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 relative">
                        <button 
                          onClick={() => onMovement(item)}
                          className="h-8 px-4 rounded-full bg-slate-900 text-white text-[11px] font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                        >
                          <ArrowRightLeft size={12} /> Movement
                        </button>
                        
                        <button 
                          onClick={() => setActiveActionRow(activeActionRow === item.sku ? null : item.sku)}
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {activeActionRow === item.sku && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveActionRow(null)}></div>
                            <div className="absolute top-10 right-0 z-20 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                              <button 
                                onClick={() => { onViewItem(item); setActiveActionRow(null); }}
                                className="w-full px-4 py-2 text-left text-[13px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Eye size={14} /> View Details
                              </button>
                              <div className="h-px bg-slate-100 my-1"></div>
                              <button className="w-full px-4 py-2 text-left text-[13px] font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                                <Archive size={14} /> Archive Item
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

'use client';

import React from 'react';
import { MapPin, PackageCheck, MoreVertical, Eye, Archive, Package, ArrowRightLeft } from 'lucide-react';
import { InventoryItem } from '@/store/useERPStore';

interface FinishedGoodsTableProps {
  finishedGoods: InventoryItem[];
  onViewItem: (item: InventoryItem) => void;
  onOpenBatchRelease: () => void;
  onMovement: (item: InventoryItem) => void;
  batchCartCount: number;
  renderAvatar: (name: string, size?: number, imageUrl?: string) => React.ReactNode;
  activeActionRow: string | null;
  setActiveActionRow: (id: string | null) => void;
}

export function FinishedGoodsTable({
  finishedGoods,
  onViewItem,
  onOpenBatchRelease,
  onMovement,
  batchCartCount,
  renderAvatar,
  activeActionRow,
  setActiveActionRow
}: FinishedGoodsTableProps) {

  const formatCurrency = (n: number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n);
  };

  return (
    <div className="animate-in slide-in-from-bottom-2 duration-500">
      <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[12px] text-slate-500 italic font-medium">Assembled products ready for batch release or movement.</p>
        </div>
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={onOpenBatchRelease}
            className="h-10 px-6 bg-emerald-600 text-white rounded-full text-[12px] font-black shadow-lg shadow-emerald-600/10 hover:bg-emerald-700 transition-all flex items-center gap-2 active:scale-95 relative"
          >
            <PackageCheck size={14} /> Batch Release
            {batchCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in duration-300">
                {batchCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
              <th className="px-6 py-4">Product Details</th>
              <th className="px-6 py-4 text-center">Stock Level</th>
              <th className="px-6 py-4">Location</th>
              <th className="px-6 py-4 text-center">Inventory Value</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {finishedGoods.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-900">No products found</p>
                      <p className="text-[12px] text-slate-500 font-medium">Use the Production tab to assemble items.</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              finishedGoods.map((item) => (
                <tr key={item.sku} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4 cursor-pointer group/item" onClick={() => onViewItem(item)}>
                      {renderAvatar(item.item || item.item_name || '', 48, item.image)}
                      <div>
                         <div className="text-[15px] font-black text-slate-900 leading-none mb-1 group-hover/item:text-indigo-600 transition-colors">{item.item || item.item_name}</div>
                         <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">{item.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100/50 border border-slate-200/60 shadow-sm">
                       <span className="text-[15px] font-black text-slate-900">{item.stock}</span>
                       <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{item.unit || item.unit_of_measure}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <div className="flex items-center gap-2 text-[13px] font-bold text-slate-600">
                        <MapPin size={14} className="text-indigo-400" />
                        {item.location || 'N/A'}
                     </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                     <span className="text-[14px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                        {formatCurrency((item.price || item.unit_price || 0) * (item.stock || 0))}
                     </span>
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
                        className="h-10 w-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeActionRow === item.sku && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveActionRow(null)}></div>
                          <div className="absolute top-12 right-0 z-20 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                             <button onClick={() => { onViewItem(item); setActiveActionRow(null); }} className="w-full px-4 py-2 text-left text-[13px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Eye size={14} /> View Details</button>
                             <div className="h-px bg-slate-100 my-1"></div>
                             <button className="w-full px-4 py-2 text-left text-[13px] font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"><Archive size={14} /> Archive Item</button>
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

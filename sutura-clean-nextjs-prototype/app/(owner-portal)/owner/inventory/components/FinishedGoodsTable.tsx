'use client';

import React from 'react';
import { PackageCheck, MoreVertical, Eye, Archive, Package, CheckCircle, AlertTriangle, PackageX, Plus, Minus } from 'lucide-react';
import { InventoryItem } from '@/store/useERPStore';

interface FinishedGoodsTableProps {
  finishedGoods: InventoryItem[];
  onViewItem: (item: InventoryItem) => void;
  onOpenBatchRelease: () => void;
  onMovement: (item: InventoryItem, mode: 'in' | 'out') => void;
  onToggleBatchItem: (item: InventoryItem) => void;
  batchCart: InventoryItem[];
  batchCartCount: number;
  activeActionRow: string | null;
  setActiveActionRow: (id: string | null) => void;
}

export function FinishedGoodsTable({
  finishedGoods,
  onViewItem,
  onOpenBatchRelease,
  onMovement,
  onToggleBatchItem,
  batchCart,
  batchCartCount,
  activeActionRow,
  setActiveActionRow
}: FinishedGoodsTableProps) {

  const formatCurrency = (n: number) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(n);
  };

  const formatStock = (stock: number) => {
    if (stock >= 1000000) return `${(stock / 1000000).toFixed(1)}M`;
    if (stock >= 10000) return `${(stock / 1000).toFixed(1)}k`;
    return stock.toLocaleString();
  };

  const getStatus = (item: InventoryItem) => {
    const stock = item.stock || 0;
    const minStock = item.reorder_level || 0;
    if (stock <= 0) return 'Out of Stock';
    if (stock <= minStock) return 'Low Stock';
    return 'In Stock';
  };

  const getHealthBadge = (status: string) => {
    switch (status) {
      case 'In Stock': return { label: 'Available', icon: <CheckCircle size={12} />, classes: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
      case 'Low Stock': return { label: 'Low', icon: <AlertTriangle size={12} />, classes: 'text-amber-600 bg-amber-50 border-amber-100' };
      case 'Out of Stock': return { label: 'Out', icon: <PackageX size={12} />, classes: 'text-rose-600 bg-rose-50 border-rose-100' };
      default: return { label: 'Unknown', icon: <Package size={12} />, classes: 'text-slate-400 bg-slate-50 border-slate-200' };
    }
  };

  return (
    <div className="animate-in slide-in-from-bottom-2 duration-500">
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[12px] text-slate-500 italic font-medium">Assembled products ready for batch release or movement.</p>
        </div>
        <div className="flex items-center gap-3 relative">
          <button 
            onClick={onOpenBatchRelease}
            className={`h-10 px-6 rounded-full text-[12px] font-black shadow-lg transition-all flex items-center gap-2 active:scale-95 relative ${
              batchCartCount > 0 
                ? 'bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-700' 
                : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 shadow-none'
            }`}
          >
            <PackageCheck size={14} /> Customer Release
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
              <th className="px-6 py-2.5">Product Details</th>
              <th className="px-6 py-2.5 text-center">Stock</th>
              <th className="px-6 py-2.5 text-center">Status</th>
              <th className="px-6 py-2.5">Storage</th>
              <th className="px-6 py-2.5 text-center">Value</th>
              <th className="px-6 py-2.5">Last Audit</th>
              <th className="px-6 py-2.5 text-right">Actions</th>
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
                    <td className="px-6 py-2">
                      <div className="flex flex-col cursor-pointer group/item" onClick={() => onViewItem(item)}>
                         <div className="text-[13px] font-black text-slate-900 leading-tight group-hover/item:text-indigo-600 transition-colors">{item.item || item.item_name}</div>
                         <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.sku}</div>
                      </div>
                    </td>
                    <td className="px-6 py-2 text-center">
                      <div className="inline-flex flex-col items-center">
                         <span className="text-[13px] font-black text-slate-900 leading-none">{formatStock(item.stock || 0)}</span>
                         <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{item.unit || item.unit_of_measure}</span>
                      </div>
                    </td>
                    <td className="px-6 py-2 text-center">
                      {(() => {
                        const health = getHealthBadge(getStatus(item));
                        return (
                          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[10px] font-black uppercase tracking-tight ${health.classes}`}>
                             {health.icon}
                             <span>{health.label}</span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-2">
                       <div className="text-[12px] font-bold text-slate-600 uppercase tracking-tight">
                          {item.location || 'N/A'}
                       </div>
                    </td>
                    <td className="px-6 py-2 text-center">
                       <span className="text-[12px] font-black text-emerald-600">
                          {formatCurrency((item.price || item.unit_price || 0) * (item.stock || 0))}
                       </span>
                    </td>
                    <td className="px-6 py-2">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-medium text-slate-400">May 08, 2026</span>
                        <span className="text-[9px] text-slate-300 font-medium italic">by Production</span>
                      </div>
                    </td>
                  <td className="px-6 py-2 text-right">
                    <div className="flex items-center justify-end gap-2 relative">
                      <button 
                        onClick={() => onToggleBatchItem(item)}
                        className={`h-8 px-3 rounded-lg text-[11px] font-bold transition-all active:scale-95 flex items-center gap-1.5 ${
                          batchCart.find(i => i.sku === item.sku)
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {batchCart.find(i => i.sku === item.sku) ? <PackageCheck size={12} /> : <Plus size={12} />}
                        {batchCart.find(i => i.sku === item.sku) ? 'Added' : 'Add to Order'}
                      </button>
                      <div className="flex justify-end gap-2 items-center">
                        <button 
                          onClick={() => onMovement(item, 'in')}
                          className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all active:scale-95 border border-emerald-100 shadow-sm"
                          title="Stock Add"
                        >
                          <Plus size={14} />
                        </button>
                        <button 
                          onClick={() => onMovement(item, 'out')}
                          className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all active:scale-95 border border-rose-100 shadow-sm"
                          title="Instant Sale"
                        >
                          <Minus size={14} />
                        </button>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionRow(activeActionRow === item.sku ? null : item.sku);
                        }}
                        className="h-10 w-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeActionRow === item.sku && (
                        <>
                          <div className="fixed inset-0 z-60" onClick={() => setActiveActionRow(null)}></div>
                          <div className="absolute top-full mt-2 right-0 z-70 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                             <button onClick={(e) => { e.stopPropagation(); onViewItem(item); setActiveActionRow(null); }} className="w-full px-4 py-2 text-left text-[13px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"><Eye size={14} /> View Details</button>
                             <div className="h-px bg-slate-100 my-1"></div>
                             <button className="w-full px-4 py-2 text-left text-[13px] font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2" onClick={(e) => e.stopPropagation()}><Archive size={14} /> Archive Item</button>
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

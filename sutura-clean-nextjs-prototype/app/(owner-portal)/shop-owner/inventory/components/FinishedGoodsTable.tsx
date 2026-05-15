'use client';

import React from 'react';
import { PackageCheck, MoreVertical, Eye, Archive, Package, CheckCircle, AlertTriangle, PackageX, Plus, Minus, History, Box, ChevronRight, Share2, Globe, ChevronDown } from 'lucide-react';
import { InventoryItem } from '@/store/useERPStore';

interface FinishedGoodsTableProps {
  finishedGoods: InventoryItem[];
  onViewItem: (item: InventoryItem) => void;
  onOpenBatchRelease: () => void;
  onMovement: (item: InventoryItem, mode: 'in' | 'out') => void;
  onToggleBatchItem: (item: InventoryItem) => void;
  batchCart: InventoryItem[];
  batchCartCount: number;
  onPostToShop?: (item: InventoryItem) => void;
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
  onPostToShop,
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
      case 'Low Stock': return { label: 'Low Stock', icon: <AlertTriangle size={12} />, classes: 'text-amber-600 bg-amber-50 border-amber-100' };
      case 'Out of Stock': return { label: 'Out of Stock', icon: <PackageX size={12} />, classes: 'text-rose-600 bg-rose-50 border-rose-100' };
      default: return { label: 'Unknown', icon: <Package size={12} />, classes: 'text-slate-400 bg-slate-50 border-slate-200' };
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Table Action Header */}
      <div className="px-10 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50">
        <div>
          <p className="text-[12px] text-slate-500 italic font-medium">Assembled products ready for batch release or immediate customer sale.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenBatchRelease}
            className={`h-10 px-6 rounded-xl text-[12px] font-black shadow-sm transition-all flex items-center gap-2 active:scale-95 relative group ${
              batchCartCount > 0 
                ? 'bg-slate-900 text-white border border-slate-900' 
                : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 shadow-none'
            }`}
          >
            <PackageCheck size={16} /> <span className="uppercase tracking-widest">Batch Release Protocol</span>
            {batchCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in duration-300 shadow-sm">
                {batchCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-10 py-5 bg-slate-50/50 rounded-tl-[32px]">
                <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                  Finished Good Style <ChevronDown size={12} className="text-slate-300" />
                </div>
              </th>
              <th className="px-10 py-5 bg-slate-50/50 text-center">
                <div className="flex items-center justify-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                  In-Stock <ChevronDown size={12} className="text-slate-300" />
                </div>
              </th>
              <th className="px-10 py-5 bg-slate-50/50 text-center">
                <div className="flex items-center justify-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                  Status <ChevronDown size={12} className="text-slate-300" />
                </div>
              </th>
              <th className="px-10 py-5 bg-slate-50/50">
                <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                  Storage <ChevronDown size={12} className="text-slate-300" />
                </div>
              </th>
              <th className="px-10 py-5 bg-slate-50/50 text-right">
                <div className="flex items-center justify-end gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                  Retail Value <ChevronDown size={12} className="text-slate-300" />
                </div>
              </th>
              <th className="px-10 py-5 bg-slate-50/50 text-right pr-10 rounded-tr-[32px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {finishedGoods.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-10 py-24 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                      <Box size={32} />
                    </div>
                    <div className="text-[14px] font-bold text-slate-400 italic">No finished goods found. Use Production to assemble items.</div>
                  </div>
                </td>
              </tr>
            ) : (
              finishedGoods.map((item) => {
                const health = getHealthBadge(getStatus(item));
                const retailValue = (item.price || item.unit_price || 0) * (item.stock || 0);

                return (
                  <tr key={item.sku} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-[18px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                          <Package size={20} />
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
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                          {item.location || 'Showroom Floor'}
                        </span>
                      </div>
                    </td>

                    <td className="px-10 py-7 text-right">
                       <div className="flex flex-col">
                         <span className="text-[15px] font-black text-emerald-600 tabular-nums">₱{retailValue.toLocaleString()}</span>
                         <span className="text-[10px] text-slate-400 font-bold uppercase">₱{(item.price || item.unit_price || 0).toLocaleString()}/unit</span>
                       </div>
                    </td>

                    <td className="px-10 py-7 text-right">
                      <div className="flex justify-end gap-2 items-center">
                        <button 
                          onClick={() => onToggleBatchItem(item)}
                          className={`h-10 px-4 rounded-xl text-[11px] font-black transition-all active:scale-95 flex items-center gap-2 border shadow-sm ${
                            batchCart.find(i => i.sku === item.sku)
                              ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {batchCart.find(i => i.sku === item.sku) ? <CheckCircle size={14} /> : <Plus size={14} />}
                          <span className="uppercase tracking-widest">{batchCart.find(i => i.sku === item.sku) ? 'Added to Release' : 'Add to Release'}</span>
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
                              <div className="absolute top-full mt-2 right-0 z-[100] w-52 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right text-left">
                                <button 
                                  onClick={() => { onViewItem(item); setActiveActionRow(null); }}
                                  className="w-full px-5 py-3 text-left text-[12px] font-black text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors uppercase tracking-widest"
                                >
                                  <Eye size={16} className="text-indigo-500" /> Style Details
                                </button>
                                  <button 
                                    onClick={() => { onMovement(item, 'in'); setActiveActionRow(null); }}
                                    className="w-full px-5 py-3 text-left text-[12px] font-black text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors uppercase tracking-widest"
                                  >
                                    <History size={16} className="text-slate-400" /> Production Log
                                  </button>
                                  <div className="h-px bg-slate-100 my-2"></div>
                                  <button 
                                    onClick={() => { onPostToShop?.(item); setActiveActionRow(null); }}
                                    className="w-full px-5 py-3 text-left text-[12px] font-black text-emerald-600 hover:bg-emerald-50 flex items-center gap-3 transition-colors uppercase tracking-widest"
                                  >
                                    <Globe size={16} /> Post to Shop
                                  </button>
                                  <button className="w-full px-5 py-3 text-left text-[12px] font-black text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors uppercase tracking-widest">
                                    <Archive size={16} /> Mark Defective
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
  );
}

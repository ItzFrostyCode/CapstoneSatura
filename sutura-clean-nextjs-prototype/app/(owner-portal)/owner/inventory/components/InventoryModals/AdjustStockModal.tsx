'use client';

import React from 'react';
import { X, ClipboardList, TrendingDown } from 'lucide-react';
import { InventoryItem } from '@/store/useERPStore';

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  adjustForm: { qty: number; reason: string };
  setAdjustForm: React.Dispatch<React.SetStateAction<{ qty: number; reason: string }>>;
  onSave: () => void;
  renderAvatar: (name: string, size?: number, imageUrl?: string) => React.ReactNode;
}

export function AdjustStockModal({
  isOpen,
  onClose,
  item,
  adjustForm,
  setAdjustForm,
  onSave,
  renderAvatar
}: AdjustStockModalProps) {

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[400px] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
              <ClipboardList size={18} />
            </div>
            <h2 className="text-[16px] font-black text-slate-900">Manual Stock Adjustment</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
             {renderAvatar(item.item || item.item_name || '', 48, item.image)}
             <div>
                <p className="text-[14px] font-black text-slate-900">{item.item || item.item_name}</p>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{item.sku}</p>
             </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Deduction Quantity ({item.unit})</label>
              <div className="relative">
                 <input
                   type="number"
                   value={adjustForm.qty || ''}
                   onChange={e => setAdjustForm(p => ({...p, qty: Number(e.target.value)}))}
                   max={item.stock || 0}
                   className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white focus:border-rose-500 outline-none transition-all text-[18px] font-black text-rose-600 pl-10"
                   placeholder="0"
                 />
                 <TrendingDown size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" />
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-black text-slate-400">MAX: {item.stock || 0}</div>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Adjustment Reason</label>
              <select
                value={adjustForm.reason}
                onChange={e => setAdjustForm(p => ({...p, reason: e.target.value}))}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all text-[13px] font-bold appearance-none cursor-pointer"
              >
                <option value="Damaged Material">Damaged / Defective</option>
                <option value="Inventory Count Correction">Count Correction</option>
                <option value="Sample Usage">Sample Usage</option>
                <option value="Rework Deduction">Rework Deduction</option>
                <option value="Expired Stock">Expired Stock</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 h-10 bg-white border border-slate-200 rounded-full text-[13px] font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
          <button 
            onClick={onSave}
            disabled={!adjustForm.qty || adjustForm.qty <= 0 || adjustForm.qty > (item.stock || 0)}
            className="px-6 h-10 bg-amber-600 text-white rounded-full font-black text-[13px] hover:bg-amber-700 transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            <ClipboardList size={16} /> Confirm Deduction
          </button>
        </div>
      </div>
    </div>
  );
}

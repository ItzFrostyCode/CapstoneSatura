'use client';

import React from 'react';
import { X, Inbox, ArrowUpRight } from 'lucide-react';
import { InventoryItem } from '@/store/useERPStore';

interface StockInModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  stockInForm: { qty: number; supplier: string; cost: number };
  setStockInForm: React.Dispatch<React.SetStateAction<{ qty: number; supplier: string; cost: number }>>;
  onSave: () => void;
  renderAvatar: (name: string, size?: number, imageUrl?: string) => React.ReactNode;
}

export function StockInModal({
  isOpen,
  onClose,
  item,
  stockInForm,
  setStockInForm,
  onSave,
  renderAvatar
}: StockInModalProps) {

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[420px] h-full md:h-auto md:max-h-[90vh] overflow-hidden md:rounded-2xl rounded-none shadow-2xl border-x md:border border-slate-200 animate-in zoom-in-95 duration-300 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
              <Inbox size={18} />
            </div>
            <div>
              <h2 className="text-[16px] font-black text-slate-900 leading-tight">Receiving Report</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Inventory In-take Slip</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
          {/* Item Header */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
             {renderAvatar(item.item || item.item_name || '', 48, item.image)}
             <div>
                <p className="text-[14px] font-black text-slate-900">{item.item || item.item_name}</p>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{item.sku}</p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Reference # (DR/Invoice)</label>
              <input
                type="text"
                placeholder="e.g. DR-8821"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Supplier Name</label>
              <input
                type="text"
                value={stockInForm.supplier || ''}
                onChange={e => setStockInForm(p => ({...p, supplier: e.target.value}))}
                placeholder="e.g. Textile Corp"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Quantity ({item.unit})</label>
              <input
                type="number"
                value={stockInForm.qty || ''}
                onChange={e => setStockInForm(p => ({...p, qty: Number(e.target.value)}))}
                onFocus={e => e.target.select()}
                className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-black"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Unit Cost</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-[12px]">₱</span>
                <input
                  type="number"
                  value={stockInForm.cost || ''}
                  onChange={e => setStockInForm(p => ({...p, cost: Number(e.target.value)}))}
                  onFocus={e => e.target.select()}
                  className="w-full h-11 pl-7 pr-4 rounded-xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-black"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Received By (Staff)</label>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-bold"
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 h-10 bg-white border border-slate-200 rounded-full text-[13px] font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
          <button 
            onClick={onSave}
            disabled={!stockInForm.qty || stockInForm.qty <= 0}
            className="px-6 h-12 bg-slate-900 text-white rounded-2xl font-black text-[13px] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2 disabled:opacity-50 active:scale-95"
          >
            <ArrowUpRight size={16} /> Finalize Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

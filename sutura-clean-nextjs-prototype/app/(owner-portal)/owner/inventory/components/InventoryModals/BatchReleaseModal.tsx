'use client';

import React from 'react';
import { X, PackageCheck, Info, User, CheckCircle2, ChevronRight, ArrowUpRight } from 'lucide-react';
import { InventoryItem, Customer } from '@/store/useERPStore';

interface BatchReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  batchReleaseStep: number;
  setBatchReleaseStep: (step: number) => void;
  batchReleaseJobOrder: string;
  setBatchReleaseJobOrder: (jo: string) => void;
  batchReleaseCustomerId: string;
  setBatchReleaseCustomerId: (id: string) => void;
  batchReleasePayment: string;
  setBatchReleasePayment: (p: string) => void;
  batchCart: InventoryItem[];
  customers: Customer[];
  onConfirm: () => void;
  renderAvatar: (name: string, size?: number, imageUrl?: string) => React.ReactNode;
}

export function BatchReleaseModal({
  isOpen,
  onClose,
  batchReleaseStep,
  setBatchReleaseStep,
  batchReleaseJobOrder,
  setBatchReleaseJobOrder,
  batchReleaseCustomerId,
  setBatchReleaseCustomerId,
  batchReleasePayment,
  setBatchReleasePayment,
  batchCart,
  customers,
  onConfirm,
  renderAvatar
}: BatchReleaseModalProps) {

  if (!isOpen) return null;

  const totalValuation = batchCart.reduce((sum, i) => sum + (i.price || 0) * (i.stock || 0), 0);
  const totalUnits = batchCart.reduce((sum, i) => sum + (i.stock || 0), 0);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[650px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30 shrink-0">
          <div>
            <h2 className="text-[22px] font-black text-slate-900 tracking-tight">Batch Product Release</h2>
            <p className="text-[14px] text-slate-500 font-medium">Issue Job Orders and release finished goods to clients.</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 space-y-8">
           {/* Summary Section */}
           <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[24px]">
                 <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-1">Total Release Units</p>
                 <p className="text-[28px] font-black text-emerald-700">{totalUnits} Units</p>
              </div>
              <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[24px]">
                 <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-1">Release Valuation</p>
                 <p className="text-[28px] font-black text-indigo-700">₱{totalValuation.toLocaleString()}</p>
              </div>
           </div>

           {/* Workflow Stepper */}
           <div className="space-y-6">
              <div className="flex items-center gap-2">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[14px] ${batchReleaseStep >= 1 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>1</div>
                 <h3 className="text-[15px] font-black text-slate-900">Client & Job Order Details</h3>
              </div>

              {batchReleaseStep === 1 && (
                 <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="col-span-2">
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Client / Customer *</label>
                       <select 
                         value={batchReleaseCustomerId}
                         onChange={e => setBatchReleaseCustomerId(e.target.value)}
                         className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[15px] font-bold appearance-none"
                       >
                          <option value="" disabled>Select Customer</option>
                          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                       </select>
                    </div>
                    <div>
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Job Order Number</label>
                       <input 
                         type="text" 
                         value={batchReleaseJobOrder}
                         onChange={e => setBatchReleaseJobOrder(e.target.value)}
                         placeholder="e.g. JO-2024-001" 
                         className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[15px] font-bold" 
                       />
                    </div>
                    <div>
                       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Payment Status</label>
                       <select 
                         value={batchReleasePayment}
                         onChange={e => setBatchReleasePayment(e.target.value)}
                         className="w-full h-14 px-5 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[15px] font-bold appearance-none"
                       >
                          <option value="Paid">Fully Paid</option>
                          <option value="Partially Paid">Partially Paid</option>
                          <option value="Unpaid">Unpaid / Bill Later</option>
                       </select>
                    </div>
                 </div>
              )}

              <div className="flex items-center gap-2">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[14px] ${batchReleaseStep >= 2 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>2</div>
                 <h3 className="text-[15px] font-black text-slate-900">Review Items for Release</h3>
              </div>

              <div className="space-y-3">
                 {batchCart.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-[20px] shadow-sm">
                       <div className="flex items-center gap-3">
                          {renderAvatar(item.item || item.item_name || '', 40, item.image)}
                          <div>
                             <p className="text-[14px] font-bold text-slate-900">{item.item || item.item_name}</p>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.sku}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[16px] font-black text-slate-900">{item.stock} Units</p>
                          <p className="text-[11px] font-bold text-emerald-600">₱{((item.price || 0) * (item.stock || 0)).toLocaleString()}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

           <div className="p-6 bg-amber-50 border border-amber-100 rounded-[24px] flex gap-4">
              <Info size={24} className="text-amber-600 shrink-0" />
              <p className="text-[13px] text-amber-900/80 font-medium leading-relaxed">
                 Confirming this release will immediately deduct these units from the inventory and create a sales log entry linked to the customer.
              </p>
           </div>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 h-12 bg-white border border-slate-200 rounded-full text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
          <button 
            onClick={onConfirm}
            disabled={!batchReleaseCustomerId || !batchReleaseJobOrder.trim()}
            className="px-8 h-12 bg-emerald-600 text-white rounded-full text-[14px] font-black shadow-lg shadow-emerald-600/10 hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center gap-2 active:scale-95"
          >
            <ArrowUpRight size={18} /> Confirm Batch Release
          </button>
        </div>
      </div>
    </div>
  );
}

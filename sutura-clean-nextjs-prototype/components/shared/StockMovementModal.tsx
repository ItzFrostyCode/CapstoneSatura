'use client';

import React, { useState, useMemo } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, AlertCircle, HelpCircle, CheckCircle2, ChevronRight, ChevronDown, ArrowRight } from 'lucide-react';
import { InventoryItem, MovementType, MovementReferenceType } from '@/types/erp';
import { LucideIcon } from 'lucide-react';
import { useERPStore } from '@/store/useERPStore';

export interface StockMovementData {
  type: MovementType;
  itemSku: string;
  qty: number;
  unitCost: number;
  referenceType: string;
  referenceId: string;
  notes: string;
  timestamp: string;
  performedBy: string;
}

interface StockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  onConfirm: (data: StockMovementData) => void;
  initialItem?: InventoryItem | null;
  mode: 'in' | 'out';
  renderAvatar: (name: string, size?: number, imageUrl?: string) => React.ReactNode;
}

type Step = 'form' | 'preview';

const MOVEMENT_TYPES: { value: MovementType; label: string; icon: LucideIcon; color: string; description: string }[] = [
  { value: 'RECEIVE', label: 'Stock Reception', icon: ArrowDownLeft, color: 'emerald', description: 'Restocking, supplier delivery, or initial stock.' },
  { value: 'ISSUE', label: 'Stock Issue', icon: ArrowUpRight, color: 'rose', description: 'Used for production or general reduction.' },
  { value: 'ADJUSTMENT_IN', label: 'Inventory Correction (+)', icon: ArrowDownLeft, color: 'amber', description: 'Correction (increase).' },
  { value: 'ADJUSTMENT_OUT', label: 'Inventory Correction (-)', icon: ArrowUpRight, color: 'amber', description: 'Correction (decrease).' },
  { value: 'DAMAGE', label: 'Damage / Loss', icon: AlertCircle, color: 'rose', description: 'Damaged materials or missing items.' },
];

const REF_TYPES = ['PO', 'JO', 'Manual', 'Transfer', 'Damage Report', 'Inventory Count'];

export function StockMovementModal({ isOpen, onClose, inventory, onConfirm, initialItem, mode, renderAvatar }: StockMovementModalProps) {
  const { currentUser } = useERPStore();
  const [step, setStep] = useState<Step>('form');
  const isFinishedGood = initialItem?.cat === 'Finished Goods' || initialItem?.item_type === 'FINISHED_GOOD';

  const [form, setForm] = useState({
    type: (mode === 'in' ? 'RECEIVE' : 'ISSUE') as MovementType,
    itemSku: initialItem?.sku || '',
    qty: 0,
    unitCost: 0,
    referenceType: isFinishedGood ? 'JO' : 'Manual',
    referenceId: '',
    notes: ''
  });

  const selectedItem = useMemo(() => inventory.find(i => i.sku === form.itemSku), [inventory, form.itemSku]);
  const movementTypeInfo = useMemo(() => MOVEMENT_TYPES.find(t => t.value === form.type), [form.type]);

  React.useEffect(() => {
    if (isOpen) {
      setForm({
        type: (mode === 'in' ? 'RECEIVE' : 'ISSUE') as MovementType,
        itemSku: initialItem?.sku || '',
        qty: 0,
        unitCost: 0,
        referenceType: (initialItem?.cat === 'Finished Goods' || initialItem?.item_type === 'FINISHED_GOOD') ? 'JO' : 'Manual',
        referenceId: '',
        notes: ''
      });
      setStep('form');
    }
  }, [isOpen, initialItem, mode]);

  if (!isOpen) return null;

  const handleNext = () => setStep('preview');
  const handleBack = () => setStep('form');

  const handleConfirm = () => {
    onConfirm({
      ...form,
      timestamp: new Date().toISOString(),
      performedBy: currentUser?.name || 'Staff Member'
    });
    onClose();
  };

  const isPositive = form.type === 'RECEIVE' || form.type === 'ADJUSTMENT_IN';

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[600px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-[20px] font-black text-slate-900 tracking-tight flex items-center gap-2">
              {isPositive ? (
                <> <ArrowDownLeft className="text-emerald-500" size={24} /> Add Stock Ledger </>
              ) : (
                <> <ArrowUpRight className="text-rose-500" size={24} /> Subtract Stock Ledger </>
              )}
            </h2>
            <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              Audit-Ready Entry for <span className="text-slate-900">{initialItem?.item || initialItem?.item_name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 hover:text-slate-900 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {step === 'form' ? (
          <div className="p-8 space-y-5">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Update Mode</label>
                <div className="relative">
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value as MovementType })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-[12px] font-black text-slate-700 outline-none focus:border-indigo-600 appearance-none cursor-pointer"
                  >
                    {mode === 'in' ? (
                      <>
                        <option value="RECEIVE">Stock Reception (In)</option>
                        <option value="ADJUSTMENT_IN">Adjustment (Increase)</option>
                      </>
                    ) : (
                      <>
                        <option value="ISSUE">Stock Issue (Out)</option>
                        <option value="DAMAGE">Damage / Loss</option>
                        <option value="ADJUSTMENT_OUT">Adjustment (Decrease)</option>
                      </>
                    )}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={14} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Current On-Hand</label>
                <div className="h-10 flex items-center px-3 bg-white rounded-lg border border-slate-200 text-[14px] font-black text-slate-900">
                  {initialItem?.stock} <span className="ml-1 text-[10px] text-slate-400 font-bold uppercase">{initialItem?.unit}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Quantity to {isPositive ? 'Add' : 'Remove'}</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={form.qty || ''}
                    onChange={e => setForm({ ...form, qty: Number(e.target.value) })}
                    onFocus={e => e.target.select()}
                    placeholder="0.00"
                    className="w-full h-12 px-4 rounded-xl border-2 border-slate-100 bg-white focus:border-slate-900 outline-none transition-all text-[18px] font-black"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">{initialItem?.unit}</span>
                </div>
              </div>
              {isPositive && (
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Unit Cost (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-black">₱</span>
                    <input
                      type="number"
                      value={form.unitCost || ''}
                      onChange={e => setForm({ ...form, unitCost: Number(e.target.value) })}
                      onFocus={e => e.target.select()}
                      placeholder="0.00"
                      className="w-full h-12 pl-8 pr-4 rounded-xl border-2 border-slate-100 bg-white focus:border-slate-900 outline-none transition-all text-[18px] font-black"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Audit Reference</label>
                <div className="relative">
                  <select
                    value={form.referenceType}
                    onChange={e => setForm({ ...form, referenceType: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-[12px] font-bold text-slate-700 outline-none focus:border-indigo-600 appearance-none cursor-pointer"
                  >
                    {REF_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" size={14} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Reference ID / Code</label>
                <input
                  type="text"
                  value={form.referenceId}
                  onChange={e => setForm({ ...form, referenceId: e.target.value })}
                  placeholder="e.g., PO-102 or JO-442"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white focus:border-indigo-600 outline-none transition-all text-[12px] font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Transaction Remarks</label>
              <textarea
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="Reason for this movement..."
                className="w-full h-20 p-4 rounded-xl border border-slate-200 bg-white focus:border-indigo-600 outline-none transition-all text-[12px] font-medium resize-none"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                disabled={!form.qty}
                onClick={handleNext}
                className="px-10 h-12 bg-slate-900 text-white rounded-2xl text-[13px] font-black shadow-lg shadow-slate-900/20 hover:bg-slate-800 disabled:opacity-30 transition-all active:scale-95 flex items-center gap-2"
              >
                Review Transaction <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 space-y-6">
            <div className="p-6 rounded-[24px] bg-slate-50 border border-slate-100 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {initialItem && renderAvatar(initialItem.item || initialItem.item_name || '', 56, initialItem.image)}
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Item</p>
                    <p className="text-[16px] font-black text-slate-900">{initialItem?.item || initialItem?.item_name}</p>
                    <p className="text-[11px] font-bold text-slate-500">{initialItem?.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deduction / Addition</p>
                  <div className={`text-[28px] font-black ${!isPositive ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {!isPositive ? '-' : '+'}{form.qty} <span className="text-[12px] opacity-60 uppercase">{initialItem?.unit}</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-200/50 w-full" />

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Trail</p>
                  <p className="text-[13px] font-black text-slate-900">{form.referenceType}: {form.referenceId || 'No Ref ID'}</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-1">{form.notes || 'No remarks provided'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performed By</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center text-[10px] text-white font-black">
                      {(currentUser?.name || 'S').charAt(0)}
                    </div>
                    <p className="text-[13px] font-black text-slate-900">{currentUser?.name || 'Staff Member'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-indigo-700">
              <CheckCircle2 size={16} className="shrink-0" />
              <p className="text-[11px] font-bold italic">
                Sutura Ledger Protection: This entry will be permanently logged and cannot be deleted.
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={handleBack}
                className="text-[13px] font-black text-slate-400 hover:text-slate-900 transition-all underline underline-offset-4 decoration-slate-200"
              >
                Back to Edit
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleConfirm}
                  className="px-10 h-12 bg-slate-900 text-white rounded-2xl text-[13px] font-black shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
                >
                  Finalize & Log
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

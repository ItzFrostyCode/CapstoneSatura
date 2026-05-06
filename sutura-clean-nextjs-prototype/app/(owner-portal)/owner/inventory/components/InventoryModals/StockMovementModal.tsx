'use client';

import React, { useState, useMemo } from 'react';
import { X, ArrowUpRight, ArrowDownLeft, AlertCircle, HelpCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { InventoryItem, MovementType } from '@/types/erp';

interface StockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  onConfirm: (data: any) => void;
  initialItem?: InventoryItem | null;
  renderAvatar: (name: string, size?: number, imageUrl?: string) => React.ReactNode;
}

type Step = 'form' | 'preview';

const MOVEMENT_TYPES: { value: MovementType; label: string; icon: any; color: string; description: string }[] = [
  { value: 'RECEIVE', label: 'Stock In (Receive)', icon: ArrowDownLeft, color: 'emerald', description: 'Restocking, supplier delivery, or initial stock.' },
  { value: 'ISSUE', label: 'Stock Out (Issue)', icon: ArrowUpRight, color: 'rose', description: 'Used for production or general reduction.' },
  { value: 'ADJUSTMENT_IN', label: 'Adjustment In', icon: ArrowDownLeft, color: 'amber', description: 'Inventory correction (increase).' },
  { value: 'ADJUSTMENT_OUT', label: 'Adjustment Out', icon: ArrowUpRight, color: 'amber', description: 'Inventory correction (decrease).' },
  { value: 'DAMAGE', label: 'Damage / Loss', icon: AlertCircle, color: 'rose', description: 'Damaged materials or missing items.' },
  { value: 'TRANSFER_OUT', label: 'Branch Transfer', icon: HelpCircle, color: 'indigo', description: 'Moving items to another branch.' },
];

const REF_TYPES = ['PO', 'JO', 'Manual', 'Transfer', 'Damage Report', 'Inventory Count'];

export function StockMovementModal({ isOpen, onClose, inventory, onConfirm, initialItem, renderAvatar }: StockMovementModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState({
    type: 'RECEIVE' as MovementType,
    itemSku: initialItem?.sku || '',
    qty: 0,
    unitCost: 0,
    referenceType: 'Manual',
    referenceId: '',
    notes: ''
  });

  // Reset form when initialItem changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setForm(prev => ({ 
        ...prev, 
        itemSku: initialItem?.sku || '',
        qty: 0,
        unitCost: 0
      }));
      setStep('form');
    }
  }, [isOpen, initialItem]);

  const selectedItem = useMemo(() => inventory.find(i => i.sku === form.itemSku), [inventory, form.itemSku]);
  const movementTypeInfo = useMemo(() => MOVEMENT_TYPES.find(t => t.value === form.type), [form.type]);

  if (!isOpen) return null;

  const handleNext = () => setStep('preview');
  const handleBack = () => setStep('form');

  const handleConfirm = () => {
    onConfirm({
      ...form,
      timestamp: new Date().toISOString(),
      performedBy: 'Joshua (Admin)' // Mock current user
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[650px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div>
            <h2 className="text-[22px] font-black text-slate-900 tracking-tight">Inventory Movement</h2>
            <p className="text-[13px] text-slate-500 font-medium">Record a formal transaction for the inventory ledger.</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {step === 'form' ? (
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Movement Type</label>
                <div className="grid grid-cols-1 gap-2">
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value as MovementType })}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-bold appearance-none"
                  >
                    {MOVEMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <p className="mt-2 text-[11px] text-slate-400 italic">
                  {movementTypeInfo?.description}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Item to Move</label>
                <select
                  disabled={!!initialItem}
                  value={form.itemSku}
                  onChange={e => setForm({ ...form, itemSku: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium appearance-none disabled:opacity-50"
                >
                  <option value="" disabled>Select Inventory Item</option>
                  {inventory.map(i => (
                    <option key={i.sku} value={i.sku}>{i.item || i.item_name} ({i.sku})</option>
                  ))}
                </select>
                {selectedItem && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] font-black text-slate-400 uppercase">Current Stock:</span>
                    <span className="text-[11px] font-bold text-slate-900">{selectedItem.stock} {selectedItem.unit}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Quantity ({selectedItem?.unit || 'Units'})</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={form.qty || ''}
                  onChange={e => setForm({ ...form, qty: Number(e.target.value) })}
                  placeholder="0.00"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-black"
                />
              </div>
              {form.type === 'RECEIVE' && (
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Unit Cost (Optional)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₱</span>
                    <input
                      type="number"
                      value={form.unitCost || ''}
                      onChange={e => setForm({ ...form, unitCost: Number(e.target.value) })}
                      placeholder="0.00"
                      className="w-full h-12 pl-8 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Reference Type</label>
                <select
                  value={form.referenceType}
                  onChange={e => setForm({ ...form, referenceType: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium appearance-none"
                >
                  {REF_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Reference ID / Code</label>
                <input
                  type="text"
                  value={form.referenceId}
                  onChange={e => setForm({ ...form, referenceId: e.target.value })}
                  placeholder="e.g., PO-102 or JO-442"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Notes / Remarks</label>
              <textarea
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="Internal notes about this movement..."
                className="w-full h-24 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-slate-900 outline-none transition-all text-[14px] font-medium resize-none"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                disabled={!form.itemSku || !form.qty}
                onClick={handleNext}
                className="px-8 h-12 bg-slate-900 text-white rounded-full text-[14px] font-black shadow-lg shadow-slate-900/10 hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2"
              >
                Review Movement <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 space-y-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`w-16 h-16 rounded-3xl bg-${movementTypeInfo?.color}-50 text-${movementTypeInfo?.color}-600 flex items-center justify-center`}>
                {movementTypeInfo && <movementTypeInfo.icon size={32} />}
              </div>
              <div>
                <h3 className="text-[20px] font-black text-slate-900 uppercase tracking-tighter">Confirm Movement</h3>
                <p className="text-slate-500 font-medium italic mt-1">Review ledger details before finalizing.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {selectedItem && renderAvatar(selectedItem.item || selectedItem.item_name || '', 48, selectedItem.image)}
                    <div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Item Target</p>
                      <p className="text-[15px] font-black text-slate-900">{selectedItem?.item || selectedItem?.item_name}</p>
                      <p className="text-[12px] font-bold text-slate-500">{selectedItem?.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Transaction</p>
                    <div className={`text-[24px] font-black ${form.type.includes('OUT') || form.type === 'ISSUE' || form.type === 'DAMAGE' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {form.type.includes('OUT') || form.type === 'ISSUE' || form.type === 'DAMAGE' ? '-' : '+'}{form.qty} {selectedItem?.unit}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-200/50 w-full" />

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Reference</p>
                    <p className="text-[14px] font-bold text-slate-900">{form.referenceType}: {form.referenceId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Performed By</p>
                    <p className="text-[14px] font-bold text-slate-900">Joshua (Admin)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700">
              <CheckCircle2 size={18} className="shrink-0" />
              <p className="text-[12px] font-medium italic">
                This action is immutable and will be recorded in the system Audit Log.
              </p>
            </div>

            <div className="flex justify-between items-center pt-4">
              <button
                onClick={handleBack}
                className="text-[14px] font-black text-slate-400 hover:text-slate-900 transition-all"
              >
                Back to Edit
              </button>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 h-12 bg-white border border-slate-200 rounded-full text-[14px] font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-8 h-12 bg-slate-900 text-white rounded-full text-[14px] font-black shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95"
                >
                  Confirm Movement
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

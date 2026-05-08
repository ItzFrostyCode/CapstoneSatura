'use client';

import { useState, useMemo } from 'react';
import { X, ArrowRightLeft, Building2, Package, AlertTriangle, CheckCircle2, ClipboardList, ChevronDown } from 'lucide-react';
import { useERPStore } from '@/store/useERPStore';
import { InventoryItem, ShopBranch } from '@/types/erp';

interface StockTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  renderAvatar: (name: string, size?: number, imageUrl?: string) => React.ReactNode;
}

export function StockTransferModal({ isOpen, onClose, renderAvatar }: StockTransferModalProps) {
  const { 
    inventory, 
    inventoryStock, 
    branches, 
    transferStock
  } = useERPStore();

  const [step, setStep] = useState(1);
  const [transferForm, setTransferForm] = useState({
    source_branch_id: 'BRN-001', // Default to Main
    destination_branch_id: '',
    inventory_item_id: '',
    qty: 1,
    reason: 'BRANCH_REQUISITION' as 'BRANCH_REQUISITION' | 'LOW_STOCK' | 'HQ_REBALANCING' | 'MANUAL_TRANSFER',
    notes: ''
  });

  const selectedItem = useMemo(() => 
    inventory.find(i => i.id === transferForm.inventory_item_id), 
    [inventory, transferForm.inventory_item_id]
  );

  const sourceStock = useMemo(() => 
    inventoryStock.find(s => s.branch_id === transferForm.source_branch_id && s.inventory_item_id === transferForm.inventory_item_id),
    [inventoryStock, transferForm.source_branch_id, transferForm.inventory_item_id]
  );

  const destStock = useMemo(() => 
    inventoryStock.find(s => s.branch_id === transferForm.destination_branch_id && s.inventory_item_id === transferForm.inventory_item_id),
    [inventoryStock, transferForm.destination_branch_id, transferForm.inventory_item_id]
  );

  const availableAtSource = sourceStock?.available_qty || 0;
  const isInsufficient = transferForm.qty > availableAtSource;

  const handleConfirm = () => {
    if (isInsufficient || !transferForm.destination_branch_id || !transferForm.inventory_item_id) return;
    
    transferStock({
      shop_id: 'SHOP-001',
      source_branch_id: transferForm.source_branch_id,
      destination_branch_id: transferForm.destination_branch_id,
      inventory_item_id: transferForm.inventory_item_id,
      qty: transferForm.qty,
      reason: transferForm.reason,
      notes: transferForm.notes,
      performed_by_user_id: 'STF-001' // Mock current user
    });
    
    setStep(3);
    setTimeout(() => {
      onClose();
      setStep(1);
      setTransferForm({
        source_branch_id: 'BRN-001',
        destination_branch_id: '',
        inventory_item_id: '',
        qty: 1,
        reason: 'BRANCH_REQUISITION',
        notes: ''
      });
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[580px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div>
            <h2 className="text-[20px] font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ArrowRightLeft className="text-indigo-600" size={22} /> Internal Stock Transfer
            </h2>
            <p className="text-[13px] text-slate-500 font-medium mt-0.5">Move inventory between branches (Audit Ledger Entry)</p>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center hover:bg-slate-100 rounded-full text-slate-400 transition-all"><X size={24} /></button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto min-h-[400px]">
          {step === 1 && (
            <div className="space-y-6">
              {/* Branch Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Source (Sender)</label>
                  <div className="relative">
                    <select 
                      value={transferForm.source_branch_id}
                      onChange={e => setTransferForm(p => ({...p, source_branch_id: e.target.value}))}
                      className="w-full h-12 px-4 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-[14px] font-bold focus:bg-white focus:border-slate-900 outline-none transition-all appearance-none cursor-pointer"
                    >
                      {branches?.map(b => <option key={b.id} value={b.id}>{b.branchName} ({b.branch_type})</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Destination (Receiver)</label>
                  <div className="relative">
                    <select 
                      value={transferForm.destination_branch_id}
                      onChange={e => setTransferForm(p => ({...p, destination_branch_id: e.target.value}))}
                      className="w-full h-12 px-4 pr-10 rounded-xl border border-slate-200 bg-white text-[14px] font-bold focus:border-slate-900 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select Target Branch</option>
                      {branches?.filter(b => b.id !== transferForm.source_branch_id).map(b => (
                        <option key={b.id} value={b.id}>{b.branchName} ({b.branch_type})</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Item Selection */}
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Select Item to Transfer</label>
                <div className="relative">
                  <select 
                    value={transferForm.inventory_item_id}
                    onChange={e => setTransferForm(p => ({...p, inventory_item_id: e.target.value}))}
                    className="w-full h-12 px-4 pr-10 rounded-xl border border-slate-200 bg-white text-[14px] font-bold focus:border-slate-900 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Choose material or product</option>
                    {inventory.map(i => (
                      <option key={i.id} value={i.id}>{i.item_name || i.item}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {selectedItem && (
                <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-200 grid grid-cols-2 gap-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Package size={80} /></div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Source Availability</div>
                    <div className={`text-[20px] font-black ${availableAtSource <= 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                      {availableAtSource} <span className="text-[12px] text-slate-400 font-bold uppercase tracking-tight">{selectedItem.unit}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination Stock</div>
                    <div className="text-[20px] font-black text-slate-900">
                      {destStock?.on_hand_qty || 0} <span className="text-[12px] text-slate-400 font-bold uppercase tracking-tight">{selectedItem.unit}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Transfer Quantity</label>
                  <input 
                    type="number"
                    min={1}
                    value={transferForm.qty}
                    onChange={e => setTransferForm(p => ({...p, qty: Number(e.target.value)}))}
                    className={`w-full h-12 px-4 rounded-xl border-2 text-[14px] font-black outline-none transition-all ${isInsufficient ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-slate-200 bg-white focus:border-slate-900'}`}
                  />
                  {isInsufficient && (
                    <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-rose-600 uppercase tracking-tight">
                      <AlertTriangle size={12} /> Insufficient stock at source
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Movement Reason</label>
                  <div className="relative">
                    <select 
                      value={transferForm.reason}
                      onChange={e => setTransferForm(p => ({...p, reason: e.target.value as 'BRANCH_REQUISITION' | 'LOW_STOCK' | 'HQ_REBALANCING' | 'MANUAL_TRANSFER'}))}
                      className="w-full h-12 px-4 pr-10 rounded-xl border border-slate-200 bg-white text-[14px] font-bold focus:border-slate-900 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="BRANCH_REQUISITION">Branch Requisition</option>
                      <option value="LOW_STOCK">Replenishment</option>
                      <option value="HQ_REBALANCING">Inventory Balance</option>
                      <option value="MANUAL_TRANSFER">Manual Override</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={isInsufficient || !transferForm.destination_branch_id || !transferForm.inventory_item_id}
                className="w-full h-14 bg-slate-900 text-white rounded-2xl text-[14px] font-black shadow-xl shadow-slate-900/10 hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:bg-slate-300 flex items-center justify-center gap-2"
              >
                Review Transfer Details <ArrowRightLeft size={18} />
              </button>
            </div>
          )}

          {step === 2 && selectedItem && (
            <div className="space-y-8 py-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4"><ClipboardList size={32} /></div>
                <h4 className="text-[20px] font-black text-slate-900">Verify Movement</h4>
                <p className="text-[13px] text-slate-500">Confirm the internal logistics details below.</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[28px] overflow-hidden divide-y divide-slate-200/60">
                <div className="p-6 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Source</div>
                    <div className="text-[13px] font-black text-slate-900">{branches?.find(b => b.id === transferForm.source_branch_id)?.branchName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination</div>
                    <div className="text-[13px] font-black text-slate-900">{branches?.find(b => b.id === transferForm.destination_branch_id)?.branchName}</div>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {renderAvatar(selectedItem.item_name || selectedItem.item || '', 40)}
                    <div>
                      <div className="text-[14px] font-black text-slate-900">{selectedItem.item_name || selectedItem.item}</div>
                      <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{selectedItem.sku}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[18px] font-black text-indigo-600 tracking-tight">{transferForm.qty} {selectedItem.unit}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">To be Moved</div>
                  </div>
                </div>
                <div className="p-6">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Transfer Notes (Audit Log)</label>
                   <textarea 
                    value={transferForm.notes}
                    onChange={e => setTransferForm(p => ({...p, notes: e.target.value}))}
                    placeholder="e.g. Replenishing QC stock based on Weekly Order #123"
                    className="w-full h-24 p-4 rounded-xl border border-slate-200 bg-white focus:border-slate-900 outline-none transition-all text-[13px] font-medium resize-none shadow-inner"
                   />
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 h-14 border-2 border-slate-100 rounded-2xl text-[14px] font-black text-slate-400 hover:bg-slate-50 transition-all">Go Back</button>
                <button onClick={handleConfirm} className="flex-[2] h-14 bg-emerald-600 text-white rounded-2xl text-[14px] font-black shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                  Confirm & Commit Transfer
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-[24px] font-black text-slate-900">Transfer Successful</h3>
              <p className="text-[14px] text-slate-500 font-medium text-center max-w-[300px] mt-2">
                The inventory has been rebalanced and logged in the audit history.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

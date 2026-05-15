import React from 'react';
import { X } from 'lucide-react';
import { EnhancedBill } from '../types/billing';
import { formatPHP } from '../utils/billingUtils';
import { PaymentMethod } from '@/types/erp';

interface SettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: EnhancedBill | null;
  amount: string;
  setAmount: (val: string) => void;
  method: PaymentMethod;
  setMethod: (val: PaymentMethod) => void;
  refNo: string;
  setRefNo: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SettlementModal: React.FC<SettlementModalProps> = ({
  isOpen, onClose, bill,
  amount, setAmount,
  method, setMethod,
  refNo, setRefNo,
  onSubmit
}) => {
  if (!isOpen || !bill) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-[18px] font-black text-slate-900 leading-none">Record Settlement</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors text-slate-500">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-2">
            <div className="flex justify-between text-[13px] mb-1">
              <span className="text-slate-500 font-medium">Bill Reference</span>
              <span className="font-bold text-slate-900">{bill.id}</span>
            </div>
            <div className="flex justify-between text-[13px] mb-1">
              <span className="text-slate-500 font-medium">Supplier</span>
              <span className="font-bold text-slate-900">{bill.supplier_name}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-500 font-medium">Remaining Balance</span>
              <span className="font-black text-rose-600">{formatPHP(bill.balance)}</span>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Settlement Amount (₱)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-400 font-medium">₱</span>
              </div>
              <input 
                type="number" 
                step="0.01"
                max={bill.balance}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-black focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none shadow-sm"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Payment Method</label>
            <select 
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none shadow-sm"
            >
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CASH">Cash</option>
              <option value="CHECK">Check</option>
              <option value="GCASH">GCash</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-2">Reference Number / Bank TXN ID</label>
            <input 
              type="text" 
              value={refNo}
              onChange={(e) => setRefNo(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              placeholder="e.g. Bank TXN ID"
            />
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full py-4 rounded-xl bg-slate-900 text-white text-[14px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10">
              Confirm Settlement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

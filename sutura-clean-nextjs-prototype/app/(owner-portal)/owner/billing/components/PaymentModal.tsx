import React from 'react';
import { X, Calendar, AlertCircle, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { EnhancedInvoice } from '../types/billing';
import { formatPHP } from '../utils/billingUtils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: EnhancedInvoice | null;
  paymentAmount: string | number;
  setPaymentAmount: (val: string | number) => void;
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
  paymentRef: string;
  setPaymentRef: (val: string) => void;
  paymentDate: string;
  setPaymentDate: (val: string) => void;
  paymentNotes: string;
  setPaymentNotes: (val: string) => void;
  paymentImage: string | null;
  setPaymentImage: (val: string | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen, onClose, invoice, 
  paymentAmount, setPaymentAmount,
  paymentMethod, setPaymentMethod,
  paymentRef, setPaymentRef,
  paymentDate, setPaymentDate,
  paymentNotes, setPaymentNotes,
  paymentImage, setPaymentImage,
  onSubmit
}) => {
  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-[18px] font-black text-slate-900 leading-none">Record Payment</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-2">
            <div className="flex justify-between text-[13px] mb-1">
              <span className="text-slate-500">Invoice</span>
              <span className="font-bold text-slate-900">{invoice.id}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-500">Remaining Balance</span>
              <span className="font-black text-amber-600">{formatPHP(invoice.balance)}</span>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-2">Payment Amount (₱)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-400 font-medium">₱</span>
              </div>
              <input 
                type="number" 
                step="0.01"
                max={invoice.balance}
                required
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-black focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-2">Payment Method</label>
            <select 
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
            >
              <option value="CASH">Cash</option>
              <option value="GCASH">GCash</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-2">Reference Number</label>
            <input 
              type="text" 
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              placeholder="Optional reference number"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-slate-700 mb-2 uppercase tracking-widest">Payment Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="date" 
                required
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] font-medium focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full py-3.5 rounded-xl bg-indigo-600 text-white text-[14px] font-black hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20">
              Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

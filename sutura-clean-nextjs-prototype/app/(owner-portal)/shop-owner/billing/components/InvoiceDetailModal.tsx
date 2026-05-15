import React from 'react';
import { X, FileCheck, DollarSign, Download } from 'lucide-react';
import { EnhancedInvoice } from '../types/billing';
import { formatPHP, safeFormatDate } from '../utils/billingUtils';

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: EnhancedInvoice | null;
  onPrint: () => void;
  onRecordPayment: (inv: EnhancedInvoice) => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  isOpen, onClose, invoice, onPrint, onRecordPayment
}) => {
  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FileCheck size={24} />
            </div>
            <div>
              <h2 className="text-[20px] font-black text-slate-900 leading-none">Invoice {invoice.id}</h2>
              <p className="text-[13px] text-slate-500 font-medium mt-1">{invoice.customer}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-widest ${
              invoice.computedStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' :
              invoice.computedStatus === 'Overdue' ? 'bg-rose-50 text-rose-600' :
              'bg-blue-50 text-blue-600'
            }`}>
              {invoice.computedStatus}
            </span>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors text-slate-500">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Issue Date</div>
              <div className="text-[14px] font-black text-slate-900">{safeFormatDate(invoice.issueDate)}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Due Date</div>
              <div className="text-[14px] font-black text-slate-900">{safeFormatDate(invoice.dueDate)}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Audit Status</div>
              <div className="text-[14px] font-medium text-slate-600">{invoice.statusSnapshot || 'N/A'}</div>
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-black text-slate-900 mb-3 border-b border-slate-100 pb-2">Line Items</h3>
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2">Description</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoice.items?.map((item, idx) => (
                  <tr key={idx} className="font-medium text-slate-700">
                    <td className="py-3">{item.description}</td>
                    <td className="py-3 text-center">{item.qty}</td>
                    <td className="py-3 text-right">{formatPHP(item.unitPrice)}</td>
                    <td className="py-3 text-right font-black text-slate-900">{formatPHP(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 flex flex-col items-end gap-2 w-full md:w-1/2 ml-auto text-[13px]">
            <div className="flex justify-between w-full">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="font-bold text-slate-700">{formatPHP(invoice.lineSubtotal)}</span>
            </div>
            {invoice.discountValue > 0 && (
              <div className="flex justify-between w-full">
                <span className="text-slate-500 font-medium">Discount</span>
                <span className="font-bold text-rose-600">-{formatPHP(invoice.discountValue)}</span>
              </div>
            )}
            <div className="flex justify-between w-full text-[16px] font-black text-slate-900 border-t border-slate-200 pt-2 mt-1">
              <span>Total</span>
              <span>{formatPHP(invoice.total_amount)}</span>
            </div>
            <div className="flex justify-between w-full text-emerald-600 font-bold">
              <span>Paid</span>
              <span>-{formatPHP(invoice.amountPaid)}</span>
            </div>
            <div className="flex justify-between w-full text-[18px] font-black text-slate-900 border-t border-slate-200 pt-2">
              <span>Balance</span>
              <span className={invoice.balance > 0 ? 'text-amber-600' : ''}>{formatPHP(invoice.balance)}</span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <button onClick={onPrint} className="flex items-center gap-2 text-[13px] font-bold text-slate-600 hover:text-slate-900 transition-colors">
            <Download size={16} /> Print Invoice
          </button>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-[13px] font-bold hover:bg-slate-50 transition-all">
              Close
            </button>
            {invoice.balance > 0 && (
              <button 
                onClick={() => onRecordPayment(invoice)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-[13px] font-black hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20"
              >
                Record Payment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

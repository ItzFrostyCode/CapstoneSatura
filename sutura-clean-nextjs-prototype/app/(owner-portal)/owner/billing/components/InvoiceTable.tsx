import React from 'react';
import { CheckCircle2, Clock, AlertCircle, FileText, FileCheck, MoreVertical } from 'lucide-react';
import { EnhancedInvoice } from '../types/billing';
import { formatPHP, safeFormatDate, isDueSoon } from '../utils/billingUtils';

interface InvoiceTableProps {
  invoices: EnhancedInvoice[];
  onPay: (inv: EnhancedInvoice) => void;
  onView: (inv: EnhancedInvoice) => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, onPay, onView }) => {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
          <th className="px-8 py-5">Invoice #</th>
          <th className="px-8 py-5">Customer</th>
          <th className="px-8 py-5">Financials</th>
          <th className="px-8 py-5">Timeline</th>
          <th className="px-8 py-5">Status & Risk</th>
          <th className="px-8 py-5 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {invoices.map((inv, i) => (
          <tr key={i} className="hover:bg-slate-50/50 transition-all group border-b border-slate-50 last:border-0">
            <td className="px-8 py-5 align-top">
              <div>
                <div className="text-[14px] font-black text-slate-900 tracking-tight leading-none mb-1.5">{inv.id}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{inv.subject}</div>
              </div>
            </td>
            <td className="px-8 py-5 align-top">
              <div>
                <div className="text-[14px] font-black text-slate-900 leading-none mb-1.5">{inv.customer}</div>
                <div className="text-[11px] text-slate-500 font-medium">{inv.email}</div>
              </div>
            </td>
            <td className="px-8 py-5 align-top">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between w-40 whitespace-nowrap">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total:</span>
                  <span className="text-[13px] font-black text-slate-900 ml-4">{formatPHP(inv.total_amount)}</span>
                </div>
                <div className="flex items-center justify-between w-40 whitespace-nowrap">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Balance:</span>
                  <span className={`text-[13px] font-black ml-4 ${inv.balance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {formatPHP(inv.balance)}
                  </span>
                </div>
              </div>
            </td>
            <td className="px-8 py-5 align-top">
               <div className="flex flex-col gap-2 min-w-[150px]">
                <div className="text-[12px] font-medium text-slate-600 whitespace-nowrap">
                  <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mr-2">Issued</span>
                  {safeFormatDate(inv.issueDate)}
                </div>
                <div className="text-[12px] font-bold text-slate-800 whitespace-nowrap">
                  <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mr-2">Due</span>
                  {safeFormatDate(inv.dueDate)}
                </div>
              </div>
            </td>
            <td className="px-8 py-5 align-top">
              <div className="flex flex-col items-start gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                  inv.computedStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                  inv.computedStatus === 'Overdue' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                  inv.computedStatus === 'Draft' ? 'bg-slate-50 text-slate-500 border-slate-200' :
                  inv.computedStatus === 'Partially Paid' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                  'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  {inv.computedStatus === 'Paid' ? <CheckCircle2 size={12} /> : 
                   inv.computedStatus === 'Overdue' ? <AlertCircle size={12} /> : 
                   inv.computedStatus === 'Draft' ? <FileText size={12} /> : 
                   <Clock size={12} />}
                  {inv.computedStatus}
                </span>
                {inv.computedStatus === 'Paid' && inv.paidDate && (
                  <div className="text-[10px] font-bold text-emerald-600 uppercase flex items-center gap-1">
                    <FileCheck size={10} /> Paid on {safeFormatDate(inv.paidDate)}
                  </div>
                )}
                {inv.computedStatus === 'Overdue' && (
                  <div className="text-[10px] font-bold text-rose-500 uppercase flex items-center gap-1">
                    <AlertCircle size={10} /> Overdue by {inv.agingDays} days
                  </div>
                )}
                {(inv.computedStatus === 'Unpaid' || inv.computedStatus === 'Partially Paid') && (
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${isDueSoon(inv.dueDate) ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      {isDueSoon(inv.dueDate) ? 'Due Soon' : 'On Track'}
                    </span>
                  </div>
                )}
              </div>
            </td>
            <td className="px-8 py-5 text-right align-top">
              <div className="flex items-center justify-end gap-2">
                {inv.computedStatus !== 'Paid' && inv.computedStatus !== 'Draft' && (
                  <button 
                    onClick={() => onPay(inv)}
                    className="h-8 px-3 rounded-md bg-indigo-50 text-indigo-600 text-[11px] font-bold hover:bg-indigo-100 transition-all"
                  >
                    Pay
                  </button>
                )}
                <button 
                  onClick={() => onView(inv)}
                  className="h-8 px-3 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold hover:bg-slate-200 transition-all"
                >
                  View
                </button>
                <button className="h-8 w-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                  <MoreVertical size={14} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

import React from 'react';
import { CheckCircle2, Clock, AlertCircle, FileText, FileCheck, MoreVertical, ChevronDown } from 'lucide-react';
import { EnhancedInvoice } from '../types/billing';
import { formatPHP, safeFormatDate, isDueSoon } from '../utils/billingUtils';

interface InvoiceTableProps {
  invoices: EnhancedInvoice[];
  onPay: (inv: EnhancedInvoice) => void;
  onView: (inv: EnhancedInvoice) => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({ invoices, onPay, onView }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30 border-b border-slate-100">
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Invoice # <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Customer <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Financials <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Timeline <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Status & Risk <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {invoices.map((inv, i) => (
              <tr 
                key={i} 
                className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                onClick={() => onView(inv)}
              >
                <td className="py-6 px-10">
                  <div className="text-[15px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">#{inv.id}</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{inv.subject}</div>
                </td>
                <td className="py-6 px-10">
                  <div className="text-[15px] font-black text-slate-900 leading-none mb-1.5">{inv.customer}</div>
                  <div className="text-[12px] text-slate-500 font-bold tracking-tight">{inv.email}</div>
                </td>
                <td className="py-6 px-10">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between w-40">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Total:</span>
                      <span className="text-[14px] font-black text-slate-900">{formatPHP(inv.total_amount)}</span>
                    </div>
                    <div className="flex items-center justify-between w-40">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Balance:</span>
                      <span className={`text-[14px] font-black ${inv.balance > 0 ? 'text-rose-500' : 'text-emerald-600'}`}>
                        {formatPHP(inv.balance)}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-6 px-10">
                   <div className="space-y-1.5 min-w-[150px]">
                    <div className="text-[12px] font-bold text-slate-600 flex items-center gap-3">
                      <span className="text-slate-300 font-black uppercase text-[9px] tracking-widest w-12">Issued</span>
                      {safeFormatDate(inv.issueDate)}
                    </div>
                    <div className="text-[12px] font-black text-slate-900 flex items-center gap-3">
                      <span className="text-slate-300 font-black uppercase text-[9px] tracking-widest w-12">Due</span>
                      {safeFormatDate(inv.dueDate)}
                    </div>
                  </div>
                </td>
                <td className="py-6 px-10">
                  <div className="flex flex-col items-start gap-2">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm ${
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
                      <div className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1.5 tracking-tight">
                        <FileCheck size={12} /> Paid on {safeFormatDate(inv.paidDate)}
                      </div>
                    )}
                    {inv.computedStatus === 'Overdue' && (
                      <div className="text-[10px] font-black text-rose-500 uppercase flex items-center gap-1.5 tracking-tight">
                        <AlertCircle size={12} /> Overdue by {inv.agingDays} days
                      </div>
                    )}
                    {(inv.computedStatus === 'Unpaid' || inv.computedStatus === 'Partially Paid') && (
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className={`w-2 h-2 rounded-full ${isDueSoon(inv.dueDate) ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {isDueSoon(inv.dueDate) ? 'Due Soon' : 'On Track'}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-6 px-10 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {inv.computedStatus !== 'Paid' && inv.computedStatus !== 'Draft' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onPay(inv); }}
                        className="h-10 px-5 rounded-xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                      >
                        Pay
                      </button>
                    )}
                    <button className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm active:scale-95">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

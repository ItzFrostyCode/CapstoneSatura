import React from 'react';
import { EnhancedBill } from '../types/billing';
import { formatPHP } from '../utils/billingUtils';
import { ChevronDown, MoreVertical } from 'lucide-react';

interface BillTableProps {
  bills: EnhancedBill[];
  onRecordPayment: (bill: EnhancedBill) => void;
}

export const BillTable: React.FC<BillTableProps> = ({ bills, onRecordPayment }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30 border-b border-slate-100">
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Bill # <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Supplier <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Amount <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Timeline <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Status <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {bills.map((bill, i) => (
              <tr 
                key={i} 
                className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                onClick={() => onRecordPayment(bill)}
              >
                <td className="py-6 px-10">
                  <div className="text-[15px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{bill.id}</div>
                </td>
                <td className="py-6 px-10">
                  <div className="text-[15px] font-black text-slate-900 leading-none mb-1.5">{bill.supplier_name || 'N/A'}</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">{bill.supplierId}</div>
                </td>
                <td className="py-6 px-10">
                  <div className="text-[15px] font-black text-slate-900">{formatPHP(bill.amount)}</div>
                </td>
                <td className="py-6 px-10">
                   <div className="space-y-1.5 min-w-[150px]">
                    <div className="text-[12px] font-bold text-slate-600 flex items-center gap-3">
                      <span className="text-slate-300 font-black uppercase text-[9px] tracking-widest w-12">Bill</span>
                      {bill.createdAt}
                    </div>
                    <div className="text-[12px] font-black text-slate-900 flex items-center gap-3">
                      <span className="text-slate-300 font-black uppercase text-[9px] tracking-widest w-12">Due</span>
                      {bill.dueDate}
                    </div>
                  </div>
                </td>
                <td className="py-6 px-10">
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                    bill.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    bill.status === 'PARTIAL' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {bill.status}
                  </span>
                </td>
                <td className="py-6 px-10 text-right">
                  <div className="flex items-center justify-end gap-3">
                    {bill.status !== 'PAID' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onRecordPayment(bill); }}
                        className="h-10 px-5 rounded-xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                      >
                        Record Payment
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

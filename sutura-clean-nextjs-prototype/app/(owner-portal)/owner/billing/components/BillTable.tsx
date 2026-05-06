import React from 'react';
import { EnhancedBill } from '../types/billing';
import { formatPHP } from '../utils/billingUtils';

interface BillTableProps {
  bills: EnhancedBill[];
  onRecordPayment: (bill: EnhancedBill) => void;
}

export const BillTable: React.FC<BillTableProps> = ({ bills, onRecordPayment }) => {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
          <th className="px-6 py-4">Bill #</th>
          <th className="px-6 py-4">Supplier</th>
          <th className="px-6 py-4">Amount</th>
          <th className="px-6 py-4">Timeline</th>
          <th className="px-6 py-4">Status</th>
          <th className="px-6 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {bills.map((bill, i) => (
          <tr key={i} className="hover:bg-slate-50/50 transition-all group border-b border-slate-50 last:border-0">
            <td className="px-6 py-5 font-black text-slate-900">{bill.id}</td>
            <td className="px-6 py-5">
              <div className="font-black text-slate-900">{bill.supplier_name || 'N/A'}</div>
              <div className="text-[11px] text-slate-500">{bill.supplierId}</div>
            </td>
            <td className="px-6 py-5 font-black text-slate-900">{formatPHP(bill.amount)}</td>
            <td className="px-6 py-5">
              <div className="text-[12px] text-slate-600"><span className="text-slate-400 mr-1">Bill:</span>{bill.createdAt}</div>
              <div className="text-[12px] font-bold text-slate-800"><span className="text-slate-400 font-medium mr-1">Due:</span>{bill.dueDate}</div>
            </td>
            <td className="px-6 py-5">
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${
                bill.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                bill.status === 'PARTIAL' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                'bg-rose-50 text-rose-600 border-rose-100'
              }`}>
                {bill.status}
              </span>
            </td>
            <td className="px-6 py-5 text-right">
              <button 
                onClick={() => onRecordPayment(bill)}
                className="h-8 px-3 rounded-md bg-indigo-50 text-indigo-600 text-[11px] font-bold hover:bg-indigo-100 transition-all"
              >
                Record Payment
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

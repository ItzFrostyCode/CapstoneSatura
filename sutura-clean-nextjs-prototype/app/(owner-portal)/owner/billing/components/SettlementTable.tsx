import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Settlement } from '@/types/erp';
import { formatPHP } from '../utils/billingUtils';

interface SettlementTableProps {
  settlements: Settlement[];
}

export const SettlementTable: React.FC<SettlementTableProps> = ({ settlements }) => {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
          <th className="px-6 py-4">Settlement #</th>
          <th className="px-6 py-4">Bill Ref</th>
          <th className="px-6 py-4">Supplier</th>
          <th className="px-6 py-4">Amount Paid</th>
          <th className="px-6 py-4">Date & Method</th>
          <th className="px-6 py-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {settlements.map((set, i) => (
          <tr key={i} className="hover:bg-slate-50/50 transition-all group border-b border-slate-50 last:border-0">
            <td className="px-6 py-5 font-black text-slate-900">{set.id}</td>
            <td className="px-6 py-5 font-bold text-indigo-600">{set.billId || set.bill_id}</td>
            <td className="px-6 py-5 font-bold text-slate-900">{set.supplier_name || 'N/A'}</td>
            <td className="px-6 py-5 font-black text-emerald-600">+{formatPHP(set.amount || set.amount_paid || 0)}</td>
            <td className="px-6 py-5">
              <div className="text-[12px] font-bold text-slate-900">{set.method}</div>
              <div className="text-[11px] text-slate-500">{new Date(set.date || set.paid_at || '').toLocaleString()}</div>
            </td>
            <td className="px-6 py-5 text-right">
              <button className="h-8 w-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                <MoreVertical size={14}/>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

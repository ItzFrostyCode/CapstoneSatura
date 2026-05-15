import React from 'react';
import { MoreVertical, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Settlement } from '@/types/erp';
import { formatPHP } from '../utils/billingUtils';

interface SettlementTableProps {
  settlements: Settlement[];
}

export const SettlementTable: React.FC<SettlementTableProps> = ({ settlements }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30 border-b border-slate-100">
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Settlement # <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Bill Ref <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Supplier <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Amount Paid <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Details <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {settlements.map((set, i) => (
              <tr 
                key={i} 
                className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
              >
                <td className="py-6 px-10">
                  <div className="text-[15px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{set.id}</div>
                </td>
                <td className="py-6 px-10">
                  <div className="text-[13px] font-black text-indigo-600 px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded-md inline-block">
                    {set.billId || set.bill_id}
                  </div>
                </td>
                <td className="py-6 px-10">
                  <div className="text-[15px] font-black text-slate-900">{set.supplier_name || 'N/A'}</div>
                </td>
                <td className="py-6 px-10">
                  <div className="text-[15px] font-black text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 size={16} />
                    {formatPHP(set.amount || set.amount_paid || 0)}
                  </div>
                </td>
                <td className="py-6 px-10">
                  <div className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{set.method}</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {new Date(set.date || set.paid_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td className="py-6 px-10 text-right">
                  <button className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm active:scale-95">
                    <MoreVertical size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

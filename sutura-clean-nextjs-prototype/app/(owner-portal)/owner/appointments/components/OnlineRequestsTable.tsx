'use client';

import React from 'react';
import { CheckCircle, XCircle, Clock, Globe, User, ChevronDown } from 'lucide-react';
import { Appointment } from '@/types/erp';

interface OnlineRequestsTableProps {
  requests: Appointment[];
  onApprove: (appointment: Appointment) => void;
  onReject: (appointment: Appointment) => void;
}

export function OnlineRequestsTable({ requests, onApprove, onReject }: OnlineRequestsTableProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-200 rounded-[40px] border-dashed">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
          <Globe size={32} />
        </div>
        <p className="text-[16px] font-black text-slate-900">No Online Requests</p>
        <p className="text-[14px] text-slate-500 font-medium">All online booking requests have been processed.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="fixed-table-container">
        <table className="fixed-table w-full text-left">
          <thead>
            <tr className="bg-slate-50/20 border-b border-slate-100">
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Request ID <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Customer <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Requested Schedule <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Type <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Source <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap text-right pr-10">
                <div className="flex items-center justify-end gap-2 pr-2">Actions <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {requests.map((apt) => (
              <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="py-6 px-8">
                  <div className="text-[14px] font-bold text-slate-900">#{apt.id}</div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">Pending</div>
                </td>
                <td className="py-6 px-8">
                  <div className="text-[14px] font-bold text-slate-900">{apt.customer}</div>
                  <div className="text-[12px] text-slate-400 font-medium mt-1">{apt.phone}</div>
                </td>
                <td className="py-6 px-8">
                  <div className="text-[14px] font-bold text-slate-900">
                    {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {apt.startTime}
                  </div>
                </td>
                <td className="py-6 px-8">
                  <div className="text-[13px] font-medium text-slate-600 uppercase tracking-wider">{apt.type}</div>
                </td>
                <td className="py-6 px-8">
                  <span className="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit">
                    <Globe size={12} /> {apt.source}
                  </span>
                </td>
                <td className="py-6 px-8 text-right pr-10">
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={() => onReject(apt)}
                      className="px-4 py-2 text-rose-600 text-[12px] font-black hover:bg-rose-50 rounded-xl transition-all"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => onApprove(apt)}
                      className="px-6 py-2 bg-slate-900 text-white text-[12px] font-black rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                    >
                      Approve
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
}

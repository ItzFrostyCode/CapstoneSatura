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
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
              <th className="px-8 py-5">Request Detail</th>
              <th className="px-8 py-5">Customer</th>
              <th className="px-8 py-5">Requested Schedule</th>
              <th className="px-8 py-5">Service Type</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right pr-12">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {requests.map((apt) => (
              <tr key={apt.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-8 py-6">
                  <div className="text-[14px] font-bold text-slate-900 tracking-tight">#{apt.id}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Pending Review</div>
                </td>
                <td className="px-8 py-6">
                  <div className="text-[14px] font-bold text-slate-900">{apt.customer}</div>
                  <div className="text-[11px] text-slate-400 font-bold mt-1 tracking-tight">{apt.phone}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-[14px] font-bold text-slate-900">
                    <Clock size={14} className="text-slate-300" />
                    {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} @ {apt.startTime}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 px-3 py-1 rounded-lg bg-slate-50">{apt.type}</span>
                </td>
                <td className="px-8 py-6">
                  <span className="px-3 py-1 bg-sky-50 text-sky-700 border border-sky-100 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit shadow-sm">
                    <Globe size={12} /> {apt.source}
                  </span>
                </td>
                <td className="px-8 py-6 text-right pr-12">
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={() => onReject(apt)}
                      className="px-4 py-2 text-rose-600 text-[11px] font-black uppercase tracking-widest hover:bg-rose-50 rounded-xl transition-all"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => onApprove(apt)}
                      className="px-6 py-2 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:shadow-lg transition-all active:scale-95 shadow-md"
                    >
                      Approve Session
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

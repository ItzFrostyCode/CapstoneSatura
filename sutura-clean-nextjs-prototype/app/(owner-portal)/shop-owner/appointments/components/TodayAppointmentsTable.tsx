'use client';

import React from 'react';
import { ChevronDown, Globe, User } from 'lucide-react';
import { Appointment } from '@/types/erp';

interface TodayAppointmentsTableProps {
  appointments: Appointment[];
  onViewDetails: (appointment: Appointment) => void;
}

export function TodayAppointmentsTable({ appointments, onViewDetails }: TodayAppointmentsTableProps) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white border border-slate-200 rounded-[40px] border-dashed">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
          <User size={32} />
        </div>
        <p className="text-[16px] font-black text-slate-900">No Appointments Today</p>
        <p className="text-[14px] text-slate-500 font-medium">There are no appointments scheduled for today.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <th className="px-10 py-5 bg-slate-50/50">
                <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                  Appointment <ChevronDown size={12} className="text-slate-300" />
                </div>
              </th>
              <th className="px-10 py-5 bg-slate-50/50">
                <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                  Schedule <ChevronDown size={12} className="text-slate-300" />
                </div>
              </th>
              <th className="px-10 py-5 bg-slate-50/50">
                <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                  Type <ChevronDown size={12} className="text-slate-300" />
                </div>
              </th>
              <th className="px-10 py-5 bg-slate-50/50">
                <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                  Source <ChevronDown size={12} className="text-slate-300" />
                </div>
              </th>
              <th className="px-10 py-5 bg-slate-50/50">
                <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                  Status <ChevronDown size={12} className="text-slate-300" />
                </div>
              </th>
              <th className="px-10 py-5 bg-slate-50/50">
                <div className="flex items-center gap-2 cursor-pointer hover:text-slate-900 transition-colors">
                  Artisan <ChevronDown size={12} className="text-slate-300" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {appointments.map((apt) => (
              <tr 
                key={apt.id} 
                className="hover:bg-slate-50/50 transition-all group cursor-pointer"
                onClick={() => onViewDetails(apt)}
              >
                <td className="px-8 py-6">
                  <div className="text-[14px] font-bold text-slate-900 tracking-tight">#{apt.id}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{apt.customer}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="text-[14px] font-bold text-slate-900">
                    {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {apt.startTime}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 px-3 py-1 rounded-lg bg-slate-50">{apt.type}</span>
                </td>
                 <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit border shadow-sm ${
                    apt.source === 'Online' ? 'bg-emerald-50 text-[#069668] border-emerald-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                  }`}>
                    {apt.source === 'Online' ? <Globe size={12} /> : <User size={12} />} {apt.source}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest px-2.5 py-1 bg-slate-100 rounded-lg">
                    {apt.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="text-[13px] font-bold text-slate-900">{apt.staff}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

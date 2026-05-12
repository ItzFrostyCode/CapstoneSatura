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
    <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="fixed-table-container">
        <table className="fixed-table w-full text-left">
          <thead>
            <tr className="bg-slate-50/20 border-b border-slate-100">
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Appointment ID <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Schedule <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Type <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Source <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Status <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Assigned Staff <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {appointments.map((apt) => (
              <tr 
                key={apt.id} 
                className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                onClick={() => onViewDetails(apt)}
              >
                <td className="py-6 px-8">
                  <div className="text-[14px] font-bold text-slate-900">#{apt.id}</div>
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
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${
                    apt.source === 'Online' ? 'bg-sky-50 text-sky-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {apt.source === 'Online' ? <Globe size={12} /> : <User size={12} />} {apt.source}
                  </span>
                </td>
                <td className="py-6 px-8">
                  <div className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">
                    {apt.status}
                  </div>
                </td>
                <td className="py-6 px-8">
                  <div className="text-[14px] font-medium text-slate-900">{apt.staff}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

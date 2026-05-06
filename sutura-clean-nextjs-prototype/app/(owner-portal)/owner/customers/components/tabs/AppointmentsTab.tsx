'use client';

import React from 'react';
import { Appointment } from '@/types/erp';

interface AppointmentsTabProps {
  appointments: Appointment[];
  customerName: string;
}

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({
  appointments,
  customerName
}) => {
  const filteredAppointments = appointments.filter(a => a.customer === customerName);

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
            <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">Type</th>
            <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
            <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Assigned</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filteredAppointments.map(apt => (
            <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
              <td className="py-5 px-8">
                <div className="text-[14px] font-black text-slate-900">{new Date(apt.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                <div className="text-[12px] text-slate-400 font-bold">{apt.startTime} ({apt.duration} mins)</div>
              </td>
              <td className="py-5 px-8 text-[13px] font-bold text-slate-600">{apt.type}</td>
              <td className="py-5 px-8 text-center">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${apt.status === 'Scheduled' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {apt.status}
                </span>
              </td>
              <td className="py-5 px-8 text-right text-[13px] font-bold text-slate-900">{apt.staff}</td>
            </tr>
          ))}
          {filteredAppointments.length === 0 && (
            <tr>
              <td colSpan={4} className="py-20 text-center text-slate-400 font-bold text-[14px]">No appointments found for this customer.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

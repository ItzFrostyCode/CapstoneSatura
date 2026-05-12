import React from 'react';
import { ChevronDown } from 'lucide-react';
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
      <div className="fixed-table-container">
        <table className="fixed-table w-full text-left">
          <thead>
            <tr className="bg-slate-50/20">
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Appointment ID & Schedule <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Type <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Status <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Assigned Staff <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Notes <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredAppointments.map(apt => (
              <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-6 px-8">
                  <div className="text-[14px] font-bold text-slate-900">#{apt.id}</div>
                  <div className="text-[12px] text-slate-400 font-medium mt-1">
                    {new Date(apt.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })} • {apt.startTime}
                  </div>
                </td>
                <td className="py-6 px-8">
                  <div className="text-[13px] font-medium text-slate-600 uppercase tracking-wider">{apt.type}</div>
                </td>
                <td className="py-6 px-8">
                  <div className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">
                    {apt.status}
                  </div>
                </td>
                <td className="py-6 px-8">
                  <div className="text-[14px] font-medium text-slate-900">{apt.staff}</div>
                </td>
                <td className="py-6 px-8">
                  <p className="text-[14px] font-medium text-slate-500 max-w-[300px] line-clamp-1">{apt.reason || '-'}</p>
                </td>
              </tr>
            ))}
            {filteredAppointments.length === 0 && (
              <tr>
                <td colSpan={5} className="py-24 text-center text-slate-300 font-medium text-[15px]">No appointments found for this customer.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-8 border-t border-slate-50 flex items-center justify-between">
        <div className="text-[13px] font-bold text-slate-400">
          Showing 1 to {filteredAppointments.length} of {filteredAppointments.length} Appointments
        </div>
        <div className="flex gap-2">
          <button className="h-10 px-6 rounded-xl border border-slate-200 text-[13px] font-bold text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all">
            Previous
          </button>
          <button className="h-10 px-6 rounded-xl border border-slate-900 bg-white text-slate-900 text-[13px] font-bold hover:bg-slate-900 hover:text-white transition-all shadow-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

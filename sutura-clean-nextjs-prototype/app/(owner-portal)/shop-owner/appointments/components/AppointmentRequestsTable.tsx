'use client';

import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Clock, 
  Globe, 
  User, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  UserMinus,
  Check,
  Trash2,
  Box
} from 'lucide-react';
import { Appointment } from '@/types/erp';
import { formatDistanceToNow } from 'date-fns';

interface AppointmentRequestsTableProps {
  requests: Appointment[];
  onApprove: (appointment: Appointment) => void;
  onDecline: (appointment: Appointment) => void;
  onReschedule: (appointment: Appointment) => void;
  onStatusUpdate?: (id: string, status: 'Completed' | 'No Show' | 'Cancelled') => void;
  onDelete?: (id: string) => void;
  onViewDetails: (appointment: Appointment) => void;
  hideGrouping?: boolean;
}

const formatTime = (timeStr: string) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 || 12;
  return `${hh}:${minutes} ${ampm}`;
};

const getTimeOfDay = (timeStr: string) => {
  if (!timeStr) return 'Morning';
  const hour = parseInt(timeStr.split(':')[0]);
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
};

export function AppointmentRequestsTable({ 
  requests, 
  onApprove, 
  onDecline, 
  onReschedule,
  onStatusUpdate,
  onDelete,
  onViewDetails,
  hideGrouping = false
}: AppointmentRequestsTableProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['Morning', 'Afternoon', 'Evening']);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const sections = [
    { id: 'Morning', label: 'Morning Session', sub: '8:00 AM - 12:00 PM', icon: <span className="text-amber-500 text-[18px]">☀️</span> },
    { id: 'Afternoon', label: 'Afternoon Session', sub: '12:00 PM - 5:00 PM', icon: <span className="text-sky-500 text-[18px]">🌤️</span> },
    { id: 'Evening', label: 'Evening Session', sub: '5:00 PM - 8:00 PM', icon: <span className="text-indigo-500 text-[18px]">🌙</span> },
  ];
  
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[40px] border-2 border-dashed border-slate-200">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 mb-4">
          <CheckCircle size={32} />
        </div>
        <p className="text-[16px] font-black text-slate-900">No Pending Requests</p>
        <p className="text-[14px] text-slate-500 font-medium">All caught up! Check the calendar for confirmed bookings.</p>
      </div>
    );
  }

  const renderTable = (items: Appointment[]) => (
    <div className="fixed-table-container">
        <table className="fixed-table">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th>Request</th>
              <th>Customer</th>
              <th>Appointment</th>
              <th>Source</th>
              <th className="text-right pr-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {items.map((apt) => (
              <tr key={apt.id} className="hover:bg-slate-50/30 transition-colors group cursor-pointer" onClick={() => onViewDetails(apt)}>
                <td className="px-5 py-3">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-black text-slate-900">{apt.id}</span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock size={10} />
                      {apt.date ? formatDistanceToNow(new Date(apt.date), { addSuffix: true }) : 'Recently'}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-slate-900">{apt.customer}</span>
                    <span className="text-[11px] font-medium text-slate-500">{apt.phone}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 text-[13px] font-bold text-slate-900">
                      <Calendar size={12} className="text-indigo-400" />
                      {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {formatTime(apt.startTime)}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{apt.type}</span>
                      {apt.purpose === 'Bulk Order' && (
                        <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-tighter rounded border border-emerald-100 flex items-center gap-1">
                          <Box size={8} /> Bulk
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1 w-fit ${
                    apt.source === 'Online' ? 'bg-sky-50 text-sky-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {apt.source === 'Online' ? <Globe size={10} /> : <User size={10} />}
                    {apt.source}
                  </span>
                </td>
                <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1.5 transition-all">
                    {apt.status === 'Pending Review' && (
                      <button 
                        onClick={() => onApprove(apt)}
                        className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90"
                        title="Approve"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                    {(apt.status === 'Scheduled' || apt.status === 'Rescheduled') && onStatusUpdate && (
                      <>
                        <button 
                          onClick={() => onStatusUpdate(apt.id, 'Completed')}
                          className="h-8 w-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-90"
                          title="Mark as Completed"
                        >
                          <Check size={16} />
                        </button>
                        <button 
                          onClick={() => onStatusUpdate(apt.id, 'No Show')}
                          className="h-8 w-8 bg-slate-100 text-slate-400 rounded-lg flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm active:scale-90"
                          title="Mark as No Show"
                        >
                          <UserMinus size={16} />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => onReschedule(apt)}
                      className="h-8 w-8 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-90"
                      title="Reschedule"
                    >
                      <Calendar size={16} />
                    </button>
                    {(apt.status === 'Pending Review' || apt.status === 'Scheduled' || apt.status === 'Rescheduled') && (
                      <button 
                        onClick={() => onDecline(apt)}
                        className="h-8 w-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm active:scale-90"
                        title={apt.status === 'Pending Review' ? "Decline" : "Cancel Appointment"}
                      >
                        <XCircle size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );

  if (hideGrouping) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
        {renderTable(requests)}
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      {sections.map((section) => {
        const sectionRequests = requests.filter(r => getTimeOfDay(r.startTime) === section.id);
        const isExpanded = expandedSections.includes(section.id);

        return (
          <div key={section.id} className="space-y-6">
            <div 
              onClick={() => toggleSection(section.id)}
              className="flex items-center gap-4 px-4 cursor-pointer group hover:bg-slate-50 py-1.5 rounded-xl transition-all"
            >
              <div className="w-8 h-8 rounded-xl bg-white shadow-sm border border-slate-100 group-hover:scale-105 transition-transform flex items-center justify-center">
                {section.icon}
              </div>
              <div className="flex flex-col">
                <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2 leading-none">
                  {section.label}
                </h3>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                  {section.sub}
                </p>
              </div>
              <div className="h-px flex-1 bg-slate-100 mx-2"></div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full border ${
                  sectionRequests.length > 0 ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-slate-50 text-slate-300 border-slate-100'
                }`}>
                  {sectionRequests.length} {sectionRequests.length === 1 ? 'Request' : 'Requests'}
                </span>
                <div className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                  isExpanded ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-900 group-hover:text-slate-900'
                }`}>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </div>
            </div>

            {isExpanded && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                {sectionRequests.length > 0 ? (
                  renderTable(sectionRequests)
                ) : (
                  <div className="mx-6 p-10 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center text-center">
                    <p className="text-[13px] font-bold text-slate-400">No appointments scheduled for this session.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Staff } from '@/store/useERPStore';

interface CalendarSidebarProps {
  staff: Staff[];
  visibleStaffIds: string[];
  toggleStaff: (id: string) => void;
  allStatuses: string[];
  visibleStatuses: string[];
  toggleStatus: (status: string) => void;
  getStatusStyles: (status: string) => { badge: string; cardOpacity: string };
}

export const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  staff,
  visibleStaffIds,
  toggleStaff,
  allStatuses,
  visibleStatuses,
  toggleStatus,
  getStatusStyles
}) => {
  return (
    <aside className="w-64 border-r border-slate-200 flex flex-col p-4 space-y-8 shrink-0 overflow-y-auto custom-scrollbar">
      {/* Mini Calendar Mockup */}
      <div className="space-y-4 px-2">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-bold text-slate-900">October 2026</span>
          <div className="flex gap-1">
            <button className="p-1 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft size={16} /></button>
            <button className="p-1 hover:bg-slate-100 rounded-full transition-colors"><ChevronRight size={16} /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 text-center gap-y-2">
          {['S','M','T','W','T','F','S'].map((d, i) => (
            <span key={`${d}-${i}`} className="text-[10px] font-black text-slate-400 uppercase">{d}</span>
          ))}
          {Array.from({ length: 31 }, (_, i) => (
            <button 
              key={i} 
              className={`text-[11px] font-medium w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 transition-all ${i+1 === 28 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Filters */}
      <div className="space-y-4 px-2 border-t border-slate-100 pt-6">
        <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Available Staff</h3>
        <div className="space-y-2">
          {staff.map(s => (
            <label key={s.id} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={visibleStaffIds.includes(s.id)}
                  onChange={() => toggleStaff(s.id)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-all"
                />
              </div>
              <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{s.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Status Filters */}
      <div className="space-y-4 px-2 border-t border-slate-100 pt-6">
        <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Status</h3>
        <div className="space-y-2">
          {allStatuses.map(status => (
            <label key={status} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={visibleStatuses.includes(status)}
                  onChange={() => toggleStatus(status)}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${getStatusStyles(status).badge.split(' ')[0]}`}></span>
                <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{status}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

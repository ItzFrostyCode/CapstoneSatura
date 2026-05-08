'use client';

import React from 'react';
import { Appointment, Staff } from '@/store/useERPStore';

interface CalendarGridProps {
  hours: number[];
  weekDays: Date[];
  mappedAppointments: (Appointment & { normalizedStatus: string })[];
  staff: Staff[];
  visibleStaffIds: string[];
  visibleStatuses: string[];
  formatDate: (date: Date) => string;
  getStatusStyles: (status: string) => { badge: string; cardOpacity: string };
  getStaffColor: (staff: string) => string;
  calculatePosition: (startTime: string, duration: number) => { top: string; height: string };
  getCurrentTimePosition: () => number;
  handleEmptySlotClick: (date: string, hour: number) => void;
  setSelectedAppointment: (apt: Appointment & { normalizedStatus: string }) => void;
  setIsModalOpen: (open: boolean) => void;
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOUR_HEIGHT = 100; // Increased from 60 to 100 for "zoom" effect

const formatTime = (timeStr: string) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 || 12;
  return `${hh}:${minutes} ${ampm}`;
};

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  hours,
  weekDays,
  mappedAppointments,
  staff,
  visibleStaffIds,
  visibleStatuses,
  formatDate,
  getStatusStyles,
  getStaffColor,
  calculatePosition,
  getCurrentTimePosition,
  handleEmptySlotClick,
  setSelectedAppointment,
  setIsModalOpen
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-white">
      {/* Days Header */}
      <div className="flex border-b border-slate-200 pr-[6px]">
        <div className="w-16 shrink-0"></div>
        <div className="flex-1 grid grid-cols-7 border-l border-slate-200">
          {weekDays.map((date, i) => {
            const isToday = formatDate(date) === '2026-10-28';
            return (
              <div key={i} className="py-4 flex flex-col items-center gap-1 border-r border-slate-100 last:border-r-0">
                <span className={`text-[11px] font-black ${isToday ? 'text-indigo-600' : 'text-slate-400'} uppercase tracking-widest`}>{days[date.getDay()]}</span>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full text-[18px] font-black transition-all ${isToday ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-900 hover:bg-slate-50'}`}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Grid Scroll Area */}
      <div className="flex-1 overflow-y-auto relative custom-scrollbar bg-slate-50/30">
        <div className="flex min-h-full">
          {/* Time Labels */}
          <div className="w-16 shrink-0 bg-white">
            {hours.map((h) => (
              <div key={h} className="h-[100px] flex items-start justify-center pr-2 relative">
                <span className="text-[10px] font-black text-slate-300 -mt-2.5 uppercase">
                  {h > 12 ? `${h-12} PM` : h === 12 ? '12 PM' : h === 0 ? '' : `${h} AM`}
                </span>
                {/* 30 min label mockup */}
                <span className="absolute top-[50px] right-2 text-[8px] font-black text-slate-200 uppercase">30</span>
              </div>
            ))}
          </div>

          {/* Grid Body */}
          <div className="flex-1 grid grid-cols-7 border-l border-slate-200 relative bg-white">
            {/* Horizontal Grid Lines */}
            {hours.map((h) => (
              <React.Fragment key={`lines-${h}`}>
                {/* Hour Line */}
                <div className="absolute left-0 right-0 border-b border-slate-100" style={{ top: `${(h - 8 + 1) * HOUR_HEIGHT}px` }}></div>
                {/* 30-Min Dash Line */}
                <div className="absolute left-0 right-0 border-b border-dashed border-slate-50" style={{ top: `${(h - 8) * HOUR_HEIGHT + (HOUR_HEIGHT / 2)}px` }}></div>
              </React.Fragment>
            ))}
            
            {/* Vertical Grid Lines */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`v-line-${i}`} className="absolute top-0 bottom-0 border-r border-slate-50 pointer-events-none" style={{ left: `${(i + 1) * (100 / 7)}%` }}></div>
            ))}

            {/* Current Time Line Indicator */}
            <div className="absolute left-0 right-0 z-20 flex items-center pointer-events-none" style={{ top: `${getCurrentTimePosition()}px` }}>
               <div className="w-2.5 h-2.5 bg-rose-500 rounded-full -ml-1.25 shadow-sm"></div>
               <div className="flex-1 h-px bg-rose-500/50"></div>
            </div>

            {/* Day Columns */}
            {weekDays.map((date, colIdx) => {
              const dateStr = formatDate(date);
              const dayAppointments = mappedAppointments.filter(a => 
                a.date === dateStr && 
                a.status !== 'Pending Review' &&
                (staff.find(s => s.name === a.staff)?.id ? visibleStaffIds.includes(staff.find(s => s.name === a.staff)!.id) : true) &&
                visibleStatuses.includes(a.normalizedStatus)
              );
              
              return (
                <div key={`col-${colIdx}`} className="relative h-full z-0 group">
                  {/* Clickable Empty Slots */}
                  {hours.map((h) => (
                    <div 
                      key={`empty-${colIdx}-${h}`} 
                      onClick={() => handleEmptySlotClick(dateStr, h)}
                      className="absolute left-0 right-0 cursor-pointer transition-colors hover:bg-slate-50"
                      style={{ top: `${(h - 8) * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
                    ></div>
                  ))}

                  {/* Appointment Cards */}
                  {dayAppointments.map((apt) => {
                    const statusStyle = getStatusStyles(apt.normalizedStatus);
                    return (
                      <div 
                        key={apt.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedAppointment(apt); setIsModalOpen(true); }}
                        className={`absolute left-1 right-2 p-3 rounded-2xl border-l-[6px] cursor-pointer transition-all hover:shadow-xl hover:z-10 overflow-hidden ${getStaffColor(apt.staff)} shadow-md border-y border-r border-slate-200/50 ${statusStyle.cardOpacity} ${apt.normalizedStatus === 'Cancelled' ? 'line-through' : ''}`}
                        style={calculatePosition(apt.startTime, apt.duration)}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="text-[13px] font-black leading-tight text-slate-900 truncate">{apt.customer}</div>
                          <span className={`text-[8px] font-black px-2 py-1 rounded-lg shrink-0 uppercase tracking-widest border ${statusStyle.badge} border-current/10`}>
                            {apt.normalizedStatus}
                          </span>
                        </div>
                        <div className="text-[11px] font-black text-slate-700/70 mt-1.5 flex items-center gap-1.5 uppercase tracking-tighter">
                          {formatTime(apt.startTime)} <span className="opacity-30">•</span> {apt.type}
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 mt-2 flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40"></div>
                          {apt.staff}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

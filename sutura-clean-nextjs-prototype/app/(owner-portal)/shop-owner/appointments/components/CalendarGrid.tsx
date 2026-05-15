'use client';

import React from 'react';
import { Appointment } from '@/store/useERPStore';

interface CalendarGridProps {
  hours: number[];
  weekDays: Date[];
  mappedAppointments: Appointment[];
  onSelectAppointment: (apt: Appointment) => void;
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOUR_HEIGHT = 80;

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  hours,
  weekDays,
  mappedAppointments,
  onSelectAppointment
}) => {
  const demoTodayStr = '2026-05-07';

  const formatTimeLabel = (h: number) => {
    const ampm = h >= 12 ? 'pm' : 'am';
    const hh = h % 12 || 12;
    return `${hh}${ampm}`;
  };

  const calculatePosition = (startTime: string, duration: number = 60) => {
    const [h, m] = startTime.split(':').map(Number);
    const startOffset = h * HOUR_HEIGHT + (m / 60) * HOUR_HEIGHT;
    const height = (duration / 60) * HOUR_HEIGHT;
    return { top: `${startOffset}px`, height: `${height}px` };
  };

  const getTypeColor = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'CONSULTATION': return 'border-indigo-500 bg-indigo-50/50 text-indigo-700';
      case 'MEASUREMENT': return 'border-amber-500 bg-amber-50/50 text-amber-700';
      case 'FITTING': return 'border-rose-500 bg-rose-50/50 text-rose-700';
      case 'PICKUP': return 'border-emerald-500 bg-emerald-50/50 text-emerald-700';
      default: return 'border-slate-400 bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative bg-white">
      {/* Days Header */}
      <div className="flex border-b border-slate-200">
        <div className="w-20 shrink-0 border-r border-slate-200"></div>
        <div className="flex-1 grid grid-cols-7">
          {weekDays.map((date, i) => {
            const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            const isToday = dateStr === demoTodayStr;
            return (
              <div key={i} className="py-6 flex flex-col items-center gap-2 border-r border-slate-200 last:border-r-0">
                <span className={`text-[12px] font-black uppercase tracking-widest ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>{days[date.getDay()]}</span>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full text-[18px] font-black transition-all ${isToday ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-900 hover:bg-slate-50'}`}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time Grid Scroll Area */}
      <div className="flex-1 overflow-y-auto relative custom-scrollbar">
        {/* All day row placeholder */}
        <div className="flex border-b border-slate-200">
          <div className="w-20 shrink-0 py-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-200 bg-slate-50/30">All day</div>
          <div className="flex-1 grid grid-cols-7 bg-slate-50/10">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-10 border-r border-slate-200 last:border-r-0"></div>
            ))}
          </div>
        </div>

        <div className="flex min-h-full">
          {/* Time Labels Column */}
          <div className="w-20 shrink-0 bg-white border-r border-slate-200">
            {Array.from({ length: 24 }).map((_, h) => (
              <div key={h} className="h-[80px] flex items-start justify-center pr-2 relative border-b border-slate-50 last:border-b-0">
                <span className="text-[11px] font-black text-slate-400 mt-[-10px] bg-white px-1 z-10 uppercase">
                  {formatTimeLabel(h)}
                </span>
              </div>
            ))}
          </div>

          {/* Grid Body */}
          <div className="flex-1 grid grid-cols-7 relative bg-white">
            {/* Hour lines for full width */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 24 }).map((_, h) => (
                <div key={h} className="h-[80px] border-b border-slate-100"></div>
              ))}
            </div>

            {/* Vertical column lines */}
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="relative h-full border-r border-slate-200 last:border-r-0">
                {/* Day column appointments */}
                {(() => {
                  const date = weekDays[i];
                  const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                  const dayAppointments = mappedAppointments.filter(a => a.date === dateStr);
                  
                  return dayAppointments.map(apt => (
                    <div 
                      key={apt.id}
                      onClick={() => onSelectAppointment(apt)}
                      className={`absolute left-1 right-1 p-3 rounded-xl border-l-4 text-[11px] font-bold cursor-pointer transition-all hover:shadow-xl hover:z-10 shadow-md ${getTypeColor(apt.type)}`}
                      style={calculatePosition(apt.startTime, apt.duration)}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-start gap-2">
                          <span className="truncate max-w-[80px]">{apt.customer}</span>
                          <span className="opacity-60 text-[9px] shrink-0">{apt.startTime}</span>
                        </div>
                        <div className="text-[9px] opacity-70 truncate">{apt.type}</div>
                        <div className="text-[9px] font-black mt-1 opacity-50 flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-current"></div>
                          {apt.staff}
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

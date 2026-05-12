'use client';

import React from 'react';
import { Appointment } from '@/store/useERPStore';

interface MonthCalendarGridProps {
  selectedDate: Date;
  appointments: Appointment[];
  onSelectAppointment: (apt: Appointment) => void;
}

export function MonthCalendarGrid({ selectedDate, appointments, onSelectAppointment }: MonthCalendarGridProps) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  // First day of month
  const firstDay = new Date(year, month, 1).getDay();
  // Total days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Previous month days to show
  const prevMonthDays = new Date(year, month, 0).getDate();
  
  const days = [];
  
  // Add days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: prevMonthDays - i,
      month: month - 1,
      year,
      isCurrentMonth: false
    });
  }
  
  // Add current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      month,
      year,
      isCurrentMonth: true
    });
  }
  
  // Fill remaining spots for a 6-row grid (42 cells)
  const remainingSlots = 42 - days.length;
  for (let i = 1; i <= remainingSlots; i++) {
    days.push({
      day: i,
      month: month + 1,
      year,
      isCurrentMonth: false
    });
  }

  const getTypeColor = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'CONSULTATION': return 'border-indigo-500 bg-indigo-50/30 text-indigo-700';
      case 'MEASUREMENT': return 'border-amber-500 bg-amber-50/30 text-amber-700';
      case 'FITTING': return 'border-rose-500 bg-rose-50/30 text-rose-700';
      case 'PICKUP': return 'border-emerald-500 bg-emerald-50/30 text-emerald-700';
      default: return 'border-slate-400 bg-slate-50 text-slate-600';
    }
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-slate-200">
        {weekDays.map(d => (
          <div key={d} className="py-4 text-center text-[12px] font-black text-slate-400 uppercase tracking-widest">
            {d}
          </div>
        ))}
      </div>

      {/* Grid Cells */}
      <div className="flex-1 grid grid-cols-7">
        {days.map((d, i) => {
          const dateStr = `${d.year}-${(d.month + 1).toString().padStart(2, '0')}-${d.day.toString().padStart(2, '0')}`;
          const dayAppointments = appointments.filter(a => a.date === dateStr);
          const isToday = new Date().toISOString().split('T')[0] === dateStr;

          return (
            <div 
              key={i} 
              className={`min-h-[120px] border-r border-b border-slate-200 p-2 flex flex-col gap-1 transition-colors hover:bg-slate-50/50 ${
                !d.isCurrentMonth ? 'bg-slate-50/20' : ''
              }`}
            >
              <div className="flex justify-center mb-1">
                <span className={`text-[13px] font-black w-7 h-7 flex items-center justify-center rounded-full transition-all ${
                  isToday ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 
                  d.isCurrentMonth ? 'text-slate-900' : 'text-slate-300'
                }`}>
                  {d.day}
                </span>
              </div>
              
              <div className="space-y-1 overflow-y-auto custom-scrollbar">
                {dayAppointments.map(apt => (
                  <div 
                    key={apt.id}
                    onClick={() => onSelectAppointment(apt)}
                    className={`px-2 py-1.5 rounded-lg border-l-4 text-[10px] font-bold cursor-pointer transition-all hover:scale-[1.02] active:scale-95 shadow-sm truncate ${getTypeColor(apt.type)}`}
                    title={`${apt.startTime} - ${apt.customer} (${apt.type})`}
                  >
                    <div className="flex items-center gap-1">
                      <span className="opacity-60">{apt.startTime}</span>
                      <span className="truncate">{apt.customer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

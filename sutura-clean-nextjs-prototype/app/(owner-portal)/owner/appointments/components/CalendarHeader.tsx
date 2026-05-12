'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, List, Columns } from 'lucide-react';

interface CalendarHeaderProps {
  selectedDate: Date;
  view: 'Week' | 'Month' | 'Agenda';
  setView: (view: 'Week' | 'Month' | 'Agenda') => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  selectedDate, 
  view,
  setView,
  onPrev, 
  onNext, 
  onToday 
}) => {
  return (
    <header className="h-20 border-b border-slate-100 flex items-center justify-between px-10 shrink-0 bg-white">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToday}
          className="h-10 px-5 bg-slate-900 text-white rounded-xl text-[13px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
        >
          Today
        </button>
        <div className="flex items-center gap-1">
          <button 
            onClick={onPrev}
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={onNext}
            className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <h2 className="text-[20px] font-black text-slate-900 ml-4 tracking-tight">
          {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
      </div>

      <div className="flex items-center p-1.5 bg-slate-100 rounded-2xl">
        <button 
          onClick={() => setView('Week')}
          className={`h-9 px-5 rounded-xl flex items-center gap-2 text-[12px] font-black transition-all ${
            view === 'Week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Columns size={16} /> Week
        </button>
        <button 
          onClick={() => setView('Month')}
          className={`h-9 px-5 rounded-xl flex items-center gap-2 text-[12px] font-black transition-all ${
            view === 'Month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Calendar size={16} /> Month
        </button>
        <button 
          onClick={() => setView('Agenda')}
          className={`h-9 px-5 rounded-xl flex items-center gap-2 text-[12px] font-black transition-all ${
            view === 'Agenda' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <List size={16} /> Agenda
        </button>
      </div>
    </header>
  );
};

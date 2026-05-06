'use client';

import React from 'react';
import { Menu, ChevronLeft, ChevronRight, LayoutGrid, ChevronDown } from 'lucide-react';

interface CalendarHeaderProps {
  selectedDate: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  selectedDate, 
  onPrev, 
  onNext, 
  onToday 
}) => {
  return (
    <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 shrink-0 bg-white">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
          <Menu size={20} />
        </button>
        <h2 className="text-[18px] font-bold text-slate-900 ml-2">
          {selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-1 ml-4 border border-slate-200 rounded-xl p-1 bg-white">
          <button 
            onClick={onPrev}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={onToday}
            className="px-3 py-1 text-[13px] font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Today
          </button>
          <button 
            onClick={onNext}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 gap-2 cursor-pointer hover:bg-slate-100 transition-all shadow-sm">
          <LayoutGrid size={16} className="text-indigo-600" />
          <span className="text-[13px] font-bold text-slate-700">Week View</span>
          <ChevronDown size={14} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
};

'use client';

import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Plus, 
  Search,
  MoreVertical,
  Filter,
  LayoutGrid,
  List,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  Settings,
  HelpCircle,
  Menu
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import appointmentsData from '@/data/appointments_extended.json';

// Types
interface Appointment {
  id: string;
  customer: string;
  email: string;
  phone: string;
  type: string;
  category: string;
  date: string;
  startTime: string;
  duration: number;
  status: string;
  branch: string;
  staff: string;
  reason: string;
}

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date('2026-10-28')); // Fixed date for demo
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [visibleStaff, setVisibleStaff] = useState<string[]>(['Maria Garcia', 'Joshua Arabejo', 'Juan Reyes']);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Form State
  const [newApt, setNewApt] = useState({
    customer: '',
    type: 'First Fitting',
    date: '2026-10-28',
    startTime: '10:00',
    staff: 'Maria Garcia',
    branch: 'Makati Central'
  });

  // Constants
  const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const HOUR_HEIGHT = 60; // Google Calendar standard
  
  // Update current time for the red line indicator
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate current week days
  const weekDays = useMemo(() => {
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [selectedDate]);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const getStaffColor = (staff: string) => {
    const colors: Record<string, string> = {
      'Maria Garcia': 'bg-blue-100 text-blue-700 border-blue-200',
      'Joshua Arabejo': 'bg-purple-100 text-purple-700 border-purple-200',
      'Juan Reyes': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'Elena Cruz': 'bg-amber-100 text-amber-700 border-amber-200',
    };
    return colors[staff] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const calculatePosition = (startTime: string, duration: number) => {
    const [h, m] = startTime.split(':').map(Number);
    const startOffset = (h - 8) * HOUR_HEIGHT + (m / 60) * HOUR_HEIGHT;
    const height = (duration / 60) * HOUR_HEIGHT;
    return { top: `${startOffset}px`, height: `${height}px` };
  };

  const getCurrentTimePosition = () => {
    const h = 10; // For demo purposes, we'll fix it to 10:30 AM to show the line
    const m = 30;
    return (h - 8) * HOUR_HEIGHT + (m / 60) * HOUR_HEIGHT;
  };

  const toggleStaff = (staff: string) => {
    setVisibleStaff(prev => 
      prev.includes(staff) ? prev.filter(s => s !== staff) : [...prev, staff]
    );
  };

  return (
    <div className="flex h-[calc(100vh-140px)] -m-10 bg-white">
      
      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-64 border-r border-slate-200 flex flex-col p-4 space-y-8 shrink-0 overflow-y-auto custom-scrollbar">
        {/* Create Button */}
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-full shadow-md hover:shadow-lg transition-all text-slate-700 group"
        >
          <Plus size={24} className="text-indigo-600 transition-transform group-hover:rotate-90" />
          <span className="text-[14px] font-bold">Create</span>
          <ChevronDown size={14} className="ml-auto text-slate-400" />
        </button>

        {/* Mini Calendar Mockup */}
        <div className="space-y-4 px-2">
           <div className="flex items-center justify-between">
             <span className="text-[13px] font-bold text-slate-900">January 2026</span>
             <div className="flex gap-1">
               <button className="p-1 hover:bg-slate-100 rounded-full"><ChevronLeft size={16} /></button>
               <button className="p-1 hover:bg-slate-100 rounded-full"><ChevronRight size={16} /></button>
             </div>
           </div>
           <div className="grid grid-cols-7 text-center gap-y-2">
             {['S','M','T','W','T','F','S'].map((d, i) => <span key={`${d}-${i}`} className="text-[10px] font-black text-slate-400 uppercase">{d}</span>)}
             {Array.from({ length: 31 }, (_, i) => (
               <button 
                 key={i} 
                 className={`text-[11px] font-medium w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 ${i+1 === 28 ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
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
            {['Maria Garcia', 'Joshua Arabejo', 'Juan Reyes', 'Elena Cruz'].map(staff => (
              <label key={staff} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={visibleStaff.includes(staff)}
                    onChange={() => toggleStaff(staff)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
                <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{staff}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><Menu size={20} /></button>
            <h2 className="text-[18px] font-bold text-slate-900 ml-2">January 2026</h2>
            <div className="flex items-center gap-1 ml-4 border border-slate-200 rounded-md p-1">
              <button className="p-1 hover:bg-slate-100 rounded text-slate-600"><ChevronLeft size={18} /></button>
              <button className="px-3 py-1 text-[13px] font-bold text-slate-700 hover:bg-slate-100 rounded">Today</button>
              <button className="p-1 hover:bg-slate-100 rounded text-slate-600"><ChevronRight size={18} /></button>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 gap-2">
               <LayoutGrid size={16} className="text-indigo-600" />
               <span className="text-[13px] font-bold text-slate-700">Week View</span>
               <ChevronDown size={14} className="text-slate-400" />
             </div>
          </div>
        </header>

        {/* Calendar Grid Container */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Days Header */}
          <div className="flex border-b border-slate-200 pr-[6px]"> {/* Space for scrollbar */}
            <div className="w-16 shrink-0"></div>
            <div className="flex-1 grid grid-cols-7 border-l border-slate-200">
              {weekDays.map((date, i) => {
                const isToday = formatDate(date) === '2026-10-28';
                return (
                  <div key={i} className="py-4 flex flex-col items-center gap-1 border-r border-slate-100 last:border-r-0">
                    <span className={`text-[11px] font-bold ${isToday ? 'text-indigo-600' : 'text-slate-500'} uppercase`}>{days[date.getDay()]}</span>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full text-[18px] font-medium ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-900 hover:bg-slate-100'}`}>
                      {date.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Grid Scroll Area */}
          <div className="flex-1 overflow-y-auto relative custom-scrollbar">
            <div className="flex min-h-full">
              {/* Time Labels */}
              <div className="w-16 shrink-0 bg-white">
                {hours.map((h) => (
                  <div key={h} className="h-[60px] flex items-start justify-center pr-2 relative">
                    <span className="text-[10px] font-medium text-slate-400 -mt-2.5">
                      {h > 12 ? `${h-12} PM` : h === 12 ? '12 PM' : h === 0 ? '' : `${h} AM`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Grid Body */}
              <div className="flex-1 grid grid-cols-7 border-l border-slate-200 relative">
                {/* Horizontal Grid Lines */}
                {hours.map((h) => (
                  <div key={h} className="absolute left-0 right-0 border-b border-slate-100" style={{ top: `${(h - 8 + 1) * HOUR_HEIGHT}px` }}></div>
                ))}
                
                {/* Vertical Grid Lines */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="absolute top-0 bottom-0 border-r border-slate-100" style={{ left: `${(i + 1) * (100 / 7)}%` }}></div>
                ))}

                {/* Current Time Line Indicator */}
                <div className="absolute left-0 right-0 z-20 flex items-center" style={{ top: `${getCurrentTimePosition()}px` }}>
                   <div className="w-3 h-3 bg-rose-500 rounded-full -ml-1.5 shadow-sm"></div>
                   <div className="flex-1 h-px bg-rose-500"></div>
                </div>

                {/* Appointment Cards */}
                {weekDays.map((date, colIdx) => {
                  const dateStr = formatDate(date);
                  const dayAppointments = appointmentsData.filter(a => a.date === dateStr && visibleStaff.includes(a.staff));
                  
                  return (
                    <div key={colIdx} className="relative h-full">
                      {dayAppointments.map((apt) => (
                        <div 
                          key={apt.id}
                          onClick={() => { setSelectedAppointment(apt); setIsModalOpen(true); }}
                          className={`absolute left-0.5 right-1.5 p-2 rounded-md border-l-4 cursor-pointer transition-all hover:shadow-lg hover:z-10 overflow-hidden ${getStaffColor(apt.staff)} shadow-sm`}
                          style={calculatePosition(apt.startTime, apt.duration)}
                        >
                          <div className="text-[12px] font-black leading-tight truncate">{apt.customer}</div>
                          <div className="text-[10px] font-bold opacity-80 mt-1 truncate">{apt.startTime} - {apt.category}</div>
                          <div className="text-[9px] opacity-60 mt-0.5 italic">{apt.staff}</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CREATE APPOINTMENT MODAL ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[500px] rounded-[16px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
             {/* Header */}
             <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-slate-900">Schedule Appointment</h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-1 hover:bg-slate-100 rounded text-slate-400 transition-all"><X size={20}/></button>
             </div>
             
             {/* Body */}
             <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-medium text-slate-900">Customer</label>
                  <select className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-lg text-[15px] outline-none focus:border-slate-900 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%236B7280%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22%3E%3C/path%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_16px_center] bg-[length:16px]">
                    <option>Select Customer...</option>
                    <option>Alexander McQueen</option>
                    <option>Maria Santos</option>
                    <option>John Doe</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-slate-900">Date</label>
                    <input type="date" className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-lg text-[15px] outline-none focus:border-slate-900 transition-all" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-slate-900">Time</label>
                    <input type="time" className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-lg text-[15px] outline-none focus:border-slate-900 transition-all" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-medium text-slate-900">Appointment Type</label>
                  <select className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-lg text-[15px] outline-none focus:border-slate-900 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%236B7280%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22%3E%3C/path%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_16px_center] bg-[length:16px]">
                    <option>Fitting</option>
                    <option>Consultation</option>
                    <option>Pick-up</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-medium text-slate-900">Notes</label>
                  <textarea 
                    rows={3}
                    placeholder="Additional details about this appointment..."
                    className="w-full p-4 bg-white border border-slate-200 rounded-lg text-[15px] outline-none focus:border-slate-900 transition-all resize-none"
                  ></textarea>
                </div>
             </div>

             {/* Footer */}
             <div className="px-6 py-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
                <button 
                  onClick={() => setIsCreateModalOpen(false)} 
                  className="px-5 h-[44px] rounded-lg text-[15px] font-semibold text-slate-900 border border-slate-200 bg-white hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setIsCreateModalOpen(false)} 
                  className="px-5 h-[44px] bg-slate-900 text-white rounded-lg text-[15px] font-semibold hover:bg-slate-800 transition-all shadow-sm"
                >
                  Save Appointment
                </button>
             </div>
          </div>
        </div>
      )}

      {/* ── APPOINTMENT DETAIL MODAL (POPOVER STYLE) ── */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[420px] rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="h-16 bg-slate-50 flex items-center justify-between px-6 border-b border-slate-200">
               <div className="flex items-center gap-2">
                 <button className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><Search size={18} /></button>
                 <button className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><MoreVertical size={18} /></button>
               </div>
               <button 
                onClick={() => setIsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-900 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8">
              <div className="flex items-start gap-4">
                 <div className="w-4 h-4 mt-1.5 rounded-sm bg-indigo-500"></div>
                 <div>
                   <h2 className="text-[24px] font-black text-slate-900 leading-tight">{selectedAppointment.customer}</h2>
                   <p className="text-[14px] text-slate-600 font-medium mt-1">{selectedAppointment.date} • {selectedAppointment.startTime}</p>
                 </div>
              </div>

              <div className="space-y-5 pl-8">
                <div className="flex items-center gap-4 text-slate-600 hover:text-slate-900 transition-colors">
                  <User size={18} />
                  <div>
                    <div className="text-[13px] font-bold">{selectedAppointment.staff}</div>
                    <div className="text-[11px] opacity-60">Assigned Expert</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <MapPin size={18} />
                  <span className="text-[13px] font-medium">{selectedAppointment.branch}</span>
                </div>
                <div className="flex items-start gap-4 text-slate-600">
                  <Menu size={18} className="mt-1" />
                  <p className="text-[13px] font-medium leading-relaxed italic text-slate-500">&quot;{selectedAppointment.reason}&quot;</p>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <Phone size={18} />
                  <span className="text-[13px] font-medium">{selectedAppointment.phone}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  className="px-6 h-10 text-[13px] font-bold text-slate-600 hover:bg-slate-50 rounded-md transition-all"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-8 h-10 bg-indigo-600 text-white rounded-md font-black text-[13px] hover:bg-indigo-700 transition-all shadow-md"
                  onClick={() => setIsModalOpen(false)}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

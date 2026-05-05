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
import { useERPStore, Appointment } from '../../store/useERPStore';

const normalizeStatus = (status: string) => {
  const s = status.toLowerCase();
  if (s === 'pending') return 'Scheduled';
  if (s === 'delayed') return 'No Show';
  if (s === 'confirmed') return 'Confirmed';
  if (s === 'completed') return 'Completed';
  if (s === 'cancelled') return 'Cancelled';
  if (s === 'no show') return 'No Show';
  return 'Scheduled'; // fallback
};

export default function AppointmentsPage() {
  const { appointments, addAppointment, updateAppointmentStatus } = useERPStore();

  const [selectedDate, setSelectedDate] = useState(new Date('2026-10-28')); // Fixed date for demo
  const [selectedAppointment, setSelectedAppointment] = useState<(Appointment & { normalizedStatus: string }) | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [visibleStaff, setVisibleStaff] = useState<string[]>(['Maria Garcia', 'Joshua Arabejo', 'Juan Reyes']);
  
  const allStatuses = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No Show'];
  const [visibleStatuses, setVisibleStatuses] = useState<string[]>(allStatuses);
  
  const [currentTime, setCurrentTime] = useState(new Date());

  // Form State
  const [newApt, setNewApt] = useState({
    customer: '',
    type: 'Fitting',
    date: '2026-10-28',
    time: '10:00',
    staff: 'Maria Garcia'
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

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Scheduled': return { badge: 'bg-blue-100 text-blue-700', cardOpacity: 'opacity-100' };
      case 'Confirmed': return { badge: 'bg-emerald-100 text-emerald-700', cardOpacity: 'opacity-100' };
      case 'Completed': return { badge: 'bg-slate-200 text-slate-700', cardOpacity: 'opacity-60 grayscale' };
      case 'Cancelled': return { badge: 'bg-rose-100 text-rose-700', cardOpacity: 'opacity-50 grayscale' };
      case 'No Show': return { badge: 'bg-orange-100 text-orange-700', cardOpacity: 'opacity-80' };
      default: return { badge: 'bg-slate-100 text-slate-700', cardOpacity: 'opacity-100' };
    }
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

  const toggleStatus = (status: string) => {
    setVisibleStatuses(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const handleEmptySlotClick = (date: string, hour: number) => {
    const formattedHour = `${hour.toString().padStart(2, '0')}:00`;
    setNewApt(prev => ({ ...prev, date, time: formattedHour, customer: '' }));
    setIsCreateModalOpen(true);
  };

  const handleReschedule = () => {
    if (selectedAppointment) {
      setNewApt({
        customer: selectedAppointment.customer,
        type: selectedAppointment.type,
        date: selectedAppointment.date,
        time: selectedAppointment.startTime,
        staff: selectedAppointment.staff
      });
      setIsModalOpen(false);
      setIsCreateModalOpen(true);
    }
  };

  const renderModalActions = (status: string) => {
    if (!selectedAppointment) return null;

    switch (status) {
      case 'Scheduled':
        return (
          <>
            <button onClick={() => { updateAppointmentStatus(selectedAppointment.id, 'Cancelled'); setIsModalOpen(false); }} className="px-4 h-10 text-[13px] font-bold text-rose-600 hover:bg-rose-50 rounded-md transition-all">Cancel Apt</button>
            <button onClick={handleReschedule} className="px-4 h-10 text-[13px] font-bold text-slate-600 hover:bg-slate-50 rounded-md transition-all">Reschedule</button>
            <button onClick={() => { updateAppointmentStatus(selectedAppointment.id, 'Confirmed'); setIsModalOpen(false); }} className="px-6 h-10 bg-indigo-600 text-white rounded-md font-black text-[13px] hover:bg-indigo-700 transition-all shadow-md">Confirm</button>
          </>
        );
      case 'Confirmed':
        return (
          <>
            <button onClick={handleReschedule} className="px-4 h-10 text-[13px] font-bold text-slate-600 hover:bg-slate-50 rounded-md transition-all">Reschedule</button>
            <button onClick={() => { updateAppointmentStatus(selectedAppointment.id, 'Completed'); setIsModalOpen(false); }} className="px-6 h-10 bg-emerald-600 text-white rounded-md font-black text-[13px] hover:bg-emerald-700 transition-all shadow-md">Mark Completed</button>
          </>
        );
      case 'No Show':
        return (
          <>
            <button onClick={handleReschedule} className="px-4 h-10 text-[13px] font-bold text-slate-600 hover:bg-slate-50 rounded-md transition-all">Reschedule</button>
            <button onClick={() => { updateAppointmentStatus(selectedAppointment.id, 'Completed'); setIsModalOpen(false); }} className="px-6 h-10 bg-emerald-600 text-white rounded-md font-black text-[13px] hover:bg-emerald-700 transition-all shadow-md">Mark Completed</button>
          </>
        );
      case 'Completed':
      case 'Cancelled':
      default:
        return (
          <button onClick={() => setIsModalOpen(false)} className="px-6 h-10 bg-slate-900 text-white rounded-md font-black text-[13px] hover:bg-slate-800 transition-all shadow-md">Close</button>
        );
    }
  };

  const mappedAppointments = useMemo(() => {
    return appointments.map(apt => ({
      ...apt,
      normalizedStatus: normalizeStatus(apt.status)
    }));
  }, [appointments]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Appointments</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Schedule and manage customer fittings and consultations.</p>
        </div>
        <button 
          onClick={() => {
            setNewApt(prev => ({ ...prev, customer: '', date: formatDate(selectedDate), time: '10:00' }));
            setIsCreateModalOpen(true);
          }}
          className="bg-slate-900 text-white h-11 px-6 rounded-2xl flex items-center gap-2 text-[13px] font-black hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
        >
          <Plus size={18} /> New Appointment
        </button>
      </div>
      <div className="flex h-[calc(100vh-280px)] bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      {/* ── LEFT SIDEBAR ── */}
      <aside className="w-64 border-r border-slate-200 flex flex-col p-4 space-y-8 shrink-0 overflow-y-auto custom-scrollbar">

        {/* Mini Calendar Mockup */}
        <div className="space-y-4 px-2">
           <div className="flex items-center justify-between">
             <span className="text-[13px] font-bold text-slate-900">October 2026</span>
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
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
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

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><Menu size={20} /></button>
            <h2 className="text-[18px] font-bold text-slate-900 ml-2">October 2026</h2>
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
                  <div key={`h-line-${h}`} className="absolute left-0 right-0 border-b border-slate-100" style={{ top: `${(h - 8 + 1) * HOUR_HEIGHT}px` }}></div>
                ))}
                
                {/* Vertical Grid Lines */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={`v-line-${i}`} className="absolute top-0 bottom-0 border-r border-slate-100 pointer-events-none" style={{ left: `${(i + 1) * (100 / 7)}%` }}></div>
                ))}

                {/* Current Time Line Indicator */}
                <div className="absolute left-0 right-0 z-20 flex items-center pointer-events-none" style={{ top: `${getCurrentTimePosition()}px` }}>
                   <div className="w-3 h-3 bg-rose-500 rounded-full -ml-1.5 shadow-sm"></div>
                   <div className="flex-1 h-px bg-rose-500"></div>
                </div>

                {/* Day Columns (for empty slot clicking) */}
                {weekDays.map((date, colIdx) => {
                  const dateStr = formatDate(date);
                  const dayAppointments = mappedAppointments.filter(a => 
                    a.date === dateStr && 
                    visibleStaff.includes(a.staff) &&
                    visibleStatuses.includes(a.normalizedStatus)
                  );
                  
                  return (
                    <div key={`col-${colIdx}`} className="relative h-full z-0 group">
                      {/* Clickable Empty Slots for this day */}
                      {hours.map((h) => (
                        <div 
                          key={`empty-${colIdx}-${h}`} 
                          onClick={() => handleEmptySlotClick(dateStr, h)}
                          className="absolute left-0 right-0 cursor-pointer transition-colors hover:bg-indigo-50/40"
                          style={{ top: `${(h - 8) * HOUR_HEIGHT}px`, height: `${HOUR_HEIGHT}px` }}
                        ></div>
                      ))}

                      {/* Appointment Cards */}
                      {dayAppointments.map((apt) => {
                        const statusStyle = getStatusStyles(apt.normalizedStatus);
                        return (
                          <div 
                            key={apt.id}
                            onClick={() => { setSelectedAppointment(apt); setIsModalOpen(true); }}
                            className={`absolute left-0.5 right-1.5 p-2 rounded-md border-l-4 cursor-pointer transition-all hover:shadow-lg hover:z-10 overflow-hidden ${getStaffColor(apt.staff)} shadow-sm ${statusStyle.cardOpacity} ${apt.normalizedStatus === 'Cancelled' ? 'line-through opacity-50' : ''}`}
                            style={calculatePosition(apt.startTime, apt.duration)}
                          >
                            <div className="flex justify-between items-start gap-1">
                              <div className="text-[12px] font-black leading-tight truncate">{apt.customer}</div>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-sm shrink-0 uppercase tracking-wider ${statusStyle.badge}`}>
                                {apt.normalizedStatus}
                              </span>
                            </div>
                            <div className="text-[10px] font-bold opacity-80 mt-1 truncate">{apt.startTime} - {apt.category}</div>
                            <div className="text-[9px] opacity-60 mt-0.5 flex justify-between">
                              <span className="italic">{apt.staff}</span>
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
                  <select 
                    value={newApt.customer}
                    onChange={(e) => setNewApt({...newApt, customer: e.target.value})}
                    className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-lg text-[15px] outline-none focus:border-slate-900 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%236B7280%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22%3E%3C/path%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_16px_center] bg-[length:16px]"
                  >
                    <option value="">Select Customer...</option>
                    <option value="Alexander McQueen">Alexander McQueen</option>
                    <option value="Maria Santos">Maria Santos</option>
                    <option value="John Doe">John Doe</option>
                    <option value="Elena Rostova">Elena Rostova</option>
                    <option value="James Jacob">James Jacob</option>
                    <option value="Jerome Bell">Jerome Bell</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-slate-900">Date</label>
                    <input 
                      type="date" 
                      value={newApt.date}
                      onChange={(e) => setNewApt({...newApt, date: e.target.value})}
                      className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-lg text-[15px] outline-none focus:border-slate-900 transition-all" 
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-medium text-slate-900">Time</label>
                    <input 
                      type="time" 
                      value={newApt.time}
                      onChange={(e) => setNewApt({...newApt, time: e.target.value})}
                      className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-lg text-[15px] outline-none focus:border-slate-900 transition-all" 
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[14px] font-medium text-slate-900">Appointment Type</label>
                  <select 
                    value={newApt.type}
                    onChange={(e) => setNewApt({...newApt, type: e.target.value})}
                    className="w-full h-[44px] px-4 bg-white border border-slate-200 rounded-lg text-[15px] outline-none focus:border-slate-900 transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%236B7280%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22%3E%3C/path%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_16px_center] bg-[length:16px]"
                  >
                    <option value="Fitting">Fitting</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Pick-up">Pick-up</option>
                    <option value="Measurement Session">Measurement Session</option>
                    <option value="Other">Other</option>
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
                  onClick={() => {
                    if (!newApt.customer) {
                      alert('Please select a customer first.');
                      return;
                    }

                    addAppointment({
                      customer: newApt.customer,
                      email: '', // Add proper email based on customer selection in real app
                      phone: '',
                      type: newApt.type,
                      category: newApt.type,
                      date: newApt.date,
                      startTime: newApt.time,
                      duration: 60,
                      status: 'Scheduled',
                      staff: newApt.staff,
                      reason: 'New appointment scheduled from portal.',
                    });

                    setIsCreateModalOpen(false);
                  }} 
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
              <div className="flex items-start justify-between gap-4">
                 <div className="flex items-start gap-4">
                   <div className="w-4 h-4 mt-1.5 rounded-sm bg-indigo-500"></div>
                   <div>
                     <h2 className="text-[24px] font-black text-slate-900 leading-tight">{selectedAppointment.customer}</h2>
                     <p className="text-[14px] text-slate-600 font-medium mt-1">{selectedAppointment.date} • {selectedAppointment.startTime}</p>
                   </div>
                 </div>
                 <span className={`text-[11px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${getStatusStyles(selectedAppointment.normalizedStatus).badge}`}>
                   {selectedAppointment.normalizedStatus}
                 </span>
              </div>

              <div className="space-y-5 pl-8">
                <div className="flex items-center gap-4 text-slate-600 hover:text-slate-900 transition-colors">
                  <User size={18} />
                  <div>
                    <div className="text-[13px] font-bold">{selectedAppointment.staff}</div>
                    <div className="text-[11px] opacity-60">Assigned Expert</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 text-slate-600">
                  <Menu size={18} className="mt-1 shrink-0" />
                  <p className="text-[13px] font-medium leading-relaxed italic text-slate-500">&quot;{selectedAppointment.reason}&quot;</p>
                </div>
                <div className="flex items-center gap-4 text-slate-600">
                  <Phone size={18} />
                  <span className="text-[13px] font-medium">{selectedAppointment.phone}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                {renderModalActions(selectedAppointment.normalizedStatus)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { 
  X, Calendar as CalendarIcon, Clock, MessageSquare, ChevronRight, 
  ChevronLeft, CheckCircle2, Sparkles, Scissors, Package,
  MapPin, Coffee, Video
} from 'lucide-react';
import { useERPStore } from '@/store/useERPStore';

interface BookConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BookConsultationModal: React.FC<BookConsultationModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { pushNotification } = useERPStore();
  const [step, setStep] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const [form, setForm] = useState({
    type: '',
    time: '',
    mode: 'In-Studio' as 'In-Studio' | 'Virtual',
    notes: ''
  });

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    
    // Fill previous month days
    const firstDayIndex = date.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex; i > 0; i--) {
      days.push({ day: prevMonthLastDay - i + 1, current: false, date: new Date(year, month - 1, prevMonthLastDay - i + 1) });
    }
    
    // Current month days
    const lastDay = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDay; i++) {
      days.push({ day: i, current: true, date: new Date(year, month, i) });
    }

    return days;
  }, [currentMonth]);

  if (!isOpen) return null;

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const isSameDay = (d1: Date, d2: Date | null) => {
    if (!d2) return false;
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  };

  const handleNext = () => {
    if (step === 1 && !form.type) {
      pushNotification('Please select a service type.', 'warning');
      return;
    }
    if (step === 2 && (!selectedDate || !form.time)) {
      pushNotification('Please select a date and time.', 'warning');
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleComplete = () => {
    pushNotification('Booking request sent! The shop owner will validate your appointment shortly.', 'success');
    if (onSuccess) onSuccess();
    onClose();
    setTimeout(() => {
      setStep(1);
      setSelectedDate(null);
      setForm({ type: '', time: '', mode: 'In-Studio', notes: '' });
    }, 500);
  };

  const SERVICES = [
    { id: 'Custom Tailoring', icon: <Sparkles className="text-amber-500" />, desc: 'Bespoke / one-of-a-kind garment' },
    { id: 'Bulk Order (Uniforms)', icon: <Package className="text-purple-500" />, desc: 'Group orders, teams, or corporate' },
    { id: 'Repair & Alterations', icon: <Scissors className="text-emerald-500" />, desc: 'Adjustments, resizing, or patching' },
  ];

  const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`bg-white w-full ${step === 2 ? 'max-w-[900px]' : 'max-w-[600px]'} rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[95vh] transition-all`}>
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1 rounded-full transition-all ${step >= s ? 'w-10 bg-emerald-600' : 'w-4 bg-slate-200'}`} />
              ))}
            </div>
            <h2 className="text-[26px] font-black text-slate-900 tracking-tight">
              {step === 1 && 'Select Service'}
              {step === 2 && 'Choose Date & Time'}
              {step === 3 && 'Final Details'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 rounded-2xl hover:bg-white flex items-center justify-center text-slate-400 transition-colors shadow-sm border border-slate-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          
          {/* STEP 1: SERVICE SELECTION */}
          {step === 1 && (
            <div className="p-10 space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
              <p className="text-[14px] font-medium text-slate-500 mb-6">Choose the type of service you wish to discuss with our master tailors.</p>
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setForm({ ...form, type: s.id })}
                  className={`w-full flex items-center gap-6 p-6 rounded-[32px] border-2 transition-all text-left group ${
                    form.type === s.id 
                      ? 'border-emerald-600 bg-emerald-50 shadow-xl shadow-emerald-600/5' 
                      : 'border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${form.type === s.id ? 'bg-emerald-600 text-white' : 'bg-white shadow-sm'}`}>
                    {React.cloneElement(s.icon as React.ReactElement, { size: 24 } as any)}
                  </div>
                  <div className="flex-1">
                    <div className={`text-[17px] font-black ${form.type === s.id ? 'text-emerald-900' : 'text-slate-900'}`}>{s.id}</div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-1">{s.desc}</div>
                  </div>
                  {form.type === s.id && <CheckCircle2 className="text-emerald-600" size={24} />}
                </button>
              ))}
            </div>
          )}

          {/* STEP 2: CALENDAR & TIME (SPLIT VIEW) */}
          {step === 2 && (
            <div className="flex flex-col lg:flex-row h-full min-h-[500px] animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Left: Calendar */}
              <div className="flex-1 p-10 border-r border-slate-100 bg-white">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-[18px] font-black text-slate-900">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                   </h3>
                   <div className="flex gap-2">
                     <button onClick={() => changeMonth(-1)} className="p-2 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-400"><ChevronLeft size={20}/></button>
                     <button onClick={() => changeMonth(1)} className="p-2 rounded-xl border border-slate-100 hover:bg-slate-50 text-slate-400"><ChevronRight size={20}/></button>
                   </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest p-2">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {daysInMonth.map((d, idx) => (
                    <button
                      key={idx}
                      disabled={!d.current}
                      onClick={() => setSelectedDate(d.date)}
                      className={`h-14 rounded-2xl flex flex-col items-center justify-center relative transition-all ${
                        !d.current ? 'text-slate-200' : 
                        isSameDay(d.date, selectedDate) 
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 z-10 scale-105' 
                        : 'hover:bg-emerald-50 text-slate-700 font-bold'
                      }`}
                    >
                      <span className="text-[14px]">{d.day}</span>
                      {d.current && !isSameDay(d.date, selectedDate) && (
                        <div className="w-1 h-1 bg-emerald-400 rounded-full mt-1 opacity-40" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Time Slots */}
              <div className="w-full lg:w-[350px] p-10 bg-slate-50/50">
                <div className="flex items-center gap-2 mb-8">
                  <Clock size={18} className="text-emerald-600" />
                  <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest">Available Times</h3>
                </div>

                {selectedDate ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
                    <p className="text-[11px] font-bold text-slate-400 mb-6">Showing slots for <span className="text-emerald-600">{selectedDate.toLocaleDateString(undefined, { dateStyle: 'medium' })}</span></p>
                    <div className="grid grid-cols-2 gap-3">
                      {TIME_SLOTS.map((t) => (
                        <button
                          key={t}
                          onClick={() => setForm({ ...form, time: t })}
                          className={`h-14 rounded-2xl text-[13px] font-black transition-all border-2 ${
                            form.time === t 
                              ? 'bg-white border-emerald-600 text-emerald-600 shadow-sm' 
                              : 'bg-white border-white text-slate-500 hover:border-slate-200 hover:text-slate-700'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-20">
                    <CalendarIcon size={40} className="mb-4 text-slate-300" />
                    <p className="text-[12px] font-bold text-slate-400 leading-relaxed">Please select a date from the calendar to view available time slots.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS & CONFIRM */}
          {step === 3 && (
            <div className="p-10 space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-emerald-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-6">Confirmed Selections</div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-[10px] font-bold text-emerald-100/50 uppercase tracking-widest mb-1">Service</div>
                    <div className="text-[15px] font-black flex items-center gap-2">
                      <Sparkles size={14} className="text-amber-400" /> {form.type}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-emerald-100/50 uppercase tracking-widest mb-1">Schedule</div>
                    <div className="text-[15px] font-black">
                      {selectedDate?.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {form.time}
                    </div>
                  </div>
                </div>
              </div>


              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Additional Notes (Optional)</label>
                <textarea 
                  className="w-full h-32 px-8 py-6 bg-slate-50 border border-slate-100 rounded-[32px] outline-none font-medium text-slate-900 focus:bg-white focus:border-emerald-600 transition-all resize-none shadow-inner"
                  placeholder="Tell us more about your requirements..."
                  value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})}
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex items-center gap-4 shrink-0">
          {step > 1 && (
            <button 
              onClick={handleBack}
              className="w-16 h-16 rounded-[24px] border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-600 transition-all shadow-sm"
            >
              <ChevronLeft size={28} />
            </button>
          )}
          
          {step < 3 ? (
            <button 
              onClick={handleNext}
              className="flex-1 h-16 bg-slate-900 text-white rounded-[24px] font-black text-[16px] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 group"
            >
              Continue to {step === 1 ? 'Schedule' : 'Details'} <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button 
              onClick={handleComplete}
              className="flex-1 h-16 bg-emerald-600 text-white rounded-[24px] font-black text-[16px] hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 group"
            >
              Complete Booking <CheckCircle2 size={22} className="group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Clock, Scissors, User, 
  ChevronRight, CheckCircle2, MapPin, Star, Sparkles,
  ChevronLeft, AlertCircle, Ruler, Box, MessageSquare, UserCheck,
  HelpCircle, Camera, Upload, Info, X, Plus, Link as LinkIcon
} from 'lucide-react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameDay, startOfDay, isBefore
} from 'date-fns';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useERPStore } from '@/store/useERPStore';


const APPOINTMENT_TYPES = [
  { id: 'consultation', name: 'Consultation', desc: 'Discuss designs & fabrics' },
  { id: 'measurement', name: 'Measurement', desc: 'Professional sizing session' },
  { id: 'fitting', name: 'Fitting', desc: 'Try on your ongoing order' },
  { id: 'pickup', name: 'Pickup', desc: 'Collect your finished garment' },
  { id: 'alteration', name: 'Alteration', desc: 'Resize or repair existing items' },
  { id: 'rtw_fitting', name: 'RTW Fitting', desc: 'Fit ready-to-wear items' },
];

const PURPOSES = [
  { id: 'custom', name: 'Custom Tailoring', icon: Scissors },
  { id: 'rtw', name: 'Ready-to-Wear Fitting', icon: Box },
  { id: 'alt', name: 'Alteration', icon: Ruler },
  { id: 'designer', name: 'Designer Consultation', icon: UserCheck },
  { id: 'bulk', name: 'Bulk Uniform Inquiry', icon: MessageSquare },
  { id: 'other', name: 'Other', icon: HelpCircle },
];

const STEPS = ['Service & Purpose', 'Schedule', 'Confirm'];

import { Suspense } from 'react';

function AppointmentBookingContent() {
  const searchParams = useSearchParams();
  const preSelectedProvider = searchParams.get('provider');
  
  const { appointments, addAppointment } = useERPStore();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [otherPurpose, setOtherPurpose] = useState('');
  const [notes, setNotes] = useState('');
  const [inspirationFiles, setInspirationFiles] = useState<File[]>([]);
  const [inspirationLink, setInspirationLink] = useState('');
  const [selectedProvider] = useState(preSelectedProvider || '');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(a => isSameDay(new Date(a.date), date));
  };

  const isDayFull = (date: Date) => {
    return getAppointmentsForDate(date).length >= 5;
  };

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '01:00 PM', '02:00 PM', '03:00 PM', 
    '04:00 PM', '05:00 PM'
  ];

  const handleConfirm = () => {
    if (selectedDate && time) {
      addAppointment({
        customer: 'John Doe',
        email: 'john@example.com',
        phone: '0912-345-6789',
        type: selectedType,
        category: 'Appointment',
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: time,
        duration: 60,
        status: 'Pending Review',
        staff: 'Unassigned',
        source: 'Online',
        reason: `${selectedType} - Purposes: ${selectedPurposes.join(', ')} ${otherPurpose ? `(${otherPurpose})` : ''}`,
        notes: `${notes}${inspirationLink ? `\n\nDesign Link: ${inspirationLink}` : ''}${inspirationFiles.length > 0 ? `\nInspiration Files: ${inspirationFiles.length}` : ''}`
      });
      nextStep();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...inspirationFiles, ...files].slice(0, 3);
    
    const totalSize = newFiles.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 10 * 1024 * 1024) {
      alert("Total file size exceeds 10MB limit.");
      return;
    }
    setInspirationFiles(newFiles);
  };

  return (
    <main className="min-h-screen bg-slate-50 font-poppins">
      {/* 1. COMPRESSED HEADER */}
      <section className="pt-20 pb-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-[32px] font-black text-slate-900 tracking-tight mb-2 uppercase">Book Appointment</h1>
          <p className="text-[13px] text-slate-500 font-bold max-w-lg mx-auto uppercase tracking-widest opacity-70">
            Select your service and schedule.
          </p>
        </div>
      </section>

      {/* 2. COMPACT STEPPER */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-center gap-8 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black transition-all border ${
                step >= i + 1 
                  ? 'bg-[#069668] text-white border-[#069668]' 
                  : 'bg-white text-slate-300 border-slate-100 shadow-sm'
              }`}>
                {step > i + 1 ? <CheckCircle2 size={12} /> : i + 1}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${step >= i + 1 ? 'text-[#069668]' : 'text-slate-300'}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && <div className="w-8 h-px bg-slate-200 ml-2" />}
            </div>
          ))}
        </div>

        {/* 3. DENSE CONTENT CONTAINER */}
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 md:p-10 shadow-sm min-h-[500px]">
          
          {/* STEP 1: APPOINTMENT DETAILS */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-10">
              
              {/* 1. Appointment Type */}
              <div>
                <div className="flex items-center gap-3 mb-5 px-2">
                  <div className="w-8 h-8 bg-[#069668] text-white rounded-xl flex items-center justify-center shadow-md">
                    <Info size={16} />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-black text-slate-900 tracking-tight uppercase">1. Appointment Type</h2>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {APPOINTMENT_TYPES.map((type) => (
                    <button 
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-5 rounded-2xl border transition-all text-left relative group ${
                        selectedType === type.id 
                          ? 'border-[#069668] bg-emerald-50/30 ring-1 ring-[#069668]' 
                          : 'border-slate-100 hover:border-emerald-600/20 bg-slate-50/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className={`p-2 rounded-lg ${selectedType === type.id ? 'bg-[#069668] text-white' : 'bg-white text-[#069668] shadow-sm'}`}>
                          <CalendarIcon size={14} />
                        </div>
                      </div>
                      <h3 className="text-[13px] font-black text-slate-900 mb-0.5 uppercase tracking-tight">{type.name}</h3>
                      <p className="text-[10px] text-slate-500 font-bold leading-tight">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Purpose Checkboxes */}
              <div>
                <div className="flex items-center gap-3 mb-5 px-2">
                  <div className="w-8 h-8 bg-[#069668] text-white rounded-xl flex items-center justify-center shadow-md">
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-black text-slate-900 tracking-tight uppercase">2. Appointment Purpose</h2>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PURPOSES.map((p) => {
                    const isSelected = selectedPurposes.includes(p.name);
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedPurposes(prev => 
                            prev.includes(p.name) 
                              ? prev.filter(item => item !== p.name)
                              : [...prev, p.name]
                          );
                        }}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left relative ${
                          isSelected 
                            ? 'bg-[#069668] border-[#069668] text-white shadow-lg' 
                            : 'bg-slate-50/50 border-slate-100 text-slate-500 hover:border-emerald-600/30'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/10' : 'bg-white text-[#069668] shadow-sm'}`}>
                          <p.icon size={16} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest leading-tight">{p.name}</span>
                        {isSelected && <div className="absolute top-2 right-2 w-3 h-3 bg-white text-[#069668] rounded-full flex items-center justify-center"><CheckCircle2 size={8} /></div>}
                      </button>
                    );
                  })}
                </div>

                {selectedPurposes.includes('Other') && (
                  <div className="mt-4 animate-in slide-in-from-top-2 duration-300">
                    <input 
                      type="text" 
                      placeholder="Specify purpose..."
                      value={otherPurpose}
                      onChange={(e) => setOtherPurpose(e.target.value)}
                      className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl px-5 text-[11px] font-black outline-none focus:bg-white focus:border-[#069668] transition-all"
                    />
                  </div>
                )}
              </div>

              {/* 3. Visual & Notes (Horizontal Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inspiration Upload */}
                <div>
                  <div className="flex items-center gap-3 mb-4 px-1">
                    <Camera size={14} className="text-[#069668]" />
                    <h2 className="text-[14px] font-black text-slate-900 uppercase">3. Inspiration</h2>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="relative h-32 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-[#069668] hover:bg-emerald-50/30 transition-all overflow-hidden bg-slate-50/50">
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} disabled={inspirationFiles.length >= 3} />
                      {inspirationFiles.length > 0 ? (
                        <div className="flex gap-2">
                          {inspirationFiles.map((_, i) => <div key={i} className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-[10px] font-black">{i+1}</div>)}
                        </div>
                      ) : (
                        <>
                          <Upload size={18} className="text-slate-300 group-hover:text-[#069668]" />
                          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Add Photos</span>
                        </>
                      )}
                    </label>

                    <div className="relative">
                      <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                      <input type="url" placeholder="Inspiration Link..." value={inspirationLink} onChange={(e) => setInspirationLink(e.target.value)}
                        className="w-full h-10 pl-12 pr-6 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:border-[#069668] transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <div className="flex items-center gap-3 mb-4 px-1">
                    <MessageSquare size={14} className="text-[#069668]" />
                    <h2 className="text-[14px] font-black text-slate-900 uppercase">4. Notes</h2>
                  </div>
                  <textarea 
                    rows={4}
                    placeholder="Tell us more..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-[172px] bg-slate-50 border border-slate-100 rounded-2xl p-5 text-[12px] font-bold outline-none focus:bg-white focus:border-[#069668] transition-all resize-none shadow-sm"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <button 
                  disabled={!selectedType || selectedPurposes.length === 0}
                  onClick={nextStep}
                  className={`w-full h-16 rounded-[24px] font-black text-[13px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl ${
                    !selectedType || selectedPurposes.length === 0
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-[#069668] text-white shadow-emerald-900/20 hover:bg-[#05855c]'
                  }`}
                >
                  Continue to Schedule
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SCHEDULING */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex flex-col lg:flex-row gap-14">
                {/* Minimalist Calendar */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-10">
                    <div>
                      <h2 className="text-[24px] font-black text-slate-900 uppercase">Select Date</h2>
                      <p className="text-[13px] text-slate-500 mt-1 font-medium">Workshop availability for appointments.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-full hover:bg-slate-50 transition-all">
                        <ChevronLeft size={18} className="text-slate-900" />
                      </button>
                      <span className="text-[13px] font-black uppercase tracking-[0.1em] text-slate-900 min-w-[120px] text-center">
                        {format(currentMonth, 'MMMM yyyy')}
                      </span>
                      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-full hover:bg-slate-50 transition-all">
                        <ChevronRight size={18} className="text-slate-900" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-3 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                      <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] py-2">{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-3">
                    {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                      <div key={`pad-${i}`} className="h-14" />
                    ))}
                    
                    {days.map((day) => {
                      const isPast = isBefore(day, startOfDay(new Date()));
                      const isSelected = selectedDate && isSameDay(day, selectedDate);
                      const full = isDayFull(day);

                      return (
                        <button
                          key={day.toString()}
                          disabled={isPast || full}
                          onClick={() => setSelectedDate(day)}
                          className={`h-14 rounded-2xl flex flex-col items-center justify-center relative transition-all border ${
                            isSelected ? 'bg-[#069668] border-[#069668] text-white shadow-lg shadow-emerald-900/10 scale-105 z-10' :
                            isPast ? 'bg-transparent border-transparent text-slate-200 cursor-not-allowed' :
                            full ? 'bg-transparent border-transparent text-rose-300 cursor-not-allowed line-through' :
                            'bg-white border-slate-100 text-slate-900 hover:border-[#069668] hover:bg-emerald-50/50'
                          }`}
                        >
                          <span className="text-[14px] font-black">{format(day, 'd')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Selection Sidebar */}
                <div className="w-full lg:w-[380px] bg-slate-50 rounded-[32px] p-10 border border-slate-200">
                  {selectedDate ? (
                    <div className="animate-in fade-in duration-500">
                      <div className="mb-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#069668] mb-2 block">Appointment Details</span>
                        <h3 className="text-[22px] font-black text-slate-900 uppercase">{format(selectedDate, 'EEEE, MMM do')}</h3>
                        <p className="text-[13px] text-slate-500 font-bold mt-1">at {selectedProvider || 'Central Workshop'}</p>
                      </div>

                      <div className="space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">Available Slots</label>
                        <div className="grid grid-cols-2 gap-4">
                          {timeSlots.map((t) => {
                            // Fix: Check if this slot is already booked for this specific date
                            const isBooked = appointments.some(a => 
                              isSameDay(new Date(a.date), selectedDate) && 
                              a.startTime === t
                            );
                            
                            // Also check if time has already passed for TODAY
                            const [h_m, period] = t.split(' ');
                            const [h, m] = h_m.split(':').map(Number);
                            const actualHour = period === 'PM' && h !== 12 ? h + 12 : (period === 'AM' && h === 12 ? 0 : h);
                            const slotTime = new Date(selectedDate);
                            slotTime.setHours(actualHour, m, 0, 0);
                            const isInPast = isBefore(slotTime, new Date());

                            return (
                              <button 
                                key={t}
                                disabled={isBooked || isInPast}
                                onClick={() => setTime(t)}
                                className={`h-12 rounded-xl text-[12px] font-black transition-all border flex items-center justify-center gap-2 ${
                                  time === t 
                                    ? 'bg-[#069668] border-[#069668] text-white' 
                                    : isBooked || isInPast
                                      ? 'bg-slate-50 border-transparent text-slate-200 cursor-not-allowed opacity-50'
                                      : 'bg-white border-slate-200 text-slate-900 hover:border-[#069668]'
                                }`}
                              >
                                <Clock size={14} /> {t}
                              </button>
                            );
                          })}
                        </div>
                        
                        {time && (
                          <button 
                            onClick={handleConfirm}
                            className="w-full h-14 bg-[#069668] text-white rounded-2xl font-black text-[14px] mt-10 hover:bg-[#05855c] transition-all shadow-xl shadow-emerald-900/10 flex items-center justify-center gap-3 uppercase tracking-widest"
                          >
                            Review Request <ChevronRight size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10">
                      <CalendarIcon size={48} strokeWidth={1} className="mb-6 opacity-30" />
                      <p className="text-[14px] font-black text-center px-4 uppercase tracking-tighter">Select a date from the workshop calendar to view availability.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRMATION */}
          {step === 3 && (
            <div className="animate-in zoom-in-95 duration-700 text-center py-10">
              <div className="w-24 h-24 bg-emerald-50 text-[#069668] rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-100">
                <Sparkles size={40} className="text-amber-400" />
              </div>
              <h2 className="text-[32px] font-black text-slate-900 mb-4 uppercase tracking-tighter">Request Received</h2>
              <p className="text-[15px] text-slate-500 font-medium mb-14 max-w-md mx-auto leading-relaxed">
                Your <span className="text-slate-900 font-black uppercase">{selectedType.replace('_', ' ')}</span> appointment request has been sent to <span className="text-slate-900 font-black">{selectedProvider || 'the workshop'}</span>.
                <br /><br />
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  {selectedDate ? format(selectedDate, 'MMMM do') : ''} @ {time}
                </span>
              </p>

              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <Link 
                  href="/customer/dashboard"
                  className="w-full h-16 bg-[#069668] text-white rounded-2xl font-black flex items-center justify-center hover:bg-[#05855c] transition-all shadow-xl shadow-emerald-900/20 uppercase tracking-widest"
                >
                  Return to Dashboard
                </Link>
                <button 
                  onClick={prevStep}
                  className="text-[13px] font-black text-slate-400 hover:text-slate-900 transition-all py-4 uppercase tracking-widest"
                >
                  Adjust Details
                </button>
              </div>
            </div>
          )}
        </div>
        
        {step < 3 && (
          <div className="mt-12 flex justify-between items-center px-4">
            <button 
              onClick={prevStep}
              className={`text-[13px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest ${step === 1 ? 'invisible' : ''}`}
            >
              Previous
            </button>
            <div className="flex gap-2">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-8 bg-[#069668]' : 'w-1.5 bg-slate-200'}`} />
              ))}
            </div>
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Phase {step} of 3
            </span>
          </div>
        )}
      </div>
    </main>
  );
}

export default function AppointmentBooking() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppointmentBookingContent />
    </Suspense>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Clock, Scissors, User, 
  ChevronRight, CheckCircle2, MapPin, Star, Sparkles,
  ChevronLeft, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  eachDayOfInterval, isSameDay, isToday, startOfDay,
  addDays, isBefore
} from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { useERPStore } from '@/store/useERPStore';


const SERVICES = [
  { id: 'bespoke', name: 'Full Bespoke', desc: 'Custom pattern & fabric selection' },
  { id: 'mtm', name: 'Made to Measure', desc: 'Modified standard patterns' },
  { id: 'alteration', name: 'Alterations', desc: 'Resizing & repairs' },
  { id: 'consultation', name: 'Design Consultation', desc: 'Style & fabric advice' },
];

const STEPS = ['Select Service', 'Schedule', 'Confirm'];

const PARTNERS = [
  { name: 'Davao Famous Tailoring', type: 'Shop', rating: 4.9, loc: 'San Pedro St.', category: 'shops' },
  { name: "Chard's Tailoring", type: 'Shop', rating: 4.8, loc: 'Ponciano St.', category: 'shops' },
  { name: 'Edgar Buyan', type: 'Designer', rating: 5.0, loc: 'Davao City', category: 'designers' },
  { name: 'Francis Libiran', type: 'Designer', rating: 4.9, loc: 'Manila (Remote)', category: 'designers' },
];

export default function AppointmentBooking() {
  const searchParams = useSearchParams();
  const preSelectedProvider = searchParams.get('provider');
  
  const { appointments, addAppointment } = useERPStore();
  const [step, setStep] = useState(preSelectedProvider ? 1 : 1); // Start at 1 regardless, but pre-fill
  const [selectedService, setSelectedService] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(preSelectedProvider || '');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  // Calendar Helpers
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(a => isSameDay(new Date(a.date), date));
  };

  const isDayFull = (date: Date) => {
    return getAppointmentsForDate(date).length >= 5; // Mock limit
  };

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '01:00 PM', '02:00 PM', '03:00 PM', 
    '04:00 PM', '05:00 PM'
  ];

  const handleConfirm = () => {
    if (selectedDate && time) {
      addAppointment({
        customer: 'John Doe', // Mock logged in user
        email: 'john@example.com',
        phone: '0912-345-6789',
        type: selectedService,
        category: 'Consultation',
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: time,
        duration: 60,
        status: 'Pending Review',
        staff: 'Unassigned',
        source: 'Online',
        reason: `Booking for ${selectedService}`
      });
      nextStep();
    }
  };


  return (
    <main className="min-h-screen bg-white">
      {/* 1. Header */}
      <section className="bg-slate-50 pt-20 pb-12 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Book Your Appointment.</h1>
          <p className="text-slate-500 font-medium">Reserve your session with SUTURAs master tailors and designers.</p>
        </div>
      </section>

      {/* 2. Progress Bar */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between relative mb-12">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2 z-0"></div>
          {STEPS.map((s, i) => (
            <div key={s} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-[14px] transition-all duration-500 ${
                step > i + 1 ? 'bg-indigo-600 text-white' : 
                step === i + 1 ? 'bg-slate-900 text-white ring-8 ring-slate-100' : 
                'bg-white border-2 border-slate-200 text-slate-400'
              }`}>
                {step > i + 1 ? <CheckCircle2 size={18} /> : i + 1}
              </div>
              <span className={`text-[11px] font-black uppercase tracking-widest mt-3 ${step === i + 1 ? 'text-slate-900' : 'text-slate-400'}`}>
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* 3. Steps Content */}
        <div className="bg-white rounded-[32px] border border-slate-100 p-8 md:p-12 shadow-xl shadow-slate-200/50 min-h-[500px]">
          
          {/* STEP 1: SERVICE */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <Scissors className="text-indigo-600" /> What are you looking for?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SERVICES.map((service) => (
                  <button 
                    key={service.id}
                    onClick={() => { setSelectedService(service.id); nextStep(); }}
                    className={`p-6 rounded-[24px] border-2 text-left transition-all group ${
                      selectedService === service.id ? 'border-indigo-600 bg-indigo-50/50 shadow-lg' : 'border-slate-100 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-black text-slate-900">{service.name}</h3>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedService === service.id ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200'
                      }`}>
                        {selectedService === service.id && <CheckCircle2 size={14} strokeWidth={3} />}
                      </div>
                    </div>
                    <p className="text-[14px] text-slate-500 font-medium mb-4">{service.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: SCHEDULE (Synchronized Calendar) */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col lg:flex-row gap-10">
                {/* Calendar View */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                      <CalendarIcon className="text-indigo-600" /> Choose Date
                    </h2>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ChevronLeft size={20} />
                      </button>
                      <span className="text-[14px] font-black uppercase tracking-widest text-slate-900 w-32 text-center">
                        {format(currentMonth, 'MMMM yyyy')}
                      </span>
                      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                      <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-2">{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {/* Padding for first day of month */}
                    {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                      <div key={`pad-${i}`} className="h-14" />
                    ))}
                    
                    {days.map((day) => {
                      const isPast = isBefore(day, startOfDay(new Date()));
                      const isSelected = selectedDate && isSameDay(day, selectedDate);
                      const full = isDayFull(day);
                      const hasAppts = getAppointmentsForDate(day).length > 0;

                      return (
                        <button
                          key={day.toString()}
                          disabled={isPast || full}
                          onClick={() => setSelectedDate(day)}
                          className={`h-14 rounded-xl flex flex-col items-center justify-center relative transition-all border-2 ${
                            isSelected ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-105 z-10' :
                            isPast ? 'bg-slate-50 border-transparent text-slate-200 cursor-not-allowed' :
                            full ? 'bg-rose-50 border-rose-100 text-rose-300 cursor-not-allowed line-through' :
                            'bg-white border-slate-100 text-slate-900 hover:border-indigo-600 hover:bg-indigo-50/30'
                          }`}
                        >
                          <span className="text-sm font-black">{format(day, 'd')}</span>
                          {hasAppts && !isSelected && !full && (
                            <div className={`absolute bottom-1 w-1 h-1 rounded-full ${getAppointmentsForDate(day).length > 3 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-8 flex items-center gap-6 text-[11px] font-bold text-slate-400">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /> Available</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400" /> Limited</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-400" /> Fully Booked</div>
                  </div>
                </div>

                {/* Details Panel */}
                <div className="w-full lg:w-[360px] bg-slate-50 rounded-[32px] p-8 border border-slate-100 flex flex-col">
                  {selectedDate ? (
                    <div className="animate-in fade-in duration-500">
                      <div className="mb-8">
                        <span className="text-[11px] font-black uppercase tracking-widest text-indigo-600 mb-2 block">Selected Schedule</span>
                        <h3 className="text-2xl font-black text-slate-900">{format(selectedDate, 'EEEE, MMM do')}</h3>
                        <p className="text-sm text-slate-500 font-medium mt-1">at {selectedProvider || 'Main Shop'}</p>
                      </div>

                      <div className="space-y-4 mb-8">
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block">Available Slots</label>
                        <div className="grid grid-cols-2 gap-3">
                          {timeSlots.map((t) => {
                            const isBooked = appointments.some(a => isSameDay(new Date(a.date), selectedDate) && a.startTime === t.replace(' AM', '').replace(' PM', ''));
                            return (
                              <button 
                                key={t}
                                disabled={isBooked}
                                onClick={() => setTime(t)}
                                className={`h-12 rounded-xl text-[13px] font-black transition-all border-2 flex items-center justify-center gap-2 ${
                                  time === t ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 
                                  isBooked ? 'bg-slate-100 border-transparent text-slate-300 cursor-not-allowed' :
                                  'bg-white border-white text-slate-900 hover:border-indigo-600'
                                }`}
                              >
                                <Clock size={14} /> {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {time ? (
                         <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-600/20">
                            <div className="flex items-center gap-3 mb-4">
                               <Sparkles size={20} />
                               <span className="text-sm font-black">Confirmation Ready</span>
                            </div>
                            <p className="text-xs font-medium text-indigo-100 leading-relaxed mb-6">
                               You have selected {selectedService} for {time}. This request will be sent to the shop owner for final approval.
                            </p>
                            <button 
                              onClick={handleConfirm}
                              className="w-full h-12 bg-white text-indigo-600 rounded-xl font-black text-sm hover:bg-slate-100 transition-colors"
                            >
                              Review & Book
                            </button>
                         </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                          <AlertCircle size={32} strokeWidth={1.5} className="mb-4" />
                          <p className="text-sm font-bold text-center">Select a time slot to continue</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                        <CalendarIcon size={32} strokeWidth={1.5} />
                      </div>
                      <p className="font-bold text-center">Select a date from the calendar to see available slots</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}


          {/* STEP 3: CONFIRM */}
          {step === 3 && (
            <div className="animate-in zoom-in-95 duration-500 text-center">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">Request Ready!</h2>
              <p className="text-slate-500 font-medium mb-12 max-w-md mx-auto">
                Youre about to book a <span className="text-slate-900 font-black">{selectedService}</span> with <span className="text-slate-900 font-black">{selectedProvider}</span> for <span className="text-slate-900 font-black">{selectedDate ? format(selectedDate, 'MMM do, yyyy') : ''}</span> at <span className="text-slate-900 font-black">{time}</span>.

              </p>

              <div className="space-y-4">
                <Link 
                  href="/customer/status"
                  className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center hover:bg-emerald-600 transition-all shadow-xl"
                >
                  Confirm Appointment
                </Link>
                <button 
                  onClick={prevStep}
                  className="w-full h-16 bg-white text-slate-400 font-bold hover:text-slate-900 transition-all"
                >
                  Go Back & Edit
                </button>
              </div>
            </div>
          )}
        </div>
        
        {step < 3 && (
          <div className="mt-8 flex justify-between">
            <button 
              onClick={prevStep}
              className={`text-[14px] font-bold text-slate-400 hover:text-slate-900 transition-colors ${step === 1 ? 'invisible' : ''}`}
            >
              Back
            </button>
            <p className="text-[12px] font-black text-slate-400 tracking-widest uppercase">
              Step {step} of 3
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

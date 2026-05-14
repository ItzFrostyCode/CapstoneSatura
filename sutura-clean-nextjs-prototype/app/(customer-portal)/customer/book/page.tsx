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

import { Suspense } from 'react';

function AppointmentBookingContent() {
  const searchParams = useSearchParams();
  const preSelectedProvider = searchParams.get('provider');
  
  const { appointments, addAppointment } = useERPStore();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(preSelectedProvider || '');
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
        type: selectedService,
        category: 'Consultation',
        date: format(selectedDate, 'yyyy-MM-dd'),
        startTime: time,
        duration: 60,
        status: 'Pending Review',
        staff: 'Unassigned',
        source: 'Online',
        reason: `Bespoke booking for ${selectedService}`
      });
      nextStep();
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* 1. Subtle Header */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-[42px] font-bold font-serif text-[#1C1917] tracking-tight mb-4">Secure Your Session</h1>
          <p className="text-[15px] text-[#78716C] font-medium max-w-lg mx-auto">
            Reserve a dedicated consultation with our master Staffs to begin your bespoke journey.
          </p>
        </div>
      </section>

      {/* 2. Minimalist Stepper */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-center gap-12 mb-16">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold transition-all duration-500 border ${
                step >= i + 1 
                  ? 'bg-[#1E3A1F] text-[#C9A84C] border-[#1E3A1F]' 
                  : 'bg-white text-[#78716C] border-[#E2DDD7]'
              }`}>
                {step > i + 1 ? <CheckCircle2 size={14} /> : i + 1}
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${step >= i + 1 ? 'text-[#1C1917]' : 'text-[#78716C]'}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && <div className="w-12 h-px bg-[#E2DDD7] ml-4" />}
            </div>
          ))}
        </div>

        {/* 3. Clean Content Container */}
        <div className="bg-white rounded-[40px] border border-[#E2DDD7] p-10 md:p-14 shadow-sm min-h-[550px]">
          
          {/* STEP 1: SERVICE SELECTION */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="mb-10">
                <h2 className="text-[24px] font-bold font-serif text-[#1C1917]">Select Service Type</h2>
                <p className="text-[14px] text-[#78716C] mt-1">Choose the nature of your bespoke consultation.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {SERVICES.map((service) => (
                  <button 
                    key={service.id}
                    onClick={() => { setSelectedService(service.id); nextStep(); }}
                    className={`p-8 rounded-[32px] border transition-all text-left group ${
                      selectedService === service.id 
                        ? 'border-[#1E3A1F] bg-[#1E3A1F]/5 ring-1 ring-[#1E3A1F]' 
                        : 'border-[#E2DDD7] hover:border-[#1E3A1F]/30 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className={`p-3 rounded-2xl transition-colors ${selectedService === service.id ? 'bg-[#1E3A1F] text-[#C9A84C]' : 'bg-[#FAF8F5] text-[#1E3A1F]'}`}>
                        <Scissors size={20} />
                      </div>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                        selectedService === service.id ? 'border-[#1E3A1F] bg-[#1E3A1F] text-[#C9A84C]' : 'border-[#E2DDD7]'
                      }`}>
                        {selectedService === service.id && <CheckCircle2 size={14} />}
                      </div>
                    </div>
                    <h3 className="text-[18px] font-bold text-[#1C1917] mb-1">{service.name}</h3>
                    <p className="text-[13px] text-[#78716C] font-medium leading-relaxed">{service.desc}</p>
                  </button>
                ))}
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
                      <h2 className="text-[24px] font-bold font-serif text-[#1C1917]">Select Date</h2>
                      <p className="text-[13px] text-[#78716C] mt-1">Workshop availability for consultations.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="w-10 h-10 flex items-center justify-center border border-[#E2DDD7] rounded-full hover:bg-[#FAF8F5] transition-all">
                        <ChevronLeft size={18} className="text-[#1C1917]" />
                      </button>
                      <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-[#1C1917] min-w-[120px] text-center">
                        {format(currentMonth, 'MMMM yyyy')}
                      </span>
                      <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="w-10 h-10 flex items-center justify-center border border-[#E2DDD7] rounded-full hover:bg-[#FAF8F5] transition-all">
                        <ChevronRight size={18} className="text-[#1C1917]" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-3 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                      <div key={d} className="text-center text-[10px] font-bold text-[#78716C] uppercase tracking-[0.2em] py-2">{d}</div>
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
                            isSelected ? 'bg-[#1E3A1F] border-[#1E3A1F] text-[#C9A84C] shadow-lg shadow-[#1E3A1F]/10 scale-105 z-10' :
                            isPast ? 'bg-transparent border-transparent text-[#E2DDD7] cursor-not-allowed' :
                            full ? 'bg-transparent border-transparent text-rose-300 cursor-not-allowed line-through' :
                            'bg-white border-[#F0EDE8] text-[#1C1917] hover:border-[#1E3A1F] hover:bg-[#1E3A1F]/5'
                          }`}
                        >
                          <span className="text-[14px] font-bold">{format(day, 'd')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Selection Sidebar */}
                <div className="w-full lg:w-[380px] bg-[#FAF8F5] rounded-[32px] p-10 border border-[#F0EDE8]">
                  {selectedDate ? (
                    <div className="animate-in fade-in duration-500">
                      <div className="mb-10">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A84C] mb-2 block">Appointment Details</span>
                        <h3 className="text-[22px] font-bold font-serif text-[#1C1917]">{format(selectedDate, 'EEEE, MMM do')}</h3>
                        <p className="text-[13px] text-[#78716C] mt-1">at {selectedProvider || 'Central Workshop'}</p>
                      </div>

                      <div className="space-y-6">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#78716C] block">Available Slots</label>
                        <div className="grid grid-cols-2 gap-4">
                          {timeSlots.map((t) => {
                            const isBooked = appointments.some(a => isSameDay(new Date(a.date), selectedDate) && a.startTime === t.replace(' AM', '').replace(' PM', ''));
                            return (
                              <button 
                                key={t}
                                disabled={isBooked}
                                onClick={() => setTime(t)}
                                className={`h-12 rounded-xl text-[12px] font-bold transition-all border flex items-center justify-center gap-2 ${
                                  time === t 
                                    ? 'bg-[#1E3A1F] border-[#1E3A1F] text-[#C9A84C]' 
                                    : 'bg-white border-[#E2DDD7] text-[#1C1917] hover:border-[#1E3A1F]'
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
                            className="w-full h-14 bg-[#1E3A1F] text-[#C9A84C] rounded-2xl font-bold text-[14px] mt-10 hover:bg-[#1C1917] transition-all shadow-xl shadow-[#1E3A1F]/10 flex items-center justify-center gap-3"
                          >
                            Review Request <ChevronRight size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-[#78716C] py-10">
                      <CalendarIcon size={48} strokeWidth={1} className="mb-6 opacity-30" />
                      <p className="text-[14px] font-medium text-center px-4">Select a date from the workshop calendar to view availability.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CONFIRMATION */}
          {step === 3 && (
            <div className="animate-in zoom-in-95 duration-700 text-center py-10">
              <div className="w-24 h-24 bg-[#1E3A1F]/5 text-[#1E3A1F] rounded-full flex items-center justify-center mx-auto mb-10 border border-[#1E3A1F]/10">
                <Sparkles size={40} className="text-[#C9A84C]" />
              </div>
              <h2 className="text-[32px] font-bold font-serif text-[#1C1917] mb-4">Request Prepared</h2>
              <p className="text-[15px] text-[#78716C] font-medium mb-14 max-w-md mx-auto leading-relaxed">
                Your <span className="text-[#1C1917] font-bold">{selectedService}</span> consultation is ready for artisan review on <span className="text-[#1C1917] font-bold">{selectedDate ? format(selectedDate, 'MMMM do') : ''}</span> at <span className="text-[#1C1917] font-bold">{time}</span>.
              </p>

              <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <Link 
                  href="/customer/orders"
                  className="w-full h-16 bg-[#1E3A1F] text-[#C9A84C] rounded-2xl font-bold flex items-center justify-center hover:bg-[#1C1917] transition-all shadow-xl shadow-[#1E3A1F]/20"
                >
                  Finalize Appointment
                </Link>
                <button 
                  onClick={prevStep}
                  className="text-[13px] font-bold text-[#78716C] hover:text-[#1C1917] transition-all py-4"
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
              className={`text-[13px] font-bold text-[#78716C] hover:text-[#1C1917] transition-colors ${step === 1 ? 'invisible' : ''}`}
            >
              Previous
            </button>
            <div className="flex gap-2">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-8 bg-[#C9A84C]' : 'w-1.5 bg-[#E2DDD7]'}`} />
              ))}
            </div>
            <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-[0.2em]">
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

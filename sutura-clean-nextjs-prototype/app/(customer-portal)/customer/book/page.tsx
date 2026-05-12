'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Clock, Scissors, User, 
  ChevronRight, CheckCircle2, MapPin, Star, Sparkles
} from 'lucide-react';
import Link from 'next/link';

const SERVICES = [
  { id: 'bespoke', name: 'Full Bespoke', desc: 'Custom pattern & fabric selection', price: 'Starts at ₱15,000' },
  { id: 'mtm', name: 'Made to Measure', desc: 'Modified standard patterns', price: 'Starts at ₱8,000' },
  { id: 'alteration', name: 'Alterations', desc: 'Resizing & repairs', price: 'Starts at ₱500' },
  { id: 'consultation', name: 'Design Consultation', desc: 'Style & fabric advice', price: 'Free' },
];

const STEPS = ['Select Service', 'Provider', 'Schedule', 'Confirm'];

export default function AppointmentBooking() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

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
                    <p className="text-[12px] font-black text-indigo-600 uppercase tracking-widest">{service.price}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: PROVIDER (Shop/Designer) */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <User className="text-indigo-600" /> Choose Your Partner
              </h2>
              <div className="space-y-4">
                {[
                  { name: 'Davao Famous Tailoring', type: 'Shop', rating: 4.9, loc: 'San Pedro St.' },
                  { name: 'Edgar Buyan', type: 'Designer', rating: 5.0, loc: 'Davao City' },
                  { name: "Chard's Tailoring", type: 'Shop', rating: 4.8, loc: 'Ponciano St.' },
                ].map((p, i) => (
                  <button 
                    key={i}
                    onClick={() => { setSelectedProvider(p.name); nextStep(); }}
                    className={`w-full p-5 rounded-2xl border-2 text-left flex items-center gap-6 transition-all ${
                      selectedProvider === p.name ? 'border-indigo-600 bg-indigo-50/50 shadow-lg' : 'border-slate-100 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center shrink-0">
                      {p.type === 'Shop' ? <Sparkles className="text-indigo-600" /> : <User className="text-indigo-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-black text-slate-900">{p.name}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-black uppercase text-slate-500 tracking-widest">{p.type}</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-500 text-[13px] font-medium">
                        <span className="flex items-center gap-1"><MapPin size={14} /> {p.loc}</span>
                        <span className="flex items-center gap-1"><Star size={14} className="fill-amber-400 text-amber-400" /> {p.rating}</span>
                      </div>
                    </div>
                    <ChevronRight className="text-slate-300" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: SCHEDULE */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <CalendarIcon className="text-indigo-600" /> Pick Date & Time
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Select Date</label>
                  <input 
                    type="date" 
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-xl px-4 font-bold outline-none focus:bg-white focus:border-indigo-600 transition-all"
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Preferred Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'].map((t) => (
                      <button 
                        key={t}
                        onClick={() => setTime(t)}
                        className={`h-12 rounded-lg text-[13px] font-black transition-all ${
                          time === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-12 flex justify-end">
                <button 
                  disabled={!date || !time}
                  onClick={nextStep}
                  className="h-14 px-10 bg-slate-900 text-white rounded-xl font-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-600 transition-all"
                >
                  Review Summary
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRM */}
          {step === 4 && (
            <div className="animate-in zoom-in-95 duration-500 text-center">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">Request Ready!</h2>
              <p className="text-slate-500 font-medium mb-12 max-w-md mx-auto">
                You're about to book a <span className="text-slate-900 font-black">{selectedService}</span> with <span className="text-slate-900 font-black">{selectedProvider}</span> for <span className="text-slate-900 font-black">{date}</span> at <span className="text-slate-900 font-black">{time}</span>.
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
        
        {step < 4 && (
          <div className="mt-8 flex justify-between">
            <button 
              onClick={prevStep}
              className={`text-[14px] font-bold text-slate-400 hover:text-slate-900 transition-colors ${step === 1 ? 'invisible' : ''}`}
            >
              Back
            </button>
            <p className="text-[12px] font-black text-slate-400 tracking-widest uppercase">
              Step {step} of 4
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

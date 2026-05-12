'use client';

import React, { useState } from 'react';
import { 
  X, Calendar as CalendarIcon, Clock, 
  Video, Coffee, User, ChevronRight,
  CheckCircle2, AlertCircle, Calendar
} from 'lucide-react';

interface BookConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName?: string;
  requestId?: string;
}

export function BookConsultationModal({ isOpen, onClose, clientName = '', requestId = '' }: BookConsultationModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    client: clientName,
    date: '',
    time: '',
    mode: 'In-Studio',
    type: 'Initial Consultation',
    notes: ''
  });

  if (!isOpen) return null;

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '01:30 PM', '02:30 PM', '03:30 PM', '04:30 PM'
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-[500px] bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-8">
           {/* Header */}
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h2 className="text-xl font-black text-slate-900 tracking-tight">Book Consultation</h2>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Sutura Designer Studio</p>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                 <X size={16} />
              </button>
           </div>

           {step === 1 ? (
             <div className="space-y-6">
                <div className="space-y-4">
                   <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Client Name</label>
                      <div className="relative">
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                         <input 
                           type="text"
                           value={formData.client}
                           onChange={(e) => setFormData({...formData, client: e.target.value})}
                           placeholder="Enter client name"
                           className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-indigo-600 transition-all"
                         />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Meeting Mode</label>
                         <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                            <button 
                              onClick={() => setFormData({...formData, mode: 'In-Studio'})}
                              className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all flex items-center justify-center gap-2 ${formData.mode === 'In-Studio' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                            >
                               <Coffee size={12} /> Studio
                            </button>
                            <button 
                              onClick={() => setFormData({...formData, mode: 'Virtual'})}
                              className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all flex items-center justify-center gap-2 ${formData.mode === 'Virtual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                            >
                               <Video size={12} /> Virtual
                            </button>
                         </div>
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Session Type</label>
                         <select 
                           value={formData.type}
                           onChange={(e) => setFormData({...formData, type: e.target.value})}
                           className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-indigo-600"
                         >
                            <option>Initial Consultation</option>
                            <option>Measurement</option>
                            <option>Concept Review</option>
                            <option>Final Fitting</option>
                         </select>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                >
                   Pick Date & Time <ChevronRight size={18} />
                </button>
             </div>
           ) : (
             <div className="space-y-6">
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block ml-1">Select Time Slot</label>
                   <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <button 
                          key={time}
                          onClick={() => setFormData({...formData, time})}
                          className={`py-3 rounded-xl text-[10px] font-black transition-all border ${formData.time === time ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-slate-100 text-slate-500 hover:border-slate-900'}`}
                        >
                           {time}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50">
                   <div className="flex gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                         <Calendar size={18} />
                      </div>
                      <div>
                         <div className="text-xs font-black text-slate-900">Confirmation Summary</div>
                         <div className="text-[10px] font-bold text-slate-500 mt-0.5">
                            {formData.client} • {formData.mode} • {formData.time || 'No time selected'}
                         </div>
                      </div>
                   </div>
                </div>

                <div className="flex gap-3">
                   <button 
                     onClick={() => setStep(1)}
                     className="px-6 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all"
                   >
                      Back
                   </button>
                   <button 
                     onClick={onClose}
                     className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2"
                   >
                      Confirm Booking <CheckCircle2 size={18} />
                   </button>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

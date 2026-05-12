'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, User, MessageSquare, Video, Coffee, Sparkles } from 'lucide-react';
import { useERPStore } from '@/store/useERPStore';
import { Appointment } from '@/types/erp';

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
  const { customers, pushNotification } = useERPStore();
  const [form, setForm] = useState({
    customerId: '',
    date: '',
    time: '',
    type: 'Initial Consultation',
    mode: 'In-Studio' as 'In-Studio' | 'Virtual',
    notes: ''
  });

  if (!isOpen) return null;

  const handleBook = () => {
    if (!form.customerId || !form.date || !form.time) {
      pushNotification('Please fill in all required fields.', 'error');
      return;
    }

    const customer = customers.find(c => c.id === form.customerId);
    
    // Simulate adding to store
    // In a real app, we'd use a store action
    pushNotification(`Consultation booked for ${customer?.name || 'Client'} on ${form.date}`, 'success');
    
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-[550px] rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-[24px] font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="text-indigo-600" size={24} />
              Book Consultation
            </h2>
            <p className="text-[12px] text-slate-400 font-bold uppercase tracking-widest mt-1">Schedule a new design session</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-slate-400 transition-colors shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Client Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Select Client</label>
              <select 
                className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900 focus:bg-white focus:border-indigo-600 transition-all"
                value={form.customerId}
                onChange={e => setForm({...form, customerId: e.target.value})}
              >
                <option value="">Choose a customer...</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Preferred Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="date" 
                    className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900 focus:bg-white focus:border-indigo-600 transition-all"
                    value={form.date}
                    onChange={e => setForm({...form, date: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Start Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="time" 
                    className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900 focus:bg-white focus:border-indigo-600 transition-all"
                    value={form.time}
                    onChange={e => setForm({...form, time: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Session Type</label>
                <select 
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900 focus:bg-white focus:border-indigo-600 transition-all"
                  value={form.type}
                  onChange={e => setForm({...form, type: e.target.value})}
                >
                  <option>Initial Consultation</option>
                  <option>Measurement Session</option>
                  <option>First Fitting</option>
                  <option>Final Fitting</option>
                  <option>Design Review</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Meeting Mode</label>
                <div className="flex p-1 bg-slate-100 rounded-2xl">
                  <button 
                    onClick={() => setForm({...form, mode: 'In-Studio'})}
                    className={`flex-1 h-10 rounded-xl flex items-center justify-center gap-2 text-[11px] font-black transition-all ${form.mode === 'In-Studio' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Coffee size={14} /> Studio
                  </button>
                  <button 
                    onClick={() => setForm({...form, mode: 'Virtual'})}
                    className={`flex-1 h-10 rounded-xl flex items-center justify-center gap-2 text-[11px] font-black transition-all ${form.mode === 'Virtual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Video size={14} /> Virtual
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Design Notes / Requirements</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 text-slate-400" size={16} />
                <textarea 
                  className="w-full h-24 pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-900 focus:bg-white focus:border-indigo-600 transition-all resize-none"
                  placeholder="e.g. Client wants a silk-blend barong with intricate embroidery..."
                  value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              onClick={handleBook}
              className="w-full h-14 bg-slate-900 text-white rounded-[24px] font-black text-[15px] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

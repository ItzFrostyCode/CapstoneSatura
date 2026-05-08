'use client';

import React from 'react';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Tag, 
  History, 
  Ruler, 
  ShoppingBag,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Appointment, Customer, MeasurementProfile, Order } from '@/types/erp';
interface AppointmentSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onRegisterCustomer?: (name: string, phone: string, email: string) => void;
  customer?: Customer;
  history?: Appointment[];
  measurements?: MeasurementProfile[];
  orders?: Order[];
}

const formatTime = (timeStr: string) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 || 12;
  return `${hh}:${minutes} ${ampm}`;
};

export function AppointmentSidePanel({ 
  isOpen, 
  onClose, 
  appointment,
  onRegisterCustomer,
  customer,
  history = [],
  measurements = [],
  orders = []
}: AppointmentSidePanelProps) {
  if (!isOpen || !appointment) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] animate-in fade-in duration-300" 
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-[500px] bg-white z-[201] shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500 flex flex-col">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Request Details</h2>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mt-1">Ref: {appointment.id}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:bg-slate-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-10">
          {/* Section 1: Appointment Info */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Calendar size={32} />
              </div>
              <div>
                <h3 className="text-[18px] font-black text-slate-900">{appointment.type}</h3>
                <div className="flex items-center gap-2 text-[14px] font-bold text-slate-500 mt-1">
                  <Clock size={14} className="text-slate-300" />
                  {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} @ {formatTime(appointment.startTime)}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Customer Message / Reason</label>
              <p className="text-[14px] text-slate-700 font-medium leading-relaxed italic">
                &quot;{appointment.reason || 'No additional notes provided.'}&quot;
              </p>
            </div>
          </section>

          {/* Section 2: Customer Profile Context */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <User size={14} className="text-indigo-400" /> Customer Context
              </h4>
              {customer ? (
                <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                  See Profile <ExternalLink size={10} />
                </button>
              ) : (
                <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[9px] font-black uppercase tracking-tighter rounded-md border border-rose-100">
                  Unrecorded
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-[16px]">
                    {appointment.customer.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[16px] font-black text-slate-900">{appointment.customer}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[12px] font-medium text-slate-500 flex items-center gap-1">
                        <Phone size={12} className="text-slate-300" /> {appointment.phone}
                      </span>
                    </div>
                  </div>
                </div>
                
                {!customer && onRegisterCustomer && (
                  <button 
                    onClick={() => onRegisterCustomer(appointment.customer, appointment.phone || '', appointment.email || '')}
                    className="h-10 px-4 bg-indigo-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                  >
                    Auto-Add to CRM
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1">
                <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    <History size={12} /> Past Appointments
                  </div>
                  <p className="text-[16px] font-black text-slate-900">{history.length}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Measurements & History Quick View */}
          <section className="space-y-4">
             <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Ruler size={14} className="text-indigo-400" /> Recent Activity
              </h4>
            </div>

            {history.length > 0 ? (
              <div className="space-y-3">
                {history.slice(0, 3).map((hist, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-50 bg-slate-50/30">
                    <div className={`mt-1 w-2 h-2 rounded-full ${hist.status === 'Completed' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <div className="flex-1">
                      <p className="text-[13px] font-bold text-slate-700">{hist.type}</p>
                      <p className="text-[11px] font-medium text-slate-500">{new Date(hist.date).toLocaleDateString()}</p>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">{hist.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400 italic text-[12px]">
                No previous appointment history found.
              </div>
            )}
          </section>

          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4">
            <Tag size={24} className="text-amber-600 shrink-0" />
            <div>
              <p className="text-[13px] text-amber-900 font-bold">Reviewer Tip</p>
              <p className="text-[12px] text-amber-700/80 font-medium leading-relaxed">
                Check the customer&apos;s history. Regular customers or those with urgent fitting needs should be prioritized for early slots.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button className="flex-1 h-12 bg-white border border-slate-200 rounded-xl text-[14px] font-black text-slate-600 hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
            <MessageSquare size={18} /> Contact Customer
          </button>
        </div>
      </div>
    </>
  );
}

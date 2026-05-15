'use client';

import React from 'react';
import { 
  X, User, Phone, Clock, 
  Image as ImageIcon, Ruler, ArrowRight,
  UserCheck, ChevronLeft, ChevronRight, Check, ShieldCheck,
  Link as LinkIcon, CheckCircle, Camera
} from 'lucide-react';
import { Appointment, Customer, Staff } from '@/store/useERPStore';

export interface NewAppointmentForm {
  customerId: string;
  type: string;
  date: string;
  time: string;
  staffId: string;
  reason: string;
  source: 'Walk-in' | 'Online';
}

interface AppointmentModalsProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  newApt: NewAppointmentForm;
  setNewApt: React.Dispatch<React.SetStateAction<NewAppointmentForm>>;
  customers: Customer[];
  staff: Staff[];
  appointments: Appointment[];
  handleSaveAppointment: () => void;
  selectedAppointment: Appointment | null;
  isDetailsModalOpen: boolean;
  setIsDetailsModalOpen: (open: boolean) => void;
  getStatusStyles: (status: string) => { badge: string; cardOpacity: string };
  renderModalActions: (status: string) => React.ReactNode;
}

const BOOKING_TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

export const AppointmentModals: React.FC<AppointmentModalsProps> = ({
  isCreateModalOpen,
  setIsCreateModalOpen,
  newApt,
  setNewApt,
  customers,
  staff,
  appointments,
  handleSaveAppointment,
  selectedAppointment,
  isDetailsModalOpen,
  setIsDetailsModalOpen
}) => {
  // Helper to normalize time to 24h for robust comparison
  const to24h = (timeStr: string) => {
    if (!timeStr) return '';
    const normalized = timeStr.toUpperCase();
    if (normalized.includes('AM') || normalized.includes('PM')) {
      const [time, period] = normalized.split(' ');
      const [hStr, mStr] = time.split(':');
      let h = Number(hStr);
      const m = Number(mStr || 0);
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
    const [hStr, mStr] = normalized.split(':');
    const h = Number(hStr);
    const m = Number(mStr || 0);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  // Helper to check if a date is fully booked
  const isDateFullyBooked = (dateStr: string) => {
    const dayApts = appointments.filter(a => 
      a.date === dateStr && 
      ['Scheduled', 'Completed', 'Pending Review'].includes(a.status)
    );
    return BOOKING_TIME_SLOTS.every(slot => dayApts.some(a => to24h(a.startTime) === to24h(slot)));
  };

  const isSlotBooked = (dateStr: string, timeStr: string) => {
    return appointments.some(a => 
      a.date === dateStr && 
      to24h(a.startTime) === to24h(timeStr) && 
      ['Scheduled', 'Completed', 'Pending Review'].includes(a.status)
    );
  };

  return (
    <>
      {/* ── WALK-IN / FRONT DESK BOOKING MODAL ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[850px] rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
             {/* Header */}
             <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-emerald-50/20">
                <div>
                  <h2 className="text-[24px] font-black text-slate-900 tracking-tight uppercase">Walk-in Booking</h2>
                  <p className="text-[12px] text-[#069668] font-black uppercase tracking-widest mt-1 opacity-60">Golden Needle Tailoring • Front Desk Intake</p>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(false)} 
                  className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-200 transition-all shadow-sm"
                >
                  <X size={20}/>
                </button>
             </div>
             
             {/* Body */}
             <div className="p-10 space-y-8 overflow-y-auto custom-scrollbar bg-slate-50/10">
                {/* 1. CUSTOMER & STAFF SELECTION */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                      <User size={12} className="text-[#069668]" /> Customer
                    </label>
                    <select 
                      value={newApt.customerId}
                      onChange={(e) => setNewApt({...newApt, customerId: e.target.value})}
                      className="w-full h-12 px-5 bg-white border border-slate-200 rounded-xl text-[13px] font-black outline-none focus:border-[#069668] transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%23069668%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22%3E%3C/path%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_15px_center] bg-[length:14px]"
                    >
                      <option value="">Select a customer...</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                      <UserCheck size={12} className="text-[#069668]" /> Assign To
                    </label>
                    <select 
                      value={newApt.staffId}
                      onChange={(e) => setNewApt({...newApt, staffId: e.target.value})}
                      className="w-full h-12 px-5 bg-white border border-slate-200 rounded-xl text-[13px] font-black outline-none focus:border-[#069668] transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%23069668%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22%3E%3C/path%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_15px_center] bg-[length:14px]"
                    >
                      {staff.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.roles?.join(', ') || 'Staff'})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. PURPOSE SELECTION */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">1. Purpose</label>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex gap-2">
                      {['Consultation', 'Custom Clothing', 'Alterations'].map((p) => (
                        <button
                          key={p}
                          onClick={() => setNewApt({...newApt, type: p})}
                          className={`flex-1 h-10 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border ${newApt.type === p ? 'bg-[#069668] border-[#069668] text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setNewApt({...newApt, type: 'Other'})}
                      className={`w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border ${newApt.type === 'Other' ? 'bg-[#069668] border-[#069668] text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    >
                      Other
                    </button>
                  </div>
                </div>

                {/* 3. SCHEDULE (2.5 RATIO) */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">2. Schedule</label>
                  <div className="flex gap-4">
                    {/* Calendar Container */}
                    <div className="flex-[2.5] bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-[12px] font-black uppercase tracking-widest text-slate-900">May 2026</span>
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"><ChevronLeft size={16}/></button>
                          <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"><ChevronRight size={16}/></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-2">
                        {['S','M','T','W','T','F','S'].map((d, i) => <div key={i} className="text-center text-[9px] font-black text-slate-300 mb-2 uppercase">{d}</div>)}
                        {Array.from({ length: 31 }).map((_, i) => {
                          const dateStr = `2026-05-${i+1 < 10 ? '0'+(i+1) : (i+1)}`;
                          const isFull = isDateFullyBooked(dateStr);
                          const isSelected = newApt.date === dateStr;

                          return (
                            <button
                              key={i}
                              disabled={isFull}
                              onClick={() => setNewApt({...newApt, date: dateStr, time: ''})}
                              className={`h-11 rounded-xl flex flex-col items-center justify-center text-[13px] font-black transition-all relative ${
                                isSelected
                                  ? 'bg-[#069668] text-white shadow-lg scale-105 z-10'
                                  : isFull 
                                    ? 'bg-rose-50 text-rose-500 border border-rose-100 cursor-not-allowed'
                                    : 'bg-slate-50/50 text-slate-600 hover:bg-emerald-50 hover:text-[#069668] border border-transparent'
                              }`}
                            >
                              <span>{i + 1}</span>
                              {isFull && <span className="text-[6px] font-black uppercase opacity-60">Full</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time List Container */}
                    <div className="flex-1 space-y-3">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 px-1">Time</div>
                      <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
                        {BOOKING_TIME_SLOTS.map(t => {
                          const isBooked = isSlotBooked(newApt.date, t);
                          const isSelected = newApt.time === t;

                          return (
                            <button
                              key={t}
                              disabled={isBooked}
                              onClick={() => setNewApt({...newApt, time: t})}
                              className={`h-12 rounded-xl flex items-center justify-between px-4 text-[11px] font-black transition-all border ${
                                isSelected 
                                  ? 'bg-[#069668] border-[#069668] text-white shadow-md' 
                                  : isBooked
                                    ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-500 hover:bg-emerald-50/30'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <Clock size={14} className={isSelected ? 'text-white' : 'text-slate-300'} /> 
                                {t}
                              </span>
                              {isBooked ? (
                                <span className="text-[8px] font-black uppercase">Booked</span>
                              ) : isSelected && (
                                <Check size={14} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. INSPIRATION & 4. NOTES - STACKED */}
                <div className="space-y-10">
                  {/* Inspiration */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">3. Inspiration</label>
                    <div className="grid grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square border-2 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center gap-1.5 bg-white hover:bg-slate-50 transition-all cursor-pointer group shadow-sm">
                          <ImageIcon size={20} className="text-slate-300 group-hover:text-[#069668] transition-colors" />
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-[#069668]">3MB MAX</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Link Input - Below Images */}
                    <div className="space-y-2 w-full">
                      <div className="relative">
                        <LinkIcon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="url" 
                          placeholder="Paste link..."
                          className="w-full h-12 pl-12 pr-5 bg-white border border-slate-200 rounded-xl text-[12px] font-bold outline-none focus:border-[#069668] transition-all shadow-sm"
                        />
                      </div>
                      <div className="text-[8px] text-slate-400 px-1 font-bold uppercase italic tracking-wider flex items-center gap-2">
                        <div className="w-1 h-1 bg-[#069668] rounded-full animate-pulse" />
                        Pinterest / Google Drive
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">4. Notes</label>
                    <textarea 
                      rows={4}
                      placeholder="Specific fit requests or details..."
                      value={newApt.reason}
                      onChange={(e) => setNewApt({...newApt, reason: e.target.value})}
                      className="w-full p-6 bg-white border border-slate-200 rounded-[32px] text-[13px] font-bold outline-none focus:border-[#069668] transition-all resize-none shadow-sm"
                    />
                  </div>
                </div>

                {/* 5. POLICY TERMS */}
                <div className="bg-slate-900 rounded-[32px] p-8 space-y-6">
                  <div>
                    <h4 className="text-[14px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-emerald-400" /> Booking Terms
                    </h4>
                    <ul className="grid grid-cols-2 gap-4">
                      {[
                        'Subject to Shop Approval (Check your notifications)',
                        '30-minute No-Show grace period only',
                        'Inspiration assets are used for prep-work',
                        'Reschedule at least 24 hours in advance'
                      ].map((text, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                          <span className="text-[10px] font-bold text-slate-400 leading-tight uppercase tracking-tight">{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex items-center gap-4">
                    <button className="w-6 h-6 rounded-md bg-[#069668] text-white flex items-center justify-center border-none shadow-lg">
                      <Check size={16} />
                    </button>
                    <p className="text-[11px] font-black text-white uppercase tracking-widest">I agree to the appointment review and confirmation policy.</p>
                  </div>
                </div>
             </div>
             
             {/* Footer */}
             <div className="px-10 py-8 border-t border-slate-100 flex items-center justify-end gap-6 bg-white">
                <button 
                  onClick={() => setIsCreateModalOpen(false)} 
                  className="text-[13px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveAppointment} 
                  disabled={!newApt.customerId || !newApt.date || !newApt.time}
                  className="h-14 px-10 bg-[#069668] text-white rounded-2xl text-[13px] font-black uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-emerald-900/20 active:scale-95 flex items-center gap-3"
                >
                  Confirm Walk-in Booking <ArrowRight size={18} />
                </button>
             </div>
          </div>
        </div>
      )}

      {/* ── APPOINTMENT DETAIL MODAL ── */}
      {isDetailsModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[480px] rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-10 space-y-8">
              <div className="flex items-start justify-between gap-4">
                 <div className="flex items-start gap-5">
                   <div className="w-6 h-6 mt-2 rounded-full bg-emerald-500 shadow-xl shadow-emerald-200"></div>
                   <div>
                     <h2 className="text-[28px] font-black text-slate-900 leading-tight tracking-tight">{selectedAppointment.customer}</h2>
                     <div className="flex items-center gap-3 text-[14px] text-slate-400 font-bold mt-2 uppercase tracking-widest">
                       {selectedAppointment.date} • {selectedAppointment.startTime}
                     </div>
                   </div>
                 </div>
                 <button 
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-[24px] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                    <span className="text-[12px] font-black text-slate-900 uppercase tracking-widest">{selectedAppointment.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Type</span>
                    <span className="text-[12px] font-black text-slate-900 uppercase tracking-widest">{selectedAppointment.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Staff</span>
                    <span className="text-[12px] font-black text-slate-900 uppercase tracking-widest">{selectedAppointment.staff}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Source</span>
                    <span className="text-[12px] font-black text-slate-900 uppercase tracking-widest">{selectedAppointment.source}</span>
                  </div>
                </div>

                <div className="p-6 bg-emerald-50/30 border border-emerald-50 rounded-[24px]">
                  <div className="text-[12px] font-black text-emerald-600 uppercase tracking-widest mb-2">Purpose / Notes</div>
                  <p className="text-[15px] font-bold text-emerald-900/70 italic">&quot;{selectedAppointment.reason || 'No specific notes provided.'}&quot;</p>
                </div>

                {selectedAppointment.source === 'Online' && selectedAppointment.type === 'Custom Clothing' && (
                  <div className="p-6 bg-slate-900 rounded-[24px] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon size={14} /> Inspiration Image
                      </span>
                    </div>
                    <div className="aspect-video bg-white/5 rounded-xl overflow-hidden border border-white/10 group cursor-pointer">
                       <img 
                         src="/catalog/Modern Filipiniana.png" 
                         alt="Inspiration" 
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                       />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 p-6 bg-emerald-50/30 border border-emerald-50 rounded-[24px]">
                  <Phone size={18} className="text-emerald-500" />
                  <div>
                    <div className="text-[14px] font-black text-emerald-900">{selectedAppointment.phone}</div>
                    <div className="text-[11px] font-bold text-emerald-500/60 uppercase tracking-widest">Contact Number</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                {selectedAppointment.status === 'Scheduled' && (
                  <button 
                    onClick={() => {
                      setIsDetailsModalOpen(false);
                      window.location.href = '/shop-owner/orders?new=true';
                    }}
                    className="w-full h-16 bg-[#069668] text-white rounded-[22px] font-black text-[13px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 flex items-center justify-center gap-3"
                  >
                    <Ruler size={18} />
                    Convert to Job Order
                    <ArrowRight size={18} />
                  </button>
                )}
                <button 
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="w-full h-14 bg-white border border-slate-200 text-slate-400 rounded-[22px] font-black text-[13px] uppercase tracking-widest hover:text-slate-900 hover:border-slate-300 transition-all active:scale-95"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

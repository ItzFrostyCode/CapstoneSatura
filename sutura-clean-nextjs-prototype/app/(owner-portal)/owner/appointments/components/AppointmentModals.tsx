'use client';

import React from 'react';
import { X, User, Phone, Menu, CalendarDays, Clock, Globe } from 'lucide-react';
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
  handleSaveAppointment: () => void;
  selectedAppointment: Appointment | null;
  isDetailsModalOpen: boolean;
  setIsDetailsModalOpen: (open: boolean) => void;
  getStatusStyles: (status: string) => { badge: string; cardOpacity: string };
  renderModalActions: (status: string) => React.ReactNode;
}

export const AppointmentModals: React.FC<AppointmentModalsProps> = ({
  isCreateModalOpen,
  setIsCreateModalOpen,
  newApt,
  setNewApt,
  customers,
  staff,
  handleSaveAppointment,
  selectedAppointment,
  isDetailsModalOpen,
  setIsDetailsModalOpen,
  getStatusStyles,
  renderModalActions
}) => {
  return (
    <>
      {/* ── SCHEDULE APPOINTMENT MODAL ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[550px] rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col">
             {/* Header */}
             <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div>
                  <h2 className="text-[24px] font-black text-slate-900 tracking-tight">Schedule Walk In Appointment</h2>
                  <p className="text-[13px] text-slate-500 font-bold uppercase tracking-widest mt-1">Book customer session and assign staff</p>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(false)} 
                  className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-200 transition-all shadow-sm"
                >
                  <X size={20}/>
                </button>
             </div>
             
             {/* Body */}
             <div className="p-10 space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar">
                {/* Customer Selection */}
                <div className="space-y-3">
                  <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} className="text-indigo-400" /> Customer
                  </label>
                  <select 
                    value={newApt.customerId}
                    onChange={(e) => setNewApt({...newApt, customerId: e.target.value})}
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-[15px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%236B7280%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22%3E%3C/path%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_20px_center] bg-[length:18px]"
                  >
                    <option value="">Select a customer...</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <CalendarDays size={14} className="text-indigo-400" /> Date
                    </label>
                    <input 
                      type="date" 
                      value={newApt.date}
                      onChange={(e) => setNewApt({...newApt, date: e.target.value})}
                      className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-[15px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={14} className="text-indigo-400" /> Time
                    </label>
                    <input 
                      type="time" 
                      value={newApt.time}
                      onChange={(e) => setNewApt({...newApt, time: e.target.value})}
                      className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-[15px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Menu size={14} className="text-indigo-400" /> Appointment Type
                    </label>
                    <select 
                      value={newApt.type}
                      onChange={(e) => setNewApt({...newApt, type: e.target.value})}
                      className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-[15px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%236B7280%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22%3E%3C/path%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_20px_center] bg-[length:18px]"
                    >
                      <option value="CONSULTATION">CONSULTATION</option>
                      <option value="MEASUREMENT">MEASUREMENT</option>
                      <option value="FITTING">FITTING</option>
                      <option value="PICKUP">PICKUP</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Globe size={14} className="text-indigo-400" /> Source
                    </label>
                    <select 
                      value={newApt.source}
                      onChange={(e) => setNewApt({...newApt, source: e.target.value as 'Walk-in' | 'Online'})}
                      className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-[15px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%236B7280%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22%3E%3C/path%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_20px_center] bg-[length:18px]"
                    >
                      <option value="Walk-in">Walk-in</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <User size={14} className="text-indigo-400" /> Assigned Staff
                  </label>
                  <select 
                    value={newApt.staffId}
                    onChange={(e) => setNewApt({...newApt, staffId: e.target.value})}
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-[15px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%236B7280%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22%3E%3C/path%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_20px_center] bg-[length:18px]"
                  >
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Purpose / Notes</label>
                  <textarea 
                    rows={3}
                    value={newApt.reason}
                    onChange={(e) => setNewApt({...newApt, reason: e.target.value})}
                    placeholder="e.g. Initial wedding tuxedo discussion..."
                    className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[24px] text-[15px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
                  ></textarea>
                </div>
             </div>
             
             {/* Footer */}
             <div className="px-10 py-8 border-t border-slate-100 flex items-center justify-end gap-6 bg-slate-50/30">
                <button 
                  onClick={() => setIsCreateModalOpen(false)} 
                  className="text-[15px] font-black text-slate-400 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveAppointment} 
                  disabled={!newApt.customerId}
                  className="h-14 px-10 bg-slate-900 text-white rounded-[22px] text-[15px] font-black hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl shadow-slate-900/20 active:scale-95"
                >
                  Schedule Appointment
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
                   <div className="w-6 h-6 mt-2 rounded-full bg-indigo-500 shadow-xl shadow-indigo-200"></div>
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

                <div className="p-6 bg-indigo-50/30 border border-indigo-50 rounded-[24px]">
                  <div className="text-[12px] font-black text-indigo-400 uppercase tracking-widest mb-2">Purpose / Notes</div>
                  <p className="text-[15px] font-bold text-indigo-900/70 italic">&quot;{selectedAppointment.reason || 'No specific notes provided.'}&quot;</p>
                </div>

                <div className="flex items-center gap-4 p-6 bg-emerald-50/30 border border-emerald-50 rounded-[24px]">
                  <Phone size={18} className="text-emerald-500" />
                  <div>
                    <div className="text-[14px] font-black text-emerald-900">{selectedAppointment.phone}</div>
                    <div className="text-[11px] font-bold text-emerald-500/60 uppercase tracking-widest">Contact Number</div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="w-full h-14 bg-slate-900 text-white rounded-[22px] font-black text-[15px] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
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

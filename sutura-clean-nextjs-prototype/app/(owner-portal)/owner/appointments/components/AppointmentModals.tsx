'use client';

import React from 'react';
import { X, Search, MoreVertical, User, Phone, Menu, CalendarDays, Clock } from 'lucide-react';
import { Appointment, Customer, Staff } from '@/store/useERPStore';

export interface NewAppointmentForm {
  customerId: string;
  type: string;
  date: string;
  time: string;
  staffId: string;
  reason: string;
}

interface AppointmentModalsProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  newApt: NewAppointmentForm;
  setNewApt: React.Dispatch<React.SetStateAction<NewAppointmentForm>>;
  customers: Customer[];
  staff: Staff[];
  handleSaveAppointment: () => void;
  selectedAppointment: (Appointment & { normalizedStatus: string }) | null;
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
      {/* ── CREATE APPOINTMENT MODAL ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[500px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
             {/* Header */}
             <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Schedule Appointment</h2>
                  <p className="text-[12px] text-slate-500 font-bold uppercase tracking-widest mt-1">Book a new session</p>
                </div>
                <button onClick={() => setIsCreateModalOpen(false)} className="w-10 h-10 hover:bg-white rounded-xl flex items-center justify-center text-slate-400 transition-all"><X size={20}/></button>
             </div>
             
             {/* Body */}
             <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Customer</label>
                  <select 
                    value={newApt.customerId}
                    onChange={(e) => setNewApt({...newApt, customerId: e.target.value})}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%236B7280%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22%3E%3C/path%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_16px_center] bg-[length:16px]"
                  >
                    <option value="">Select Customer...</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Date</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="date" 
                        value={newApt.date}
                        onChange={(e) => setNewApt({...newApt, date: e.target.value})}
                        className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all" 
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="time" 
                        value={newApt.time}
                        onChange={(e) => setNewApt({...newApt, time: e.target.value})}
                        className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all" 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Appointment Type</label>
                  <select 
                    value={newApt.type}
                    onChange={(e) => setNewApt({...newApt, type: e.target.value})}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%236B7280%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22%3E%3C/path%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_16px_center] bg-[length:16px]"
                  >
                    <option value="Fitting">Fitting</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Pick-up">Pick-up</option>
                    <option value="Measurement Session">Measurement Session</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Assigned Staff</label>
                  <select 
                    value={newApt.staffId}
                    onChange={(e) => setNewApt({...newApt, staffId: e.target.value})}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%236B7280%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 stroke-width=%222%22 d=%22M19 9l-7 7-7-7%22%3E%3C/path%3E%3C/svg%3E')] bg-no-repeat bg-[position:right_16px_center] bg-[length:16px]"
                  >
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Notes / Reason</label>
                  <textarea 
                    rows={3}
                    value={newApt.reason}
                    onChange={(e) => setNewApt({...newApt, reason: e.target.value})}
                    placeholder="e.g. First fitting for wedding tuxedo..."
                    className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none"
                  ></textarea>
                </div>
             </div>
             
             {/* Footer */}
             <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-end gap-4 bg-slate-50/50">
                <button 
                  onClick={() => setIsCreateModalOpen(false)} 
                  className="h-12 px-6 text-[14px] font-black text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveAppointment} 
                  disabled={!newApt.customerId}
                  className="h-12 px-8 bg-slate-900 text-white rounded-[18px] text-[14px] font-black hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                >
                  Save Appointment
                </button>
             </div>
          </div>
        </div>
      )}

      {/* ── APPOINTMENT DETAIL MODAL ── */}
      {isDetailsModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[450px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="h-20 bg-slate-50/50 flex items-center justify-between px-8 border-b border-slate-100">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 cursor-pointer transition-all shadow-sm"><Search size={18} /></div>
                 <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 cursor-pointer transition-all shadow-sm"><MoreVertical size={18} /></div>
               </div>
               <button 
                onClick={() => setIsDetailsModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl text-slate-400 hover:text-slate-900 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-8">
              <div className="flex items-start justify-between gap-4">
                 <div className="flex items-start gap-4">
                   <div className="w-5 h-5 mt-2 rounded-lg bg-indigo-500 shadow-lg shadow-indigo-200"></div>
                   <div>
                     <h2 className="text-[26px] font-black text-slate-900 leading-tight tracking-tight">{selectedAppointment.customer}</h2>
                     <div className="flex items-center gap-2 text-[13px] text-slate-500 font-bold mt-1 uppercase tracking-wider">
                       <CalendarDays size={14} className="text-slate-400" /> {selectedAppointment.date} 
                       <span className="opacity-30 mx-1">•</span> 
                       <Clock size={14} className="text-slate-400" /> {selectedAppointment.startTime}
                     </div>
                   </div>
                 </div>
                 <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border border-current/10 ${getStatusStyles(selectedAppointment.normalizedStatus).badge}`}>
                   {selectedAppointment.normalizedStatus}
                 </span>
              </div>

              <div className="space-y-6 pl-9">
                <div className="flex items-center gap-4 group cursor-default">
                  <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors"><User size={18} /></div>
                  <div>
                    <div className="text-[14px] font-black text-slate-900">{selectedAppointment.staff}</div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Assigned Expert</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 group cursor-default">
                  <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0 mt-1"><Menu size={18} /></div>
                  <div>
                    <p className="text-[14px] font-bold leading-relaxed text-slate-600 italic">&quot;{selectedAppointment.reason || 'No specific notes provided.'}&quot;</p>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Visit Reason</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 group cursor-default">
                  <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors"><Phone size={18} /></div>
                  <div>
                    <div className="text-[14px] font-black text-slate-900">{selectedAppointment.phone}</div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Contact Number</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                {renderModalActions(selectedAppointment.normalizedStatus)}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import { 
  X,
  Check,
  CheckCircle2, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  AlertTriangle,
  Info,
  CalendarCheck,
  Sun,
  CloudSun,
  Moon
} from 'lucide-react';
import { Appointment, Staff } from '@/types/erp';

// Re-defining Staff specifically for the modal to avoid typing issues if imported incorrectly
interface SimpleStaff {
  id: string;
  name: string;
}

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  staffMembers: SimpleStaff[];
  allAppointments: Appointment[];
  onConfirm: (data: { staffId: string; date: string; time: string }) => void;
}

const formatTime = (timeStr: string) => {
  if (!timeStr) return 'TBD';
  const [hours, minutes] = timeStr.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = h % 12 || 12;
  return `${hh}:${minutes} ${ampm}`;
};

const getTimeOfDay = (timeStr: string) => {
  const hour = parseInt(timeStr.split(':')[0]);
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
};

export function ConfirmScheduleModal({ 
  isOpen, 
  onClose, 
  appointment, 
  staffMembers,
  allAppointments,
  onConfirm 
}: ApprovalModalProps) {
  const [staffId, setStaffId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (appointment) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDate(appointment.date);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTime(appointment.startTime);
    }
  }, [appointment]);

  // Smart Availability Check
  const dailySchedule = allAppointments.filter(a => a.date === date && a.status !== 'Cancelled' && a.id !== appointment?.id);
  const conflict = dailySchedule.find(a => a.startTime === time);

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-250 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[550px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <CalendarCheck size={24} />
            </div>
            <div>
              <h2 className="text-[20px] font-black tracking-tight">Confirm & Schedule</h2>
              <p className="text-[13px] text-indigo-100 font-medium">Commit this slot to the branch calendar.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-600 shrink-0">
              <Info size={20} />
            </div>
            <p className="text-[13px] text-indigo-900 font-medium leading-relaxed">
              You are approving <span className="font-black">{appointment.customer}&apos;s</span> request for a <span className="font-black">{appointment.type}</span>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Staff</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold text-[14px] appearance-none"
                >
                  <option value="" disabled>Select Staff</option>
                  {staffMembers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Final Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold text-[14px]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Final Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 font-bold text-[14px]"
                />
              </div>
            </div>
          </div>

          {/* Smart Availability Section */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} className="text-indigo-400" /> Daily Schedule Check
              </h5>
              <span className="text-[10px] font-bold text-slate-400">{date}</span>
            </div>
            
            {conflict ? (
              <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 rounded-xl animate-pulse">
                <AlertTriangle className="text-rose-600" size={18} />
                <div>
                  <p className="text-[12px] font-black text-rose-900">Time Slot Conflict!</p>
                  <p className="text-[11px] text-rose-700 font-medium">Already booked for {conflict.customer} at {formatTime(conflict.startTime)}</p>
                </div>
              </div>
            ) : dailySchedule.length > 0 ? (
              <div className="flex flex-col gap-4">
                {[
                  { id: 'Morning', label: 'Morning', icon: <Sun size={14} className="text-amber-500" />, range: '8AM-12PM' },
                  { id: 'Afternoon', label: 'Afternoon', icon: <CloudSun size={14} className="text-sky-500" />, range: '12PM-5PM' },
                  { id: 'Evening', label: 'Evening', icon: <Moon size={14} className="text-indigo-500" />, range: '5PM-8PM' }
                ].map(session => {
                  const sessionAppointments = dailySchedule.filter(a => getTimeOfDay(a.startTime) === session.id);
                  const isSelectedSession = getTimeOfDay(time) === session.id;

                  return (
                    <div key={session.id} className={`p-3 rounded-2xl border transition-all ${
                      isSelectedSession ? 'bg-white border-indigo-200 shadow-sm' : 'bg-slate-50/50 border-slate-100'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {session.icon}
                          <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{session.label}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{session.range}</span>
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          sessionAppointments.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {sessionAppointments.length > 0 ? `${sessionAppointments.length} Booked` : 'Available'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {sessionAppointments.length > 0 ? (
                          sessionAppointments.map((apt, i) => (
                            <div key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-600 shadow-sm flex items-center gap-2">
                              <Clock size={10} className="text-slate-300" />
                              {formatTime(apt.startTime)}
                            </div>
                          ))
                        ) : (
                          <span className="text-[11px] font-bold text-slate-300 italic ml-1">No appointments yet</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[12px] text-slate-400 italic py-1">No other appointments scheduled for this day.</p>
            )}
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-4 items-center">
          {conflict && (
            <p className="text-[11px] font-bold text-rose-500 flex-1">Please select another time to avoid double-booking.</p>
          )}
          <button onClick={onClose} className="px-6 h-12 text-[14px] font-bold text-slate-500 hover:text-slate-900 transition-all">Cancel</button>
          <button 
            disabled={!staffId || !date || !time || !!conflict}
            onClick={() => onConfirm({ staffId, date, time })}
            className="px-8 h-12 bg-indigo-600 text-white rounded-xl text-[14px] font-black shadow-lg shadow-indigo-600/20 hover:bg-slate-900 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm & Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

interface DeclineModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onConfirm: (reason: string, note: string) => void;
}

export function DeclineRequestModal({ isOpen, onClose, appointment, onConfirm }: DeclineModalProps) {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const reasons = [
    "Fully booked for this date",
    "Tailor/Staff unavailable",
    "Invalid/Duplicate request",
    "Service no longer offered"
  ];

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-250 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-[450px] rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h2 className="text-[20px] font-black text-slate-900">Decline Appointment?</h2>
              <p className="text-[14px] text-slate-500 font-medium px-4 mt-1">This will cancel the request and notify {appointment.customer}.</p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Reason for Declining</label>
            <div className="grid grid-cols-1 gap-2">
              {reasons.map((r, i) => (
                <button
                  key={i}
                  onClick={() => setReason(r)}
                  className={`p-3 rounded-xl border text-left text-[13px] font-bold transition-all ${
                    reason === r ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div className="pt-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">
                Additional Description / Notes
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter details about why this is being declined..."
                className="w-full h-24 px-6 py-4 bg-slate-50 border border-slate-100 rounded-[20px] text-[14px] font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:bg-white transition-all resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-10 p-8 border-t border-slate-100 bg-slate-50">
          <button 
            onClick={onClose}
            className="flex-1 h-16 bg-white text-slate-500 border border-slate-200 rounded-[22px] text-[15px] font-black hover:bg-slate-100 transition-all active:scale-95"
          >
            Go Back
          </button>
          <button 
            disabled={!reason}
            onClick={() => {
              onConfirm(reason, note);
              setReason('');
              setNote('');
              onClose();
            }}
            className="flex-2 h-16 bg-slate-900 text-white rounded-[22px] text-[15px] font-black hover:bg-rose-600 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
          >
            Confirm Decline
          </button>
        </div>
      </div>
    </div>
  );
}

export function CompleteAppointmentModal({
  isOpen,
  onClose,
  appointment,
  onConfirm
}: {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onConfirm: (notes: string) => void;
}) {
  const [notes, setNotes] = useState('');

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10">
          <div className="w-16 h-16 bg-emerald-50 rounded-[24px] flex items-center justify-center text-emerald-600 mb-8">
            <Check size={32} />
          </div>
          
          <h2 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">Complete Appointment</h2>
          <p className="text-[15px] text-slate-500 font-bold mt-3 leading-relaxed">
            Finalize the appointment with {appointment.customer}. You can add some completion notes for the records.
          </p>

          <div className="mt-8 space-y-6">
            <div>
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">
                Completion Notes / Summary
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How did the session go? (e.g., Final measurements taken, ready for production)"
                className="w-full h-32 px-6 py-4 bg-slate-50 border border-slate-100 rounded-[24px] text-[15px] font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <button 
              onClick={onClose}
              className="flex-1 h-16 bg-slate-50 text-slate-500 rounded-[22px] text-[15px] font-black hover:bg-slate-100 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              onClick={() => {
                onConfirm(notes);
                setNotes('');
                onClose();
              }}
              className="flex-2 h-16 bg-slate-900 text-white rounded-[22px] text-[15px] font-black hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 px-8"
            >
              Finalize & Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

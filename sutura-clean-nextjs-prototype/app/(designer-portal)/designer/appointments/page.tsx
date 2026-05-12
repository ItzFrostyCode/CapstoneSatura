'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Clock, User, 
  Search, Filter, Plus, ChevronLeft, 
  ChevronRight, MoreHorizontal, Video, 
  Coffee, CheckCircle2, FileText,
  XCircle, Check, AlertCircle, Sparkles,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

export default function DesignerConsultations() {
  const [activeTab, setActiveTab] = useState<'queue' | 'calendar' | 'scheduled'>('queue');

  const pendingRequests = [
    { 
      id: 'REQ-990', 
      client: 'Sofia Loren', 
      date: 'May 12, 2026', 
      time: '02:00 PM', 
      type: 'Initial Consultation', 
      message: 'Interested in a custom gala gown for a summer wedding.',
      mode: 'In-Studio',
      status: 'Pending Review'
    }
  ];

  const confirmedAppointments = [
    { id: 'APP-101', client: 'Maria Clara Santos', time: '10:00 AM', type: 'Initial Consultation', status: 'Confirmed', mode: 'In-Studio', date: 'May 10, 2026' },
    { id: 'APP-105', client: 'Ricardo Dalisay', time: '01:30 PM', type: 'Measurement & Fitting', status: 'Confirmed', mode: 'Virtual', date: 'May 10, 2026' },
  ];

  return (
    <div className="space-y-8 font-outfit max-w-[1400px] mx-auto pb-20">
      
      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Consultation Calendar</h1>
          <p className="text-[13px] text-slate-500 font-bold mt-1 uppercase tracking-widest flex items-center gap-2">
            Manage your design bookings and client meetings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-11 px-6 bg-indigo-600 text-white rounded-2xl flex items-center gap-2 text-[13px] font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 group">
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> Book Consultation
          </button>
        </div>
      </div>

      {/* ── STATS / KPIs ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-2">
         <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pending Inquiries</div>
            <div className="text-2xl font-black text-indigo-600">{pendingRequests.length}</div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Today's Meetings</div>
            <div className="text-2xl font-black text-slate-900">{confirmedAppointments.length}</div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Capacity</div>
            <div className="text-2xl font-black text-slate-900">85%</div>
         </div>
         <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Virtual Sessions</div>
            <div className="text-2xl font-black text-emerald-600">42</div>
         </div>
      </div>

      {/* ── VIEW SWITCHER & SEARCH ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
        <div className="flex items-center p-1 bg-slate-100 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('queue')}
            className={`h-10 px-6 rounded-xl flex items-center gap-2 text-[12px] font-black transition-all ${
              activeTab === 'queue' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Inquiry Queue {pendingRequests.length > 0 && <span className="px-1.5 py-0.5 bg-indigo-600 text-white rounded-md text-[9px]">{pendingRequests.length}</span>}
          </button>
          <button 
            onClick={() => setActiveTab('scheduled')}
            className={`h-10 px-6 rounded-xl flex items-center gap-2 text-[12px] font-black transition-all ${
              activeTab === 'scheduled' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Scheduled Meetings
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`h-10 px-6 rounded-xl flex items-center gap-2 text-[12px] font-black transition-all ${
              activeTab === 'calendar' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Studio Calendar
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              placeholder="Search consultations..." 
              className="w-full h-11 pl-12 pr-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:border-indigo-600 transition-all shadow-sm"
            />
          </div>
          <button className="h-11 w-11 flex items-center justify-center bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {activeTab === 'queue' ? (
        /* ── INQUIRY QUEUE: COMPACT TABLE ── */
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Inquiry</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type / Mode</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Requested Schedule</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {pendingRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xs">
                                  {req.client.charAt(0)}
                               </div>
                               <div>
                                  <div className="text-sm font-black text-slate-900">{req.client}</div>
                                  <div className="text-[11px] font-medium text-slate-400 italic mt-0.5 truncate max-w-[200px]">"{req.message}"</div>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <div className="text-sm font-bold text-slate-700">{req.type}</div>
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase mt-1">
                               {req.mode === 'Virtual' ? <Video size={12} className="text-emerald-500" /> : <Coffee size={12} className="text-amber-500" />}
                               {req.mode}
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <div className="text-sm font-black text-slate-900">{req.date}</div>
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 mt-1">
                               <Clock size={12} /> {req.time}
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-amber-100">
                               {req.status}
                            </span>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center justify-end gap-2">
                               <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[11px] font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                                  Accept
                               </button>
                               <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-rose-500 transition-all border border-transparent hover:border-rose-100">
                                  <XCircle size={18} />
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      ) : activeTab === 'scheduled' ? (
        /* ── SCHEDULED MEETINGS: COMPACT TABLE ── */
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultation Type</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Handoff</th>
                       <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {confirmedAppointments.map((appt) => (
                      <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-8 py-6">
                            <div className="text-sm font-black text-slate-900">{appt.client}</div>
                            <div className="text-[10px] font-black text-slate-400 uppercase mt-0.5 tracking-tight">{appt.id}</div>
                         </td>
                         <td className="px-8 py-6">
                            <div className="text-sm font-bold text-slate-700">{appt.type}</div>
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase mt-1">
                               {appt.mode === 'Virtual' ? <Video size={12} className="text-emerald-500" /> : <Coffee size={12} className="text-amber-500" />}
                               {appt.mode}
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <div className="text-sm font-black text-slate-900">{appt.date}</div>
                            <div className="text-[11px] font-bold text-slate-400 mt-0.5">{appt.time}</div>
                         </td>
                         <td className="px-8 py-6">
                            <Link href="/designer/blueprints/new">
                               <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black hover:bg-indigo-100 transition-all flex items-center gap-2 border border-indigo-100">
                                  <FileText size={14} /> Blueprint Sheet
                               </button>
                            </Link>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <button className="h-10 px-5 bg-slate-900 text-white rounded-xl text-[11px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10">
                               Start Session
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      ) : (
        /* ── STUDIO CALENDAR VIEW ── */
        <div className="flex flex-col lg:flex-row gap-8 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm animate-in zoom-in-95 duration-500">
           <div className="lg:col-span-8 flex-1">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-4">
                    <h2 className="text-xl font-black tracking-tight">May 2026</h2>
                    <div className="flex items-center gap-1">
                       <button className="p-2 hover:bg-slate-50 rounded-xl transition-all"><ChevronLeft size={18} className="text-slate-400" /></button>
                       <button className="p-2 hover:bg-slate-50 rounded-xl transition-all"><ChevronRight size={18} className="text-slate-400" /></button>
                    </div>
                 </div>
              </div>
              <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-[32px] overflow-hidden border border-slate-100">
                 {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                   <div key={day} className="bg-slate-50/50 py-3 text-center text-[9px] font-black text-slate-400 tracking-widest">{day}</div>
                 ))}
                 {Array.from({ length: 35 }).map((_, i) => {
                    const d = i - 3;
                    return (
                       <div key={i} className={`min-h-[90px] bg-white p-3 border-r border-b border-slate-50 hover:bg-slate-50 transition-all cursor-pointer ${d < 1 || d > 31 ? 'opacity-20' : ''}`}>
                          <span className="text-xs font-black text-slate-400">{d > 0 && d <= 31 ? d : ''}</span>
                       </div>
                    );
                 })}
              </div>
           </div>
           <div className="lg:w-80 space-y-6">
              <div className="bg-slate-900 p-8 rounded-[32px] text-white">
                 <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Today</div>
                 <div className="text-xl font-black">May 10, 2026</div>
                 <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="w-1 h-8 bg-indigo-500 rounded-full" />
                       <div>
                          <div className="text-xs font-black">Maria Clara Santos</div>
                          <div className="text-[10px] font-bold text-slate-500">10:00 AM • In-Studio</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

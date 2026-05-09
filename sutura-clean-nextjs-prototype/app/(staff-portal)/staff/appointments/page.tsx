'use client';

import React, { useState } from 'react';
import { Calendar, Search, Filter, Clock, MapPin, ChevronRight, User } from 'lucide-react';

const mockAppointments = [
  { id: 'APT-001', client: 'John Doe', type: 'Suit Fitting', time: '10:00 AM', date: 'Today', status: 'CONFIRMED' },
  { id: 'APT-002', client: 'Jane Smith', type: 'Measurement', time: '1:30 PM', date: 'Today', status: 'PENDING' },
  { id: 'APT-003', client: 'Robert Brown', type: 'Final Fitting', time: '9:00 AM', date: 'Tomorrow', status: 'CONFIRMED' },
];

export default function StaffAppointmentsPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-black text-slate-900 tracking-tight leading-none">My Schedule</h1>
          <p className="text-[12px] text-slate-500 font-bold mt-1.5 uppercase tracking-widest leading-none">Daily Appointments & Fittings</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search appointments..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-6 bg-white border border-slate-200 rounded-xl text-[14px] font-medium outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
          />
        </div>
        <button className="h-12 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[13px] font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          <Filter size={16} /> Filter by Date
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {mockAppointments.filter(a => a.client.toLowerCase().includes(search.toLowerCase())).map((apt) => (
          <div key={apt.id} className="bg-white border border-slate-200 rounded-[32px] p-6 flex flex-col lg:flex-row lg:items-center justify-between shadow-sm hover:shadow-xl transition-all group">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[24px] flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{apt.date}</span>
                <span className="text-[15px] font-black text-slate-900">{apt.time.split(' ')[0]}</span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{apt.time.split(' ')[1]}</span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                    apt.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {apt.status}
                  </span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{apt.id}</span>
                </div>
                <h3 className="font-black text-[18px] text-slate-900 leading-tight tracking-tight">{apt.client}</h3>
                <div className="flex items-center gap-4 mt-2">
                   <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500">
                      <Clock size={14} className="text-slate-400" /> {apt.type}
                   </div>
                   <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-500">
                      <MapPin size={14} className="text-slate-400" /> Fitting Room A
                   </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6 lg:mt-0">
               <button className="h-12 px-6 rounded-2xl bg-white border border-slate-200 text-slate-600 font-black text-[13px] hover:bg-slate-900 hover:text-white transition-all active:scale-95">
                  View Details
               </button>
               <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/10 hover:bg-indigo-600 transition-all active:scale-95">
                  <ChevronRight size={20} />
               </button>
            </div>
          </div>
        ))}

        {mockAppointments.length === 0 && (
          <div className="p-20 text-center bg-white border border-slate-200 rounded-[32px]">
            <Calendar size={48} className="text-slate-200 mx-auto mb-4" />
            <h3 className="text-[18px] font-black text-slate-900">No appointments scheduled</h3>
            <p className="text-[14px] text-slate-500 font-medium">Your schedule is clear for today.</p>
          </div>
        )}
      </div>

    </div>
  );
}

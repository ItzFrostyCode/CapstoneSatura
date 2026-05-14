'use client';

import React from 'react';
import { Globe, Clock, UserCheck, AlertCircle } from 'lucide-react';
import { Appointment } from '@/types/erp';

interface AppointmentKPIsProps {
  appointments: Appointment[];
}

export function AppointmentKPIs({ appointments }: AppointmentKPIsProps) {
  // Demo date: 2026-05-07
  const demoToday = '2026-05-07';

  const pendingOnline = appointments.filter(a => a.source === 'Online' && a.status === 'Pending Review').length;
  const todayCount = appointments.filter(a => a.date === demoToday && a.status !== 'Cancelled' && a.status !== 'Pending Review').length;
  const upcomingFittings = appointments.filter(a => (a.type === 'FITTING' || a.category === 'Fitting') && a.status === 'Scheduled').length;
  const missedCount = appointments.filter(a => a.status === 'No Show').length;

  const kpis = [
    {
      label: 'Pending Online Requests',
      value: pendingOnline,
      icon: Globe,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      description: 'Awaiting shop approval'
    },
    {
      label: "Today's Appointments",
      value: todayCount,
      icon: Clock,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      description: 'Scheduled for today'
    },
    {
      label: 'Upcoming Fittings',
      value: upcomingFittings,
      icon: UserCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      description: 'Production milestones'
    },
    {
      label: 'Missed Appointments',
      value: missedCount,
      icon: AlertCircle,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      description: 'Require rescheduling'
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {kpis.map((kpi, i) => (
        <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</div>
          <div className="text-[24px] font-black text-slate-900 tracking-tight">{kpi.value}</div>
          <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{kpi.description}</div>
        </div>
      ))}
    </div>
  );
}

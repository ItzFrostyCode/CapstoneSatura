'use client';

import React from 'react';
import { Clock, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';
import { Appointment } from '@/types/erp';

interface AppointmentKPIsProps {
  appointments: Appointment[];
}

export function AppointmentKPIs({ appointments }: AppointmentKPIsProps) {
  const pendingCount = appointments.filter(a => a.status === 'Pending Review').length;
  const todayCount = appointments.filter(a => {
    const today = new Date('2026-05-07').toISOString().split('T')[0]; // Fixed for demo
    return a.date === today && a.status !== 'Pending Review' && a.status !== 'Cancelled';
  }).length;
  const upcomingFittings = appointments.filter(a => 
    a.category === 'Fitting' && 
    (a.status === 'Scheduled' || a.status === 'Rescheduled')
  ).length;
  const noShowCount = appointments.filter(a => a.status === 'No Show').length;

  const kpis = [
    {
      label: 'Pending Approval',
      value: pendingCount,
      icon: Clock,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      description: 'Requests awaiting review'
    },
    {
      label: "Today's Schedule",
      value: todayCount,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      description: 'Confirmed for today'
    },
    {
      label: 'Upcoming Fittings',
      value: upcomingFittings,
      icon: UserCheck,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      description: 'Production milestones'
    },
    {
      label: 'Missed / No Show',
      value: noShowCount,
      icon: AlertCircle,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      description: 'Requires rescheduling'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {kpis.map((kpi, i) => (
        <div 
          key={i} 
          className={`p-4 rounded-2xl border ${kpi.color} shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500`}
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-xl bg-white shadow-sm`}>
              <kpi.icon size={18} />
            </div>
            <span className="text-[24px] font-black leading-none">{kpi.value}</span>
          </div>
          <div>
            <p className="text-[13px] font-black tracking-tight">{kpi.label}</p>
            <p className="text-[10px] font-medium opacity-70 mt-0.5 uppercase tracking-wider">{kpi.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

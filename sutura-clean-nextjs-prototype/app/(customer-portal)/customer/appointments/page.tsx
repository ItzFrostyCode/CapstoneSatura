"use client";

import { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, MapPin, Scissors, ChevronLeft, CalendarDays } from 'lucide-react';
import Link from 'next/link';

type AptStatus = 'Pending Review' | 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';

interface MockAppointment {
  id: string;
  type: string;
  shop: string;
  address: string;
  date: string;
  startTime: string;
  duration: number;
  status: AptStatus;
  staff: string;
  notes?: string;
}

const MOCK_APPOINTMENTS: MockAppointment[] = [
  {
    id: 'apt-001',
    type: 'Fitting Session',
    shop: 'Davao Famous Tailoring',
    address: 'San Pedro St., Davao City',
    date: '2026-05-25',
    startTime: '14:00',
    duration: 60,
    status: 'Scheduled',
    staff: 'Carlos Reyes',
    notes: 'First fitting for 3-piece suit. Bring the fabric swatch.',
  },
  {
    id: 'apt-002',
    type: 'Consultation',
    shop: "Chard's Tailoring",
    address: 'Ponciano St., Davao City',
    date: '2026-06-02',
    startTime: '10:00',
    duration: 30,
    status: 'Pending Review',
    staff: '',
    notes: 'Initial consultation for wedding suit.',
  },
  {
    id: 'apt-003',
    type: 'Pickup',
    shop: 'Golden Needle Tailoring',
    address: 'Ilustre St., Davao City',
    date: '2026-04-30',
    startTime: '11:00',
    duration: 15,
    status: 'Completed',
    staff: 'Maria Santos',
  },
];

const STATUS_CONFIG: Record<AptStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  'Pending Review': { label: 'Pending Review', color: 'text-[#C9A84C]',  bg: 'bg-[#C9A84C]/5',   icon: AlertCircle },
  'Scheduled':      { label: 'Confirmed',      color: 'text-[#1E3A1F]',   bg: 'bg-[#1E3A1F]/5',    icon: CheckCircle },
  'Completed':      { label: 'Completed',      color: 'text-[#78716C]',  bg: 'bg-[#F0EDE8]',  icon: CheckCircle },
  'Cancelled':      { label: 'Cancelled',      color: 'text-red-600',    bg: 'bg-red-50',     icon: XCircle },
  'No Show':        { label: 'No Show',        color: 'text-gray-500',   bg: 'bg-gray-100',   icon: XCircle },
};

export default function AppointmentsPage() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcoming = MOCK_APPOINTMENTS.filter((a) => ['Pending Review', 'Scheduled'].includes(a.status));
  const past = MOCK_APPOINTMENTS.filter((a) => ['Completed', 'Cancelled', 'No Show'].includes(a.status));
  const list = tab === 'upcoming' ? upcoming : past;

  const formatTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    return `${h > 12 ? h - 12 : h}:${m.toString().padStart(2, '0')} ${suffix}`;
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <section className="bg-[#1E3A1F] pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#C9A84C] via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
           <Link href="/customer/dashboard" className="inline-flex items-center gap-2 text-[#C9A84C] text-[12px] font-bold uppercase tracking-widest mb-6 hover:opacity-80 transition-opacity">
              <ChevronLeft size={16} /> Back to Dashboard
           </Link>
           <h1 className="text-5xl font-bold font-serif text-[#FAF8F5] tracking-tight mb-4">Your Workshop Calendar</h1>
           <p className="text-[#FAF8F5]/60 font-medium max-w-xl mx-auto">Tracking your journey from consultation to the final fitting.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 -mt-10 pb-24 relative z-10">
        {/* Tab Switcher */}
        <div className="bg-white rounded-3xl border border-[#E2DDD7] shadow-xl p-2 mb-10 flex gap-2 w-fit mx-auto">
          {(['upcoming', 'past'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`h-12 px-8 rounded-2xl text-[13px] font-bold uppercase tracking-widest transition-all ${
                tab === t ? 'bg-[#1E3A1F] text-[#C9A84C] shadow-lg shadow-[#1E3A1F]/20' : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              {t} ({t === 'upcoming' ? upcoming.length : past.length})
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {list.length === 0 && (
            <div className="bg-white rounded-[40px] border border-[#E2DDD7] p-20 text-center">
              <CalendarDays size={48} className="mx-auto text-[#E2DDD7] mb-6" />
              <p className="text-[#78716C] font-bold text-[14px] uppercase tracking-widest">No {tab} appointments found</p>
            </div>
          )}

          {list.map((apt) => {
            const cfg = STATUS_CONFIG[apt.status];
            const StatusIcon = cfg.icon;
            const date = new Date(apt.date);
            return (
              <div key={apt.id} className="bg-white rounded-[40px] border border-[#E2DDD7] hover:shadow-2xl hover:shadow-[#1E3A1F]/5 transition-all duration-500 p-8 group">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                  <div className="flex gap-6">
                    {/* Date Block */}
                    <div className="w-20 h-24 bg-[#FAF8F5] border border-[#E2DDD7] rounded-[24px] flex flex-col items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <span className="text-[12px] font-bold text-[#78716C] uppercase tracking-widest mb-1">{date.toLocaleDateString('en-PH', { weekday: 'short' })}</span>
                      <span className="text-[28px] font-bold text-[#1C1917] leading-none mb-1">{date.getDate()}</span>
                      <span className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-widest">{date.toLocaleDateString('en-PH', { month: 'short' })}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${cfg.bg} ${cfg.color} border-current/10`}>
                          <StatusIcon size={12} /> {cfg.label}
                        </span>
                        <span className="text-[12px] text-[#78716C] font-bold uppercase tracking-widest bg-[#F0EDE8] px-3 py-1 rounded-full">{apt.type}</span>
                      </div>
                      <h3 className="text-[20px] font-bold font-serif text-[#1C1917]">{apt.shop}</h3>
                      <div className="flex items-center gap-2 text-[#78716C] text-[14px] font-medium">
                        <MapPin size={14} className="text-[#C9A84C]" /> {apt.address}
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:text-right shrink-0 border-t md:border-t-0 pt-6 md:pt-0">
                    <div className="text-[24px] font-bold text-[#1C1917] mb-1">{formatTime(apt.startTime)}</div>
                    <div className="text-[13px] text-[#78716C] font-bold uppercase tracking-widest">{apt.duration} Minutes Duration</div>
                    {apt.staff && (
                      <div className="inline-flex items-center gap-2 mt-4 text-[12px] font-bold text-[#1E3A1F] bg-[#1E3A1F]/5 px-3 py-1.5 rounded-xl">
                        <Scissors size={12} className="text-[#C9A84C]" />
                        <span>Artisan: {apt.staff}</span>
                      </div>
                    )}
                  </div>
                </div>
                {apt.notes && (
                  <div className="mt-8 p-6 bg-[#FAF8F5] rounded-[24px] text-[14px] text-[#78716C] italic border-l-4 border-[#C9A84C]">
                    “{apt.notes}”
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

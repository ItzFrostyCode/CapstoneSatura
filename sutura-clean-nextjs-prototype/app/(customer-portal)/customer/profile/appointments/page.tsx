'use client';

import { useERPStore } from "@/store/useERPStore";
import { useState, useMemo } from 'react';
import { 
  Calendar, ArrowLeft, Clock, MapPin, 
  Link as LinkIcon, CheckCircle2, XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

type AppointmentStatusTab = 'pending' | 'accepted' | 'rejected';

export default function MyAppointmentsPage() {
  const { currentUser, appointments } = useERPStore();
  const [activeTab, setActiveTab] = useState<AppointmentStatusTab>('pending');

  const myAppointments = useMemo(() => (appointments || []).filter(a => a.email === currentUser?.email || a.customer === currentUser?.name), [appointments, currentUser]);

  const filtered = useMemo(() => {
    if (activeTab === 'pending') return myAppointments.filter(a => a.status === 'Pending Review');
    if (activeTab === 'accepted') return myAppointments.filter(a => a.status === 'Scheduled');
    return myAppointments.filter(a => a.status === 'Cancelled' || a.status === 'No Show' || a.status === 'Completed');
  }, [activeTab, myAppointments]);

  const tabCounts = {
    pending: myAppointments.filter(a => a.status === 'Pending Review').length,
    accepted: myAppointments.filter(a => a.status === 'Scheduled').length,
    rejected: myAppointments.filter(a => a.status === 'Cancelled' || a.status === 'No Show' || a.status === 'Completed').length,
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-32 animate-in fade-in duration-500">
      {/* ── HEADER ── */}
      <div className="bg-white px-6 pt-10 pb-0 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between mb-8">
           <div className="flex items-center gap-4">
              <Link href="/customer/dashboard" className="w-10 h-10 bg-slate-50 rounded-[8px] flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                 <ArrowLeft size={20} />
              </Link>
              <div>
                 <h1 className="text-[20px] font-black text-slate-900 tracking-tight italic uppercase">Appointments</h1>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consultations & Fittings</p>
              </div>
           </div>
        </div>

        {/* TABS */}
        <div className="max-w-2xl mx-auto flex border-b border-slate-50">
           {(['pending', 'accepted', 'rejected'] as const).map(t => (
             <button
               key={t}
               onClick={() => setActiveTab(t)}
               className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === t ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
             >
               {t === 'pending' ? 'Pending' : t === 'accepted' ? 'Accepted' : 'Past'} ({tabCounts[t]})
               {activeTab === t && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 rounded-t-full" />}
             </button>
           ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="space-y-6">
           {filtered.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-[8px] border border-slate-100 border-dashed">
                <Calendar size={48} className="text-slate-100 mx-auto mb-4" />
                <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest">No {activeTab} bookings</p>
             </div>
           ) : (
             filtered.map(apt => (
               <div key={apt.id} className="bg-white rounded-[8px] p-6 shadow-sm flex flex-col md:flex-row gap-6 group transition-all">
                  <div className="w-full md:w-24 h-24 bg-slate-50 rounded-[8px] flex flex-col items-center justify-center border border-slate-50 shrink-0 group-hover:bg-slate-100 transition-all">
                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">{format(new Date(apt.date), 'MMM')}</span>
                     <span className="text-[28px] font-black text-slate-900 leading-none">{format(new Date(apt.date), 'd')}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                     <div className="flex items-start justify-between mb-4">
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-[4px] text-[9px] font-black uppercase tracking-widest">
                                 {apt.purpose || apt.type}
                              </span>
                              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">#{apt.id}</span>
                           </div>
                           <h3 className="text-[18px] font-black text-slate-900 tracking-tight">{apt.type}</h3>
                        </div>
                        <StatusIcon status={activeTab} />
                     </div>

                     <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                           <Clock size={14} className="text-emerald-500/50" />
                           {apt.startTime}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                           <MapPin size={14} className="text-slate-200" />
                           Golden Needle Studio
                        </div>
                     </div>

                     {/* INSPIRATION SECTION */}
                     {apt.inspiration && apt.inspiration.length > 0 && (
                        <div className="mb-6 space-y-3">
                           <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Design Inspiration</p>
                           <div className="flex flex-wrap gap-3">
                              {apt.inspiration.map((insp, idx) => {
                                const isAccepted = activeTab === 'accepted';
                                return (
                                <div key={idx} className="flex items-center gap-2">
                                   {insp.image_url && !isAccepted ? (
                                     <div className="w-12 h-12 rounded-[8px] overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                                        <img src={insp.image_url} className="w-full h-full object-cover" alt="" />
                                     </div>
                                   ) : null}
                                   {insp.link && (
                                     <a 
                                       href={insp.link} 
                                       target="_blank" 
                                       className="h-12 px-4 bg-slate-50 rounded-[8px] flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100"
                                     >
                                        <LinkIcon size={14} /> Moodboard
                                     </a>
                                   )}
                                   {insp.image_url && !insp.link && !isAccepted && (
                                      <div className="h-12 px-4 bg-slate-50/50 rounded-[8px] flex items-center text-[10px] font-black text-slate-300 uppercase tracking-widest border border-slate-50">
                                         Mockup Only
                                      </div>
                                   )}
                                </div>
                              )})}
                           </div>
                        </div>
                     )}

                     {apt.notes && (
                        <div className="p-4 bg-[#FAF9F6] rounded-[8px] border-l-2 border-slate-200">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer Notes</p>
                           <p className="text-[12px] text-slate-600 font-medium italic leading-relaxed">
                              &quot;{apt.notes}&quot;
                           </p>
                        </div>
                     )}
                  </div>
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: AppointmentStatusTab }) {
   if (status === 'accepted') return <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500"><CheckCircle2 size={18} /></div>;
   if (status === 'rejected') return <div className="w-8 h-8 bg-slate-50 rounded-full flex items-center justify-center text-slate-400"><XCircle size={18} /></div>;
   return <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center text-amber-500"><Clock size={18} /></div>;
}

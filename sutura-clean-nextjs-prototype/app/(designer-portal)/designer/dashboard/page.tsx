'use client';

import React, { useState } from 'react';
import { 
  Users, Palette, FileText, 
  TrendingUp, MessageSquare, 
  Calendar, ArrowUpRight, Plus,
  Sparkles, Eye, Scissors,
  CheckCircle2, Clock
} from 'lucide-react';
import Link from 'next/link';
import { PostDesignModal } from '../portfolio/components/PostDesignModal';

export default function DesignerDashboard() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const stats = [
    { label: 'Creative Inquiries', value: '12', icon: <MessageSquare size={20} />, color: 'bg-indigo-50 text-indigo-600', trend: '+3 this week' },
    { label: 'Showcase Views', value: '4.2k', icon: <Eye size={20} />, color: 'bg-emerald-50 text-emerald-600', trend: '+12% from last month' },
    { label: 'Ongoing Projects', value: '5', icon: <Palette size={20} />, color: 'bg-amber-50 text-amber-600', trend: '2 nearing completion' },
    { label: 'Design Blueprints', value: '28', icon: <FileText size={20} />, color: 'bg-slate-900 text-white', trend: 'Awaiting Customer Review' },
  ];

  return (
    <div className="space-y-12 font-outfit pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-700">
      
      {/* ── ELITE HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Artisan Studio</div>
             <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
             <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Workspace v2.4</div>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 italic">Designer Dashboard.</h1>
          <p className="text-lg font-medium text-slate-500 mt-2">Manage your creative output, portfolios, and collaborative requests.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/designer/requests">
            <button className="px-8 py-4 bg-white border-2 border-slate-100 rounded-[24px] font-black text-[13px] uppercase tracking-widest hover:border-slate-900 hover:shadow-xl transition-all flex items-center gap-2">
               Review Inquiries
            </button>
          </Link>
          <button 
            onClick={() => setIsPostModalOpen(true)}
            className="px-10 py-4 bg-indigo-600 text-white rounded-[24px] font-black text-[13px] uppercase tracking-widest hover:bg-indigo-700 shadow-[0_20px_40px_rgba(79,70,229,0.25)] transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus size={20} strokeWidth={3} /> Publish Showcase
          </button>
        </div>
      </div>

      {/* ── PREMIUM KPI GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="group bg-white p-10 rounded-[40px] border-2 border-slate-50 hover:border-indigo-100 hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)] transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[80px] -mr-8 -mt-8 group-hover:bg-indigo-50/50 transition-colors duration-500"></div>
            
            <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-8 relative z-10 shadow-lg`}>
              {stat.icon}
            </div>
            
            <div className="relative z-10">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</div>
              <div className="text-4xl font-black text-slate-900 tracking-tight mb-2">{stat.value}</div>
              <div className="text-[12px] text-slate-500 font-bold flex items-center gap-2">
                 <span className="text-indigo-600">●</span> {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── ACTIVITY & PRODUCTION BRIDGE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* NEW INQUIRIES FEED */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border-2 border-slate-50 shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Sparkles size={20}/></div>
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Inquiries</h2>
              </div>
              <button className="text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All Requests</button>
           </div>

           <div className="space-y-4">
             {[
               { client: 'Maria Clara', garment: 'Modern Filipiniana Concept', time: '2 hours ago', status: 'Pending Review' },
               { client: 'Ricardo Dalisay', garment: 'Bespoke Barong V3', time: '5 hours ago', status: 'Consulting' },
               { client: 'Elena Gilbert', garment: 'Evening Gown Sketch', time: 'Yesterday', status: 'Pending Review' }
             ].map((req, i) => (
               <div key={i} className="group p-5 bg-slate-50 rounded-[28px] border border-transparent hover:border-slate-100 hover:bg-white transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                        {req.client.charAt(0)}
                     </div>
                     <div>
                        <div className="font-black text-slate-900 text-sm">{req.client}</div>
                        <div className="text-xs font-bold text-slate-400 mt-0.5">{req.garment}</div>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="hidden md:block text-right">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{req.time}</div>
                        <div className="text-[10px] font-bold text-indigo-600 leading-none">{req.status}</div>
                     </div>
                     <button className="w-10 h-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                        <ArrowUpRight size={18} />
                     </button>
                  </div>
               </div>
             ))}
           </div>
        </div>

        {/* ── RIGHT: CREATIVE PIPELINE ── */}
        <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="relative z-10">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Client Collaboration</div>
                 <h3 className="text-xl font-black mb-2">Awaiting Approval</h3>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    You have 3 design blueprints finalized and ready to be sent to customers for digital review and approval.
                 </p>
                 <Link href="/designer/blueprints/new">
                   <button className="mt-6 px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-xs hover:bg-slate-50 transition-all flex items-center gap-2">
                      Send New Design Sheet <ArrowUpRight size={14} />
                   </button>
                 </Link>
              </div>
            </div>

           <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                 <h3 className="text-lg font-black text-slate-900">Upcoming Consultations</h3>
                 <Calendar size={18} className="text-slate-300" />
              </div>
              <div className="space-y-6">
                 {[
                   { time: '10:00 AM', client: 'Maria Clara', mode: 'In-Studio' },
                   { time: '01:30 PM', client: 'Ricardo Dalisay', mode: 'Virtual' }
                 ].map((appt, i) => (
                   <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-slate-100">
                         <div className="text-[10px] font-black text-slate-400 leading-none">{appt.time.split(' ')[1]}</div>
                         <div className="text-xs font-black text-slate-900 leading-none mt-1">{appt.time.split(' ')[0]}</div>
                      </div>
                      <div>
                         <div className="text-sm font-black text-slate-900">{appt.client}</div>
                         <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1 uppercase tracking-wide">
                            <Clock size={10} /> {appt.mode} Session
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      <PostDesignModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
      />
    </div>
  );
}

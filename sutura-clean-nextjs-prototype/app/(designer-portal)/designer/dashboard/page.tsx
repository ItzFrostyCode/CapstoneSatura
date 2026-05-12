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
    { label: 'Active Commissions', value: '5', icon: <Palette size={20} />, color: 'bg-amber-50 text-amber-600', trend: '2 nearing completion' },
    { label: 'Design Blueprints', value: '28', icon: <FileText size={20} />, color: 'bg-slate-900 text-white', trend: 'Handed over to shops' },
  ];

  return (
    <div className="space-y-10 font-outfit pb-10">
      
      {/* ── DASHBOARD HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Designer Dashboard</h1>
          <p className="text-lg font-medium text-slate-500 mt-1">Manage your design studio, showcase works, and client inquiries.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/designer/requests">
            <button className="px-6 py-3.5 bg-white border-2 border-slate-100 rounded-2xl font-black text-sm hover:border-slate-900 transition-all flex items-center gap-2">
               Review Inquiries
            </button>
          </Link>
          <button 
            onClick={() => setIsPostModalOpen(true)}
            className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> Publish Showcase
          </button>
        </div>
      </div>

      {/* ── KPI GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                {stat.icon}
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.trend}</div>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
            <div className="text-sm font-bold text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* ── LEFT: RECENT INQUIRIES ── */}
        <div className="lg:col-span-7 bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                 <Sparkles size={24} className="text-indigo-600" /> New Inquiries
              </h2>
              <Link href="/designer/requests" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</Link>
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
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Production Bridge</div>
                 <h3 className="text-xl font-black mb-2">Ready for Handoff</h3>
                 <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    You have 3 design blueprints finalized and ready to be sent to shop owners for tailoring execution.
                 </p>
                 <Link href="/designer/blueprints/new">
                   <button className="mt-6 px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-xs hover:bg-slate-50 transition-all flex items-center gap-2">
                      Start New Design Sheet <ArrowUpRight size={14} />
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

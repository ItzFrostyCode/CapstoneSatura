'use client';

import React from 'react';
import { 
  Scissors, Search, Filter, 
  ArrowUpRight, Clock, User, 
  Layers, CheckCircle2, AlertCircle,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function DesignerProjects() {
  const projects = [
    { 
      id: 'DS-2026-001', 
      client: 'Maria Clara Santos', 
      garment: 'Modern Filipiniana', 
      status: 'In Production', 
      progress: 65, 
      shop: 'Golden Needle Tailoring',
      lastUpdate: '2h ago'
    },
    { 
      id: 'DS-2026-005', 
      client: 'Ricardo Dalisay', 
      garment: 'Bespoke Barong', 
      status: 'Drafting', 
      progress: 25, 
      shop: 'Not Assigned',
      lastUpdate: '5h ago'
    },
    { 
      id: 'DS-2026-012', 
      client: 'Elena Gilbert', 
      garment: 'Evening Gown', 
      status: 'Review Required', 
      progress: 90, 
      shop: 'Luxe Stitch Studio',
      lastUpdate: '1d ago'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Production': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Drafting': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Review Required': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 font-outfit">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Active Design Projects</h1>
          <p className="text-slate-500 font-medium mt-1">Track your design blueprints from concept to shop floor.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/designer/blueprints/new">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/20">
               + New Blueprint
            </button>
          </Link>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:border-indigo-600 outline-none w-64 shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {projects.map((proj, i) => (
          <div key={i} className="bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden flex flex-col">
            {/* Card Header */}
            <div className="p-8 pb-0">
               <div className="flex items-center justify-between mb-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(proj.status)}`}>
                    {proj.status}
                  </span>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Clock size={12} /> {proj.lastUpdate}
                  </div>
               </div>
               
               <div className="mb-8">
                  <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{proj.garment}</h3>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                    <User size={14} className="text-indigo-500" />
                    {proj.client}
                  </div>
               </div>
            </div>

            {/* Progress Area */}
            <div className="flex-1 px-8">
               <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Blueprint Progress</span>
                  <span className="text-sm font-black text-slate-900">{proj.progress}%</span>
               </div>
               <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden mb-8 border border-slate-100">
                  <div 
                    className={`h-full transition-all duration-1000 ${proj.status === 'Review Required' ? 'bg-rose-500' : 'bg-indigo-600'}`} 
                    style={{ width: `${proj.progress}%` }} 
                  />
               </div>

               <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-[13px] font-bold text-slate-500">
                     <Layers size={16} className="text-slate-300" />
                     <span>Shop: <span className="text-slate-900 font-black">{proj.shop}</span></span>
                  </div>
                  <div className="flex items-center gap-3 text-[13px] font-bold text-slate-500">
                     <FileText size={16} className="text-slate-300" />
                     <span>Project ID: <span className="text-slate-900 font-black">{proj.id}</span></span>
                  </div>
               </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-8 pt-0 mt-auto">
               <Link 
                 href={`/designer/projects/${proj.id}`}
                 className="w-full py-4 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white rounded-2xl text-sm font-black text-slate-900 transition-all flex items-center justify-center gap-2"
               >
                 View Design Sheet
                 <ArrowUpRight size={18} />
               </Link>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

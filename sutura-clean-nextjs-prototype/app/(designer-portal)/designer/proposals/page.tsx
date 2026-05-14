'use client';

import { 
  Sparkles, 
  MessageSquare, 
  Clock, 
  ChevronRight, 
  UserCircle,
  CheckCircle2,
  XCircle,
  Search
} from 'lucide-react';

const PROPOSALS = [
  { id: 'PR-1024', client: 'Maria Clara', project: 'Silk Filipiniana Redesign', status: 'In Review', date: '2h ago', price: '₱12,500' },
  { id: 'PR-1025', client: 'Juan Luna', project: 'Heritage Barong (Custom Embroidery)', status: 'Approved', date: '5h ago', price: '₱8,200' },
  { id: 'PR-1026', client: 'Leonor Rivera', project: 'Gala Evening Gown', status: 'Pending', date: '1d ago', price: '₱24,000' },
  { id: 'PR-1027', client: 'Jose Rizal', project: 'Bespoke European Overcoat', status: 'Declined', date: '3d ago', price: '₱15,500' },
];

export default function ProposalsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2 text-amber-500">
            <Sparkles size={20}/>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Client Collaboration</span>
          </div>
          <h1 className="text-[42px] font-black text-slate-900 tracking-tight leading-tight">
            Design <span className="text-slate-400 italic">Proposals</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2">Track and manage custom design inquiries and creative commissions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Active Requests', count: 12, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Approved', count: 42, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Pending Feedback', count: 5, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Conversion Rate', count: '74%', color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
               <Sparkles size={18}/>
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">{stat.count}</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2 mb-4">
           <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Inquiries</h3>
           <div className="flex items-center gap-3">
              <button className="text-xs font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">Archive</button>
              <button className="text-xs font-black text-amber-600 hover:underline uppercase tracking-widest transition-all underline-offset-4">Export CSV</button>
           </div>
        </div>

        {PROPOSALS.map((prop) => (
          <div key={prop.id} className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 font-black text-xl group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                {prop.client.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-[16px] font-black text-slate-900 tracking-tight">{prop.client}</h4>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                    prop.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    prop.status === 'In Review' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    prop.status === 'Declined' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                  }`}>
                    {prop.status}
                  </span>
                </div>
                <p className="text-[13px] text-slate-500 font-medium">Project: <span className="text-slate-900 font-bold">{prop.project}</span></p>
              </div>
            </div>

            <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
               <div className="text-right">
                  <div className="text-sm font-black text-slate-900 tracking-tight">{prop.price}</div>
                  <div className="text-[10px] text-slate-400 font-bold flex items-center justify-end gap-1.5 uppercase tracking-widest">
                    <Clock size={10}/> {prop.date}
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                    <CheckCircle2 size={18}/>
                  </button>
                  <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all">
                    <XCircle size={18}/>
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-amber-600 group-hover:text-white transition-all ml-4 shadow-sm">
                    <ChevronRight size={18}/>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

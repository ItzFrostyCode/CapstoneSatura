'use client';

import React from 'react';
import { 
  HelpCircle, Search, Filter, 
  MessageSquare, Clock, AlertCircle,
  ArrowUpRight, Eye
} from 'lucide-react';
import { SupportTicketModal, SupportTicket } from './components/SupportTicketModal';

export default function SupportTicketsPage() {
  const [selectedTicket, setSelectedTicket] = React.useState<SupportTicket | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const tickets: SupportTicket[] = [
    { id: 'TKT-2026-045', subject: 'Billing Issue: Subscription Double Charged', tenant: 'Studio S', status: 'Open', priority: 'High', date: 'May 10, 2026' },
    { id: 'TKT-2026-044', subject: 'How to add a second branch?', tenant: 'Golden Needle Tailoring', status: 'Pending Reply', priority: 'Medium', date: 'May 09, 2026' },
    { id: 'TKT-2026-043', subject: 'Cannot upload PDF blueprint', tenant: 'Elena Designs', status: 'Resolved', priority: 'Low', date: 'May 08, 2026' },
    { id: 'TKT-2026-042', subject: 'Platform downtime yesterday', tenant: 'Metro Threads', status: 'Resolved', priority: 'High', date: 'May 07, 2026' },
  ];

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Open': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      case 'Pending Reply': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Resolved': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'High': return <AlertCircle size={14} className="text-rose-500" />;
      case 'Medium': return <Clock size={14} className="text-amber-500" />;
      default: return <MessageSquare size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 font-outfit pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Business Support</h1>
          <p className="text-slate-500 font-medium mt-1">Review and respond to inquiries from verified shops and designers.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search ticket ID or subject..." 
              className="pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:border-indigo-600 outline-none w-72 shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-indigo-600 rounded-[28px] p-6 text-white shadow-lg shadow-indigo-600/20">
            <div className="text-[10px] font-black uppercase tracking-widest text-indigo-200 mb-2">Open Tickets</div>
            <div className="text-4xl font-black mb-1">12</div>
            <div className="text-sm font-medium text-indigo-200">Requires admin action</div>
         </div>
         <div className="bg-amber-50 rounded-[28px] p-6 border border-amber-100">
            <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">Pending Shop Reply</div>
            <div className="text-4xl font-black text-amber-900 mb-1">5</div>
            <div className="text-sm font-bold text-amber-700">Awaiting user response</div>
         </div>
         <div className="bg-emerald-50 rounded-[28px] p-6 border border-emerald-100">
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Resolved This Week</div>
            <div className="text-4xl font-black text-emerald-900 mb-1">34</div>
            <div className="text-sm font-bold text-emerald-700">Successfully closed</div>
         </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-4">
         <div className="space-y-2">
            {tickets.map((ticket, i) => (
              <div key={i} className="group p-6 bg-white border border-slate-100 rounded-[24px] hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer">
                 <div className="flex items-start gap-4">
                    <div className="mt-1 w-12 h-12 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                       <HelpCircle size={20} />
                    </div>
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black text-slate-400">{ticket.id}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                             {getPriorityIcon(ticket.priority)} {ticket.priority} Priority
                          </span>
                       </div>
                       <h3 className="text-[17px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{ticket.subject}</h3>
                       <div className="text-sm font-bold text-slate-500 mt-1">Business: <span className="text-slate-700">{ticket.tenant}</span></div>
                    </div>
                 </div>
                 <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                       <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Last Updated</div>
                       <div className="text-xs font-bold text-slate-900 leading-none">{ticket.date}</div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    
                    <div className="flex items-center gap-2 border-l border-slate-100 pl-4 ml-2">
                      <button 
                        onClick={() => { setSelectedTicket(ticket); setIsModalOpen(true); }}
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all border border-indigo-100 flex items-center gap-2"
                      >
                         <Eye size={14} /> View Ticket
                      </button>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </div>
       <SupportTicketModal 
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         ticket={selectedTicket}
       />
    </div>
  );
}

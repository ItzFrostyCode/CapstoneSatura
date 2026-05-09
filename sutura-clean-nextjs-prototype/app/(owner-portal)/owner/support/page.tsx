'use client';

import { useState, useMemo } from 'react';
import { useERPStore } from '@/store/useERPStore';
import { SupportTicketStatus } from '@/types/erp';
import { HelpCircle, Plus, Search, MessageSquare, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { NewTicketModal } from './components/NewTicketModal';
import { TicketDetailsModal } from './components/TicketDetailsModal';

export default function SupportCenterPage() {
  const { supportTickets } = useERPStore();
  const [activeTab, setActiveTab] = useState<'All' | SupportTicketStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const filteredTickets = useMemo(() => {
    return supportTickets.filter(ticket => {
      const matchesTab = activeTab === 'All' || ticket.status === activeTab;
      const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [supportTickets, activeTab, searchQuery]);

  const getStatusColor = (status: SupportTicketStatus) => {
    switch (status) {
      case 'Open': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'In Review': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Waiting Reply': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Closed': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'High': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Normal': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Low': return 'bg-slate-50 text-slate-600 border-slate-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical Issue': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Billing Concern': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Feature Request': return 'bg-violet-50 text-violet-600 border-violet-100';
      case 'Complaint': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Branch Concern': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Inventory Problem': return 'bg-orange-50 text-orange-600 border-orange-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const openCount = supportTickets.filter(t => t.status === 'Open').length;
  const waitingReplyCount = supportTickets.filter(t => t.status === 'Waiting Reply').length;
  const resolvedCount = supportTickets.filter(t => t.status === 'Resolved').length;

  return (
    <div className="relative min-h-full pb-20 overflow-x-hidden">
      
      {/* ── MESH GRADIENT BACKGROUND ── */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-[5%] -left-[5%] w-[60%] h-[50%] bg-indigo-50/50 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[5%] -right-[5%] w-[50%] h-[40%] bg-blue-50/40 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 pt-6">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
                <HelpCircle size={24} />
              </div>
              <h1 className="text-[40px] font-black text-slate-900 tracking-tighter leading-[0.9]">
                Support Center
              </h1>
            </div>
            <p className="text-[16px] text-slate-500 font-medium max-w-2xl leading-relaxed">
              Report issues, request features, or send inquiries directly to Sutura Admin. Track your requests and communicate with our support team here.
            </p>
          </div>
          <button 
            onClick={() => setIsNewTicketModalOpen(true)}
            className="flex items-center gap-2 h-14 px-8 bg-slate-900 text-white rounded-2xl text-[14px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} /> New Ticket
          </button>
        </div>

        {/* ── KPI SUMMARY CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-[24px] p-5 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Open Tickets</div>
              <div className="text-[28px] font-black text-slate-900 leading-none">{openCount}</div>
            </div>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <AlertCircle size={24} />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-[24px] p-5 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Waiting Reply</div>
              <div className="text-[28px] font-black text-slate-900 leading-none">{waitingReplyCount}</div>
            </div>
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
              <MessageSquare size={24} />
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-[24px] p-5 flex items-center justify-between shadow-sm">
            <div>
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Resolved</div>
              <div className="text-[28px] font-black text-slate-900 leading-none">{resolvedCount}</div>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        {/* ── CONTROLS ── */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center gap-1 p-1 bg-white/60 backdrop-blur-md border border-slate-200 w-max rounded-2xl overflow-x-auto">
            {['All', 'Open', 'In Review', 'Waiting Reply', 'Resolved', 'Closed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as 'All' | SupportTicketStatus)}
                className={`px-5 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search tickets by ID or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-4 bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl text-[14px] font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* ── TICKET LIST ── */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest w-[120px]">Ticket ID</th>
                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Subject</th>
                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Last Updated</th>
                <th className="py-5 px-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center w-[100px]">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map((ticket) => (
                <tr 
                  key={ticket.id} 
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className="group hover:bg-slate-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-5 px-6">
                    <span className="text-[13px] font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md whitespace-nowrap">{ticket.id}</span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="text-[15px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{ticket.subject}</div>
                    <div className="flex items-center gap-2 mt-1">
                       <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${getPriorityColor(ticket.priority)}`}>
                         {ticket.priority} Priority
                       </span>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-widest border ${getCategoryColor(ticket.category)}`}>
                      {ticket.category}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border ${getStatusColor(ticket.status)}`}>
                      {ticket.status === 'Resolved' ? <CheckCircle2 size={12} /> : 
                       ticket.status === 'Waiting Reply' ? <MessageSquare size={12} /> : 
                       ticket.status === 'Open' ? <AlertCircle size={12} /> : <Clock size={12} />}
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-right">
                    <div className="text-[13px] font-bold text-slate-600">
                      {new Date(ticket.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="py-5 px-6 text-center">
                    <button className="text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors">
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                      <HelpCircle size={32} />
                    </div>
                    <div className="text-[16px] font-black text-slate-900">No tickets found</div>
                    <div className="text-[14px] text-slate-500 mt-1">Adjust your filters or create a new ticket.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <NewTicketModal 
        isOpen={isNewTicketModalOpen} 
        onClose={() => setIsNewTicketModalOpen(false)} 
      />

      {selectedTicketId && (
        <TicketDetailsModal 
          ticketId={selectedTicketId} 
          onClose={() => setSelectedTicketId(null)} 
        />
      )}

    </div>
  );
}

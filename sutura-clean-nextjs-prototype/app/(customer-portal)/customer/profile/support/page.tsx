'use client';

import { useERPStore } from "@/store/useERPStore";
import { useState, useMemo } from 'react';
import { 
  ArrowLeft, Plus, MessageSquare, 
  ChevronRight, Search, CheckCircle2, AlertCircle,
  UploadCloud, Send, Paperclip, ShieldCheck, UserCircle2
} from 'lucide-react';
import { format } from 'date-fns';
import { SupportTicketStatus, SupportTicketCategory, Priority } from '@/types/erp';

type SupportView = 'list' | 'new' | 'details';

export default function MySupportPage() {
  const { currentUser, supportTickets, createSupportTicket, addTicketMessage, updateTicketStatus, pushNotification } = useERPStore();
  const [view, setView] = useState<SupportView>('list');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  
  // List State
  const [activeTab, setActiveTab] = useState<'All' | SupportTicketStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // New Ticket State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicketCategory>('Technical Issue');
  const [priority, setPriority] = useState<Priority>('Normal');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Thread State
  const [replyMessage, setReplyMessage] = useState('');

  const selectedTicket = useMemo(() => 
    supportTickets.find(t => t.id === selectedTicketId), 
    [supportTickets, selectedTicketId]
  );

  const filteredTickets = useMemo(() => {
    return (supportTickets || [])
      .filter(t => t.creatorId === currentUser?.id)
      .filter(t => {
        const matchesTab = activeTab === 'All' || t.status === activeTab;
        const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             t.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
      });
  }, [supportTickets, currentUser, activeTab, searchQuery]);

  const openCount = (supportTickets || []).filter(t => t.creatorId === currentUser?.id && t.status === 'Open').length;
  const waitingReplyCount = (supportTickets || []).filter(t => t.creatorId === currentUser?.id && t.status === 'Waiting Reply').length;
  const resolvedCount = (supportTickets || []).filter(t => t.creatorId === currentUser?.id && t.status === 'Resolved').length;

  // Handlers
  const handleCreateTicket = async () => {
    if (!subject || !message) {
      pushNotification('Subject and message are required.', 'error');
      return;
    }

    if (file) {
      setIsUploading(true);
      for (let i = 0; i <= 100; i += 25) {
        setUploadProgress(i);
        await new Promise(r => setTimeout(r, 300));
      }
      setIsUploading(false);
    }

    createSupportTicket({
      shopId: 'SYSTEM',
      creatorId: currentUser?.id || 'USR-001',
      subject,
      category,
      priority,
    });

    pushNotification('Ticket submitted successfully', 'success');
    resetNewForm();
    setView('list');
  };

  const resetNewForm = () => {
    setSubject('');
    setCategory('Technical Issue');
    setPriority('Normal');
    setMessage('');
    setFile(null);
  };

  const handleReply = () => {
    if (!replyMessage.trim() || !selectedTicketId) return;
    addTicketMessage(selectedTicketId, {
      sender: 'User',
      senderName: currentUser?.name || 'Customer',
      message: replyMessage,
    });
    setReplyMessage('');
  };

  const handleResolve = () => {
    if (selectedTicketId) {
      updateTicketStatus(selectedTicketId, 'Resolved');
      pushNotification('Ticket marked as resolved', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-32 animate-in fade-in duration-500">
      
      {/* ── HEADER ── */}
      <div className="bg-white border-b border-slate-100 px-6 pt-12 pb-8 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => view === 'list' ? window.location.href = '/customer/dashboard' : setView('list')}
                className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
              >
                 <ArrowLeft size={20} />
              </button>
              <div>
                 <h1 className="text-[24px] font-black text-slate-900 tracking-tight italic uppercase">
                  {view === 'list' ? 'Support Center' : view === 'new' ? 'New Ticket' : 'Ticket Detail'}
                 </h1>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  {view === 'list' ? 'Help & Inquiries' : view === 'new' ? 'Submit a Request' : selectedTicket?.id}
                 </p>
              </div>
           </div>
           {view === 'list' && (
             <button 
              onClick={() => setView('new')}
              className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 transition-all"
             >
                <Plus size={24} />
             </button>
           )}
           {view === 'details' && selectedTicket?.status !== 'Resolved' && (
             <button 
              onClick={handleResolve}
              className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all"
             >
                Mark Resolved
             </button>
           )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        
        {/* ── LIST VIEW ── */}
        {view === 'list' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Open</div>
                <div className="flex items-center justify-between">
                  <div className="text-[20px] font-black text-slate-900">{openCount}</div>
                  <AlertCircle size={16} className="text-amber-500" />
                </div>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Waiting</div>
                <div className="flex items-center justify-between">
                  <div className="text-[20px] font-black text-slate-900">{waitingReplyCount}</div>
                  <MessageSquare size={16} className="text-indigo-500" />
                </div>
              </div>
              <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Resolved</div>
                <div className="flex items-center justify-between">
                  <div className="text-[20px] font-black text-slate-900">{resolvedCount}</div>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={20} />
                <input 
                  placeholder="Search tickets..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 bg-white border border-slate-100 rounded-[28px] pl-16 pr-6 text-[14px] font-medium outline-none focus:border-slate-900 focus:shadow-md transition-all shadow-sm" 
                />
              </div>

              <div className="flex items-center gap-1 p-1 bg-white border border-slate-100 rounded-2xl overflow-x-auto shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {['All', 'Open', 'Waiting Reply', 'Resolved', 'Closed'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-5 py-2 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all ${
                      activeTab === tab 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Ticket List (Minimalist) */}
            <div className="space-y-3">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-20 bg-white border border-slate-100 rounded-[32px] border-dashed">
                    <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">No matching history</p>
                </div>
              ) : (
                filteredTickets.map(ticket => (
                  <div 
                    key={ticket.id} 
                    onClick={() => { setSelectedTicketId(ticket.id); setView('details'); }}
                    className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:border-slate-300 transition-all cursor-pointer group flex items-center gap-4"
                  >
                    {/* Status Dot */}
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      ticket.status === 'Resolved' ? 'bg-emerald-500' : 
                      ticket.status === 'Waiting Reply' ? 'bg-indigo-500' : 'bg-amber-500'
                    }`} />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{ticket.id}</span>
                        <span className="text-[10px] font-bold text-slate-300 px-1.5 border border-slate-100 rounded uppercase">{ticket.category}</span>
                      </div>
                      <h3 className="text-[14px] font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{ticket.subject}</h3>
                    </div>

                    {/* Metadata */}
                    <div className="text-right shrink-0">
                      <div className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{ticket.status}</div>
                      <div className="text-[10px] font-bold text-slate-400">{format(new Date(ticket.updatedAt), 'MMM d')}</div>
                    </div>

                    <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors shrink-0" />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── NEW TICKET VIEW ── */}
        {view === 'new' && (
          <div className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-lg space-y-8 animate-in slide-in-from-right-8 duration-500">
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  >
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Billing Concern">Billing Concern</option>
                    <option value="Account Access">Account Access</option>
                    <option value="Report a Shop">Report a Shop</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Priority</label>
                  <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Subject</label>
                <input 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Summarize your issue..."
                  className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
             </div>

             <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Description</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us more about the issue..."
                  className="w-full h-40 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-[14px] font-medium focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none"
                />
             </div>

             {/* Upload Area */}
             <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-100 rounded-[28px] bg-slate-50/50 hover:bg-slate-50 cursor-pointer transition-all group">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm mb-2">
                   <UploadCloud size={20} />
                </div>
                <div className="text-[12px] font-bold text-slate-500">Upload Media (Max 200MB)</div>
                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
             </label>

             <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setView('list')}
                  className="flex-1 h-14 bg-white border border-slate-100 text-slate-600 rounded-2xl text-[13px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateTicket}
                  disabled={isUploading}
                  className="flex-[2] h-14 bg-slate-900 text-white rounded-2xl text-[13px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all"
                >
                  {isUploading ? `Uploading ${uploadProgress}%...` : 'Submit Ticket'}
                </button>
             </div>
          </div>
        )}

        {/* ── DETAILS VIEW ── */}
        {view === 'details' && selectedTicket && (
          <div className="space-y-8 animate-in slide-in-from-left-8 duration-500">
             {/* Thread Container */}
             <div className="bg-white border border-slate-100 rounded-[40px] shadow-sm overflow-hidden flex flex-col max-h-[70vh]">
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-50/30">
                  {selectedTicket.messages.map((msg, idx) => {
                    const isStaff = msg.sender === 'HQ Admin';
                    return (
                      <div key={msg.id} className={`flex gap-4 ${isStaff ? '' : 'flex-row-reverse'}`}>
                        <div className="shrink-0 mt-1">
                          {isStaff ? (
                            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-md">
                              <ShieldCheck size={20} />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-sm">
                              <UserCircle2 size={24} />
                            </div>
                          )}
                        </div>
                        <div className={`max-w-[75%] ${isStaff ? '' : 'text-right'}`}>
                           <div className={`flex items-center gap-2 mb-1 ${isStaff ? '' : 'justify-end'}`}>
                              <span className="text-[13px] font-black text-slate-900">{isStaff ? 'Sutura Support' : msg.senderName}</span>
                              <span className="text-[11px] font-bold text-slate-400">{format(new Date(msg.timestamp), 'h:mm a')}</span>
                           </div>
                           <div className={`p-5 text-[15px] font-medium leading-relaxed ${
                             isStaff 
                               ? 'bg-white border border-slate-100 rounded-3xl rounded-tl-sm text-slate-700 shadow-sm' 
                               : 'bg-slate-900 text-white rounded-3xl rounded-tr-sm'
                           }`}>
                             {msg.message}
                           </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Reply Input */}
                {selectedTicket.status !== 'Resolved' && (
                  <div className="p-6 bg-white border-t border-slate-100 flex items-center gap-4">
                     <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl flex items-center px-4">
                        <Paperclip size={18} className="text-slate-400" />
                        <input 
                          value={replyMessage}
                          onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="Type your reply..."
                          onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                          className="flex-1 h-14 bg-transparent outline-none px-4 text-[14px] font-medium"
                        />
                        <button 
                          onClick={handleReply}
                          className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-slate-800 transition-all"
                        >
                           <Send size={16} />
                        </button>
                     </div>
                  </div>
                )}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}

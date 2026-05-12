'use client';

import React, { useState } from 'react';
import { 
  X, MessageSquare, Send, 
  HelpCircle, User, Building2,
  Clock, AlertCircle, CheckCircle2,
  Paperclip, Image as ImageIcon
} from 'lucide-react';

export interface SupportTicket {
  id: string;
  subject: string;
  tenant: string;
  status: 'Open' | 'Pending Reply' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  date: string;
}

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SupportTicket | null;
}

export function SupportTicketModal({ isOpen, onClose, ticket }: SupportTicketModalProps) {
  const [reply, setReply] = useState('');
  
  if (!isOpen || !ticket) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-[900px] h-[85vh] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50 shrink-0">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                 <HelpCircle className="text-indigo-600" size={24} />
              </div>
              <div>
                 <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{ticket.subject}</h2>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                       ticket.status === 'Open' ? 'text-indigo-600 bg-indigo-50 border-indigo-100' : 'text-emerald-600 bg-emerald-50 border-emerald-100'
                    }`}>
                       {ticket.status}
                    </span>
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Ticket ID: {ticket.id} • Opened {ticket.date}</p>
              </div>
           </div>
           <button onClick={onClose} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-100">
              <X size={20} />
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
           
           {/* Left: Chat History */}
           <div className="flex-1 flex flex-col bg-slate-50/30">
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                 {/* Original Message */}
                 <div className="flex gap-4">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-black shrink-0">
                       {ticket.tenant.charAt(0)}
                    </div>
                    <div className="flex-1 space-y-2">
                       <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">{ticket.tenant}</span>
                          <span className="text-[10px] font-bold text-slate-400">10:45 AM</span>
                       </div>
                       <div className="bg-white p-5 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm text-sm text-slate-700 leading-relaxed">
                          Hello Satura Support, we noticed that our last subscription payment was charged twice on our credit card. Could you please check this for us? We have the receipt attached below.
                       </div>
                    </div>
                 </div>

                 {/* System Log */}
                 <div className="flex justify-center">
                    <span className="px-4 py-1 bg-slate-100 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">
                       Ticket assigned to Admin_Juan
                    </span>
                 </div>

                 {/* Admin Reply */}
                 <div className="flex gap-4 flex-row-reverse">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black shrink-0">
                       A
                    </div>
                    <div className="flex-1 space-y-2 text-right">
                       <div className="flex items-center gap-2 justify-end">
                          <span className="text-[10px] font-bold text-slate-400">11:20 AM</span>
                          <span className="text-xs font-black text-slate-900">Admin_Juan</span>
                       </div>
                       <div className="bg-slate-900 p-5 rounded-2xl rounded-tr-none text-white text-sm leading-relaxed text-left inline-block">
                          Hi there! Im looking into this now. Give me a moment to verify with our billing provider.
                       </div>
                    </div>
                 </div>
              </div>

              {/* Reply Input */}
              <div className="p-6 bg-white border-t border-slate-100">
                 <div className="relative">
                    <textarea 
                       value={reply}
                       onChange={(e) => setReply(e.target.value)}
                       placeholder="Type your response here..."
                       className="w-full h-32 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-indigo-600 transition-all resize-none"
                    />
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                       <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                          <Paperclip size={18} />
                       </button>
                       <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2">
                          Send Reply <Send size={14} />
                       </button>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right: Ticket Info */}
           <div className="w-full md:w-[320px] border-l border-slate-50 p-8 space-y-8 bg-slate-50/20 overflow-y-auto">
              <div>
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Business Details</div>
                 <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Building2 size={20} /></div>
                    <div>
                       <div className="text-xs font-black text-slate-900">{ticket.tenant}</div>
                       <div className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">Premium Plan</div>
                    </div>
                 </div>
              </div>

              <div>
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Reference Assets</div>
                 <div className="space-y-2">
                    <button className="w-full p-3 bg-white border border-slate-100 rounded-xl flex items-center gap-3 hover:border-indigo-600 transition-all text-left">
                       <ImageIcon size={16} className="text-slate-400" />
                       <div className="text-[10px] font-bold text-slate-700">Receipt_102.png</div>
                    </button>
                 </div>
              </div>

              <div className="pt-8 border-t border-slate-100 space-y-4">
                 <button className="w-full py-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} /> Mark as Resolved
                 </button>
                 <button className="w-full py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-slate-900 transition-all flex items-center justify-center gap-2">
                    Escalate to Tech
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { X, Send, Paperclip, FileImage, FileVideo, UserCircle2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useERPStore } from '@/store/useERPStore';

export function TicketDetailsModal({ ticketId, onClose }: { ticketId: string; onClose: () => void }) {
  const { supportTickets, addTicketMessage, updateTicketStatus, currentUser } = useERPStore();
  const [replyMessage, setReplyMessage] = useState('');

  const ticket = useMemo(() => supportTickets.find(t => t.id === ticketId), [supportTickets, ticketId]);

  if (!ticket) return null;

  const handleReply = () => {
    if (!replyMessage.trim()) return;

    addTicketMessage(ticket.id, {
      sender: 'User',
      senderName: currentUser?.name || 'Shop Owner',
      message: replyMessage,
    });
    
    // Auto change status if it was Waiting Reply
    if (ticket.status === 'Waiting Reply') {
      updateTicketStatus(ticket.id, 'Open');
    }

    setReplyMessage('');
  };

  const handleResolve = () => {
    updateTicketStatus(ticket.id, 'Resolved');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl h-[85vh] bg-white border border-slate-200 rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-1">
               <span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{ticket.id}</span>
               <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase tracking-widest font-bold">
                 {ticket.category}
               </span>
            </div>
            <h2 className="text-[22px] font-black text-slate-900 tracking-tight">{ticket.subject}</h2>
          </div>
          <div className="flex items-center gap-4">
            {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
              <button 
                onClick={handleResolve}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-[12px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors"
              >
                <CheckCircle2 size={16} /> Mark Resolved
              </button>
            )}
            <button onClick={onClose} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Thread Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 custom-scrollbar space-y-8">
          
          {ticket.messages.map((msg, index) => {
            const isHQ = msg.sender === 'HQ Admin';
            return (
              <div key={msg.id} className={`flex gap-4 ${isHQ ? '' : 'flex-row-reverse'}`}>
                
                {/* Avatar */}
                <div className="shrink-0 mt-1">
                  {isHQ ? (
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-md">
                      <ShieldCheck size={20} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 shadow-sm">
                      <UserCircle2 size={24} />
                    </div>
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[75%] ${isHQ ? '' : 'text-right'}`}>
                  <div className={`flex items-center gap-2 mb-1 ${isHQ ? '' : 'justify-end'}`}>
                    <span className="text-[13px] font-black text-slate-900">{msg.senderName}</span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <div className={`p-4 text-[15px] leading-relaxed font-medium text-left ${
                    isHQ 
                      ? 'bg-white border border-slate-200 rounded-2xl rounded-tl-sm text-slate-700 shadow-sm' 
                      : 'bg-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-md'
                  }`}>
                    {msg.message}
                  </div>

                  {/* Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className={`flex gap-2 mt-2 ${isHQ ? '' : 'justify-end'}`}>
                      {msg.attachments.map(att => (
                        <div key={att.id} className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-xl shadow-sm cursor-pointer hover:border-indigo-300 transition-colors">
                          <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-500">
                            {att.fileType.startsWith('video') ? <FileVideo size={16} /> : <FileImage size={16} />}
                          </div>
                          <div className="text-left">
                             <div className="text-[11px] font-black text-slate-900 truncate w-24">{att.fileName}</div>
                             <div className="text-[9px] font-bold text-slate-400">{(att.fileSize / 1024 / 1024).toFixed(1)} MB</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>

        {/* Reply Box */}
        {ticket.status !== 'Closed' && ticket.status !== 'Resolved' ? (
          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <div className="flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-[20px] p-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
              <button className="p-3 text-slate-400 hover:text-indigo-600 transition-colors">
                <Paperclip size={20} />
              </button>
              <textarea 
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply here..."
                className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none focus:outline-none resize-none py-3 text-[14px] font-medium text-slate-900 custom-scrollbar"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleReply();
                  }
                }}
              />
              <button 
                onClick={handleReply}
                disabled={!replyMessage.trim()}
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-slate-50 border-t border-slate-200 text-center shrink-0">
            <span className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">
              This ticket has been {ticket.status.toLowerCase()}. You can no longer reply.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

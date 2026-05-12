'use client';

import React, { useState } from 'react';
import { 
  X, User, Calendar, Clock, 
  MessageSquare, CheckCircle2, 
  XCircle, Scissors, FileText,
  ChevronRight, Sparkles, Send
} from 'lucide-react';
import Link from 'next/link';

interface RequestReviewModalProps {
  request: any;
  isOpen: boolean;
  onClose: () => void;
  onSchedule?: () => void;
}

export function RequestReviewModal({ request, isOpen, onClose, onSchedule }: RequestReviewModalProps) {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-[950px] h-[75vh] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
        
        {/* Left Side: Request Brief */}
        <div className="w-full md:w-[38%] bg-slate-50 p-8 border-r border-slate-100 flex flex-col overflow-y-auto custom-scrollbar">
           <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                 <FileText size={16} />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Request Brief</h2>
           </div>

           <div className="space-y-6">
              <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm">
                 <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Client</div>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-600 text-sm">
                       {request.client.charAt(0)}
                    </div>
                    <div>
                       <div className="font-black text-slate-900 text-sm">{request.client}</div>
                       <div className="text-[10px] font-bold text-slate-400">{request.id}</div>
                    </div>
                 </div>
              </div>

              <div className="space-y-4 px-1">
                 <div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Garment</div>
                    <div className="text-base font-black text-slate-900">{request.garment}</div>
                 </div>
                 <div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Schedule</div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                       <Calendar size={12} className="text-indigo-500" /> {request.date}
                    </div>
                 </div>
                 <div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Preference</div>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed">
                       {request.garment === 'Modern Filipiniana' 
                        ? 'Garden wedding theme. Wants sustainable fabrics like Pineapple Silk.' 
                        : 'Bespoke fit with premium details.'}
                    </p>
                 </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                 <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Inspiration</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="aspect-square bg-slate-200 rounded-xl overflow-hidden shadow-inner">
                       <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=300" alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="aspect-square bg-slate-200 rounded-xl overflow-hidden shadow-inner">
                       <img src="https://images.unsplash.com/photo-1537832816519-689ad163238b?auto=format&fit=crop&q=80&w=300" alt="" className="w-full h-full object-cover" />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex-1 p-8 flex flex-col h-full overflow-y-auto custom-scrollbar">
           <div className="flex items-center justify-between mb-8">
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                request.status === 'Pending Review' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                request.status === 'Consulting' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
              }`}>
                {request.status}
              </span>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                <X size={16} />
              </button>
           </div>

           <div className="flex-1">
              <h2 className="text-xl font-black text-slate-900 tracking-tight mb-6">Creative Response</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                 <Link href="/designer/blueprints/new" className="block w-full">
                   <button className="w-full p-5 bg-indigo-600 text-white rounded-[24px] hover:bg-indigo-700 transition-all text-left group shadow-lg shadow-indigo-100">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                         <CheckCircle2 size={20} />
                      </div>
                      <div className="text-xs font-black mb-0.5">Accept & Design</div>
                      <div className="text-[10px] font-bold text-indigo-200 uppercase tracking-wide">Start Blueprint</div>
                   </button>
                 </Link>
                 <button 
                   onClick={onSchedule}
                   className="p-5 bg-slate-900 text-white rounded-[24px] hover:bg-slate-800 transition-all text-left group shadow-lg shadow-slate-100"
                 >
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                       <MessageSquare size={20} />
                    </div>
                    <div className="text-xs font-black mb-0.5">Consultation</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Contact Client</div>
                 </button>
              </div>

              <div className="bg-slate-50 rounded-[24px] p-6 border border-slate-100 mb-6">
                 <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Internal Response</div>
                 <textarea 
                    rows={3}
                    placeholder="Type your response..."
                    className="w-full bg-white border border-slate-100 rounded-xl p-3 text-sm font-medium outline-none focus:border-indigo-600 transition-all resize-none shadow-sm mb-3"
                 />
                 <button className="flex items-center gap-1.5 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline">
                    <Send size={12} /> Send to client
                 </button>
              </div>
           </div>

           <div className="pt-6 flex flex-col sm:flex-row gap-3">
              <button className="flex-[2] py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/10 flex items-center justify-center gap-2">
                 Move to Production <ChevronRight size={16} />
              </button>
              <button className="flex-1 py-3.5 bg-rose-50 text-rose-600 rounded-2xl font-black text-sm hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2 border border-rose-100">
                 <XCircle size={16} /> Decline
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

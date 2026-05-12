'use client';

import React from 'react';
import { 
  X, FileText, Clock, User, 
  Terminal, Shield, Info, AlertTriangle,
  CheckCircle2, Copy
} from 'lucide-react';

export interface AuditLog {
  id: string;
  action: string;
  tenant: string;
  admin: string;
  date: string;
  type: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
}

interface LogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLog | null;
}

export function LogDetailModal({ isOpen, onClose, log }: LogDetailModalProps) {
  if (!isOpen || !log) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-[600px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-400">
                 <Terminal size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-black text-slate-900 tracking-tight">Log Details</h2>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{log.id} • Secure Audit Record</p>
              </div>
           </div>
           <button onClick={onClose} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-100">
              <X size={20} />
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-6">
           <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[32px] text-white">
              <div className="space-y-1">
                 <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Event Action</div>
                 <div className="text-lg font-black">{log.action}</div>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                 log.severity === 'critical' ? 'text-rose-400 border-rose-400/30 bg-rose-400/10' :
                 log.severity === 'warning' ? 'text-amber-400 border-amber-400/30 bg-amber-400/10' :
                 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10'
              }`}>
                 {log.severity}
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                 <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Clock size={10} /> Timestamp
                 </div>
                 <div className="text-xs font-black text-slate-900">{log.date}</div>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                 <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                    <User size={10} /> Performed By
                 </div>
                 <div className="text-xs font-black text-slate-900">{log.admin}</div>
              </div>
           </div>

           <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                 <Terminal size={10} /> Raw Data Payload
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-600 leading-relaxed overflow-x-auto whitespace-pre">
{`{
  "event_id": "${log.id}",
  "target_tenant": "${log.tenant}",
  "action": "${log.action}",
  "metadata": {
    "ip_address": "124.105.18.242",
    "user_agent": "Mozilla/5.0...",
    "region": "Davao City, PH",
    "previous_state": "active",
    "new_state": "active"
  }
}`}
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-50 flex items-center gap-3 bg-slate-50/30">
           <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              <Copy size={16} /> Copy Log Payload
           </button>
           <button onClick={onClose} className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
              Close
           </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { 
  X, ShieldCheck, ShieldAlert, 
  CheckCircle2, XCircle, FileText,
  Building2, User, Globe, MapPin,
  ExternalLink, Download, Mail
} from 'lucide-react';

export interface VerificationRequest {
  id: string;
  name: string;
  type: 'Designer' | 'Shop';
  plan: string;
  date: string;
  time: string;
  location: string;
  email: string;
  status: string;
}

interface VerificationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: VerificationRequest | null;
}

export function VerificationReviewModal({ isOpen, onClose, request }: VerificationReviewModalProps) {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-[800px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="p-8 md:p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                 {request.type === 'Designer' ? <User className="text-indigo-600" size={24} /> : <Building2 className="text-emerald-600" size={24} />}
              </div>
              <div>
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight">Review Application</h2>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Submission ID: {request.id}</p>
              </div>
           </div>
           <button onClick={onClose} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-100">
              <X size={20} />
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-10">
           <div className="space-y-8">
              <div>
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Account Information</div>
                 <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Legal Name</div>
                       <div className="text-sm font-black text-slate-900">{request.name}</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Subscription Plan</div>
                       <div className="text-sm font-black text-indigo-600">{request.plan}</div>
                    </div>
                    <div className="flex flex-col gap-2 px-1">
                       <div className="flex items-center gap-3 text-slate-500">
                          <MapPin size={14} />
                          <span className="text-xs font-bold">{request.location}</span>
                       </div>
                       <div className="flex items-center gap-3 text-slate-500">
                          <Mail size={14} />
                          <span className="text-xs font-bold">{request.email}</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div>
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Verification Documents</div>
                 <div className="space-y-3">
                    <button className="w-full p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-indigo-600 transition-all">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center"><FileText size={16} /></div>
                          <div className="text-left">
                             <div className="text-[10px] font-black text-slate-900">Government ID</div>
                             <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">Verified_ID.pdf</div>
                          </div>
                       </div>
                       <Download size={16} className="text-slate-300 group-hover:text-indigo-600" />
                    </button>
                    {request.type === 'Shop' && (
                      <button className="w-full p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-indigo-600 transition-all">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center"><Building2 size={16} /></div>
                            <div className="text-left">
                               <div className="text-[10px] font-black text-slate-900">Business Permit</div>
                               <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">SEC_Registration.pdf</div>
                            </div>
                         </div>
                         <Download size={16} className="text-slate-300 group-hover:text-emerald-600" />
                      </button>
                    )}
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <div>
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Designer Portfolio Preview</div>
                 <div className="aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden relative group">
                    <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400" alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <ExternalLink size={24} className="text-white" />
                    </div>
                 </div>
                 <div className="mt-4 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex items-start gap-3">
                    <ShieldAlert size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-medium text-indigo-700 leading-relaxed">
                       Designer has provided a link to their external portfolio on Satura Creative Studio. Identity matches verified ID.
                    </p>
                 </div>
              </div>
           </div>
        </div>

        {/* Actions */}
        <div className="p-8 md:p-10 border-t border-slate-50 flex items-center gap-4 bg-slate-50/30">
           <button className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2">
              <CheckCircle2 size={18} /> Approve & Activate
           </button>
           <button className="flex-1 py-4 bg-white border border-rose-100 text-rose-600 rounded-2xl font-black text-sm hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm">
              <XCircle size={18} /> Decline Application
           </button>
        </div>
      </div>
    </div>
  );
}

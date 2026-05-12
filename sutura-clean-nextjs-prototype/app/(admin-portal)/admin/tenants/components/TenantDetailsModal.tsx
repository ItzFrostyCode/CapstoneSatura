'use client';

import React from 'react';
import { 
  X, Building2, User, Mail, 
  Phone, Globe, MapPin, Calendar,
  ShieldCheck, CreditCard, Activity,
  AlertCircle
} from 'lucide-react';

export interface Tenant {
  id: string;
  name: string;
  type: string;
  plan: string;
  status: 'Active' | 'Suspended';
  joined: string;
}

interface TenantDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
}

export function TenantDetailsModal({ isOpen, onClose, tenant }: TenantDetailsModalProps) {
  if (!isOpen || !tenant) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-[700px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                 <Building2 className="text-indigo-600" size={28} />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight">{tenant.name}</h2>
                 <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{tenant.id}</span>
                    <span className="text-slate-300">•</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${tenant.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                       {tenant.status}
                    </span>
                 </div>
              </div>
           </div>
           <button onClick={onClose} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-100">
              <X size={20} />
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
           {/* Business Profile */}
           <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <User size={12} /> Account Owner
                 </div>
                 <div className="text-sm font-black text-slate-900">Joshua Arabojo</div>
                 <div className="text-[11px] font-bold text-slate-500 mt-1 flex items-center gap-2">
                    <Mail size={12} /> joshua@example.com
                 </div>
              </div>
              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <CreditCard size={12} /> Subscription
                 </div>
                 <div className="text-sm font-black text-indigo-600">{tenant.plan} Plan</div>
                 <div className="text-[11px] font-bold text-slate-500 mt-1 flex items-center gap-2">
                    <Calendar size={12} /> Renews June 20, 2026
                 </div>
              </div>
           </div>

           {/* Stats Summary */}
           <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Orders</div>
                 <div className="text-xl font-black text-slate-900">142</div>
              </div>
              <div className="text-center p-4 border-x border-slate-100">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Staff</div>
                 <div className="text-xl font-black text-slate-900">8</div>
              </div>
              <div className="text-center p-4">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rev. Share</div>
                 <div className="text-xl font-black text-slate-900">5%</div>
              </div>
           </div>

           {/* Additional Info */}
           <div className="space-y-4">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Business Identity</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex items-center gap-3 text-slate-600 bg-white p-3 rounded-2xl border border-slate-100">
                    <MapPin size={16} className="text-slate-400" />
                    <span className="text-xs font-bold">Davao City, PH</span>
                 </div>
                 <div className="flex items-center gap-3 text-slate-600 bg-white p-3 rounded-2xl border border-slate-100">
                    <Globe size={16} className="text-slate-400" />
                    <span className="text-xs font-bold underline cursor-pointer">golden-needle.sutura.com</span>
                 </div>
              </div>
           </div>

           {/* Security / Health */}
           <div className="p-6 bg-slate-900 rounded-[32px] text-white">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    <ShieldCheck size={14} /> Security Status
                 </div>
                 <span className="text-[10px] font-bold text-slate-400">Last login: 2h ago</span>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                 Business identity was verified on {tenant.joined}. All compliance checks are current. No security flags or pending support escalations found.
              </p>
           </div>
        </div>

        {/* Actions */}
        <div className="p-8 border-t border-slate-50 flex items-center gap-3 bg-slate-50/30">
           {tenant.status === 'Active' ? (
             <button className="flex-1 py-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2">
                <AlertCircle size={16} /> Suspend Account
             </button>
           ) : (
             <button className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                <ShieldCheck size={16} /> Activate Account
             </button>
           )}
           <button className="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
              Manage Billing
           </button>
        </div>
      </div>
    </div>
  );
}

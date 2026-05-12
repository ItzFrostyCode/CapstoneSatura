'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, UserCheck, Building2, 
  Search, Filter, CheckCircle2, 
  XCircle, Clock, ArrowUpRight,
  MoreHorizontal, Eye, ShieldAlert,
  ChevronRight, ExternalLink
} from 'lucide-react';

import { VerificationReviewModal, VerificationRequest } from './components/VerificationReviewModal';

export default function AdminVerificationQueue() {
  const [activeTab, setActiveTab] = useState('Pending');
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pendingRequests: VerificationRequest[] = [
    { 
      id: 'SUB-101', 
      name: 'Joshua Arabojo', 
      type: 'Designer', 
      plan: 'Pro Designer', 
      date: 'May 12, 2026', 
      time: '02:45 PM', 
      location: 'Davao City, PH', 
      email: 'joshua@satura.com',
      status: 'Pending' 
    },
    { 
      id: 'SUB-105', 
      name: 'Lumina Tailoring', 
      type: 'Shop', 
      plan: 'Enterprise', 
      date: 'May 11, 2026', 
      time: '11:20 AM', 
      location: 'Quezon City, PH', 
      email: 'verify@lumina.ph',
      status: 'Pending' 
    },
    { 
      id: 'SUB-110', 
      name: 'Isabel Rivera', 
      type: 'Designer', 
      plan: 'Starter', 
      date: 'May 10, 2026', 
      time: '09:12 AM', 
      location: 'Cebu City, PH', 
      email: 'isabel.r@fashions.ph',
      status: 'Pending' 
    },
  ];

  return (
    <div className="space-y-10 font-outfit p-8 max-w-[1400px] mx-auto w-full">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Verification Queue</h1>
          <p className="text-lg font-medium text-slate-500 mt-1">Review and approve new shop and designer account requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-sm font-black text-slate-900">{pendingRequests.length} Pending Approvals</span>
             </div>
          </div>
        </div>
      </div>

      {/* ── KPI GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Pending', value: String(pendingRequests.length), icon: <Clock size={20} />, color: 'bg-amber-50 text-amber-600' },
          { label: 'Verified Designers', value: '142', icon: <UserCheck size={20} />, color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Verified Shops', value: '86', icon: <Building2 size={20} />, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Account Status', value: 'Verified', icon: <ShieldCheck size={20} />, color: 'bg-slate-900 text-white' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:shadow-xl">
             <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 bg-slate-50 border border-slate-100">
                <div className={stat.color + " p-2 rounded-xl"}>{stat.icon}</div>
             </div>
             <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
             <div className="text-sm font-bold text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── FILTER TABS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
          {['Pending', 'Verified', 'Rejected'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-xl text-sm font-black transition-all ${
                activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search accounts..." 
              className="w-64 h-12 pl-12 pr-4 bg-white border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-indigo-600 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* ── VERIFICATION TABLE ── */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Name</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Subscription Plan</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Requested</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {pendingRequests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50/50 transition-all group">
                <td className="px-8 py-6">
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${req.type === 'Designer' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                         {req.name.charAt(0)}
                      </div>
                      <div>
                         <div className="text-sm font-black text-slate-900">{req.name}</div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{req.id}</div>
                      </div>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                     req.type === 'Designer' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                   }`}>
                     {req.type}
                   </span>
                </td>
                <td className="px-8 py-6">
                   <div className="text-sm font-black text-slate-900">{req.plan}</div>
                   <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Annual Billing</div>
                </td>
                <td className="px-8 py-6">
                   <div className="text-sm font-black text-slate-900">{req.date}</div>
                   <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{req.time}</div>
                </td>
                <td className="px-8 py-6 text-right">
                   <button 
                     onClick={() => {
                       setSelectedRequest(req);
                       setIsModalOpen(true);
                     }}
                     className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-2 ml-auto"
                   >
                      Review <ChevronRight size={14} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <VerificationReviewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
      />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Filter, 
  ChevronRight, Calendar, Clock, 
  User, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { RequestReviewModal } from './components/RequestReviewModal';
import { BookConsultationModal } from '../appointments/components/BookConsultationModal';

export default function DesignerRequests() {
  const [activeTab, setActiveTab] = useState('All Requests');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const requests = [
    { id: 'REQ-992', client: 'Maria Clara Santos', garment: 'Modern Filipiniana', date: 'May 10, 2026', type: 'Custom Made', status: 'Pending Review' },
    { id: 'REQ-995', client: 'Ricardo Dalisay', garment: 'Barong Tagalog', date: 'May 11, 2026', type: 'Bespoke', status: 'Consulting' },
    { id: 'REQ-998', client: 'Elena Gilbert', garment: 'Evening Gown', date: 'May 12, 2026', type: 'Design Only', status: 'Active Commissions' },
    { id: 'REQ-1002', client: 'Damon Salvatore', garment: 'Leather Jacket', date: 'May 14, 2026', type: 'Bespoke', status: 'Pending Review' },
  ];

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'All Requests') return true;
    return req.status === activeTab;
  });

  const handleRequestClick = (req: any) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 font-outfit">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Client Requests</h1>
          <p className="text-slate-500 font-medium mt-1">Manage incoming design inquiries and consultations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search requests..." 
              className="pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:border-indigo-600 outline-none w-64 shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-slate-100 pb-px">
        {['All Requests', 'Pending Review', 'Consulting', 'Active Commissions'].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-black transition-all relative ${activeTab === tab ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'}`}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full animate-in slide-in-from-left-2 duration-300" />}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client / ID</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Garment Type</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Request Date</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => handleRequestClick(req)}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-black text-xs">
                        {req.id.split('-')[1]}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-sm">{req.client}</div>
                        <div className="text-[11px] font-bold text-slate-400">{req.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-black text-slate-700">{req.garment}</div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{req.type}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                      <Calendar size={14} className="text-slate-300" />
                      {req.date}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      req.status === 'Pending Review' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                      req.status === 'Consulting' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="inline-flex items-center justify-center w-10 h-10 bg-white border border-slate-100 rounded-xl text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-600 transition-all shadow-sm">
                      <ArrowUpRight size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-300 mx-auto mb-4">
                    <ShoppingBag size={32} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">No requests found</h3>
                  <p className="text-sm font-medium text-slate-400 mt-2">Try adjusting your filters or search terms.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <RequestReviewModal 
        isOpen={isModalOpen} 
        request={selectedRequest}
        onClose={() => setIsModalOpen(false)}
        onSchedule={() => {
          setIsModalOpen(false);
          setIsBookModalOpen(true);
        }}
      />

      <BookConsultationModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        clientName={selectedRequest?.client}
        requestId={selectedRequest?.id}
      />
    </div>
  );
}

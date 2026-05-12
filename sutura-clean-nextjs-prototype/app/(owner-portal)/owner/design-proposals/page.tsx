'use client';

import React, { useState } from 'react';
import { 
  Search, Palette, Clock, 
  CheckCircle2, XCircle, MoreVertical, MessageSquare,
  Trash2, Download, ExternalLink, ArrowDownLeft,
  X, Code, Sparkles, ArrowRight, RefreshCw, 
  Package, CheckCircle, ChevronRight, History
} from 'lucide-react';
import Link from 'next/link';

type ProposalTab = 'pending' | 'revision' | 'history';

const mockProposals = [
  {
    id: "DS-2026-001",
    customer: "Maria Clara Santos",
    garment: "Modern Filipiniana Gown",
    designer: "Elena Cruz",
    designerRole: "In-House Designer",
    date: "May 10, 2026",
    status: 'Pending Review',
    tab: 'pending'
  },
  {
    id: "DS-2026-005",
    customer: "Anne Hathaway",
    garment: "Evening Gala Gown",
    designer: "Elena Cruz",
    designerRole: "In-House Designer",
    date: "May 09, 2026",
    status: 'Revision Requested',
    tab: 'revision'
  },
  {
    id: "DS-2026-004",
    customer: "James Brown",
    garment: "Premium Silk Suit",
    designer: "Marco Rossi",
    designerRole: "Freelance Specialist",
    date: "May 08, 2026",
    status: 'Converted to Order',
    tab: 'history',
    orderId: 'ORD-1080'
  },
  {
    id: "DS-2026-003",
    customer: "Sarah Jenkins",
    garment: "Summer RTW Line",
    designer: "Liza Soberano",
    designerRole: "Guest Designer",
    date: "May 01, 2026",
    status: 'Rejected',
    tab: 'history'
  }
];

export default function DesignProposalsPage() {
  const [activeTab, setActiveTab] = useState<ProposalTab>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState('');

  const filteredProposals = mockProposals.filter(p => {
    const matchesTab = p.tab === activeTab;
    const matchesSearch = p.customer.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.garment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] animate-in fade-in duration-500 pb-20 font-outfit">
      {/* HEADER */}
      <div className="bg-transparent px-10 py-12">
        <div className="max-w-[1450px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-black tracking-widest uppercase text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">Designer Collaboration</span>
            </div>
            <h1 className="text-[36px] font-black text-slate-900 tracking-tight leading-none">Design Proposals</h1>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setShowImportModal(true)}
               className="h-11 px-6 bg-white border border-slate-200 rounded-2xl text-[12px] font-black text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center gap-2 shadow-sm active:scale-95"
             >
                <ArrowDownLeft size={16} className="text-indigo-500" /> Import Design Blueprint
             </button>
          </div>
        </div>
      </div>

      <main className="max-w-[1450px] mx-auto px-10">
        {/* CLEAN PILL TABS */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-1 p-1 bg-slate-100/50 border border-slate-200/60 rounded-full shadow-sm overflow-x-auto max-w-full">
            {[
              { id: 'pending', label: 'Pending Review', icon: <ArrowDownLeft size={14}/> },
              { id: 'revision', label: 'In Revision', icon: <RefreshCw size={14}/> },
              { id: 'history', label: 'History & Processed', icon: <History size={14}/> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ProposalTab)}
                className={`px-6 py-2.5 text-[13px] font-bold transition-all rounded-full flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-[340px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Quick search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-full text-[13px] font-bold placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* PROPOSALS TABLE */}
        <div className="bg-white border border-slate-200 rounded-[40px] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30 border-b border-slate-100">
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Blueprint Detail</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Designer</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Status</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProposals.length > 0 ? (
                filteredProposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-[18px] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                          <Palette size={20} />
                        </div>
                        <div>
                          <div className="text-[15px] font-black text-slate-900 tracking-tight">{proposal.garment}</div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{proposal.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="text-[14px] font-bold text-slate-600">{proposal.customer}</div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="text-[14px] font-black text-slate-900 leading-none mb-1">{proposal.designer}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{proposal.designerRole}</div>
                    </td>
                    <td className="px-10 py-7 text-center">
                      <span className={`inline-block px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border whitespace-nowrap ${
                        proposal.status === 'Converted to Order' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        proposal.status === 'Revision Requested' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        proposal.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {proposal.status}
                      </span>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {proposal.tab === 'pending' && (
                          <Link 
                            href={`/owner/design-proposals/${proposal.id}`}
                            className="h-11 px-6 bg-slate-900 text-white rounded-xl text-[12px] font-black hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10 active:scale-95"
                          >
                            Review & Convert <ChevronRight size={14}/>
                          </Link>
                        )}
                        {proposal.tab === 'revision' && (
                          <button 
                            onClick={() => {
                              setFeedbackContent(proposal.id === "DS-2026-005" ? "The neckline is too high. Please adjust to a deep V-neck as discussed." : "Needs more detailed sketches for the back profile.");
                              setIsFeedbackModalOpen(true);
                            }}
                            className="h-11 px-6 bg-white border border-slate-200 text-slate-900 rounded-xl text-[12px] font-black hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center gap-2"
                          >
                            <MessageSquare size={14}/> Check Feedback
                          </button>
                        )}
                        {proposal.tab === 'history' && (
                          <div className="flex items-center gap-2">
                             {proposal.status === 'Converted to Order' && (
                               <button className="h-11 px-6 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-[11px] font-black hover:bg-emerald-100 transition-all flex items-center gap-2">
                                 <Package size={14}/> View Job Order
                               </button>
                             )}
                             <Link 
                               href={`/owner/design-proposals/${proposal.id}`}
                               className="h-11 px-6 bg-white border border-slate-200 text-slate-600 rounded-xl text-[11px] font-black hover:bg-slate-50 transition-all flex items-center gap-2"
                             >
                               View Blueprint
                             </Link>
                          </div>
                        )}
                        <button className="h-11 w-11 bg-white border border-slate-100 text-slate-400 rounded-xl hover:text-slate-900 hover:border-slate-200 transition-all flex items-center justify-center">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                        <Package size={32} />
                      </div>
                      <div className="text-[14px] font-bold text-slate-400">No projects currently in {activeTab} stage.</div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowImportModal(false)} />
          <div className="relative w-full max-w-[500px] bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-[18px] flex items-center justify-center">
                    <Code size={24} />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-black text-slate-900 tracking-tight">Import Design Blueprint</h3>
                    <p className="text-[12px] font-bold text-slate-400">Enter code to link external project.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowImportModal(false)}
                  className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5 block px-1">Blueprint Code</label>
                   <div className="relative group">
                      <Sparkles size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                      <input 
                        type="text"
                        value={importCode}
                        onChange={(e) => setImportCode(e.target.value.toUpperCase())}
                        placeholder="e.g. BLUE-2026-X99"
                        className="w-full h-14 bg-slate-50 border border-slate-200 rounded-[20px] pl-12 pr-4 text-[18px] font-black placeholder:text-slate-300 outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
                      />
                   </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-[24px] p-5">
                   <p className="text-[11px] font-bold text-indigo-800 leading-relaxed">
                      Linking a blueprint will automatically fetch technical specs, sketches, and customer body profiles into your production queue.
                   </p>
                </div>

                <div className="pt-4">
                  <button className="w-full h-14 bg-slate-900 text-white rounded-[20px] text-[14px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] flex items-center justify-center gap-3">
                    <Download size={20} /> Fetch Blueprint Package
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* CHECK FEEDBACK MODAL */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsFeedbackModalOpen(false)} />
          <div className="relative w-full max-w-[450px] bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-[18px] flex items-center justify-center">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-black text-slate-900 tracking-tight">Revision Feedback</h3>
                    <p className="text-[12px] font-bold text-slate-400">Design requested for changes.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 flex items-center justify-center transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-6 mb-8 italic text-slate-700 font-bold leading-relaxed">
                &quot;{feedbackContent}&quot;
              </div>

              <div className="flex gap-3">
                 <Link 
                   href="/owner/design-proposals/DS-2026-005"
                   className="flex-1 h-14 bg-slate-900 text-white rounded-[20px] text-[13px] font-black hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
                 >
                   Open Editor <ArrowRight size={16}/>
                 </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

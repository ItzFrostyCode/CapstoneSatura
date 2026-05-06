'use client';

import { useState } from 'react';
import { MapPin, ChevronDown, Check, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useERPStore } from '@/store/useERPStore';

export function BranchSwitcher() {
  const { currentBranch, branches, setCurrentBranch, canSwitchBranch, currentUser } = useERPStore();
  const [isOpen, setIsOpen] = useState(false);

  // 1. Role-based Guarding: If the user doesn't have permission to switch (Owner/Admin only), 
  // we just show a static, premium badge of their current locked branch.
  if (!canSwitchBranch()) {
    return (
      <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-100/50 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm transition-all">
        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
          <MapPin size={16} />
        </div>
        <div className="text-left">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
            Current Workspace
          </div>
          <div className="text-[14px] font-black text-slate-900 leading-none">
            {currentBranch?.branchName || 'No Branch'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl transition-all group shadow-sm hover:shadow-md"
      >
        <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-105 transition-transform">
          <Building2 size={18} />
        </div>
        <div className="text-left">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
            Switch Workspace
          </div>
          <div className="text-[15px] font-black text-slate-900 leading-none flex items-center gap-2">
            {currentBranch?.branchName}
            <ChevronDown size={14} className={`transition-transform duration-300 text-slate-400 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute left-0 mt-3 w-72 bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden backdrop-blur-xl">
            <div className="px-4 pt-3 pb-2 mb-2">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                Operational Branches
              </div>
            </div>
            
            <div className="space-y-1 max-h-[400px] overflow-y-auto custom-scrollbar px-1">
              {branches.map((branch) => {
                const isActive = branch.id === currentBranch?.id;
                return (
                  <button
                    key={branch.id}
                    onClick={() => {
                      const { hasUnsavedChanges } = useERPStore.getState();
                      if (hasUnsavedChanges) {
                        const confirmed = window.confirm('You have unsaved changes. Switching branches will discard them. Continue?');
                        if (!confirmed) return;
                      }
                      setCurrentBranch(branch);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-[18px] transition-all group ${
                      isActive 
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                        : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex flex-col items-start">
                      <span className={`text-[14px] font-black leading-none mb-1.5 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                        {branch.branchName}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          isActive ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {branch.branchCode}
                        </span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>
                          • {branch.branch_type}
                        </span>
                      </div>
                    </div>
                    {isActive && (
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-2 p-1">
              <Link 
                href="/owner/branches"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all text-[12px] font-black uppercase tracking-widest"
                onClick={() => setIsOpen(false)}
              >
                Manage Branches
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

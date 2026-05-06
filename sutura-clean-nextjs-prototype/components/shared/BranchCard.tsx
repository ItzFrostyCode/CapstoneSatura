'use client';

import { MapPin, Users, ShoppingBag, Building2, ChevronRight, User } from 'lucide-react';
import { ShopBranch, Staff, Order } from '@/types/erp';
import Link from 'next/link';

interface BranchCardProps {
  branch: ShopBranch;
  manager?: Staff;
  staffCount: number;
  activeOrdersCount: number;
}

export function BranchCard({ branch, manager, staffCount, activeOrdersCount }: BranchCardProps) {
  const isMain = branch.isMain;

  return (
    <div className="group bg-white border border-slate-200 rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden relative">
      {/* Background Decorative Element */}
      <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${
        isMain ? 'bg-indigo-600' : 'bg-emerald-600'
      }`} />

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500 ${
            isMain ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
          }`}>
            <Building2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[18px] font-black text-slate-900 tracking-tight leading-none">
                {branch.branchName}
              </h3>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                isMain ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {branch.branch_type}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
              <MapPin size={12} />
              {branch.branchCode}
            </div>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
          branch.status === 'ACTIVE' 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
            : 'bg-slate-50 text-slate-400 border-slate-100'
        }`}>
          {branch.status}
        </div>
      </div>

      {/* Manager & Location */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
          <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 overflow-hidden shadow-sm">
            {manager?.avatar ? (
              <img src={manager.avatar} alt={manager.name} className="w-full h-full object-cover" />
            ) : (
              <User size={18} />
            )}
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
              Branch Manager
            </div>
            <div className="text-[13px] font-bold text-slate-900">
              {manager?.name || 'Unassigned'}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 px-1">
          <div className="w-5 h-5 mt-0.5 rounded bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
            <MapPin size={12} />
          </div>
          <div className="text-[13px] text-slate-500 font-medium leading-relaxed">
            {branch.address}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Users size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Staff</span>
          </div>
          <div className="text-[20px] font-black text-slate-900 tabular-nums">
            {staffCount}
          </div>
        </div>
        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <ShoppingBag size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">Active Orders</span>
          </div>
          <div className="text-[20px] font-black text-slate-900 tabular-nums">
            {activeOrdersCount}
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <Link 
        href={`/owner/branches/${branch.id}`}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all duration-300 border ${
          isMain 
            ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20' 
            : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50'
        }`}
      >
        Open Workspace
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}

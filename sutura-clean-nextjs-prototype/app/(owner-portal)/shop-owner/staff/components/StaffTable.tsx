'use client';

import React from 'react';
import { Mail, Phone, MoreVertical, Lock, Search, ChevronDown } from 'lucide-react';
import { Staff, StaffRole, Order, ShopBranch } from '@/store/useERPStore';

interface StaffTableProps {
  staff: Staff[];
  orders: Order[];
  branches: ShopBranch[];
  onUpdateStaff: (id: string, data: Partial<Staff>) => void;
  roleFilter: StaffRole | 'All';
  setRoleFilter: React.Dispatch<React.SetStateAction<StaffRole | 'All'>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

function getRoleBadge(role: StaffRole) {
  switch (role) {
    case 'SHOP_OWNER': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    case 'STAFF': return 'bg-slate-50 text-slate-700 border-slate-200';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
}

export const StaffTable: React.FC<StaffTableProps> = ({ 
  staff, orders, branches, onUpdateStaff, 
  roleFilter, setRoleFilter, searchQuery, setSearchQuery 
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* INTEGRATED HEADER */}
      <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/20 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/40 rounded-2xl w-max border border-slate-200/50 overflow-x-auto max-w-full">
          {(['All', 'SHOP_OWNER', 'STAFF'] as const).map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role as StaffRole | 'All')}
              className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${roleFilter === role ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {role === 'All' ? 'View All' : role === 'SHOP_OWNER' ? 'Shop Owners' : 'Shop Staff'}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-80 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" size={16} />
          <input 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            type="text" 
            placeholder="Search by name or code..." 
            className="h-14 w-full pl-14 pr-6 bg-white border border-slate-100 rounded-[20px] text-[13px] font-bold outline-none focus:border-slate-900 transition-all shadow-sm" 
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30 border-b border-slate-100">
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Account Holder <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Roles & Access <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Branch <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap text-center">
                <div className="flex items-center justify-center gap-2">Workload <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                <div className="flex items-center gap-2">Contact Details <ChevronDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-6 px-10 text-[14px] font-bold text-slate-600 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {staff.map(s => {
              const activeCount = orders.filter(o => (o.assigned_staff_id === s.id || o.assigned_tailor_id === s.id) && o.status !== 'RELEASED' && o.status !== 'CANCELLED').length;

              return (
                <tr 
                  key={s.id} 
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  onClick={() => onUpdateStaff(s.id, {})}
                >
                  <td className="py-6 px-10">
                    <div className="text-[15px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{s.name}</div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.staffCode || '---'}</div>
                  </td>
                  <td className="py-6 px-10">
                    <div className="flex flex-wrap gap-2">
                      {s.roles.map(role => (
                        <span key={role} className={`inline-flex items-center px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${getRoleBadge(role as StaffRole)}`}>
                          {role === 'STAFF' ? 'Staff' : role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-6 px-10">
                    <div className="text-[14px] font-bold text-slate-700">
                      {branches.find(b => b.id === s.branch_id)?.branchName || 'Headquarters'}
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                      {branches.find(b => b.id === s.branch_id)?.branchCode || 'BRN-001'}
                    </div>
                  </td>
                  <td className="py-6 px-10">
                    <div className="flex flex-col items-center">
                      <div className={`text-[18px] font-black ${activeCount > 3 ? 'text-rose-600' : 'text-slate-900'}`}>{activeCount}</div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Orders</div>
                      {activeCount > 3 && (
                        <span className="text-[8px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100 mt-2 uppercase">Limit Reached</span>
                      )}
                    </div>
                  </td>
                  <td className="py-6 px-10">
                    <div className="space-y-1.5">
                      <div className="text-[12px] font-bold text-slate-600 flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-all"><Mail size={12} /></div>
                        {s.email || 'no-email@sutura.com'}
                      </div>
                      <div className="text-[12px] font-bold text-slate-600 flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-all"><Phone size={12} /></div>
                        {s.phone || '---'}
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-10 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm active:scale-95">
                          <MoreVertical size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-10 py-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
        <div className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">
          Total User Accounts: <span className="text-slate-900">{staff.length}</span>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2 rounded-xl border border-slate-200 text-[11px] font-black uppercase tracking-widest bg-white text-slate-400 cursor-not-allowed">
            Prev
          </button>
          <button className="px-6 py-2 rounded-xl border border-slate-200 text-[11px] font-black uppercase tracking-widest bg-white text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { Mail, Phone, MoreVertical, X } from 'lucide-react';
import { Staff, StaffRole, Order } from '@/store/useERPStore';

interface StaffTableProps {
  staff: Staff[];
  orders: Order[];
  branches: import('@/types/erp').ShopBranch[];
  onUpdateStaff: (id: string, data: Partial<Staff>) => void;
}

function getRoleBadge(role: StaffRole) {
  switch (role) {
    case 'Admin': return 'bg-rose-50 text-rose-700 border-rose-100';
    case 'Manager': return 'bg-cyan-50 text-cyan-700 border-cyan-100';
    case 'Sales': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    case 'Tailor': return 'bg-amber-50 text-amber-700 border-amber-100';
    case 'Inventory': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}

export const StaffTable: React.FC<StaffTableProps> = ({ staff, orders, branches, onUpdateStaff }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
            <th className="px-6 py-4">Employee</th>
            <th className="px-6 py-4">Roles & Skills</th>
            <th className="px-6 py-4">Branch</th>
            <th className="px-6 py-4 text-center">Active Workload</th>
            <th className="px-6 py-4">Contact</th>
            <th className="px-6 py-4 text-center">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {staff.map(s => {
            const activeCount = orders.filter(o => o.assigned_tailor_id === s.id && o.status !== 'COMPLETED' && o.status !== 'CANCELLED' && o.status !== 'DELIVERED').length;
            
            // Handle specialization as tags
            const specs = typeof s.specialization === 'string' 
              ? s.specialization.split(',').filter((x: string) => x.trim()) 
              : (Array.isArray(s.specialization) ? s.specialization : []);

            return (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-6 py-4">
                  <div className="text-[14px] font-bold text-slate-900">{s.name}</div>
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{s.staffCode}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {s.roles.map(role => (
                      <span key={role} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${getRoleBadge(role as StaffRole)}`}>
                        {role}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {specs.map(tag => (
                      <div key={tag} className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-600 rounded-md border border-slate-200 text-[10px] font-bold uppercase tracking-tight">
                        {tag}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const newSpecs = specs.filter((t: string) => t !== tag).join(', ');
                            onUpdateStaff(s.id, { specialization: newSpecs });
                          }}
                          className="hover:text-rose-500 transition-colors"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-[13px] font-black text-slate-700">
                    {branches.find(b => b.id === s.branch_id)?.branchName || 'Not Assigned'}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    {branches.find(b => b.id === s.branch_id)?.branchCode || '---'}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className={`text-[18px] font-black ${activeCount > 3 ? 'text-rose-600' : 'text-slate-900'}`}>{activeCount}</div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Orders</div>
                    {activeCount > 3 && (
                      <span className="text-[8px] font-black text-rose-500 bg-rose-50 px-1 rounded border border-rose-100 mt-1 uppercase">Overloaded</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {s.email && <div className="text-[12px] text-slate-600 flex items-center gap-2"><Mail size={12} /> {s.email}</div>}
                  {s.phone && <div className="text-[12px] text-slate-600 flex items-center gap-2 mt-1"><Phone size={12} /> {s.phone}</div>}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest ${s.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="h-9 w-9 rounded-lg bg-white border border-slate-200 inline-flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shadow-sm">
                    <MoreVertical size={15} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

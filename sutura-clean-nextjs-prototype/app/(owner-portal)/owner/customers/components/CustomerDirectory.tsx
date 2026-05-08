'use client';

import React from 'react';
import { Search, Filter, Plus, Eye, Mail, Phone } from 'lucide-react';
import { Customer } from '@/types/erp';

interface CustomerDirectoryProps {
  customers: Customer[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectCustomer: (id: string) => void;
  onOpenAddModal: () => void;
}

export const CustomerDirectory: React.FC<CustomerDirectoryProps> = ({
  customers,
  searchQuery,
  setSearchQuery,
  onSelectCustomer,
  onOpenAddModal
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-black text-slate-900 tracking-tight leading-none">Customers</h1>
          <p className="text-[12px] text-slate-500 font-medium mt-1">Manage your artisan tailoring database and measurement profiles.</p>
        </div>
        <button 
          onClick={onOpenAddModal}
          className="bg-slate-900 text-white h-10 px-6 rounded-xl text-[13px] font-black shadow-lg shadow-slate-900/10 hover:bg-indigo-600 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={16} /> Register Customer
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden mt-4">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/30">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone..." 
              className="h-10 w-full pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
            />
          </div>
          <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[12px] font-black text-slate-600 hover:border-slate-900 transition-all">
            <Filter size={14} /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-2.5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Name</th>
                <th className="py-2.5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Information</th>
                <th className="py-2.5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="py-2.5 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customers.map(c => (
                <tr 
                  key={c.id} 
                  onClick={() => onSelectCustomer(c.id)}
                  className="group hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-6">
                    <div>
                      <div className="text-[13px] font-black text-slate-900">{c.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{c.id} • {c.gender || 'M'}</div>
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-[12px] text-slate-600 font-medium">
                        <Mail size={12} className="text-slate-300" /> {c.email}
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-slate-600 font-medium">
                        <Phone size={12} className="text-slate-300" /> {c.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${c.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex justify-end">
                      <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

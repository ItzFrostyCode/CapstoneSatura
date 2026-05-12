'use client';

import React from 'react';
import { Search, Filter, Plus, Eye, Mail, Phone, ChevronDown } from 'lucide-react';
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
          className="bg-white border border-slate-200 text-slate-900 h-12 px-6 rounded-full text-[14px] font-black shadow-sm hover:border-slate-900 transition-all flex items-center gap-2 active:scale-95"
        >
          <Plus size={20} /> Walk In Customer
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden mt-6">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone..." 
              className="h-11 w-full pl-11 pr-4 bg-slate-50/50 border border-slate-100 rounded-xl text-[13px] font-medium outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="fixed-table-container">
          <table className="fixed-table w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                  <div className="flex items-center gap-2">ID <ChevronDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                  <div className="flex items-center gap-2">Full Name <ChevronDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                  <div className="flex items-center gap-2">Email <ChevronDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap">
                  <div className="flex items-center gap-2">Contact Number <ChevronDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">Gender <ChevronDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">Source <ChevronDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">Status <ChevronDown size={14} className="text-slate-400" /></div>
                </th>
                <th className="py-6 px-8 text-[14px] font-bold text-slate-600 whitespace-nowrap text-right pr-10">
                  <div className="flex items-center justify-end gap-2 pr-2">Action <ChevronDown size={14} className="text-slate-400" /></div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customers.map(c => {
                const displayId = `Cust-${parseInt(c.id.split('-')[1]) || c.id}`;
                return (
                  <tr 
                    key={c.id} 
                    onClick={() => onSelectCustomer(c.id)}
                    className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <td className="py-6 px-8 text-[12px] font-bold text-slate-400">{displayId}</td>
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 border border-slate-200">
                          {c.avatar ? (
                            <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[12px] font-black text-slate-400">
                              {c.name[0]}
                            </div>
                          )}
                        </div>
                        <div className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{c.name}</div>
                      </div>
                    </td>
                    <td className="py-6 px-8 text-[13px] font-medium text-slate-600">{c.email}</td>
                    <td className="py-6 px-8 text-[13px] font-medium text-slate-600">{c.phone}</td>
                    <td className="py-6 px-8 text-center text-[13px] font-medium text-slate-600">{c.gender}</td>
                    <td className="py-6 px-8 text-center">
                      <span className="text-[12px] font-bold text-slate-600">{c.source === 'Walk-in' ? 'Walk_In' : c.source}</span>
                    </td>
                    <td className="py-6 px-8 text-center">
                      <span className={`text-[12px] font-bold ${c.is_active ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {c.is_active ? 'Active' : 'InActive'}
                      </span>
                    </td>
                    <td className="py-6 px-8 text-right pr-10">
                      <div className="flex justify-end">
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

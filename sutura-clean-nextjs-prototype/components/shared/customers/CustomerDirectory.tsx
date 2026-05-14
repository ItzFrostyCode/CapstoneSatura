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
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 mt-4">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight flex items-center gap-3">
            Customer Management
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Managing the relationships and unique profiles of our esteemed clientele.</p>
        </div>
        
        <button 
          onClick={onOpenAddModal}
          className="h-10 px-5 bg-slate-900 text-white rounded-full flex items-center gap-2 text-[12px] font-bold hover:bg-indigo-600 transition-all shadow-md active:scale-95"
        >
          <Plus size={16} /> Register New Client
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-[40px] shadow-sm overflow-hidden mt-2">
        {/* INTEGRATED HEADER: SEARCH & FILTER */}
        <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/20 flex items-center justify-between gap-8">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or ID..." 
              className="h-10 w-full pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[13px] font-bold outline-none focus:border-slate-900 transition-all shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2">
             <button className="h-10 px-4 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-900 transition-all bg-white shadow-sm flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                <Filter size={14} /> Filter List
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-10 py-5">Client Identity</th>
                <th className="px-10 py-5">Contact Details</th>
                <th className="px-10 py-5 text-center">Gender</th>
                <th className="px-10 py-5 text-center">Acquisition</th>
                <th className="px-10 py-5 text-center">Lifecycle</th>
                <th className="px-10 py-5 text-right pr-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {customers.map(c => {
                const displayId = `CUST-${parseInt(c.id.split('-')[1]) || c.id}`;
                return (
                  <tr 
                    key={c.id} 
                    onClick={() => onSelectCustomer(c.id)}
                    className="hover:bg-slate-50/50 transition-all group cursor-pointer"
                  >
                    <td className="px-10 py-7">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[18px] overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center text-[14px] font-black text-slate-400 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                          {c.avatar ? <img src={c.avatar} alt="" className="w-full h-full object-cover" /> : c.name[0]}
                        </div>
                        <div>
                          <div className="text-[15px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{c.name}</div>
                          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{displayId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <div className="text-[14px] font-bold text-slate-600">{c.email}</div>
                      <div className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{c.phone}</div>
                    </td>
                    <td className="px-10 py-7 text-center">
                      <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-lg uppercase tracking-widest border border-slate-200">{c.gender}</span>
                    </td>
                    <td className="px-10 py-7 text-center">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.source === 'Walk-in' ? 'Walk_In' : c.source}</span>
                    </td>
                    <td className="px-10 py-7 text-center">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest ${c.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                        {c.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-10 py-7 text-right pr-10">
                      <button className="h-10 px-5 rounded-xl bg-white border border-slate-200 text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                        View Profile
                      </button>
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

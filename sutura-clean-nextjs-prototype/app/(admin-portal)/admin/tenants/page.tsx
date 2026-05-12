'use client';

import React from 'react';
import { 
  Building2, Search, Filter, 
  MoreVertical, CheckCircle2, ShieldCheck,
  AlertCircle, Eye
} from 'lucide-react';
import { TenantDetailsModal, Tenant } from './components/TenantDetailsModal';

export default function TenantsPage() {
  const [selectedTenant, setSelectedTenant] = React.useState<Tenant | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const tenants: Tenant[] = [
    { id: 'T-001', name: 'Golden Needle Tailoring', type: 'Shop Owner', plan: 'Premium', status: 'Active', joined: 'Jan 15, 2026' },
    { id: 'T-002', name: 'Studio S', type: 'Shop Owner', plan: 'Pro', status: 'Active', joined: 'Feb 02, 2026' },
    { id: 'T-003', name: 'Elena Designs', type: 'Fashion Designer', plan: 'Designer', status: 'Active', joined: 'Mar 10, 2026' },
    { id: 'T-004', name: 'Metro Threads', type: 'Shop Owner', plan: 'Basic', status: 'Suspended', joined: 'Dec 05, 2025' },
    { id: 'T-005', name: 'Manila Bespoke', type: 'Shop Owner', plan: 'Premium', status: 'Active', joined: 'Apr 20, 2026' },
  ];

  return (
    <div className="space-y-8 font-outfit pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Active Businesses</h1>
          <p className="text-slate-500 font-medium mt-1">Overview of all verified shop and designer accounts in the SUTURA ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search businesses..." 
              className="pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-medium focus:border-indigo-600 outline-none w-64 shadow-sm"
            />
          </div>
          <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Business ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Plan</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants.map((tenant, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-slate-900">{tenant.id}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                        {tenant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">{tenant.name}</div>
                        <div className="text-[11px] font-bold text-slate-400">Joined {tenant.joined}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                      <Building2 size={16} className="text-slate-400" /> {tenant.type}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      {tenant.plan}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      tenant.status === 'Active' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
                      'text-rose-600 bg-rose-50 border-rose-100'
                    }`}>
                      {tenant.status === 'Active' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setSelectedTenant(tenant); setIsModalOpen(true); }}
                        className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-xl transition-all border border-indigo-100 flex items-center gap-2"
                      >
                         <Eye size={14} /> Details
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100 border border-transparent hover:border-slate-200">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <TenantDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tenant={selectedTenant}
      />
    </div>
  );
}

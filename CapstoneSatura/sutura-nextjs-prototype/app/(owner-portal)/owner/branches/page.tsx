'use client';

import { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Plus, 
  MoreVertical, 
  BarChart3, 
  Users, 
  PackageSearch 
} from 'lucide-react';

export default function BranchesPage() {
  const [branches] = useState([
    {
      id: 'B-001',
      name: 'Main Headquarters',
      type: 'Primary Shop & Production',
      address: '123 Tailor Street, Manila',
      manager: 'Joshua Arabejo',
      status: 'Active',
      metrics: { revenue: '₱1.2M', orders: 142, staff: 12 }
    },
    {
      id: 'B-002',
      name: 'Makati Branch',
      type: 'Retail Outlet',
      address: 'Greenbelt 5, Makati City',
      manager: 'Sarah Tolentino',
      status: 'Active',
      metrics: { revenue: '₱850K', orders: 89, staff: 5 }
    },
    {
      id: 'B-003',
      name: 'BGC Studio',
      type: 'Bespoke Lounge',
      address: 'High Street, BGC Taguig',
      manager: 'Marcus Lim',
      status: 'Active',
      metrics: { revenue: '₱920K', orders: 64, staff: 4 }
    }
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Branches & Locations</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Manage your multi-branch enterprise and view location-specific reports.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="bg-slate-900 text-white h-11 px-6 rounded-xl text-[13px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2">
            <Plus size={16} /> Add New Branch
          </button>
        </div>
      </div>

      {/* ── BRANCH CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <div key={branch.id} className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-indigo-50/50"></div>
            
            <div className="relative">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-colors group-hover:border-indigo-600">
                  {branch.id === 'B-001' ? <Building2 size={24} /> : <MapPin size={24} />}
                </div>
                <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-[20px] font-black text-slate-900 tracking-tight leading-none mb-1.5">{branch.name}</h3>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-black uppercase tracking-widest mb-3 border border-slate-200">
                  {branch.type}
                </div>
                <p className="text-[13px] font-medium text-slate-500">{branch.address}</p>
              </div>

              <div className="h-px bg-slate-100 w-full mb-6"></div>

              {/* Branch Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1"><BarChart3 size={12}/> MTD</div>
                  <div className="text-[14px] font-black text-slate-900">{branch.metrics.revenue}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1"><PackageSearch size={12}/> Orders</div>
                  <div className="text-[14px] font-black text-slate-900">{branch.metrics.orders}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1"><Users size={12}/> Staff</div>
                  <div className="text-[14px] font-black text-slate-900">{branch.metrics.staff}</div>
                </div>
              </div>

              <button className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-900 text-[13px] font-black rounded-xl border border-slate-200 transition-colors">
                View Branch Report
              </button>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

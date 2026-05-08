"use client";

import { useState } from 'react';
import { useERPStore } from '@/store/useERPStore';
import { BranchCard } from '@/components/shared/BranchCard';
import { 
  Plus, Search, Filter, Building2, LayoutGrid, 
  List, ChevronRight, X, ShieldCheck, MapPin, 
  Phone, UserPlus, Info
} from 'lucide-react';

export default function BranchManagementPage() {
  const { branches, staff, orders, addBranch } = useERPStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newBranchData, setNewBranchData] = useState({
    branchName: '',
    branchCode: '',
    branch_type: 'SATELLITE' as 'MAIN' | 'SATELLITE',
    address: '',
    contactNo: '',
    managerUserId: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
    isMain: false,
    is_default_source: false
  });

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    addBranch({
      ...newBranchData,
      shopId: 'SHOP-001', // Mock shop ID
    });
    setIsAddModalOpen(false);
    setNewBranchData({
      branchName: '',
      branchCode: '',
      branch_type: 'SATELLITE',
      address: '',
      contactNo: '',
      managerUserId: '',
      status: 'ACTIVE',
      isMain: false,
      is_default_source: false
    });
  };

  const filteredBranches = branches.filter(b => 
    b.branchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.branchCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Building2 size={20} />
            </div>
            <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-none uppercase">
              Branch Management
            </h1>
          </div>
          <p className="text-slate-500 font-medium text-[15px] max-w-[600px]">
            Oversee all outlets, manage branch managers, and monitor operational health across your entire tailoring network.
          </p>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 group active:scale-95"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          Add New Branch
        </button>
      </div>

      {/* ── FILTERS & UTILS ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-[28px] border border-slate-200/60 shadow-sm">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search branches by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 pl-12 pr-6 bg-slate-50 border-none rounded-2xl text-[14px] font-bold outline-none focus:ring-2 ring-indigo-500/10 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={18} />
            </button>
          </div>
          
          <button className="flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-[13px] font-black text-slate-600 hover:text-slate-900 transition-all group">
            <Filter size={16} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
            Filter
          </button>
        </div>
      </div>

      {/* ── BRANCH GRID ── */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBranches.map(branch => {
            const branchManager = staff.find(s => s.id === branch.managerUserId);
            const branchStaffCount = staff.filter(s => s.branch_id === branch.id).length;
            const branchActiveOrders = orders.filter(o => 
              o.branch_id === branch.id && 
              !['RELEASED', 'CANCELLED'].includes(o.status)
            ).length;

            return (
              <BranchCard 
                key={branch.id}
                branch={branch}
                manager={branchManager}
                staffCount={branchStaffCount}
                activeOrdersCount={branchActiveOrders}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Branch Name</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Manager</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Summary</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredBranches.map(branch => {
                const branchManager = staff.find(s => s.id === branch.managerUserId);
                const branchStaffCount = staff.filter(s => s.branch_id === branch.id).length;
                const branchActiveOrders = orders.filter(o => 
                  o.branch_id === branch.id && 
                  !['RELEASED', 'CANCELLED'].includes(o.status)
                ).length;

                return (
                  <tr key={branch.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${branch.isMain ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          <Building2 size={18} />
                        </div>
                        <div>
                          <div className="text-[14px] font-black text-slate-900 tracking-tight">{branch.branchName}</div>
                          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{branch.branchCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
                          {branchManager?.avatar && <img src={branchManager.avatar} alt={branchManager.name} className="w-full h-full object-cover" />}
                        </div>
                        <span className="text-[13px] font-bold text-slate-700">{branchManager?.name || 'Unassigned'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                        branch.isMain ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {branch.branch_type}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${branch.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">{branch.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4 text-[13px] font-bold text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Plus size={14} className="text-slate-300" /> {branchStaffCount} Staff
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Plus size={14} className="text-slate-300" /> {branchActiveOrders} Orders
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── ADD BRANCH MODAL ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsAddModalOpen(false)} />
          
          <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl shadow-slate-900/20 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
            {/* Modal Header */}
            <div className="px-10 pt-10 pb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-600 rounded-[22px] flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                  <Building2 size={24} />
                </div>
                <div>
                  <h2 className="text-[24px] font-black text-slate-900 tracking-tight leading-none uppercase">Register New Branch</h2>
                  <p className="text-slate-500 font-bold text-[12px] uppercase tracking-widest mt-2">Expansion Registry • SUTURA ERP</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddBranch} className="p-10 pt-0 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Branch Name */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Branch Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Sutura Makati Flagship"
                    value={newBranchData.branchName}
                    onChange={(e) => setNewBranchData({...newBranchData, branchName: e.target.value})}
                    className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl text-[14px] font-bold outline-none focus:ring-2 ring-indigo-500/10 transition-all placeholder:text-slate-300"
                  />
                </div>

                {/* Branch Code */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Unique Branch Code</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="e.g. MKT-001"
                      value={newBranchData.branchCode}
                      onChange={(e) => setNewBranchData({...newBranchData, branchCode: e.target.value.toUpperCase()})}
                      className="w-full h-14 pl-12 pr-6 bg-slate-50 border-none rounded-2xl text-[14px] font-bold outline-none focus:ring-2 ring-indigo-500/10 transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>

                {/* Branch Type */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Branch Hierarchy</label>
                  <select 
                    value={newBranchData.branch_type}
                    onChange={(e) => setNewBranchData({...newBranchData, branch_type: e.target.value as 'MAIN' | 'SATELLITE'})}
                    className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl text-[14px] font-bold outline-none focus:ring-2 ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                  >
                    <option value="SATELLITE">Satellite Outlet</option>
                    <option value="MAIN">Main HQ Branch</option>
                  </select>
                </div>

                {/* Manager Assignment */}
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Manager</label>
                  <div className="relative">
                    <UserPlus className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <select 
                      value={newBranchData.managerUserId}
                      onChange={(e) => setNewBranchData({...newBranchData, managerUserId: e.target.value})}
                      className="w-full h-14 pl-12 pr-6 bg-slate-50 border-none rounded-2xl text-[14px] font-bold outline-none focus:ring-2 ring-indigo-500/10 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Unassigned (Set Later)</option>
                      {staff.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.roles[0]})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Physical Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-5 top-4 text-slate-300" size={18} />
                    <textarea 
                      required
                      placeholder="Full street address, city, and zip code"
                      value={newBranchData.address}
                      onChange={(e) => setNewBranchData({...newBranchData, address: e.target.value})}
                      className="w-full h-24 pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl text-[14px] font-bold outline-none focus:ring-2 ring-indigo-500/10 transition-all placeholder:text-slate-300 resize-none"
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Details</label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      required
                      type="text" 
                      placeholder="+63 9XX XXX XXXX or (02) 8XXX-XXXX"
                      value={newBranchData.contactNo}
                      onChange={(e) => setNewBranchData({...newBranchData, contactNo: e.target.value})}
                      className="w-full h-14 pl-12 pr-6 bg-slate-50 border-none rounded-2xl text-[14px] font-bold outline-none focus:ring-2 ring-indigo-500/10 transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 flex items-center gap-4">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 h-14 bg-slate-100 text-slate-600 rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-[2] h-14 bg-slate-900 text-white rounded-2xl font-black text-[13px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                >
                  Authorize & Create Branch
                </button>
              </div>

              <div className="flex items-center gap-2 text-slate-400 justify-center">
                 <Info size={14} />
                 <p className="text-[10px] font-bold uppercase tracking-widest">Adding a branch will update global inventory routing tables.</p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EMPTY STATE ── */}
      {filteredBranches.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[32px] border border-dashed border-slate-300">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
            <Building2 size={40} />
          </div>
          <h3 className="text-[20px] font-black text-slate-900 mb-2">No branches found</h3>
          <p className="text-slate-500 font-medium text-[14px]">Try adjusting your search or add a new branch to your network.</p>
        </div>
      )}
    </div>
  );
}

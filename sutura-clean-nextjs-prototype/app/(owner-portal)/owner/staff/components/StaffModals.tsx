'use client';

import React, { useState } from 'react';
import { X, Check, Lock, ShieldCheck, Plus, ChevronDown } from 'lucide-react';
import { Staff, StaffRole, ShopBranch, ProductionSpecialization } from '@/store/useERPStore';



interface StaffModalsProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  newStaff: Partial<Staff> & { password?: string };
  setNewStaff: (staff: Partial<Staff> & { password?: string }) => void;
  handleAddStaff: () => void;
  toggleRole: (role: StaffRole) => void;
  currentPermissions: Record<string, boolean | 'usage-only'>;
  MODULE_LABELS: Record<string, string>;
  branches: ShopBranch[];
}

export const StaffModals: React.FC<StaffModalsProps> = ({
  isModalOpen,
  setIsModalOpen,
  newStaff,
  setNewStaff,
  handleAddStaff,
  toggleRole,
  currentPermissions,
  MODULE_LABELS,
  branches
}) => {
  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[850px] h-full md:h-auto md:max-h-[90vh] overflow-hidden md:rounded-[32px] rounded-none shadow-2xl border-x md:border border-slate-200 animate-in zoom-in-95 duration-300 flex flex-col md:flex-row">
            
            {/* Left Panel: Form Section */}
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[24px] font-black text-slate-900 leading-tight tracking-tight">
                    {newStaff.id ? 'Edit User Account' : 'Add User Account'}
                  </h2>
                  <p className="text-[13px] text-slate-500 font-medium mt-1">
                    {newStaff.id ? 'Update staff roles, contact info, and account access.' : 'Assign a role and skills to determine access and workload.'}
                  </p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 hover:bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-8">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                      <input type="text" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} placeholder="e.g. Juan dela Cruz" className="h-12 w-full px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                      <input type="text" value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})} placeholder="09XX XXX XXXX" className="h-12 w-full px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                      <input type="email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} placeholder="juan@sutura.com" className="h-12 w-full px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Gender</label>
                      <div className="relative">
                        <select 
                          value={newStaff.gender || ''} 
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewStaff({...newStaff, gender: e.target.value as 'Male' | 'Female' | 'Other'})}
                          className="h-12 w-full px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Select Gender...</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                           <ChevronDown size={16} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                    <div className="col-span-2">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Branch Assignment</label>
                      <div className="relative">
                        <select 
                          value={newStaff.branch_id || ''} 
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewStaff({...newStaff, branch_id: e.target.value})}
                          className="h-12 w-full px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer"
                        >
                          <option value="">Select Branch...</option>
                          {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>{branch.branchName} ({branch.branchCode})</option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                           <ChevronDown size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Roles Selection */}
                <div className="pt-6 border-t border-slate-100">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Account Role & Access Type</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Shop Owner Card */}
                    <button
                      type="button"
                      onClick={() => setNewStaff({ ...newStaff, roles: ['SHOP_OWNER'] })}
                      className={`group flex flex-col p-5 rounded-3xl border text-left transition-all ${newStaff.roles?.includes('SHOP_OWNER') ? 'bg-indigo-50 border-indigo-500 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${newStaff.roles?.includes('SHOP_OWNER') ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                          <ShieldCheck size={20} />
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${newStaff.roles?.includes('SHOP_OWNER') ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                          {newStaff.roles?.includes('SHOP_OWNER') && <Check size={12} className="text-white" strokeWidth={4} />}
                        </div>
                      </div>
                      <div className={`text-[16px] font-black ${newStaff.roles?.includes('SHOP_OWNER') ? 'text-indigo-900' : 'text-slate-900'}`}>Shop Owner</div>
                      <p className="text-[12px] text-slate-500 font-medium mt-1 leading-snug">Full authority over business operations, staff, and financial reports.</p>
                    </button>

                    {/* Staff Card */}
                    <button
                      type="button"
                      onClick={() => setNewStaff({ ...newStaff, roles: ['STAFF'] })}
                      className={`group flex flex-col p-5 rounded-3xl border text-left transition-all ${newStaff.roles?.includes('STAFF') ? 'bg-indigo-50 border-indigo-500 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${newStaff.roles?.includes('STAFF') ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                          <Lock size={20} />
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${newStaff.roles?.includes('STAFF') ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                          {newStaff.roles?.includes('STAFF') && <Check size={12} className="text-white" strokeWidth={4} />}
                        </div>
                      </div>
                      <div className={`text-[16px] font-black ${newStaff.roles?.includes('STAFF') ? 'text-indigo-900' : 'text-slate-900'}`}>Shop Staff</div>
                      <p className="text-[12px] text-slate-500 font-medium mt-1 leading-snug">Operational access to tasks, measurements, and daily production.</p>
                    </button>
                  </div>
                </div>

                {/* Specializations (Operational Tags) */}
                <div className="pt-6 border-t border-slate-100">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Operational Specializations</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Tailoring', 'Cutting', 'Quality Check', 'Bookkeeper', 
                      'Embroidery', 'Finishing', 'Marketing & Operations', 
                      'Admin/HR', 'Layout Artist', 'Machine Operator', 
                      'Sales Assistant', 'Shop Helper', 'Liaison'
                    ].map(spec => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => {
                          const current = newStaff.specialization || [];
                          const updated = current.includes(spec as ProductionSpecialization)
                            ? current.filter(s => s !== spec)
                            : [...current, spec as ProductionSpecialization];
                          setNewStaff({ ...newStaff, specialization: updated });
                        }}
                        className={`px-4 py-2 rounded-full border text-[12px] font-bold transition-all ${
                          newStaff.specialization?.includes(spec as ProductionSpecialization)
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium mt-3 italic">
                    * Assigning specializations helps in filtering tasks and organizing production workflows.
                  </p>
                </div>

              </div>

              <div className="mt-10 flex justify-end gap-4">
                <button onClick={() => setIsModalOpen(false)} className="h-12 px-8 text-[14px] font-black text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
                <button 
                  onClick={handleAddStaff} 
                  disabled={!newStaff.name || newStaff.roles?.length === 0}
                  className="h-12 px-8 rounded-[18px] bg-slate-900 text-white text-[14px] font-black hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                >
                  {newStaff.id ? 'Save Changes' : 'Create Account'}
                </button>
              </div>
            </div>

            {/* Right Panel: RBAC Visualizer Section */}
            <div className="w-full md:w-[320px] bg-slate-50 border-l border-slate-100 p-8 shrink-0 md:max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-2 text-[11px] font-black text-indigo-500 uppercase tracking-widest mb-2">
                <ShieldCheck size={16} /> Access Matrix
              </div>
              <h3 className="text-[20px] font-black text-slate-900 mb-6 leading-tight">
                {newStaff.roles && newStaff.roles.length > 0 ? newStaff.roles.join(' + ') : 'No Permissions'}
              </h3>
              
              <div className="space-y-3">
                {Object.entries(MODULE_LABELS).map(([key, label]) => {
                  const permission = currentPermissions[key];
                  
                  return (
                    <div key={key} className={`flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all ${permission ? 'opacity-100' : 'opacity-40'}`}>
                      <span className="text-[13px] font-black text-slate-700">{label}</span>
                      {permission === true ? (
                        <div className="w-6 h-6 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-lg"><Check size={14} strokeWidth={3} /></div>
                      ) : permission === 'usage-only' ? (
                        <span className="bg-amber-50 text-amber-600 text-[9px] font-black uppercase px-2 py-1 rounded-lg border border-amber-100">Usage</span>
                      ) : (
                        <div className="w-6 h-6 bg-slate-50 text-slate-300 flex items-center justify-center rounded-lg"><X size={14} /></div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <p className="text-[11px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest">
                  Principle of Least Privilege
                </p>
                <p className="text-[12px] text-slate-400 font-medium mt-2 leading-relaxed">
                  Permissions are automatically inherited and merged from assigned roles.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

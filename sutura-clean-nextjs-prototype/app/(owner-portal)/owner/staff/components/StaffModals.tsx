'use client';

import React, { useState } from 'react';
import { X, Check, Lock, ShieldCheck, Plus } from 'lucide-react';
import { Staff, StaffRole } from '@/store/useERPStore';

interface StaffModalsProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  newStaff: Partial<Staff> & { password?: string };
  setNewStaff: (staff: Partial<Staff> & { password?: string }) => void;
  handleAddStaff: () => void;
  toggleRole: (role: StaffRole) => void;
  currentPermissions: Record<string, boolean | 'usage-only'>;
  MODULE_LABELS: Record<string, string>;
  branches: import('@/types/erp').ShopBranch[];
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
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().replace(',', '');
      if (tag) {
        const currentSpecs = typeof newStaff.specialization === 'string' 
          ? newStaff.specialization.split(',').filter((x: string) => x.trim()) 
          : [];
        
        if (!currentSpecs.includes(tag)) {
          const newSpecs = [...currentSpecs, tag].join(', ');
          setNewStaff({ ...newStaff, specialization: newSpecs });
        }
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    const currentSpecs = typeof newStaff.specialization === 'string' 
      ? newStaff.specialization.split(',').filter((x: string) => x.trim()) 
      : [];
    const newSpecs = currentSpecs.filter((t: string) => t !== tag).join(', ');
    setNewStaff({ ...newStaff, specialization: newSpecs });
  };

  const currentSpecs = typeof newStaff.specialization === 'string' 
    ? newStaff.specialization.split(',').filter((x: string) => x.trim()) 
    : [];

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[850px] max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-300 flex flex-col md:flex-row">
            
            {/* Form Section */}
            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[24px] font-black text-slate-900 leading-tight tracking-tight">Add New Staff</h2>
                  <p className="text-[13px] text-slate-500 font-medium mt-1">Assign a role and skills to determine access and workload.</p>
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

                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Specializations / Skills</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {currentSpecs.map((tag: string) => (
                        <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 text-[11px] font-black uppercase tracking-widest">
                          {tag}
                          <button onClick={() => removeTag(tag)} className="hover:text-rose-600 transition-colors"><X size={12} /></button>
                        </span>
                      ))}
                    </div>
                    <input 
                      type="text" 
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Type skill and press Enter or Comma..." 
                      className="h-12 w-full px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Primary Branch Assignment</label>
                    <div className="relative">
                      <select 
                        value={newStaff.branch_id || ''} 
                        onChange={e => setNewStaff({...newStaff, branch_id: e.target.value})}
                        className="h-12 w-full px-4 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none"
                      >
                        <option value="">Select a Branch...</option>
                        {branches.map(b => (
                          <option key={b.id} value={b.id}>{b.branchName} ({b.branchCode})</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Plus size={16} className="rotate-45" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Roles Selection */}
                <div className="pt-6 border-t border-slate-100">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Roles & System Permissions</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Admin', 'Manager', 'Sales', 'Tailor', 'Inventory'].map(role => {
                      const isSelected = newStaff.roles?.includes(role as StaffRole);
                      return (
                        <button
                          key={role}
                          onClick={() => toggleRole(role as StaffRole)}
                          className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${isSelected ? 'bg-indigo-50 border-indigo-500 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                        >
                          <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                            {isSelected && <Check size={14} className="text-white" />}
                          </div>
                          <div className={`text-[14px] font-black ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>{role}</div>
                        </button>
                      );
                    })}
                  </div>
                  {newStaff.roles?.length === 0 && (
                    <p className="text-[11px] text-rose-500 font-bold mt-3">Please select at least one role to proceed.</p>
                  )}
                </div>

                {/* System Access Toggle */}
                <div className="pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-[14px] font-black text-slate-900">System Access (Cloud Login)</div>
                      <div className="text-[12px] text-slate-500 font-medium">Enable this for staff who need to use the ERP dashboard.</div>
                    </div>
                    <button 
                      onClick={() => setNewStaff({...newStaff, hasSystemAccess: !newStaff.hasSystemAccess})}
                      className={`w-12 h-7 rounded-full p-1 transition-all flex ${newStaff.hasSystemAccess ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'}`}
                    >
                      <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>

                  {newStaff.hasSystemAccess && (
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-[24px] space-y-4 animate-in slide-in-from-top-2 fade-in duration-300">
                      <div className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><Lock size={14} className="text-indigo-500"/> Account Security</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 text-[10px]">Email Address</label>
                          <input type="email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} className="h-11 w-full px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold outline-none focus:border-indigo-500 transition-all" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5 text-[10px]">Temporary Password</label>
                          <input type="password" value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} placeholder="••••••••" className="h-11 w-full px-4 bg-white border border-slate-200 rounded-xl text-[14px] font-bold outline-none focus:border-indigo-500 transition-all" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10 flex justify-end gap-4">
                <button onClick={() => setIsModalOpen(false)} className="h-12 px-8 text-[14px] font-black text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
                <button 
                  onClick={handleAddStaff} 
                  disabled={!newStaff.name || newStaff.roles?.length === 0}
                  className="h-12 px-8 rounded-[18px] bg-slate-900 text-white text-[14px] font-black hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                >
                  Create Staff Account
                </button>
              </div>
            </div>

            {/* RBAC Visualizer Section */}
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

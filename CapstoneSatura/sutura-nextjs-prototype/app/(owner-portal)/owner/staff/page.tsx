'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Users, Plus, Search, ShieldCheck, Mail, Phone, MoreVertical, X, Check, Lock, UserCog, User } from 'lucide-react';
import { useERPStore, Staff, StaffRole } from '../../store/useERPStore';

const ROLE_PERMISSIONS: Record<StaffRole, Record<string, boolean | 'usage-only'>> = {
  Admin: { customers: true, orders: true, measurements: true, appointments: true, inventory: true, suppliers: true, billing: true, reports: true },
  Sales: { customers: true, orders: true, measurements: true, appointments: true, inventory: false, suppliers: false, billing: true, reports: false },
  Tailor: { customers: false, orders: true, measurements: true, appointments: false, inventory: 'usage-only', suppliers: false, billing: false, reports: false },
  Inventory: { customers: false, orders: false, measurements: false, appointments: false, inventory: true, suppliers: true, billing: false, reports: false }
};

const MODULE_LABELS = {
  customers: 'Customers',
  orders: 'Orders',
  measurements: 'Measurements',
  appointments: 'Appointments',
  inventory: 'Inventory',
  suppliers: 'Suppliers',
  billing: 'Billing & Payments',
  reports: 'Reports & Analytics'
};

function getRoleBadge(role: StaffRole) {
  switch (role) {
    case 'Admin': return 'bg-rose-50 text-rose-700 border-rose-100';
    case 'Sales': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
    case 'Tailor': return 'bg-amber-50 text-amber-700 border-amber-100';
    case 'Inventory': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    default: return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}

export default function StaffPage() {
  const { staff, addStaff } = useERPStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | StaffRole>('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState<Partial<Staff> & { password?: string }>({
    name: '', email: '', phone: '', roles: ['Sales'], hasSystemAccess: true, status: 'Active', password: ''
  });

  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get('onboarding') === 'true') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const filteredStaff = useMemo(() => 
    staff.filter(s => 
      (roleFilter === 'All' || s.roles.includes(roleFilter)) &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.staffCode.toLowerCase().includes(searchQuery.toLowerCase()))
    ), [staff, searchQuery, roleFilter]
  );

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.roles || newStaff.roles.length === 0) return;
    
    // In a real app, password would be sent to an auth service.
    // For the store, we drop the password since it shouldn't be in local state.
    const { password, ...staffData } = newStaff;
    
    addStaff(staffData as Omit<Staff, 'id' | 'staffCode'>);
    setIsModalOpen(false);
    setNewStaff({ name: '', email: '', phone: '', roles: ['Sales'], hasSystemAccess: true, status: 'Active', password: '' });
  };

  const toggleRole = (r: StaffRole) => {
    setNewStaff(prev => {
      const currentRoles = prev.roles || [];
      const newRoles = currentRoles.includes(r) 
        ? currentRoles.filter(x => x !== r) 
        : [...currentRoles, r];
      return { ...prev, roles: newRoles };
    });
  };

  // Merge permissions from all selected roles
  const currentPermissions = (newStaff.roles || []).reduce((acc, role) => {
    const perms = ROLE_PERMISSIONS[role];
    Object.keys(perms).forEach(k => {
      if (perms[k] === true) acc[k] = true;
      if (perms[k] === 'usage-only' && acc[k] !== true) acc[k] = 'usage-only';
    });
    return acc;
  }, {} as Record<string, boolean | 'usage-only'>);

  return (
    <div className="space-y-0 animate-in fade-in duration-500 max-w-[1200px] mx-auto pb-20">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Staff</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Manage employees and role-based access control (RBAC).</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-10 px-4 bg-slate-900 text-white rounded-xl flex items-center gap-2 text-[13px] font-bold hover:bg-indigo-600 transition-all shadow-sm"
        >
          <Plus size={16} /> Add Staff
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Staff', val: staff.length, color: 'indigo' },
          { label: 'System Users', val: staff.filter(s => s.hasSystemAccess).length, color: 'emerald' },
          { label: 'Production Only', val: staff.filter(s => !s.hasSystemAccess).length, color: 'amber' },
          { label: 'Admins', val: staff.filter(s => s.roles.includes('Admin')).length, color: 'rose' },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-[28px] font-black text-slate-900">{stat.val}</div>
          </div>
        ))}
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {['All', 'Admin', 'Sales', 'Tailor', 'Inventory'].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role as 'All' | StaffRole)}
              className={`px-4 py-2 rounded-xl text-[12px] font-bold border transition-all ${roleFilter === role ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}
            >
              {role}
            </button>
          ))}
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            type="text" 
            placeholder="Search staff..." 
            className="h-10 w-full pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[13px] outline-none focus:border-slate-900 transition-all" 
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Roles</th>
              <th className="px-6 py-4">System Access</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredStaff.map(s => (
              <tr key={s.id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-6 py-4">
                  <div className="text-[14px] font-bold text-slate-900">{s.name}</div>
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{s.staffCode}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {s.roles.map(role => (
                      <span key={role} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${getRoleBadge(role)}`}>
                        {role === 'Admin' ? <ShieldCheck size={12} /> : <UserCog size={12} />}
                        {role}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {s.hasSystemAccess ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <Lock size={12} /> Login Enabled
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <User size={12} /> Production Only
                    </span>
                  )}
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
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD STAFF MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[850px] max-h-[90vh] overflow-y-auto rounded-[24px] shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-300 flex">
            
            {/* Form Section */}
            <div className="flex-1 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[20px] font-black text-slate-900 leading-tight">Add New Staff</h2>
                  <p className="text-[13px] text-slate-500 font-medium">Assign a role to determine their permissions.</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                
                {/* Basic Info */}
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
                  <input type="text" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="h-10 w-full px-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                </div>
                
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Phone Number</label>
                  <input type="text" value={newStaff.phone} onChange={e => setNewStaff({...newStaff, phone: e.target.value})} className="h-10 w-full px-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                </div>

                {/* Multiple Roles Selection */}
                <div className="pt-4 border-t border-slate-100">
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Roles & Access</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Admin', 'Sales', 'Tailor', 'Inventory'].map(role => {
                      const isSelected = newStaff.roles?.includes(role as StaffRole);
                      return (
                        <button
                          key={role}
                          onClick={() => toggleRole(role as StaffRole)}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${isSelected ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                        >
                          {/* Checkbox style */}
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                            {isSelected && <Check size={12} className="text-white" />}
                          </div>
                          <div className={`text-[13px] font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>{role}</div>
                        </button>
                      );
                    })}
                  </div>
                  {newStaff.roles?.length === 0 && (
                    <p className="text-[11px] text-rose-500 font-bold mt-2">Please select at least one role.</p>
                  )}
                </div>

                {/* System Access Toggle */}
                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <button 
                    onClick={() => setNewStaff({...newStaff, hasSystemAccess: !newStaff.hasSystemAccess})}
                    className={`w-10 h-6 rounded-full p-1 transition-all flex ${newStaff.hasSystemAccess ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'}`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                  </button>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">System Access (Can Login)</div>
                    <div className="text-[11px] text-slate-500">Disable for production-only staff.</div>
                  </div>
                </div>

                {/* Conditional Login Credentials */}
                {newStaff.hasSystemAccess && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="text-[11px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5"><Lock size={12}/> Login Credentials</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
                        <input type="email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} className="h-10 w-full px-3 bg-white border border-slate-200 rounded-xl text-[14px] outline-none focus:border-indigo-500 transition-all" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Temporary Password</label>
                        <input type="password" value={newStaff.password} onChange={e => setNewStaff({...newStaff, password: e.target.value})} placeholder="••••••••" className="h-10 w-full px-3 bg-white border border-slate-200 rounded-xl text-[14px] outline-none focus:border-indigo-500 transition-all" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => setIsModalOpen(false)} className="h-10 px-6 text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors">Cancel</button>
                <button 
                  onClick={handleAddStaff} 
                  disabled={!newStaff.name || newStaff.roles?.length === 0}
                  className="h-10 px-6 rounded-xl bg-slate-900 text-white text-[13px] font-bold hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Save Staff
                </button>
              </div>
            </div>

            {/* RBAC Matrix Section (Read-only Visualizer) */}
            <div className="w-[320px] bg-slate-50 border-l border-slate-200 p-8 shrink-0">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">RBAC Permissions</div>
              <h3 className="text-[18px] font-black text-slate-900 mb-6">
                {newStaff.roles && newStaff.roles.length > 0 ? newStaff.roles.join(' + ') : 'No Access'}
              </h3>
              
              <div className="space-y-3">
                {Object.entries(MODULE_LABELS).map(([key, label]) => {
                  const permission = currentPermissions[key];
                  
                  return (
                    <div key={key} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                      <span className="text-[13px] font-bold text-slate-700">{label}</span>
                      {permission === true ? (
                        <span className="bg-emerald-100 text-emerald-700 p-1 rounded-md"><Check size={14} /></span>
                      ) : permission === 'usage-only' ? (
                        <span className="bg-amber-100 text-amber-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">Usage Only</span>
                      ) : (
                        <span className="bg-rose-50 text-rose-300 p-1 rounded-md"><X size={14} /></span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                <p className="text-[11px] text-indigo-700 font-medium">
                  <strong>Principle of Least Privilege:</strong> Permissions are combined from all selected roles to grant appropriate access.
                </p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

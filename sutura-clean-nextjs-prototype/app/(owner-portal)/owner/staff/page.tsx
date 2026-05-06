'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { useERPStore, Staff, StaffRole } from '@/store/useERPStore';

// Sub-components
import { StaffStats } from './components/StaffStats';
import { StaffTable } from './components/StaffTable';
import { StaffModals } from './components/StaffModals';

const ROLE_PERMISSIONS: Record<StaffRole, Record<string, boolean | 'usage-only'>> = {
  Admin: { customers: true, orders: true, measurements: true, appointments: true, inventory: true, suppliers: true, billing: true, reports: true },
  Manager: { customers: true, orders: true, measurements: true, appointments: true, inventory: true, suppliers: true, billing: true, reports: true },
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

export default function StaffPage() {
  const { staff, orders, branches, addStaff, pushNotification } = useERPStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | StaffRole>('All');
  
  const searchParams = useSearchParams();
  const onboardingParam = searchParams.get('onboarding');
  const [isModalOpen, setIsModalOpen] = useState(onboardingParam === 'true');
  const [newStaff, setNewStaff] = useState<Partial<Staff> & { password?: string }>({
    name: '', email: '', phone: '', roles: ['Tailor'], hasSystemAccess: true, status: 'Active', password: '', specialization: ''
  });

  const filteredStaff = useMemo(() => 
    staff.filter(s => 
      (roleFilter === 'All' || s.roles.includes(roleFilter)) &&
      (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || (s.staffCode?.toLowerCase() || '').includes(searchQuery.toLowerCase()))
    ), [staff, searchQuery, roleFilter]
  );

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.roles || newStaff.roles.length === 0) {
      pushNotification('Staff name and at least one role are required.', 'error');
      return;
    }
    
    const staffData = { ...newStaff };
    delete staffData.password;
    addStaff(staffData as Omit<Staff, 'id' | 'staffCode'>);
    setIsModalOpen(false);
    setNewStaff({ name: '', email: '', phone: '', roles: ['Tailor'], hasSystemAccess: true, status: 'Active', password: '', specialization: '' });
    pushNotification('New staff member added successfully.', 'success');
  };

  const handleUpdateStaff = (id: string, data: Partial<Staff>) => {
    useERPStore.setState(state => ({
      staff: state.staff.map(s => s.id === id ? { ...s, ...data } : s)
    }));
    pushNotification('Staff information updated.', 'info');
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

  const currentPermissions = (newStaff.roles || []).reduce((acc, role) => {
    const perms = ROLE_PERMISSIONS[role as StaffRole];
    Object.keys(perms).forEach((k: string) => {
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
          <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-none">Staff</h1>
          <p className="text-[14px] text-slate-500 font-bold mt-2 uppercase tracking-widest">Team Management & Role Control</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-12 px-6 bg-slate-900 text-white rounded-[18px] flex items-center gap-2 text-[13px] font-black hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
        >
          <Plus size={18} /> Add New Staff
        </button>
      </div>

      <StaffStats staff={staff} orders={orders} />

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl w-max border border-slate-200/50 overflow-x-auto max-w-full">
          {['All', 'Admin', 'Manager', 'Sales', 'Tailor', 'Inventory'].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role as 'All' | StaffRole)}
              className={`px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${roleFilter === role ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {role}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
          <input 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            type="text" 
            placeholder="Search by name or code..." 
            className="h-11 w-full pl-11 pr-4 bg-white border border-slate-200 rounded-2xl text-[13px] font-bold outline-none focus:border-indigo-500 transition-all shadow-sm" 
          />
        </div>
      </div>

      <StaffTable 
        staff={filteredStaff} 
        orders={orders} 
        branches={branches}
        onUpdateStaff={handleUpdateStaff}
      />

      <StaffModals 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        newStaff={newStaff}
        setNewStaff={setNewStaff}
        handleAddStaff={handleAddStaff}
        toggleRole={toggleRole}
        currentPermissions={currentPermissions}
        MODULE_LABELS={MODULE_LABELS}
        branches={branches}
      />

    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { useERPStore, Staff, StaffRole } from '@/store/useERPStore';

import { StaffStats } from './components/StaffStats';
import { StaffTable } from './components/StaffTable';
import { StaffModals } from './components/StaffModals';

const ROLE_PERMISSIONS: Record<string, Record<string, boolean | 'usage-only'>> = {
  ADMIN: { customers: true, orders: true, measurements: true, appointments: true, inventory: true, suppliers: true, billing: true, reports: true },
  MANAGER: { customers: true, orders: true, measurements: true, appointments: true, inventory: true, suppliers: true, billing: true, reports: true },
  SALES: { customers: true, orders: true, measurements: true, appointments: true, inventory: false, suppliers: false, billing: true, reports: false },
  TAILOR: { customers: false, orders: true, measurements: true, appointments: false, inventory: 'usage-only', suppliers: false, billing: false, reports: false },
  INVENTORY: { customers: false, orders: false, measurements: false, appointments: false, inventory: true, suppliers: true, billing: false, reports: false }
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
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [newStaff, setNewStaff] = useState<Partial<Staff> & { password?: string }>({
    name: '', email: '', phone: '', roles: ['TAILOR'], hasSystemAccess: true, status: 'Active', password: '', specialization: ''
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
    
    if (editingStaffId) {
      // Handle Update
      useERPStore.setState(state => ({
        staff: state.staff.map(s => s.id === editingStaffId ? { ...s, ...newStaff } : s)
      }));
      pushNotification('Staff information updated successfully.', 'success');
    } else {
      // Handle Create
      const staffData = { ...newStaff };
      delete staffData.password;
      addStaff(staffData as Omit<Staff, 'id' | 'staffCode'>);
      pushNotification('New staff member added successfully.', 'success');
    }
    
    setIsModalOpen(false);
    setEditingStaffId(null);
    setNewStaff({ name: '', email: '', phone: '', roles: ['TAILOR'], hasSystemAccess: true, status: 'Active', password: '', specialization: '' });
  };

  const handleUpdateStaff = (id: string, data: Partial<Staff>) => {
    // If we are passing partial data from the table (like inline updates)
    if (Object.keys(data).length > 0 && !data.name) {
      useERPStore.setState(state => ({
        staff: state.staff.map(s => s.id === id ? { ...s, ...data } : s)
      }));
      pushNotification('Staff information updated.', 'info');
      return;
    }

    // Otherwise, this is coming from the modal for a full edit
    const existing = staff.find(s => s.id === id);
    if (existing) {
      setEditingStaffId(id);
      setNewStaff({ ...existing, password: '' });
      setIsModalOpen(true);
    }
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
    if (!perms) return acc;

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

      <StaffTable 
        staff={filteredStaff} 
        orders={orders} 
        branches={branches}
        onUpdateStaff={handleUpdateStaff}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
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

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
  SHOP_OWNER: { customers: true, orders: true, measurements: true, appointments: true, inventory: true, suppliers: true, billing: true, reports: true },
  STAFF: { customers: true, orders: true, measurements: true, appointments: true, inventory: 'usage-only', suppliers: false, billing: false, reports: false },
  DESIGNER: { customers: false, orders: false, measurements: true, appointments: true, inventory: false, suppliers: false, billing: false, reports: false },
  CUSTOMER: { customers: false, orders: false, measurements: false, appointments: true, inventory: false, suppliers: false, billing: false, reports: false }
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

import { Suspense } from 'react';

function StaffPageContent() {
  const { staff, orders, branches, addStaff, pushNotification } = useERPStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | StaffRole>('All');
  
  const searchParams = useSearchParams();
  const onboardingParam = searchParams.get('onboarding');
  const [isModalOpen, setIsModalOpen] = useState(onboardingParam === 'true');
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [newStaff, setNewStaff] = useState<Partial<Staff> & { password?: string }>({
    name: '', email: '', phone: '', roles: ['STAFF'], hasSystemAccess: true, status: 'Active', password: '', specialization: []
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
      pushNotification('User account information updated successfully.', 'success');
    } else {
      // Handle Create
      const staffData = { ...newStaff };
      delete staffData.password;
      addStaff(staffData as Omit<Staff, 'id' | 'staffCode'>);
      pushNotification('New user account added successfully.', 'success');
    }
    
    setIsModalOpen(false);
    setEditingStaffId(null);
    setNewStaff({ name: '', email: '', phone: '', roles: ['STAFF'], hasSystemAccess: true, status: 'Active', password: '', specialization: [] });
  };

  const handleUpdateStaff = (id: string, data: Partial<Staff>) => {
    // If we are passing partial data from the table (like inline updates)
    if (Object.keys(data).length > 0 && !data.name) {
      useERPStore.setState(state => ({
        staff: state.staff.map(s => s.id === id ? { ...s, ...data } : s)
      }));
      pushNotification('User account information updated.', 'info');
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-2">
        <div>
          <h1 className="text-[32px] font-bold font-sans text-[#1C1917] tracking-tight leading-none">User Account</h1>
          <p className="text-[14px] text-[#78716C] mt-2">Managing the skilled hands and creative minds of our Workshop.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-12 px-8 bg-slate-900 text-white rounded-xl flex items-center gap-3 text-[14px] font-bold shadow-lg hover:shadow-slate-900/20 transition-all active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> Invite Artisan
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

export default function StaffPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StaffPageContent />
    </Suspense>
  );
}

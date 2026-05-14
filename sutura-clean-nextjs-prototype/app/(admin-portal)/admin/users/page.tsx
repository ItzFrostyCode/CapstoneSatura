'use client';

import { useState } from 'react';
import { Users, Search, Shield, UserCheck, UserX, AlertCircle } from 'lucide-react';

type UserRole = 'admin' | 'owner' | 'staff' | 'customer';
type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  shopName?: string;
  joinedAt: string;
}

const MOCK_USERS: AdminUser[] = [
  { id: 'u01', name: 'System Admin',        email: 'admin@sutura.ph',    role: 'admin',    status: 'ACTIVE',    joinedAt: '2025-01-01' },
  { id: 'u02', name: 'Ricardo Tan',         email: 'rtan@sutura.ph',     role: 'owner',    status: 'ACTIVE',    shopName: 'Davao Famous Tailoring', joinedAt: '2025-03-15' },
  { id: 'u03', name: 'Charles Mendoza',     email: 'cmendoza@sutura.ph', role: 'owner',    status: 'ACTIVE',    shopName: "Chard's Tailoring", joinedAt: '2025-04-02' },
  { id: 'u04', name: 'Carlos Reyes',        email: 'creyes@sutura.ph',   role: 'staff',    status: 'ACTIVE',    shopName: 'Davao Famous Tailoring', joinedAt: '2025-03-20' },
  { id: 'u05', name: 'Ana Cruz',            email: 'acruz@sutura.ph',    role: 'staff',    status: 'ACTIVE',    shopName: 'Davao Famous Tailoring', joinedAt: '2025-05-01' },
  { id: 'u06', name: 'Juan dela Cruz',      email: 'juan@email.com',     role: 'customer', status: 'ACTIVE',    joinedAt: '2025-08-15' },
  { id: 'u07', name: 'Maria Santos',        email: 'maria@email.com',    role: 'customer', status: 'ACTIVE',    joinedAt: '2025-09-01' },
  { id: 'u08', name: 'Andres Malveda',      email: 'a.malveda@email.com',role: 'owner',    status: 'SUSPENDED', shopName: 'Blacklisted Shop', joinedAt: '2025-06-10' },
];

const ROLE_CONFIG: Record<UserRole, { label: string; color: string; bg: string }> = {
  admin:    { label: 'Admin',    color: 'text-rose-700',   bg: 'bg-rose-50'   },
  owner:    { label: 'Owner',    color: 'text-indigo-700', bg: 'bg-indigo-50' },
  staff:    { label: 'Staff',    color: 'text-blue-700',   bg: 'bg-blue-50'   },
  customer: { label: 'Customer', color: 'text-slate-700',  bg: 'bg-slate-100' },
};

const STATUS_CONFIG: Record<AccountStatus, { color: string; bg: string }> = {
  ACTIVE:    { color: 'text-emerald-700', bg: 'bg-emerald-50' },
  SUSPENDED: { color: 'text-red-700',     bg: 'bg-red-50'     },
  INACTIVE:  { color: 'text-slate-500',   bg: 'bg-slate-100'  },
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [users, setUsers] = useState(MOCK_USERS);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const toggleSuspend = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED' }
          : u
      )
    );
  };

  return (
    <div className="relative min-h-full pb-20 pt-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
          <Users size={16} />
        </div>
        <div>
          <h1 className="text-[22px] font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-[13px] text-slate-500 font-medium">{users.length} registered users across all roles</p>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {(['admin', 'owner', 'staff', 'customer'] as UserRole[]).map((role) => {
          const cfg = ROLE_CONFIG[role];
          const count = users.filter((u) => u.role === role).length;
          return (
            <button
              key={role}
              onClick={() => setRoleFilter(roleFilter === role ? 'all' : role)}
              className={`bg-white rounded-2xl border p-4 shadow-sm text-left transition-all hover:shadow-md ${roleFilter === role ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-100'}`}
            >
              <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${cfg.color}`}>{cfg.label}</div>
              <div className="text-[22px] font-black text-slate-900">{count}</div>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-[13px] font-medium placeholder:text-slate-400 focus:outline-none"
          />
        </div>
        {roleFilter !== 'all' && (
          <button onClick={() => setRoleFilter('all')} className="h-10 px-4 rounded-xl bg-indigo-50 text-indigo-600 text-[12px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors">
            Clear Filter
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_100px] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">
          <span>User</span><span>Role</span><span>Shop</span><span>Status</span><span>Actions</span>
        </div>
        {filtered.map((user) => {
          const roleCfg = ROLE_CONFIG[user.role];
          const statusCfg = STATUS_CONFIG[user.status];
          return (
            <div key={user.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_100px] gap-4 px-6 py-4 border-b border-slate-50 last:border-0 items-center hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-9 h-9 rounded-xl shrink-0" />
                <div>
                  <div className="text-[14px] font-black text-slate-900">{user.name}</div>
                  <div className="text-[12px] text-slate-400 font-medium">{user.email}</div>
                </div>
              </div>
              <div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${roleCfg.bg} ${roleCfg.color}`}>
                  {roleCfg.label}
                </span>
              </div>
              <div className="text-[13px] text-slate-500 font-medium">{user.shopName ?? '—'}</div>
              <div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${statusCfg.bg} ${statusCfg.color}`}>
                  {user.status}
                </span>
              </div>
              <div>
                {user.role !== 'admin' && (
                  <button
                    onClick={() => toggleSuspend(user.id)}
                    className={`text-[11px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl transition-colors ${
                      user.status === 'SUSPENDED'
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    {user.status === 'SUSPENDED' ? 'Activate' : 'Suspend'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Users size={32} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 font-bold text-[13px] uppercase tracking-widest">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}

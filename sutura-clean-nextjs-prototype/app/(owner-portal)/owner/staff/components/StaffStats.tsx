'use client';

import React from 'react';
import { Staff, Order } from '@/store/useERPStore';

interface StaffStatsProps {
  staff: Staff[];
  orders: Order[];
}

export const StaffStats: React.FC<StaffStatsProps> = ({ staff, orders }) => {
  const stats = [
    { label: 'Total Team', val: staff.length, sub: 'Employees' },
    { 
      label: 'High Workload', 
      val: staff.filter(s => orders.filter(o => o.assigned_tailor_id === s.id && o.status !== 'COMPLETED' && o.status !== 'CANCELLED' && o.status !== 'DELIVERED').length > 3).length, 
      sub: '> 3 active orders' 
    },
    { 
      label: 'Capacity', 
      val: `${staff.filter(s => s.status === 'Active').length * 5}`, 
      sub: 'Target Order Load' 
    },
    { 
      label: 'System Users', 
      val: staff.filter(s => s.hasSystemAccess).length, 
      sub: 'Login Enabled' 
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
          <div className="text-[28px] font-black text-slate-900 tracking-tight">{stat.val}</div>
          <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{stat.sub}</div>
        </div>
      ))}
    </div>
  );
};

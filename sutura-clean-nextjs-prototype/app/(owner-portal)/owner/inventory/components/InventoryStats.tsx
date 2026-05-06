'use client';

import React from 'react';

interface Stat {
  label: string;
  value: string;
  color: 'indigo' | 'emerald' | 'amber' | 'rose';
  sub: string;
  filter: string;
}

interface InventoryStatsProps {
  stats: Stat[];
  statusFilter: string;
  onFilterChange: (filter: any) => void;
  onTabChange: (tab: any) => void;
}

const colorClassMap: Record<string, string> = {
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  rose: 'bg-rose-500',
};

export function InventoryStats({ stats, statusFilter, onFilterChange, onTabChange }: InventoryStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          onClick={() => { 
            onFilterChange(stat.filter); 
            if (stat.filter === 'Low Stock' || stat.filter === 'Out of Stock') {
              onTabChange('low_stock');
            } else if (stat.label === 'Finished Units') {
              onTabChange('finished');
            } else {
              onTabChange('materials');
            }
          }}
          className={`bg-white border p-6 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer group ${
            statusFilter === stat.filter 
              ? 'border-slate-900 ring-1 ring-slate-900' 
              : 'border-slate-200'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] group-hover:text-slate-600 transition-colors">
              {stat.label}
            </span>
            <div className={`w-2.5 h-2.5 rounded-full ${colorClassMap[stat.color]} shadow-[0_0_12px_rgba(0,0,0,0.1)]`} />
          </div>
          <div className="text-[28px] font-black text-slate-900 tracking-tight">{stat.value}</div>
          <div className="text-[11px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{stat.sub}</div>
        </div>
      ))}
    </div>
  );
}

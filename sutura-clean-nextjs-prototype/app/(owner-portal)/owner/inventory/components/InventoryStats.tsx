'use client';

import React from 'react';
import { Database, Package, AlertTriangle, PackageX, CheckCircle } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  color: 'indigo' | 'emerald' | 'amber' | 'rose';
  sub: string;
  filter: string;
}

interface InventoryStatsProps {
  stats: Stat[];
}

const colorClassMap: Record<string, string> = {
  indigo: 'text-indigo-500 bg-indigo-50',
  emerald: 'text-emerald-500 bg-emerald-50',
  amber: 'text-amber-500 bg-amber-50',
  rose: 'text-rose-500 bg-rose-50',
};

const iconMap: Record<string, React.ReactNode> = {
  'Raw Materials': <Database size={14} />,
  'Finished Units': <Package size={14} />,
  'Low': <AlertTriangle size={14} />,
  'Out': <PackageX size={14} />,
};

export function InventoryStats({ stats }: InventoryStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm transition-all hover:shadow-md cursor-default group"
        >
          <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {stat.label}
            </span>
            <div className={`p-1.5 rounded-lg transition-transform group-hover:scale-110 ${colorClassMap[stat.color]}`}>
              {iconMap[stat.label] || <CheckCircle size={14} />}
            </div>
          </div>
          <div className="text-[20px] font-black text-slate-900 tracking-tight leading-none">{stat.value}</div>
          <div className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{stat.sub}</div>
        </div>
      ))}
    </div>
  );
}

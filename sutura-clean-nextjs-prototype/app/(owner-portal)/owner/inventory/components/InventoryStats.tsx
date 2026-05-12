'use client';

import React from 'react';
import { Database, Package, AlertTriangle, PackageX, CheckCircle, TrendingDown } from 'lucide-react';

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
  indigo: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  amber: 'text-amber-600 bg-amber-50 border-amber-100',
  rose: 'text-rose-600 bg-rose-50 border-rose-100',
};

const iconMap: Record<string, React.ElementType> = {
  'Raw Materials': Database,
  'Finished Units': Package,
  'Low Stock': TrendingDown,
  'Out of Stock': PackageX,
};

export function InventoryStats({ stats }: InventoryStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, i) => {
        const Icon = iconMap[stat.label] || CheckCircle;
        return (
          <div 
            key={i} 
            className="bg-white border border-slate-200 p-6 rounded-[32px] shadow-sm transition-all hover:shadow-md hover:border-slate-300 cursor-default group relative overflow-hidden"
          >
            {/* Subtle Background Pattern */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <Icon size={80} />
            </div>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`w-10 h-10 rounded-[14px] border flex items-center justify-center transition-all group-hover:scale-110 ${colorClassMap[stat.color]}`}>
                <Icon size={16} />
              </div>
              {stat.color === 'rose' && (
                 <div className="px-2 py-0.5 bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full animate-pulse">Critical</div>
              )}
            </div>
          
          <div className="relative z-10">
            <div className="text-[28px] font-black text-slate-900 tracking-tight leading-none mb-1 tabular-nums">
              {stat.value}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">
                {stat.label}
              </span>
              <span className="text-[10px] text-slate-400 font-bold mt-1 tracking-tight">
                {stat.sub}
              </span>
            </div>
          </div>
            </div>
          );
      })}
    </div>
  );
}

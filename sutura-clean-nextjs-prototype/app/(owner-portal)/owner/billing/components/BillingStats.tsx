import React from 'react';

interface Stat {
  label: string;
  val: string;
  trend: string;
  color: string;
}

interface BillingStatsProps {
  stats: Stat[];
}

export const BillingStats: React.FC<BillingStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[12px] font-bold text-slate-500">{stat.label}</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
              {stat.trend}
            </span>
          </div>
          <div className="text-[28px] font-black text-slate-900 tracking-tight">{stat.val}</div>
        </div>
      ))}
    </div>
  );
};

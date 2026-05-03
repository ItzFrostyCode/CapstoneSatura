'use client';

import { 
  TrendingUp, 
  BarChart3, 
  Download, 
  Calendar, 
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  DollarSign,
  PieChart
} from 'lucide-react';
import { useState } from 'react';

export default function ReportsPage() {
  const [timeframe, setTimeframe] = useState('This Month');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-20">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Financial Intelligence</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Detailed analysis of revenue, material costs, and profitability.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            {['This Month', 'Last Quarter', 'Yearly'].map((t) => (
              <button 
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-2 rounded-lg text-[12px] font-black transition-all ${
                  timeframe === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-slate-900 text-[13px] font-black hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* ── HIGH-LEVEL METRICS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Gross Revenue', value: '₱1,242,000', change: '+12.5%', trend: 'up' },
          { label: 'Material COGS', value: '₱482,000', change: '+2.4%', trend: 'up' },
          { label: 'Net Profit', value: '₱760,000', change: '+18.2%', trend: 'up' },
          { label: 'Profit Margin', value: '61.2%', change: '+3.1%', trend: 'up' },
        ].map((m, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
             <div className="relative z-10">
               <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">{m.label}</div>
               <div className="text-[24px] font-black text-slate-900 mb-2">{m.value}</div>
               <div className={`text-[11px] font-black inline-flex items-center gap-1 px-2 py-0.5 rounded-lg ${
                 m.trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'
               }`}>
                 {m.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                 {m.change}
               </div>
             </div>
          </div>
        ))}
      </div>

      {/* ── REVENUE VS COGS TRACKING (Custom SVG Chart) ── */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-10 shadow-sm">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
               <h2 className="text-[20px] font-black text-slate-900 tracking-tight">Revenue vs COGS Tracking</h2>
               <p className="text-[13px] text-slate-400 font-medium mt-1">Daily consumption trajectory and revenue generation.</p>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Revenue</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Material COGS</span>
               </div>
            </div>
         </div>

         <div className="relative h-[350px] w-full">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
               {[0, 1, 2, 3].map((l) => (
                 <div key={l} className="w-full h-px bg-slate-50 border-t border-dashed border-slate-200"></div>
               ))}
            </div>

            {/* SVG Chart Lines */}
            <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 1300 350">
               {/* COGS Line (Grey) */}
               <path 
                 d="M0,300 L100,280 L200,290 L300,260 L400,275 L500,250 L600,265 L700,240 L800,255 L900,230 L1000,245 L1100,220 L1200,235 L1300,210" 
                 fill="none" 
                 stroke="#CBD5E1" 
                 strokeWidth="4" 
                 strokeLinecap="round" 
                 style={{ vectorEffect: 'non-scaling-stroke' }}
               />
               {/* Revenue Line (Indigo) */}
               <path 
                 d="M0,280 L100,220 L200,240 L300,180 L400,200 L500,140 L600,160 L700,100 L800,120 L900,60 L1000,80 L1100,20 L1200,40 L1300,10" 
                 fill="none" 
                 stroke="#4F46E5" 
                 strokeWidth="5" 
                 strokeLinecap="round"
                 style={{ vectorEffect: 'non-scaling-stroke' }}
               />
            </svg>

            {/* Tooltip Overlay (Mock) */}
            <div className="absolute left-[60%] top-[10%] group cursor-pointer">
               <div className="w-4 h-4 bg-indigo-600 border-4 border-white rounded-full shadow-lg scale-150 relative z-20"></div>
               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                  <div className="bg-slate-900 text-white p-3 rounded-xl shadow-2xl whitespace-nowrap">
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">May 24, 2026</div>
                     <div className="flex items-center gap-4">
                        <div>
                           <div className="text-[10px] text-slate-500">Revenue</div>
                           <div className="text-[14px] font-black">₱84,200</div>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div>
                           <div className="text-[10px] text-slate-500">COGS</div>
                           <div className="text-[14px] font-black">₱22,400</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* X-Axis Labels */}
         <div className="flex justify-between mt-8 px-2">
            {['MAY 01', 'MAY 10', 'MAY 20', 'MAY 30'].map((d) => (
              <span key={d} className="text-[11px] font-black text-slate-400 tracking-widest">{d}</span>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Top Categories */}
         <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <h3 className="text-[18px] font-black text-slate-900 tracking-tight mb-8">Revenue by Service</h3>
            <div className="space-y-6">
               {[
                 { name: 'Bespoke Suits', value: '₱582,000', percentage: 45, color: 'bg-indigo-600' },
                 { name: 'Gowns & Formals', value: '₱342,000', percentage: 28, color: 'bg-violet-500' },
                 { name: 'Barong Tagalog', value: '₱212,000', percentage: 17, color: 'bg-sky-400' },
                 { name: 'Alterations', value: '₱106,000', percentage: 10, color: 'bg-slate-400' },
               ].map((cat, i) => (
                 <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                       <span className="text-[13px] font-bold text-slate-600">{cat.name}</span>
                       <span className="text-[13px] font-black text-slate-900">{cat.value}</span>
                    </div>
                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                       <div className={`h-full ${cat.color}`} style={{ width: `${cat.percentage}%` }}></div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Profitability Index */}
         <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <h3 className="text-[18px] font-black tracking-tight mb-8">Profitability Index</h3>
            
            <div className="flex items-center justify-center h-[200px] relative">
               <div className="w-40 h-40 rounded-full border-[12px] border-white/5 flex items-center justify-center">
                  <div className="text-center">
                     <div className="text-[32px] font-black leading-none">61.2%</div>
                     <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Avg Margin</div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target</div>
                  <div className="text-[16px] font-black">65.0%</div>
               </div>
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</div>
                  <div className="text-[16px] font-black text-emerald-400">On Track</div>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}

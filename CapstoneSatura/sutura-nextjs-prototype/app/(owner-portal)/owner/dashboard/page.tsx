'use client';

import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Package, 
  Calendar, 
  ArrowUpRight, 
  ChevronRight,
  Clock,
  Sparkles,
  Search,
  Plus,
  AlertCircle,
  Building2,
  MousePointer2,
  ArrowRight,
  Target,
  BarChart3,
  Zap
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function OwnerDashboard() {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'yearly'>('monthly');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Runnable Clock logic
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeframeConfig = {
    daily: {
      data: [15, 25, 45, 30, 60, 40, 85, 70, 95, 80, 50, 65],
      labels: ['May 01', 'May 02', 'May 03', 'May 04', 'May 05', 'May 06', 'May 07', 'May 08', 'May 09', 'May 10', 'May 11', 'May 12']
    },
    weekly: {
      data: [40, 55, 62, 88, 75, 92, 45, 60, 70, 85, 95, 100],
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12']
    },
    'bi-weekly': {
      data: [50, 75, 90, 65, 80, 95, 100, 85, 70, 60, 55, 45],
      labels: ['BW1', 'BW2', 'BW3', 'BW4', 'BW5', 'BW6', 'BW7', 'BW8', 'BW9', 'BW10', 'BW11', 'BW12']
    },
    monthly: {
      data: [32, 68, 45, 92, 55, 100, 42, 85, 60, 95, 38, 72],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yearly: {
      data: [45, 60, 55, 75, 80, 85, 90, 95, 100, 92, 88, 98],
      labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026']
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-10">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-[32px] font-black text-slate-900 tracking-tight leading-none mb-2">Dashboard</h1>
           <div className="flex items-center gap-2 text-slate-400 font-bold text-[13px] tracking-tight">
              <Calendar size={14} className="text-indigo-500" />
              <span>{currentTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
              <Clock size={14} className="text-emerald-500" />
              <span className="font-black text-slate-600 tabular-nums">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
           </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-11 bg-white border border-slate-200 rounded-xl px-4 flex items-center gap-3 shadow-sm w-[300px] group focus-within:border-slate-900 transition-all">
            <Search className="text-slate-300 group-focus-within:text-slate-900 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search records, orders... (⌘K)" 
              className="bg-transparent border-none outline-none text-[13px] font-medium w-full"
            />
          </div>
          <button className="h-11 px-4 bg-slate-900 text-white rounded-xl text-[13px] font-black hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10 active:scale-95">
            <Plus size={16} /> New Order
          </button>
        </div>
      </div>

      {/* ── BENTO GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        
        {/* REVENUE OVERVIEW (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h2 className="text-[18px] font-black text-slate-900 tracking-tight flex items-center gap-2">
                <BarChart3 size={20} className="text-indigo-500" /> Revenue Pulse
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+12.4%</span>
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Growth vs Prev period</span>
              </div>
            </div>

            <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-100">
               {(['daily', 'weekly', 'bi-weekly', 'monthly', 'yearly'] as const).map((t) => (
                 <button
                   key={t}
                   onClick={() => setTimeframe(t)}
                   className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                     timeframe === t 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                      : 'text-slate-400 hover:text-slate-600'
                   }`}
                 >
                   {t.replace('-', ' ')}
                 </button>
               ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-[200px] relative px-1 flex items-end gap-3">
              {/* Grid Lines (Indications) - Moved to z-20 to stay on top */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-20">
                 <div className="border-t border-slate-100/50 w-full flex justify-end items-start pt-1"><span className="text-[10px] font-bold text-slate-400 -mr-4 bg-white/80 px-1 rounded">100k</span></div>
                 <div className="border-t border-slate-100/50 w-full flex justify-end items-start pt-1"><span className="text-[10px] font-bold text-slate-400 -mr-4 bg-white/80 px-1 rounded">75k</span></div>
                 <div className="border-t border-slate-100/50 w-full flex justify-end items-start pt-1"><span className="text-[10px] font-bold text-slate-400 -mr-4 bg-white/80 px-1 rounded">50k</span></div>
                 <div className="border-t border-slate-100/50 w-full flex justify-end items-start pt-1"><span className="text-[10px] font-bold text-slate-400 -mr-4 bg-white/80 px-1 rounded">25k</span></div>
                 <div className="w-full h-0"></div>
              </div>

              {timeframeConfig[timeframe].data.map((h, i) => (
                <div key={`${timeframe}-${i}`} className="flex-1 h-full flex items-end group relative z-10">
                  <div 
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all duration-500 hover:from-indigo-500 hover:to-indigo-300 hover:scale-x-110 origin-bottom shadow-lg shadow-indigo-500/10 cursor-pointer animate-in fade-in slide-in-from-bottom-2"
                    style={{ height: `${h}%` }}
                  ></div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none transform -translate-y-1 group-hover:translate-y-0">
                     <div className="bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded shadow-xl whitespace-nowrap">₱{h}k</div>
                  </div>
                </div>
              ))}
            </div>

            {/* X-AXIS LABELS */}
            <div className="flex gap-3 px-1">
               {timeframeConfig[timeframe].labels.map((label, i) => (
                 <div key={i} className="flex-1 text-center">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter whitespace-nowrap">{label}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-slate-50">
             <div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Job Orders</div>
               <div className="text-[20px] font-black text-slate-900">142 Orders</div>
             </div>
             <div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Balance</div>
               <div className="text-[20px] font-black text-rose-500">₱82,400</div>
             </div>
             <div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Revenue / Suit</div>
               <div className="text-[20px] font-black text-slate-900">₱18,250</div>
             </div>
          </div>
        </div>

        {/* FITTING SCHEDULE (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 rounded-3xl p-8 text-white flex flex-col shadow-xl shadow-slate-900/10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[16px] font-black tracking-tight flex items-center gap-2">
              <Calendar size={18} className="text-slate-500" /> Schedule
            </h2>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">3 Fittings</span>
          </div>

          <div className="space-y-6 flex-1">
             {[
               { time: '10:30', client: 'Alexander M.', type: 'Suit Fitting' },
               { time: '14:00', client: 'Elena R.', type: 'Gown Check' },
               { time: '16:30', client: 'Maria S.', type: 'Adjustment' },
             ].map((apt, i) => (
               <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="text-slate-500 font-black text-[12px] mt-1">{apt.time}</div>
                  <div className="flex-1 border-l border-white/10 pl-4">
                    <div className="text-[14px] font-black group-hover:text-indigo-400 transition-colors">{apt.client}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{apt.type}</div>
                  </div>
               </div>
             ))}
          </div>

          <button className="w-full h-11 bg-white/10 hover:bg-white hover:text-slate-900 rounded-xl text-[12px] font-black transition-all mt-8">
            View All fittings
          </button>
        </div>

        {/* MATERIAL HEALTH (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-100">
              <Package size={18} />
            </div>
            <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">Low Stock</span>
          </div>
          <h3 className="text-[16px] font-black text-slate-900 tracking-tight mb-4">Inventory Alert</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[12px] font-bold">
                <span className="text-slate-600">Italian Wool (Navy)</span>
                <span className="text-rose-600">2.4m</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-[15%]"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[12px] font-bold">
                <span className="text-slate-600">Silk Lining (Gold)</span>
                <span className="text-amber-600">8.2m</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[45%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* PRODUCTION QUEUE (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-[16px] font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Target size={18} className="text-indigo-500" /> Active Production
              </h2>
              <button className="text-[12px] font-black text-slate-400 hover:text-slate-900 transition-colors">Manage Queue</button>
           </div>

           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Sastre Maria', task: 'Barong', progress: 85 },
                { name: 'Master Jose', task: '3PC Suit', progress: 42 },
                { name: 'Sastre Elena', task: 'Evening Gown', progress: 92 },
                { name: 'Ben', task: 'Shirt', progress: 15 },
              ].map((staff, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                   <div className="text-[13px] font-black text-slate-900 mb-0.5">{staff.name}</div>
                   <div className="text-[11px] text-slate-500 font-medium mb-4">{staff.task}</div>
                   <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-slate-900" style={{ width: `${staff.progress}%` }}></div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* BRANCH PERFORMANCE (4 cols) */}
        <div className="lg:col-span-4 bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-[16px] font-black tracking-tight mb-6 flex items-center gap-2">
                <Building2 size={18} /> Network Overview
              </h3>
              
              <div className="space-y-6">
                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                  <div className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Primary HQ</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-black">Sutura Tailoring</span>
                    <span className="text-[15px] font-black">₱242k</span>
                  </div>
                </div>

                <div className="space-y-4 px-2">
                  <div className="flex items-center justify-between opacity-60">
                    <span className="text-[13px] font-bold">Makati Branch</span>
                    <span className="text-[13px] font-black">₱184k</span>
                  </div>
                  <div className="flex items-center justify-between opacity-60 border-t border-white/5 pt-4">
                    <span className="text-[13px] font-bold">BGC Studio</span>
                    <span className="text-[13px] font-black">₱152k</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full h-11 bg-white/20 hover:bg-white text-white hover:text-indigo-600 rounded-xl text-[12px] font-black transition-all mt-6">
              Manage All Locations
            </button>
          </div>
        </div>

        {/* QUICK ACTIONS (8 cols) */}
        <div className="lg:col-span-8 flex flex-wrap gap-4">
           {[
             { name: 'Inventory Check', icon: <Package size={16} /> },
             { name: 'Staff Management', icon: <Users size={16} /> },
             { name: 'Financial Reports', icon: <TrendingUp size={16} /> },
           ].map((action, i) => (
             <button 
               key={i}
               className="flex-1 min-w-[200px] h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center gap-3 text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all text-[13px] font-black uppercase tracking-widest shadow-sm"
             >
                {action.icon} {action.name}
             </button>
           ))}
        </div>

      </div>
    </div>
  );
}

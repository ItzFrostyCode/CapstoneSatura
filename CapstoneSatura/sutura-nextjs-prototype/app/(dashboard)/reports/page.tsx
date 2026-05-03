'use client';

import { useState } from 'react';
import { PieChart, Download, Calendar, Filter, ArrowUpRight, ArrowDownRight, Boxes, Activity, TrendingUp, Building2 } from 'lucide-react';

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('This Month');

  const mainStats = [
    { label: "Net Revenue", value: "₱452,000", change: "+14.2%", isPositive: true, subLabel: "vs Last Month" },
    { label: "Gross Profit", value: "₱185,500", change: "+8.1%", isPositive: true, subLabel: "Margin: 41%" },
    { label: "Inventory Value", value: "₱892,300", change: "+2.4%", isPositive: true, subLabel: "240 Unique SKUs" },
    { label: "Active Orders", value: "42", change: "-5.0%", isPositive: false, subLabel: "8 Near Deadline" },
  ];

  const productionMetrics = [
    { stage: "Measured", count: 12, color: "bg-slate-200" },
    { stage: "Cutting", count: 8, color: "bg-amber-400" },
    { stage: "Sewing", count: 15, color: "bg-blue-500" },
    { stage: "QC Check", count: 4, color: "bg-purple-500" },
    { stage: "Ready", count: 3, color: "bg-emerald-500" },
  ];

  const categoryDistribution = [
    { name: "Fabrics", value: 65, color: "text-indigo-600", bg: "bg-indigo-600" },
    { name: "Uniforms", value: 20, color: "text-emerald-600", bg: "bg-emerald-600" },
    { name: "Accessories", value: 10, color: "text-amber-600", bg: "bg-amber-600" },
    { name: "Others", value: 5, color: "text-slate-400", bg: "bg-slate-400" },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Reports & Analytics</h1>
          <p className="text-[16px] text-slate-500 mt-1 font-normal">Deep dive into production efficiency, inventory health, and financial growth.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 h-10 shadow-sm">
            <Calendar size={16} className="text-slate-400" />
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-[13px] font-bold text-slate-700 bg-transparent outline-none pr-4"
            >
              <option>Last 7 Days</option>
              <option>This Month</option>
              <option>Last Quarter</option>
              <option>Full Year</option>
            </select>
          </div>
          <button className="flex items-center gap-2 bg-slate-900 text-white h-10 px-4 rounded-lg text-[13px] font-bold hover:bg-slate-800 transition-all shadow-sm">
            <Download size={16} /> Export Intelligence
          </button>
        </div>
      </div>

      {/* High-Level KPIs */}
      <div className="grid grid-cols-4 gap-6">
        {mainStats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
              <div className={`flex items-center gap-1 text-[12px] font-black ${stat.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <div className="text-[32px] font-black text-slate-900 leading-tight">{stat.value}</div>
            <p className="text-[12px] text-slate-400 font-medium mt-1">{stat.subLabel}</p>
          </div>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Production Pipeline Health */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2">
                <Activity size={20} className="text-indigo-600" /> Production Pipeline Health
              </h3>
              <p className="text-[13px] text-slate-500 mt-0.5">Real-time distribution of job orders across stages.</p>
            </div>
            <button className="text-[12px] font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">Detailed View</button>
          </div>
          
          <div className="h-[350px] min-h-[350px] w-full flex items-end justify-between gap-6 px-4 pt-12 pb-4 bg-slate-50/30 rounded-2xl">
            {productionMetrics.map((m, i) => (
              <div key={i} className="flex-1 h-full flex flex-col justify-end group min-h-[300px]">
                <div className="relative w-full h-[300px] flex flex-col justify-end items-center">
                  {/* Track Background */}
                  <div className="absolute inset-x-0 top-0 bottom-0 bg-slate-200/30 rounded-xl mx-2 border border-slate-200/50 shadow-inner"></div>
                  
                  {/* Value Label */}
                  <div className="absolute -top-10 left-0 right-0 text-center text-[16px] font-black text-slate-900 z-30 group-hover:scale-125 transition-transform">
                    {m.count}
                  </div>

                  {/* The Bar */}
                  <div 
                    className="relative w-16 rounded-t-xl transition-all duration-700 ease-out shadow-lg z-20 group-hover:brightness-110" 
                    style={{ 
                      height: `${(m.count / 20) * 100}%`, 
                      minHeight: '12px',
                      backgroundColor: m.stage === 'Measured' ? '#94a3b8' : 
                                       m.stage === 'Cutting' ? '#f59e0b' : 
                                       m.stage === 'Sewing' ? '#3b82f6' : 
                                       m.stage === 'QC Check' ? '#8b5cf6' : 
                                       '#10b981'
                    }}
                  >
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-white/15 rounded-t-xl"></div>
                  </div>
                </div>
                
                {/* Stage Label */}
                <div className="mt-5 text-center h-6 flex items-center justify-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">{m.stage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Composition */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h3 className="text-[18px] font-bold text-slate-900 flex items-center gap-2 mb-1">
            <PieChart size={20} className="text-indigo-600" /> Stock Composition
          </h3>
          <p className="text-[13px] text-slate-500 mb-8 font-medium">Asset distribution by category.</p>

          <div className="space-y-6">
            {categoryDistribution.map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center text-[13px] font-bold">
                  <span className="text-slate-700">{cat.name}</span>
                  <span className={cat.color}>{cat.value}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-1000 ${cat.bg}`} style={{ width: `${cat.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
            <div className="text-[12px] font-bold text-indigo-900 flex items-center gap-2 mb-1.5">
              <Boxes size={14} /> Optimization Tip
            </div>
            <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
              Fabric turnover is at 85%. Consider increasing reorder frequency for **Premium Cotton** to avoid production blocks.
            </p>
          </div>
        </div>

        {/* Multi-Branch Performance Matrix (Ultimate Report View) */}
        <div className="col-span-12 bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm overflow-hidden">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-600 text-white text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-[0.2em] shadow-sm">Global Overview</div>
              <h3 className="text-[24px] font-black text-slate-900 tracking-tight">Multi-Branch Performance Matrix</h3>
            </div>
            <p className="text-[15px] text-slate-500 font-medium max-w-2xl">Comparative analytics for revenue, stock efficiency, and staff output across all locations.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="h-11 px-5 bg-white border border-slate-200 rounded-xl text-[13px] font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">Filter by Region</button>
            <button className="h-11 px-6 bg-slate-900 text-white rounded-xl text-[13px] font-bold shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center gap-2">
              Generate PDF Pack
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-10">
          {/* Branch Revenue Comparison */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-7 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">Revenue Contribution (MTD)</h4>
              <span className="text-[12px] font-bold text-slate-400">Target: ₱2.5M</span>
            </div>
            {[
              { name: "Makati Central Branch", value: 1200000, color: "bg-indigo-600", percentage: 55 },
              { name: "Quezon City Workshop", value: 820000, color: "bg-amber-500", percentage: 32 },
              { name: "BGC Satellite Hub", value: 450000, color: "bg-emerald-500", percentage: 13 },
            ].map((branch, i) => (
              <div key={i} className="group">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <div className="text-[15px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{branch.name}</div>
                    <div className="text-[13px] text-slate-500 font-bold">₱{branch.value.toLocaleString()} <span className="text-slate-300 mx-1">|</span> {branch.percentage}% of total</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[13px]">
                    <TrendingUp size={14} /> +4.2%
                  </div>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ease-out group-hover:brightness-110 ${branch.color}`} 
                    style={{ width: `${branch.percentage}%` }}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-white/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Branch KPI Sidebar */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-5 flex flex-col gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 flex flex-col justify-center relative overflow-hidden group flex-1">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Building2 size={80} />
              </div>
              <div className="relative z-10">
                <div className="text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-3">Top Performer</div>
                <div className="text-[26px] font-black text-slate-900 leading-tight">Makati Central Branch</div>
                <p className="text-[14px] text-slate-500 mt-2 font-medium leading-relaxed">Achieved **98.2%** order accuracy and highest fulfillment speed this period.</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 shadow-sm">+12.4% Revenue Growth</span>
                  <span className="px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-xl text-[11px] font-bold text-rose-600 shadow-sm">3 Material Shortages</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Performance Table (Simplified) */}
        <div className="col-span-12 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-[18px] font-bold text-slate-900">Profitability by Product Line</h3>
            <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-[13px] font-bold">
              <Filter size={16} /> Advanced Filter
            </button>
          </div>
          <table className="w-full text-left text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-4 font-bold text-slate-600 uppercase tracking-wider">Product Category</th>
                <th className="px-8 py-4 font-bold text-slate-600 text-right uppercase tracking-wider">Retail Revenue</th>
                <th className="px-8 py-4 font-bold text-slate-600 text-right uppercase tracking-wider">Material Cost</th>
                <th className="px-8 py-4 font-bold text-slate-600 text-right uppercase tracking-wider">Gross Margin</th>
                <th className="px-8 py-4 font-bold text-slate-600 text-right uppercase tracking-wider">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { line: "Custom Tailoring (Bespoke)", rev: "₱185,000", cost: "₱42,000", margin: "77%", efficiency: "High" },
                { line: "Ready-to-Wear Uniforms", rev: "₱124,500", cost: "₱68,200", margin: "45%", efficiency: "Medium" },
                { line: "Repairs & Alterations", rev: "₱42,300", cost: "₱4,500", margin: "89%", efficiency: "Very High" },
                { line: "Raw Material Resale", rev: "₱12,400", cost: "₱8,900", margin: "28%", efficiency: "Low" },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-4 font-bold text-slate-900">{row.line}</td>
                  <td className="px-8 py-4 text-right font-black text-slate-900">{row.rev}</td>
                  <td className="px-8 py-4 text-right font-bold text-slate-500">{row.cost}</td>
                  <td className="px-8 py-4 text-right">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-black border border-indigo-100">{row.margin}</span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                      row.efficiency.includes('Very High') ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                      row.efficiency === 'High' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      row.efficiency === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                      'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {row.efficiency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Plus, MapPin, Users, ShoppingBag, TrendingUp, Globe, Building2, MoreVertical, X, CheckCircle2, ShieldCheck, Activity, Boxes } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  address: string;
  manager: string;
  staff: number;
  orders: number;
  revenue: string;
  revenueGrowth: string;
  efficiency: string;
  status: string;
}

export default function BranchesPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const branches = [
    { 
      id: "BR-001", 
      name: "Makati Central Branch", 
      address: "Ayala Ave, Makati City", 
      manager: "Isabella Rodriguez",
      staff: 12, 
      orders: 145, 
      revenue: "₱1,240,000",
      revenueGrowth: "+12.4%",
      efficiency: "98.2%",
      status: "Active"
    },
    { 
      id: "BR-002", 
      name: "BGC Satellite Hub", 
      address: "Bonifacio Global City, Taguig", 
      manager: "Mark Anthony",
      staff: 4, 
      orders: 42, 
      revenue: "₱450,200",
      revenueGrowth: "+5.1%",
      efficiency: "94.5%",
      status: "Active"
    },
    { 
      id: "BR-003", 
      name: "Quezon City Workshop", 
      address: "Katipunan Ave, Quezon City", 
      manager: "Sarah Jenkins",
      staff: 8, 
      orders: 98, 
      revenue: "₱820,400",
      revenueGrowth: "+8.9%",
      efficiency: "96.8%",
      status: "Active"
    }
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full flex flex-col gap-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Branch Management</h1>
          </div>
          <p className="text-[16px] text-slate-500 font-normal">Oversee operations, manage permissions, and track performance across all locations.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white h-11 px-5 rounded-xl text-[14px] font-bold hover:bg-slate-800 transition-all shadow-lg hover:-translate-y-0.5"
        >
          <Plus size={18} /> Register New Branch
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
            <Globe size={24} />
          </div>
          <div>
            <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Total Footprint</div>
            <div className="text-[24px] font-black text-slate-900">3 Active Branches</div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
            <Users size={24} />
          </div>
          <div>
            <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Global Workforce</div>
            <div className="text-[24px] font-black text-slate-900">24 Staff Members</div>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">Combined Revenue</div>
            <div className="text-[24px] font-black text-slate-900">₱2.51M</div>
          </div>
        </div>
      </div>

      {/* Advanced Insights Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Performance Leaderboard */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div>
              <h3 className="text-[18px] font-black text-slate-900 tracking-tight flex items-center gap-2">
                <TrendingUp size={20} className="text-indigo-600" /> Branch Performance Leaderboard
              </h3>
              <p className="text-[13px] text-slate-500 font-medium">Ranking locations by efficiency and revenue growth.</p>
            </div>
            <button className="text-[12px] font-bold text-indigo-600 hover:underline">Full Comparison</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-white border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5 font-black text-slate-400 uppercase tracking-widest text-[10px]">Location</th>
                  <th className="px-8 py-5 font-black text-slate-400 uppercase tracking-widest text-[10px]">Efficiency</th>
                  <th className="px-8 py-5 font-black text-slate-400 uppercase tracking-widest text-[10px]">MTD Revenue</th>
                  <th className="px-8 py-5 font-black text-slate-400 uppercase tracking-widest text-[10px]">Growth</th>
                  <th className="px-8 py-5 font-black text-slate-400 uppercase tracking-widest text-[10px] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {branches.map((b, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-[11px]">0{i+1}</div>
                        <div>
                          <div className="font-black text-slate-900">{b.name}</div>
                          <div className="text-[11px] text-slate-400 font-medium">{b.manager}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: b.efficiency }}></div>
                        </div>
                        <span className="font-bold text-slate-700">{b.efficiency}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-black text-slate-900">{b.revenue}</td>
                    <td className="px-8 py-5">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg font-black text-[10px] border border-emerald-100">{b.revenueGrowth}</span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button onClick={() => setSelectedBranch(b)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                        <TrendingUp size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operational Health & Sync */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group shadow-xl">
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-all duration-700 group-hover:scale-125">
              <ShieldCheck size={160} />
            </div>
            <div className="relative z-10">
              <div className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-6">Inventory Sync Health</div>
              <div className="space-y-6">
                {[
                  { label: "Catalog Sync", status: "Synchronized", color: "text-emerald-400" },
                  { label: "Price Uniformity", status: "98% Matched", color: "text-emerald-400" },
                  { label: "Stock Alerts", status: "5 Critical", color: "text-rose-400" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-[13px] font-bold opacity-60">{item.label}</span>
                    <span className={`text-[12px] font-black ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[13px] font-black transition-all border border-white/5">Trigger Global Audit</button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
            <h3 className="text-[14px] font-black text-slate-900 mb-6 flex items-center gap-2">
              <Activity size={18} className="text-indigo-600" /> Recent Global Activity
            </h3>
            <div className="space-y-6">
              {[
                { time: "2m ago", text: "New Order #JO-882 in BGC Branch", icon: <ShoppingBag size={14}/> },
                { time: "15m ago", text: "Low Stock: Premium Silk in QC", icon: <Boxes size={14}/> },
                { time: "1h ago", text: "Manager Check-in: Makati Branch", icon: <CheckCircle2 size={14}/> },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    {activity.icon}
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-slate-800 leading-tight">{activity.text}</p>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Branch Cards Grid */}
      <div className="flex items-center justify-between mt-4 mb-4">
        <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-[0.2em]">Location Directory</h3>
        <span className="text-[12px] font-bold text-slate-400">{branches.length} Registered Branches</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {branches.map((branch, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all group relative border-b-[6px] border-b-slate-100 hover:border-b-indigo-500">
            {/* Branch Header */}
            <div className="p-6 pb-0 flex justify-between items-start">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                <Building2 size={24} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <div className="flex gap-2">
                <button className="text-slate-300 hover:text-slate-900 transition-colors"><MoreVertical size={20}/></button>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-[20px] font-black text-slate-900 leading-tight mb-1">{branch.name}</h3>
              <div className="flex items-center gap-1.5 text-slate-500 text-[13px] font-medium mb-6">
                <MapPin size={14} className="text-indigo-400" /> {branch.address}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Orders</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[18px] font-black text-slate-900">{branch.orders}</span>
                    <ShoppingBag size={12} className="text-slate-300" />
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Local Revenue</div>
                  <div className="text-[18px] font-black text-emerald-600">{branch.revenue}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[11px] font-black text-indigo-700 border border-indigo-200">
                    {branch.manager.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Branch Manager</div>
                    <div className="text-[13px] font-bold text-slate-800">{branch.manager}</div>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-500">
                      +{branch.staff - 3 + j}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-600 uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                {branch.status}
              </div>
              <button onClick={() => setSelectedBranch(branch)} className="text-[12px] font-bold text-indigo-600 hover:underline">View Analytics</button>
            </div>
          </div>
        ))}

        {/* Add Branch Placeholder */}
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="border-2 border-dashed border-slate-200 rounded-[24px] flex flex-col items-center justify-center p-8 gap-4 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group min-h-[350px]"
        >
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-lg transition-all">
            <Plus size={32} />
          </div>
          <div className="text-center">
            <div className="text-[16px] font-bold text-slate-900">Add New Branch</div>
            <p className="text-[13px] text-slate-500 mt-1 max-w-[200px]">Expand your footprint and scale your operations.</p>
          </div>
        </button>
      </div>

      {/* Branch Analytics Slide-over */}
      {selectedBranch && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedBranch(null)}></div>
          <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h2 className="text-[24px] font-black text-slate-900 tracking-tight">{selectedBranch.name}</h2>
                  <p className="text-[14px] text-slate-500 font-medium">Detailed performance analytics for this location.</p>
                </div>
              </div>
              <button onClick={() => setSelectedBranch(null)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Key Branch KPIs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-[24px] p-6">
                  <div className="text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-1">Local Revenue</div>
                  <div className="text-[28px] font-black text-slate-900">{selectedBranch.revenue}</div>
                  <div className="text-[12px] font-bold text-emerald-600 flex items-center gap-1 mt-1">
                    <TrendingUp size={12} /> {selectedBranch.revenueGrowth} vs last month
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-[24px] p-6">
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Operational Efficiency</div>
                  <div className="text-[28px] font-black text-slate-900">{selectedBranch.efficiency}</div>
                  <div className="text-[12px] font-bold text-slate-500 mt-1">Based on target QC pass rate</div>
                </div>
              </div>

              {/* Order Volume Section */}
              <div className="bg-slate-50/50 border border-slate-200 rounded-[32px] p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Order Volume</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Historical trends for this location.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <select className="h-8 px-2 rounded-lg border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 outline-none focus:border-indigo-500 transition-all">
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Bi-Weekly</option>
                      <option>Monthly</option>
                      <option>Yearly</option>
                    </select>
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg h-8 px-2">
                      <input type="date" className="text-[10px] font-bold text-slate-500 bg-transparent outline-none w-24 uppercase"/>
                      <span className="text-slate-300 text-[9px] font-black tracking-tighter">TO</span>
                      <input type="date" className="text-[10px] font-bold text-slate-500 bg-transparent outline-none w-24 uppercase"/>
                    </div>
                  </div>
                </div>

                <div className="h-64 w-full flex gap-4 relative mt-4">
                  {/* Y-Axis Labels */}
                  <div className="flex flex-col justify-between h-[160px] mb-8 text-[10px] font-bold text-slate-300 pr-2 border-r border-slate-100">
                    <span>60</span>
                    <span>30</span>
                    <span>0</span>
                  </div>

                  {/* Chart Bars Area */}
                  <div className="flex-1 flex items-end justify-between gap-3 px-2">
                    {[24, 32, 28, 45, 38, 52, 41].map((v, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-3 group h-full justify-end">
                        <div className="relative w-full flex flex-col justify-end h-[160px]">
                          {/* Value Indicator Bubble */}
                          <div className="absolute -top-7 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
                            <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-lg">
                              {v}
                            </span>
                          </div>

                          <div 
                            className="w-full bg-indigo-600 rounded-t-xl transition-all duration-500 ease-out shadow-lg group-hover:scale-x-105 group-hover:brightness-110 relative overflow-hidden" 
                            style={{ height: `${(v / 60) * 100}%` }}
                          >
                            <div className="absolute inset-0 bg-white/10 rounded-t-xl"></div>
                            {/* Permanent Small Value Label */}
                            <div className="absolute bottom-2 left-0 right-0 text-center text-[9px] font-black text-white/40 group-hover:text-white transition-colors">
                              {v}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Products in this Branch */}
              <div className="space-y-4">
                <h3 className="text-[13px] font-black text-slate-400 uppercase tracking-[0.2em]">Top Product Lines</h3>
                {[
                  { name: "Premium Summer Blazers", orders: 24, revenue: "₱84k" },
                  { name: "Executive Silk Ties", orders: 18, revenue: "₱32k" },
                  { name: "Linen Gala Dresses", orders: 12, revenue: "₱120k" },
                ].map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-100 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600 font-bold"># {i+1}</div>
                      <div>
                        <div className="text-[14px] font-black text-slate-900">{p.name}</div>
                        <div className="text-[12px] text-slate-500 font-medium">{p.orders} local orders</div>
                      </div>
                    </div>
                    <div className="text-[14px] font-black text-slate-900">{p.revenue}</div>
                  </div>
                ))}
              </div>

              {/* Staff Activity Sidebar */}
              <div className="p-8 bg-slate-900 rounded-[40px] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Users size={64} />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                      <Users size={18} />
                    </div>
                    <h3 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest">Active Workforce</h3>
                  </div>
                  <p className="text-[15px] leading-relaxed opacity-80 font-medium max-w-lg">
                    This branch currently has **{selectedBranch.staff}** active staff members. No overdue tasks or operational bottlenecks reported in the last 24 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4">
              <button onClick={() => setSelectedBranch(null)} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[14px] font-black shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all">Close Dashboard</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Branch Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-[550px] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-10 py-8 border-b border-slate-100 bg-slate-50 flex items-start justify-between">
              <div>
                <h2 className="text-[24px] font-black text-slate-900 tracking-tight">Register New Branch</h2>
                <p className="text-[14px] text-slate-500 mt-1">Configure your new location and assign management.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                <X size={20}/>
              </button>
            </div>

            <div className="p-10 flex flex-col gap-6">
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Branch Information</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <input type="text" placeholder="Branch Name (e.g. Alabang Town Center)" className="w-full h-12 px-4 rounded-xl border border-slate-200 text-[14px] font-medium outline-none focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white"/>
                  </div>
                  <div className="col-span-2">
                    <input type="text" placeholder="Complete Business Address" className="w-full h-12 px-4 rounded-xl border border-slate-200 text-[14px] font-medium outline-none focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white"/>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Branch Management</label>
                <div className="w-full">
                  <select className="w-full h-12 px-4 rounded-xl border border-slate-200 text-[14px] font-medium outline-none focus:border-indigo-500 transition-all bg-slate-50 focus:bg-white appearance-none">
                    <option value="">Select Branch Manager</option>
                    <option>Isabella Rodriguez</option>
                    <option>Mark Anthony</option>
                    <option>Sarah Jenkins</option>
                  </select>
                </div>
              </div>

              <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 flex gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm h-fit">
                  <ShieldCheck className="text-indigo-600" size={24} />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-indigo-900">Security & Restrictions</h4>
                  <p className="text-[12px] text-indigo-700/80 leading-relaxed mt-1">
                    By default, this branch will have isolated **Inventory** and **Order** tracking. You can sync global catalog items during setup.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-10 py-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsAddModalOpen(false)} className="h-12 px-6 rounded-xl border border-slate-200 text-slate-600 font-bold text-[14px] hover:bg-white transition-all bg-transparent">Discard</button>
              <button onClick={() => setIsAddModalOpen(false)} className="h-12 px-10 rounded-xl bg-slate-900 text-white font-black text-[14px] hover:bg-slate-800 shadow-xl transition-all hover:-translate-y-0.5 flex items-center gap-2">
                <CheckCircle2 size={18} /> Deploy Branch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Plus, MoreHorizontal, LayoutList, KanbanSquare, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function JobOrdersPage() {
  const [activeView, setActiveView] = useState('table');

  const jobOrders = [
    { id: "ORD-1045", customer: "Maria Garcia", garment: "Wedding Gown (Silk)", price: 45000, balance: 0, dueDate: "May 15", staff: "Isabella", status: "QC Check", priority: "High", progress: 100 },
    { id: "ORD-1044", customer: "Alexander McQueen", garment: "Bespoke Navy Suit", price: 32000, balance: 15000, dueDate: "May 18", staff: "Juan", status: "Sewing", priority: "Normal", progress: 65 },
    { id: "ORD-1043", customer: "Elena Rostova", garment: "Summer Dress", price: 8500, balance: 0, dueDate: "May 10", staff: "Maria", status: "Ready", priority: "Normal", progress: 100 },
    { id: "ORD-1042", customer: "David Torres", garment: "3x Linen Shirts", price: 12000, balance: 0, dueDate: "May 22", staff: "Carlo", status: "Cutting", priority: "Low", progress: 30 },
    { id: "ORD-1041", customer: "Sofia Andres", garment: "Tuxedo Alteration", price: 4500, balance: 1000, dueDate: "May 08", staff: "Juan", status: "Measured", priority: "Urgent", progress: 10 },
    { id: "ORD-1040", customer: "James Wilson", garment: "Evening Coat", price: 18000, balance: 0, dueDate: "May 05", staff: "Isabella", status: "Released", priority: "Normal", progress: 100 },
    { id: "ORD-1039", customer: "Roberto Gomez", garment: "Barong Tagalog", price: 12500, balance: 5000, dueDate: "May 12", staff: "Mike", status: "Ready", priority: "High", progress: 100, isBlocked: true, blockReason: "Missing Buttons" },
    { id: "ORD-1038", customer: "Lucia Santos", garment: "Cocktail Dress", price: 15000, balance: 0, dueDate: "May 11", staff: "Sarah", status: "QC Check", priority: "Normal", progress: 100, isRework: true, reworkReason: "Uneven Hemline" },
  ];

  const kanbanStages = ["Measured", "Cutting", "Sewing", "QC Check", "Ready", "Released"];

  return (
    <div className="p-8 w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">Job Orders</h1>
          <p className="text-[16px] text-slate-500 mt-1 font-normal leading-relaxed">Manage production lifecycle and order tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200">
            <button 
              onClick={() => setActiveView('table')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] font-bold transition-all ${activeView === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutList size={14} /> Data View
            </button>
            <button 
              onClick={() => setActiveView('kanban')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[12px] font-bold transition-all ${activeView === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <KanbanSquare size={14} /> Kanban
            </button>
          </div>
          <Link href="/orders/new" className="flex items-center gap-2 bg-slate-900 text-white h-9 px-4 rounded-md text-[13px] font-semibold hover:bg-slate-800 transition-colors shadow-sm">
            <Plus size={16} /> New Job Order
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6 shrink-0">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="text" placeholder="Search orders by ID, Customer, or Garment..." className="w-full h-9 pl-9 pr-4 rounded-md bg-white border border-slate-200 text-[13px] outline-none focus:border-slate-300 transition-colors shadow-sm" />
        </div>
        <button className="h-9 px-4 border border-slate-200 bg-white rounded-md text-[13px] font-semibold text-slate-700 flex items-center gap-2 hover:bg-slate-50 shadow-sm">
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* TABLE VIEW */}
      {activeView === 'table' && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm flex-1">
          <div className="overflow-x-auto h-full">
            <table className="w-full text-left text-[13px]">
              <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Order ID</th>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Customer</th>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Garment</th>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Price</th>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Due Date</th>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Staff</th>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Status</th>
                  <th className="px-5 py-3 text-[13px] font-medium text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobOrders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                    <td className="px-5 py-4 font-mono font-bold text-slate-700">{order.id}</td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900">{order.customer}</div>
                      {order.balance > 0 && <div className="text-[10px] text-rose-500 font-bold uppercase tracking-tighter">₱{order.balance.toLocaleString()} Balance</div>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-700">{order.garment}</div>
                      {(order.status === 'Sewing' || order.status === 'Cutting') && (
                        <div className="w-24 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${order.progress}%` }}></div>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-600 font-mono text-[12px]">₱{order.price.toLocaleString()}</td>
                    <td className="px-5 py-4 text-slate-600 flex items-center gap-1.5">
                      <Clock size={14} className={order.priority === 'Urgent' ? 'text-rose-500' : 'text-slate-400'}/> {order.dueDate}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[10px] font-bold text-slate-600">{order.staff.charAt(0)}</div>
                        <span className="text-slate-600">{order.staff}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border w-fit ${
                          order.status === 'Released' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                          order.status === 'Ready' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          order.status === 'QC Check' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          order.status === 'Sewing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          order.status === 'Cutting' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          {order.status}
                        </span>
                        {order.isRework && <span className="text-[9px] text-rose-500 font-black uppercase flex items-center gap-1"><AlertCircle size={10}/> Rework</span>}
                        {order.isBlocked && <span className="text-[9px] text-amber-500 font-black uppercase flex items-center gap-1"><AlertCircle size={10}/> Blocked</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {order.status === 'QC Check' ? (
                        <button className="px-3 py-1 bg-purple-600 text-white text-[11px] font-bold rounded-md hover:bg-purple-700 transition-colors shadow-sm">Inspect</button>
                      ) : order.status === 'Ready' ? (
                        <button 
                          disabled={order.balance > 0}
                          className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all shadow-sm ${order.balance > 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                        >
                          {order.balance > 0 ? 'Pay Balance' : 'Release'}
                        </button>
                      ) : order.status === 'Released' ? (
                        <button className="px-3 py-1 border border-slate-200 text-slate-400 text-[11px] font-bold rounded-md hover:bg-slate-50 transition-colors">Archive</button>
                      ) : (
                        <button className="p-1.5 text-slate-400 hover:text-slate-900 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                          <MoreHorizontal size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KANBAN VIEW */}
      {activeView === 'kanban' && (
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 h-full min-w-max">
            {kanbanStages.map((stage, stageIdx) => {
              const stageOrders = jobOrders.filter(o => o.status === stage);
              return (
                <div key={stageIdx} className="w-[280px] bg-slate-100/50 rounded-xl border border-slate-200 flex flex-col h-full shrink-0">
                  <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-100/80 rounded-t-xl">
                    <h3 className="font-medium text-[13px] text-slate-500 uppercase tracking-wider">{stage}</h3>
                    <span className="bg-white border border-slate-200 px-2 py-0.5 rounded-full text-[11px] font-bold text-slate-500">
                      {stageOrders.length}
                    </span>
                  </div>
                  <div className="p-3 flex-1 overflow-y-auto flex flex-col gap-3">
                    {stageOrders.map((order, orderIdx) => (
                      <div key={orderIdx} className={`bg-white border-2 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-grab flex flex-col gap-3 ${order.isRework ? 'border-rose-100 bg-rose-50/20' : order.isBlocked ? 'border-amber-100 bg-amber-50/20' : 'border-slate-200'}`}
                           style={{ borderLeftWidth: '6px', borderLeftColor: order.priority === 'Urgent' ? '#f43f5e' : order.priority === 'High' ? '#f59e0b' : '#cbd5e1' }}>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-black text-slate-400 tracking-tighter">{order.id}</span>
                          <div className="flex gap-1">
                            {order.isRework && <div className="w-5 h-5 rounded-md bg-rose-500 text-white flex items-center justify-center"><AlertCircle size={12}/></div>}
                            {order.isBlocked && <div className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center"><AlertCircle size={12}/></div>}
                            {order.status === 'Ready' && order.balance === 0 && <div className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center"><CheckCircle2 size={12}/></div>}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-[14px] text-slate-900 leading-tight mb-0.5">{order.garment}</h4>
                          <p className="text-[12px] text-slate-500 font-medium">{order.customer}</p>
                        </div>

                        {(order.status === 'Sewing' || order.status === 'Cutting') && (
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              <span>{order.status} Progress</span>
                              <span>{order.progress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-slate-900 transition-all duration-500" style={{ width: `${order.progress}%` }}></div>
                            </div>
                          </div>
                        )}

                        {order.isRework && (
                          <div className="bg-white border border-rose-200 rounded-lg p-2 text-[10px] text-rose-600 font-bold italic flex items-center gap-1.5 shadow-sm">
                            <AlertCircle size={12}/> Failed: {order.reworkReason}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-1">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                            <Clock size={12} className={order.priority === 'Urgent' ? 'text-rose-500' : 'text-slate-400'}/> {order.dueDate}
                          </div>
                          <div className="flex items-center gap-2">
                            {order.balance > 0 && <span className="text-[10px] font-black text-rose-500">₱{order.balance.toLocaleString()}</span>}
                            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600" title={`Assigned to ${order.staff}`}>
                              {order.staff.charAt(0)}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons in Kanban */}
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <button className="h-8 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">Details</button>
                          {order.status === 'QC Check' ? (
                            <button className="h-8 bg-purple-600 text-white rounded-lg text-[11px] font-bold hover:bg-purple-700 shadow-sm">Inspect</button>
                          ) : order.status === 'Ready' ? (
                            <button 
                              disabled={order.balance > 0}
                              className={`h-8 rounded-lg text-[11px] font-bold shadow-sm ${order.balance > 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                            >
                              {order.balance > 0 ? 'Pay' : 'Release'}
                            </button>
                          ) : order.status === 'Released' ? (
                            <button className="h-8 border border-slate-200 text-slate-400 rounded-lg text-[11px] font-bold hover:bg-slate-50">Archived</button>
                          ) : (
                            <button className="h-8 bg-slate-900 text-white rounded-lg text-[11px] font-bold hover:bg-slate-800 transition-colors">Advance</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  );
}

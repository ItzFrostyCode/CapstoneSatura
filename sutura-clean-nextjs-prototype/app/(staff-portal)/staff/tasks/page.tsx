'use client';

import { useState } from 'react';
import { Scissors, AlertCircle, CheckCircle2, AlertTriangle, ArrowRight, PackageOpen, X, Edit2, Clock, Filter, Search } from 'lucide-react';
import { AllocateMaterialsModal } from '@/components/shared/AllocateMaterialsModal';

interface ProductionOrder {
  id: string;
  garment: string;
  customer: string;
  type: string;
  priority: string;
  stage: string;
  due: string;
  action: string;
}

export default function ProductionQueuePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);

  const stats = [
    { label: "Assigned Jobs", value: "4", sub: "Active tasks", icon: <Scissors size={20} className="text-indigo-600"/>, bg: "bg-indigo-50" },
    { label: "Due Soon", value: "2", sub: "Next 48 hours", icon: <AlertCircle size={20} className="text-rose-600"/>, bg: "bg-rose-50" },
    { label: "Completion Rate", value: "92%", sub: "Last 30 days", icon: <CheckCircle2 size={20} className="text-emerald-600"/>, bg: "bg-emerald-50" },
  ];

  const assignedOrders = [
    { id: "ORD-1006", garment: "Barong Tagalog", customer: "Mr. Reyes", type: "Full Set", priority: "Urgent", stage: "Cutting", due: "Apr 29, 2026", action: "Allocate Materials" },
    { id: "ORD-1004", garment: "Cocktail Dress", customer: "Ms. Santos", type: "Evening Wear", priority: "High Priority", stage: "Sewing", due: "Apr 28, 2026", action: "Allocate Materials" },
    { id: "ORD-1002", garment: "Office Uniforms ×4", customer: "Dela Cruz Corp.", type: "Bulk", priority: "Normal", stage: "QC Inspection", due: "May 3, 2026", action: "View Materials" },
    { id: "ORD-1001", garment: "Wedding Gown", customer: "Ms. Ramos", type: "Custom", priority: "Normal", stage: "Ready for Pickup", due: "May 10, 2026", action: "Mark Delivered" },
  ];

  const handleOpenModal = (order: ProductionOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-black text-slate-900 tracking-tight leading-none">Production Queue</h1>
          <p className="text-[12px] text-slate-500 font-bold mt-1.5 uppercase tracking-widest leading-none">Job Orders & Task Management</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-[24px] p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-all">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{stat.label}</div>
              <div className="text-[28px] font-black text-slate-900 tracking-tight leading-none">{stat.value}</div>
              <div className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">{stat.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search by order ID or garment..." 
            className="w-full h-12 pl-12 pr-6 bg-white border border-slate-200 rounded-xl text-[14px] font-medium outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="h-12 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[13px] font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={16} /> Filters
          </button>
          <button className="h-12 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[13px] font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Clock size={16} /> Timeline
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">My Assigned Orders</h2>
        <div className="flex flex-col gap-4">
          {assignedOrders.map((order, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-[32px] p-6 flex flex-col lg:flex-row lg:items-center justify-between shadow-sm hover:shadow-xl hover:border-slate-300 transition-all group relative overflow-hidden">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-inner group-hover:bg-slate-900 group-hover:text-white transition-all">
                  <span className="text-[10px] font-black opacity-40 uppercase tracking-tighter">ID</span>
                  <span className="text-[15px] font-black">{order.id.split('-')[1]}</span>
                </div>
                
                <div className="w-72">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                      order.priority === 'Urgent' ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse' :
                      order.priority === 'High Priority' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {order.priority}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{order.type}</span>
                  </div>
                  <h3 className="font-black text-[18px] text-slate-900 leading-tight tracking-tight">{order.garment}</h3>
                  <p className="text-[13px] text-slate-500 font-bold mt-1 uppercase tracking-tight">{order.customer}</p>
                </div>

                <div className="grid grid-cols-2 gap-12 pl-8 hidden xl:grid">
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Current Stage
                    </div>
                    <div className="text-[14px] font-black text-slate-900 uppercase tracking-tight">{order.stage}</div>
                  </div>

                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                      <Clock size={12} className="text-rose-400" /> Target Date
                    </div>
                    <div className="text-[14px] font-black text-slate-900 uppercase tracking-tight">{order.due}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6 lg:mt-0">
                <button className="h-12 px-6 rounded-2xl bg-white border border-slate-200 text-slate-600 font-black text-[13px] hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center gap-2 shadow-sm active:scale-95">
                  <Edit2 size={16} /> Update Status
                </button>
                {order.action.includes('Allocate') ? (
                  <button 
                    onClick={() => handleOpenModal(order)}
                    className="h-12 px-6 rounded-2xl bg-indigo-600 text-white font-black text-[13px] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 active:scale-95"
                  >
                    <PackageOpen size={18} /> {order.action}
                  </button>
                ) : (
                  <button className="h-12 px-6 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200 font-black text-[13px] hover:bg-slate-200 transition-all flex items-center gap-2 active:scale-95">
                    <ArrowRight size={18} /> {order.action}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL OVERLAY */}
      <AllocateMaterialsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />

    </div>
  );
}

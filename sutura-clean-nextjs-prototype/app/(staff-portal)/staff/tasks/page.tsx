'use client';

import { useState } from 'react';
import { Scissors, AlertCircle, CheckCircle2, AlertTriangle, ArrowRight, PackageOpen, X, Edit2, Clock, Filter, Search } from 'lucide-react';
import { AllocateMaterialsModal } from '@/components/shared/AllocateMaterialsModal';
import { ProductionJobDetailsModal } from '@/components/shared/ProductionJobDetailsModal';
import { useERPStore } from '@/store/useERPStore';
import { resolveOrderState, getDisplayLabel } from '@/features/orders/orderEngine';
import { Order } from '@/types/erp';

// interface ProductionOrder removed as we now use Order type from erp.ts

export default function ProductionQueuePage() {
  const { getEnrichedOrders, staff, customers } = useERPStore();
  const enrichedOrders = getEnrichedOrders();
  
  const assignedOrders = enrichedOrders.filter(o => {
    const { productionStage } = resolveOrderState(o);
    return productionStage === 'IN_PRODUCTION' || productionStage === 'ALTERATIONS' || productionStage === 'READY_FOR_FITTING';
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const stats = [
    { label: "Assigned Jobs", value: assignedOrders.length.toString(), sub: "Active tasks", icon: <Scissors size={20} />, color: "bg-indigo-50 text-indigo-600" },
    { label: "Urgent Jobs", value: assignedOrders.filter(o => o.priority === 'High').length.toString(), sub: "High Priority", icon: <AlertCircle size={20} />, color: "bg-rose-50 text-rose-600" },
    { label: "Completed Today", value: "3", sub: "Last 24 hours", icon: <CheckCircle2 size={20} />, color: "bg-emerald-50 text-emerald-600" },
  ];

  const handleOpenModal = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="space-y-12 pb-20 max-w-[1600px] mx-auto animate-in fade-in duration-700 font-outfit">
      
      {/* ── ELITE HEADER ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Artisan Production</div>
             <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
             <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Studio Terminal</div>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 italic">Production Studio.</h1>
          <p className="text-lg font-medium text-slate-500 mt-2">Precision tailoring workflow and artisanal task management.</p>
        </div>
      </div>

      {/* ── PREMIUM KPI GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="group bg-white p-10 rounded-[40px] border-2 border-slate-50 hover:border-indigo-100 hover:shadow-[0_30px_60px_rgba(0,0,0,0.04)] transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[80px] -mr-8 -mt-8 group-hover:bg-indigo-50/50 transition-colors duration-500"></div>
            
            <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-8 relative z-10 shadow-lg`}>
              {stat.icon}
            </div>
            
            <div className="relative z-10">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</div>
              <div className="text-4xl font-black text-slate-900 tracking-tight mb-2">{stat.value}</div>
              <div className="text-[12px] text-slate-500 font-bold flex items-center gap-2">
                 <span className="text-indigo-600">●</span> {stat.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── CONTROL BAR ── */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 bg-white p-4 rounded-[32px] border-2 border-slate-50 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by order ID or garment description..." 
            className="w-full h-16 pl-16 pr-8 bg-slate-50 border-none rounded-[24px] text-[15px] font-bold outline-none focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="h-16 px-8 bg-white border-2 border-slate-50 rounded-[24px] flex items-center gap-3 text-[13px] font-black text-slate-600 uppercase tracking-widest hover:border-slate-900 transition-all">
            <Filter size={18} /> Filters
          </button>
          <button className="h-16 px-8 bg-slate-900 text-white rounded-[24px] flex items-center gap-3 text-[13px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10">
            <Clock size={18} /> Timeline
          </button>
        </div>
      </div>

      {/* ── PRODUCTION TABLE ── */}
      <div className="bg-white rounded-[48px] border-2 border-slate-50 shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white"><Scissors size={18} /></div>
              <h2 className="text-xl font-black text-slate-900">Active Production Queue</h2>
           </div>
           <span className="text-[11px] font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-full uppercase tracking-widest">
             {assignedOrders.length} Tasks in pipeline
           </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50">
                <th className="px-10 py-6">Garment & Order</th>
                <th className="px-10 py-6">Customer</th>
                <th className="px-10 py-6">Status & Progress</th>
                <th className="px-10 py-6">Artisan</th>
                <th className="px-10 py-6">Deadline</th>
                <th className="px-10 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {assignedOrders.map((order) => {
                const { productionStage, progress } = resolveOrderState(order);
                const garmentName = order.order_type === 'ALTERATION' 
                  ? order.alteration_details?.item_description || 'Repair Item'
                  : order.items?.[0]?.garment_name || 'Custom Garment';
                const customerName = customers.find(c => c.id === order.customer_id)?.name || 'Unknown';
                
                return (
                <tr key={order.id} className="hover:bg-slate-50/30 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                        order.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {order.order_type === 'ALTERATION' ? <Scissors size={20} /> : <PackageOpen size={20} />}
                      </div>
                      <div>
                        <div className="text-[15px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{garmentName}</div>
                        <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: #{order.id} • {order.order_type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="text-[14px] font-bold text-slate-900">{customerName}</div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-2 max-w-[200px]">
                      <div className="flex items-center justify-between">
                         <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-md text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                           {getDisplayLabel(productionStage)}
                         </span>
                         <span className="text-[11px] font-black text-slate-400">{progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-[11px] shadow-lg">
                        {order.assigned_staff_id ? staff.find(s => s.id === order.assigned_staff_id)?.name.charAt(0) : '?'}
                      </div>
                      <div className="text-[13px] font-bold text-slate-700">
                        {order.assigned_staff_id ? staff.find(s => s.id === order.assigned_staff_id)?.name : 'Unassigned'}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-2">
                       <Clock size={14} className={order.priority === 'High' ? 'text-rose-500' : 'text-slate-300'} />
                       <span className={`text-[13px] font-black ${order.priority === 'High' ? 'text-rose-600' : 'text-slate-900'}`}>
                         {new Date(order.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                       </span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button 
                      onClick={() => handleOpenDetails(order)}
                      className="px-6 py-3 bg-white border-2 border-slate-100 rounded-[18px] text-slate-900 text-[11px] font-black uppercase tracking-widest hover:border-slate-900 hover:shadow-lg transition-all"
                    >
                      View Job
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AllocateMaterialsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder ? {
          id: selectedOrder.id,
          garment: (selectedOrder.items?.[0]?.garment_name || 'Garment'),
          customer: (customers.find(c => c.id === selectedOrder.customer_id)?.name || 'Unknown'),
          due: new Date(selectedOrder.due_date).toLocaleDateString()
        } : null}
      />

      <ProductionJobDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        order={selectedOrder}
      />

    </div>
  );
}

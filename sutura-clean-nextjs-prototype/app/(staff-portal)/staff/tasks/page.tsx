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
  
  // For staff portal, we filter for orders that are actually IN_PRODUCTION or need attention
  const assignedOrders = enrichedOrders.filter(o => {
    const { productionStage } = resolveOrderState(o);
    return productionStage === 'IN_PRODUCTION' || productionStage === 'ALTERATIONS' || productionStage === 'READY_FOR_FITTING';
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const stats = [
    { label: "Assigned Jobs", value: assignedOrders.length.toString(), sub: "Active tasks", icon: <Scissors size={20} className="text-indigo-600"/>, bg: "bg-indigo-50" },
    { label: "Urgent Jobs", value: assignedOrders.filter(o => o.priority === 'High').length.toString(), sub: "High Priority", icon: <AlertCircle size={20} className="text-rose-600"/>, bg: "bg-rose-50" },
    { label: "Completed Today", value: "3", sub: "Last 24 hours", icon: <CheckCircle2 size={20} className="text-emerald-600"/>, bg: "bg-emerald-50" },
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

      {/* Orders List Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">Assigned Production Queue</h2>
          <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
            Showing {assignedOrders.length} active tasks
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <th className="px-6 py-4 w-[250px]">Order Details</th>
                <th className="px-6 py-4 w-[150px]">Customer</th>
                <th className="px-6 py-4 w-[180px]">Assigned Staff</th>
                <th className="px-6 py-4 w-[250px]">Tailoring Progress</th>
                <th className="px-6 py-4 w-[150px]">Deadline</th>
                <th className="px-6 py-4 text-right pr-8">Action</th>
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
                <tr key={order.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                          order.priority === 'High' ? 'bg-rose-100 text-rose-700' :
                          order.order_type === 'BULK' ? 'bg-blue-100 text-blue-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {order.order_type}
                        </span>
                        <div className="text-[13px] font-bold text-slate-900 truncate max-w-[200px]">
                          {garmentName}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-1.5 ml-1">
                        {order.order_type === 'ALTERATION' ? <Scissors size={10} className="text-rose-400" /> : 
                         order.order_type === 'BULK' ? <PackageOpen size={10} className="text-blue-400" /> : 
                         <Clock size={10} className="text-slate-300" />}
                        {order.order_type} • ID: {order.id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[14px] font-bold text-slate-900">{customerName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-500">
                        {order.assigned_staff_id ? staff.find(s => s.id === order.assigned_staff_id)?.name.charAt(0) : '?'}
                      </div>
                      <div className="text-[13px] font-bold text-slate-700">
                        {order.assigned_staff_id ? staff.find(s => s.id === order.assigned_staff_id)?.name : 'Unassigned'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-indigo-100 bg-indigo-50 text-indigo-700">
                          {getDisplayLabel(productionStage)}
                        </span>
                        <span className="text-[10px] font-black text-slate-400">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500" 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock size={12} className={order.priority === 'High' ? 'text-rose-500 animate-pulse' : 'text-slate-400'} />
                      <span className={`text-[12px] font-bold ${order.priority === 'High' ? 'text-rose-600' : 'text-slate-900'}`}>
                        {new Date(order.due_date).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right pr-8">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenDetails(order)}
                        className="h-8 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 text-[11px] font-black hover:bg-slate-50 transition-all shadow-sm"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL OVERLAY */}
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

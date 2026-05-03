'use client';

import { useState } from 'react';
import { Scissors, AlertCircle, CheckCircle2, AlertTriangle, ArrowRight, PackageOpen, X, Edit2 } from 'lucide-react';

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
    { label: "Assigned to Me", value: "4 Orders", icon: <Scissors size={20} className="text-purple-600"/>, bg: "bg-purple-50" },
    { label: "Due This Week", value: "2 Orders", icon: <AlertCircle size={20} className="text-amber-600"/>, bg: "bg-amber-50" },
    { label: "Completed This Month", value: "7 Orders", icon: <CheckCircle2 size={20} className="text-emerald-600"/>, bg: "bg-emerald-50" },
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
    <div className="p-8 max-w-[1200px] mx-auto w-full relative">
      
      {/* Role Banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-4 mb-8">
        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 mt-0.5">
          <Scissors size={20} />
        </div>
        <div>
          <h2 className="text-[13px] font-bold text-purple-900 uppercase tracking-wider">Simulating: Seamstress / Tailor View</h2>
          <p className="text-[16px] text-purple-700 mt-1 font-normal leading-relaxed">You can update order stages, check material availability, and allocate materials from inventory. Contact the Shop Owner for billing matters.</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-slate-900 tracking-tight leading-tight">My Production Queue</h1>
          <p className="text-[16px] text-slate-500 mt-1 font-normal leading-relaxed">Friday, April 25, 2026 — 4 orders assigned to you</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4 shadow-sm">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-[13px] font-medium text-slate-500 uppercase tracking-wider mb-0.5">{stat.label}</div>
              <div className="text-[24px] font-bold text-slate-900 tracking-tight">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders List */}
      <h2 className="text-[13px] font-medium text-slate-500 uppercase tracking-wider mb-4">My Assigned Orders</h2>
      <div className="flex flex-col gap-4">
        {assignedOrders.map((order, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-lg flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-slate-400">ID</span>
                <span className="text-[12px] font-bold text-slate-700">{order.id.split('-')[1]}</span>
              </div>
              
              <div className="w-64">
                <h3 className="font-bold text-[15px] text-slate-900 leading-tight mb-1">{order.garment}</h3>
                <p className="text-[13px] text-slate-500">{order.customer} <span className="mx-1">·</span> {order.type}</p>
              </div>

              <div className="w-32">
                <span className={`px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                  order.priority === 'Urgent' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  order.priority === 'High Priority' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-slate-50 text-slate-600 border-slate-200'
                }`}>
                  {order.priority}
                </span>
              </div>

              <div className="w-40">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Stage</div>
                <div className="text-[13px] font-bold text-slate-900">{order.stage}</div>
              </div>

              <div className="w-32">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Due Date</div>
                <div className="text-[13px] font-bold text-slate-900">{order.due}</div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <button className="flex items-center gap-2 text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors">
                <Edit2 size={14} /> Update Stage
              </button>
              {order.action.includes('Allocate') ? (
                <button 
                  onClick={() => handleOpenModal(order)}
                  className="flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 h-8 px-4 rounded-md text-[12px] font-bold hover:bg-indigo-100 transition-colors"
                >
                  <PackageOpen size={14} /> {order.action}
                </button>
              ) : (
                <button className="flex items-center gap-2 bg-slate-100 text-slate-700 border border-slate-200 h-8 px-4 rounded-md text-[12px] font-bold hover:bg-slate-200 transition-colors">
                  {order.action}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL OVERLAY */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-[850px] max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-200 bg-slate-50 flex items-start justify-between shrink-0">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider mb-3">
                  <Scissors size={12}/> Seamstress / Tailor Action
                </span>
                <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Allocate Materials to Job Order</h2>
                <p className="text-[13px] text-slate-500 mt-1">Check material availability and reserve quantities for production.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm">
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto flex-1">
              
              {/* Job Info Grid */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 grid grid-cols-4 gap-6 mb-8">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Order ID</div>
                  <div className="font-mono font-bold text-slate-900">{selectedOrder.id}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Item / Garment</div>
                  <div className="font-bold text-slate-900">{selectedOrder.garment}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Due Date</div>
                  <div className="font-bold text-slate-900">{selectedOrder.due}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Customer</div>
                  <div className="font-bold text-slate-900">{selectedOrder.customer}</div>
                </div>
              </div>

              {/* Allocation Table */}
              <h3 className="text-[12px] font-bold text-slate-900 uppercase tracking-wider mb-3">Required Materials</h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Material</th>
                      <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Current Stock</th>
                      <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Availability</th>
                      <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Allocate</th>
                      <th className="px-5 py-3 text-[13px] font-medium text-slate-600">Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">Piña Fabric (Natural)</div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">SKU: FAB-PIA-002</div>
                      </td>
                      <td className="px-5 py-4 font-medium">22 meters</td>
                      <td className="px-5 py-4"><span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">Sufficient</span></td>
                      <td className="px-5 py-4"><input type="number" defaultValue={3} className="w-16 h-8 border border-slate-300 rounded-md text-center font-bold text-[13px] outline-none focus:border-indigo-500"/></td>
                      <td className="px-5 py-4 text-slate-500 font-medium">meters</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">White Embroidery Thread</div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">SKU: THR-WHT-008</div>
                      </td>
                      <td className="px-5 py-4 font-medium">4 spools</td>
                      <td className="px-5 py-4"><span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">Low Stock</span></td>
                      <td className="px-5 py-4"><input type="number" defaultValue={2} className="w-16 h-8 border border-slate-300 rounded-md text-center font-bold text-[13px] outline-none focus:border-indigo-500"/></td>
                      <td className="px-5 py-4 text-slate-500 font-medium">spools</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">Barong Buttons (Small)</div>
                        <div className="text-[11px] font-mono text-slate-500 mt-0.5">SKU: ACC-BTN-031</div>
                      </td>
                      <td className="px-5 py-4 font-medium text-rose-600">0 sets</td>
                      <td className="px-5 py-4"><span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-1 rounded-md border border-rose-200">Out of Stock</span></td>
                      <td className="px-5 py-4"><input type="number" defaultValue={0} readOnly className="w-16 h-8 border border-slate-200 bg-slate-50 rounded-md text-center font-bold text-[13px] outline-none opacity-50"/></td>
                      <td className="px-5 py-4 text-slate-500 font-medium">sets</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Blocked Warning */}
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 flex items-start gap-4">
                <AlertTriangle size={20} className="text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[13px] font-bold text-rose-900 mb-1">1 item is out of stock (Barong Buttons)</h4>
                  <p className="text-[12px] text-rose-700 leading-relaxed">A restock request will be automatically flagged for the Shop Owner to approve. Production can still begin with the available allocated materials.</p>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Items to Allocate</div>
                  <div className="font-bold text-slate-900 text-[14px]">2 / 3</div>
                </div>
                <div className="w-px h-8 bg-slate-300"></div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Next Stage After</div>
                  <div className="font-bold text-slate-900 text-[14px] flex items-center gap-2">Cutting <ArrowRight size={14} className="text-slate-400"/> Sewing</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setIsModalOpen(false)} className="h-10 px-5 rounded-lg border border-slate-300 text-slate-700 font-bold text-[13px] hover:bg-slate-100 transition-colors bg-white shadow-sm">Cancel</button>
                <button onClick={() => setIsModalOpen(false)} className="h-10 px-5 rounded-lg bg-indigo-600 text-white font-bold text-[13px] hover:bg-indigo-700 transition-all shadow-[0_4px_12px_rgba(79,70,229,0.2)] hover:-translate-y-0.5">Allocate & Start Production</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

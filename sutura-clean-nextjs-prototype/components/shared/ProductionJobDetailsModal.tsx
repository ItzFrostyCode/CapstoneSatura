'use client';

import React from 'react';
import { 
  X, 
  Scissors, 
  Clock, 
  User, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  ClipboardList,
  Layers,
  Ruler,
  AlertTriangle,
  History,
  Check
} from 'lucide-react';
import { Order, ProductionTask } from '@/types/erp';
import { resolveOrderState, getDisplayLabel, getStageExplanation } from '@/features/orders/orderEngine';
import { LogDiscrepancyModal } from './LogDiscrepancyModal';
import { UpdateStatusModal } from './UpdateStatusModal';
import { useERPStore } from '@/store/useERPStore';

interface ProductionJobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  staffName?: string;
}

export function ProductionJobDetailsModal({ isOpen, onClose, order, staffName = "Staff Member" }: ProductionJobDetailsModalProps) {
  const [isDiscModalOpen, setIsDiscModalOpen] = React.useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = React.useState(false);
  const { logProductionDiscrepancy, updateOrderStatus, staff } = useERPStore();

  if (!isOpen || !order) return null;

  const assignedStaff = staff.find(s => s.id === order.assigned_staff_id);
  const staffDisplayName = assignedStaff?.name || staffName;

  const engine = resolveOrderState(order);
  const { productionStage, progress, taskStats } = engine;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-[1000px] max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Modal Header */}
        <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex items-start justify-between shrink-0">
          <div className="flex gap-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <ClipboardList size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-[24px] font-black text-slate-900 tracking-tight leading-none">Production Job Details</h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  order.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {order.priority} Priority
                </span>
              </div>
              <p className="text-[14px] text-slate-500 font-medium">Full production specifications for ID: <span className="text-slate-900 font-bold">{order.id}</span></p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Side: Tasks & Workflow */}
          <div className="flex-1 p-10 overflow-y-auto custom-scrollbar border-r border-slate-100">
            <div className="space-y-8">
              {/* Progress Card */}
              <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Production Progress</div>
                    <div className="text-[18px] font-black text-slate-900 leading-none">{getDisplayLabel(productionStage)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[18px] font-black text-indigo-600">{progress}%</div>
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-1000 ease-out" 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">{taskStats.label}</p>
              </div>

              {/* Tasks List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Layers size={18} className="text-indigo-600" /> Tailoring Workflow
                  </h3>
                </div>
                <div className="space-y-3">
                  {order.tasks && order.tasks.length > 0 ? order.tasks.map((task: ProductionTask) => (
                    <div 
                      key={task.id} 
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${ 
                        task.status === 'Completed' ? 'bg-slate-50/50 border-slate-100' : 'bg-white border-slate-200 shadow-sm' 
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${ 
                          task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400' 
                        }`}>
                          {task.status === 'Completed' ? <Check size={16} /> : <Scissors size={16} />}
                        </div>
                        <div>
                          <div className={`text-[13px] font-bold ${ task.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-900' }`}>
                            {task.title}
                          </div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            Status: <span className={task.status === 'In Progress' ? 'text-indigo-600' : 'text-slate-600'}>{task.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                         task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        {task.status}
                      </div>
                    </div>
                  )) : (
                    <div className="py-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-[13px] font-medium">
                      No tasks assigned to this job yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Discrepancies / Issues */}
              {order.discrepancies && order.discrepancies.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[16px] font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <AlertTriangle size={18} className="text-amber-500" /> Production Issues / Discrepancies
                    </h3>
                    <button 
                      onClick={() => setIsDiscModalOpen(true)}
                      className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-100 hover:bg-rose-100 transition-all"
                    >
                      + Log New Issue
                    </button>
                  </div>
                  <div className="space-y-3">
                    {order.discrepancies.map((disc: any) => (
                      <div key={disc.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                          <AlertCircle size={16} />
                        </div>
                        <div>
                          <div className="text-[12px] font-bold text-amber-900">{disc.description}</div>
                          <div className="text-[10px] text-amber-700 font-black uppercase tracking-widest mt-1">
                            Type: {disc.discrepancy_type.replace('_', ' ')} • Impact: ₱{disc.financial_impact}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Specifications */}
          <div className="w-[350px] bg-slate-50/50 p-10 overflow-y-auto custom-scrollbar space-y-8">
             {/* Customer Info */}
             <div className="space-y-4">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Customer Details</div>
                <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black">
                      {order.customer_id?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="text-[14px] font-black text-slate-900">{order.customer_id || 'Unknown Customer'}</div>
                      <div className="text-[11px] text-slate-400 font-bold uppercase">Assigned to: {staffDisplayName}</div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-[12px] text-slate-600 font-bold">
                      <Calendar size={14} className="text-slate-400" /> Due: {new Date(order.due_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-slate-600 font-bold">
                      <MapPin size={14} className="text-slate-400" /> Branch: {order.branch_id}
                    </div>
                  </div>
                </div>
             </div>

             {/* Measurements Card (Mocked for Prototype consistency) */}
             <div className="space-y-4">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Job Specifications</div>
                <div className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[9px] font-black text-slate-400 uppercase">Garment</div>
                      <div className="text-[13px] font-bold text-slate-900">{order.items?.[0]?.garment_name || 'Custom'}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-black text-slate-400 uppercase">Quantity</div>
                      <div className="text-[13px] font-bold text-slate-900">{order.items?.[0]?.quantity || 1} units</div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-100">
                    <div className="text-[9px] font-black text-slate-400 uppercase mb-2">Key Measurements</div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[12px]">
                         <span className="text-slate-500 font-medium">Chest / Bust</span>
                         <span className="text-slate-900 font-black">42"</span>
                       </div>
                       <div className="flex justify-between text-[12px]">
                         <span className="text-slate-500 font-medium">Waist</span>
                         <span className="text-slate-900 font-black">36"</span>
                       </div>
                       <div className="flex justify-between text-[12px]">
                         <span className="text-slate-500 font-medium">Shoulder Width</span>
                         <span className="text-slate-900 font-black">18"</span>
                       </div>
                    </div>
                  </div>
                </div>
             </div>

             {/* Special Instructions */}
             <div className="bg-indigo-600 rounded-[24px] p-6 text-white shadow-lg shadow-indigo-100">
                <div className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-3">Staff Instructions</div>
                <p className="text-[12px] font-medium italic leading-relaxed">
                  "Ensure precise alignment on the fabric patterns. Double-check sleeve length before final stitching."
                </p>
             </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-10 py-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <button className="h-11 px-6 rounded-xl border border-slate-200 bg-white text-slate-600 text-[13px] font-black hover:bg-slate-100 transition-all">
            Print Job Sheet
          </button>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="h-11 px-6 rounded-xl border border-slate-300 text-slate-700 font-black text-[13px] hover:bg-slate-100 transition-all bg-white shadow-sm">
              Close
            </button>
            <button 
              onClick={() => setIsStatusModalOpen(true)}
              className="h-11 px-8 rounded-xl bg-slate-900 text-white font-black text-[13px] hover:bg-black shadow-lg shadow-slate-200 transition-all active:scale-95"
            >
              Update Status
            </button>
          </div>
        </div>

        {/* Nested Discrepancy Modal */}
        <LogDiscrepancyModal 
          isOpen={isDiscModalOpen}
          onClose={() => setIsDiscModalOpen(false)}
          orderId={order.id}
          onLog={(data) => {
            logProductionDiscrepancy({
              job_order_id: order.id,
              discrepancy_type: data.type,
              financial_impact: data.impact,
              reason: data.description,
              reported_by_user_id: 'STF-001',
            });
          }}
        />

        {/* Nested Status Update Modal */}
        <UpdateStatusModal 
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          orderId={order.id}
          currentStatus={order.status}
          onUpdate={(newStatus, notes) => {
            updateOrderStatus(order.id, newStatus, notes);
          }}
        />
      </div>
    </div>
  );
}

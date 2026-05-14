'use client';

import { useState } from 'react';
import Link from 'next/link'; 
import Image from 'next/image';
import { useERPStore } from '@/store/useERPStore';
import { Order, ProductionTask } from '@/types/erp';
import { resolveOrderState, getDisplayLabel, getStageExplanation, ProductionStage } from '@/features/orders/orderEngine';
import CreateOrderModal from './components/CreateOrderModal';
import {
  Search,
  Plus,
  LayoutList,
  KanbanSquare,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  X,
  Scissors,
  Calendar,
  ClipboardList,
  ShieldCheck,
  Package,
  History,
  User,
  CreditCard,
  AlertTriangle,
  AlertCircle,
  Receipt,
  Check,
  Phone,
  MessageCircle,
  MessageSquare,
  Printer,
  Ruler,
  Lock,
  PackageOpen,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import { AllocateMaterialsModal } from '@/components/shared/AllocateMaterialsModal';

type DetailTab = 'jobs' | 'measurements' | 'tasks' | 'timeline' | 'discrepancies';

function getStatusColor(status: string) {
  switch (status) {
    case 'ON_HOLD':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'IN_PRODUCTION':
      return 'bg-slate-900 text-white border-slate-900';
    case 'QUALITY_CHECK':
      return 'bg-[#F0EDE8] text-slate-900 border-[#E2DDD7]';
    case 'REVISION_REQUIRED':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'READY_FOR_RELEASE':
      return 'bg-indigo-600 text-slate-900 border-indigo-600';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200';
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'High':
      return 'bg-rose-50 text-rose-700 border-rose-100';
    case 'Medium':
      return 'bg-[#F0EDE8] text-[#1C1917] border-[#E2DDD7]';
    case 'Low':
      return 'bg-[#ECFDF5] text-[#059669] border-[#D1FAE5]';
    default:
      return 'bg-slate-50 text-slate-600';
  }
}

export default function JobOrdersPage() {
  const { 
    getEnrichedOrders, 
    orderStatusLogs: globalLogs, 
    customers,
    staff,
    recordPayment,
    recordInspection,
    orderInspections,
    updateTaskStatus,
    addProductionTask,
    measurementProfiles,
    pushNotification,
    logProductionDiscrepancy,
    inventory,
    inventoryReservations,
    updateOrderStatus,
    releaseStock
  } = useERPStore();
  
  const jobOrders = getEnrichedOrders();
  
  const [activeView, setActiveView] = useState<'table' | 'kanban'>('table');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailTab, setDetailTab] = useState<DetailTab>('jobs');
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState('');

  // Transaction Inputs for the modal
  const [paymentAmount, setPaymentAmount] = useState<string | number>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash');
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [paymentImage, setPaymentImage] = useState<string | null>(null);
  const [cashReceived, setCashReceived] = useState<string>('');
  const [inspectionNote, setInspectionNote] = useState<string>('');

  // Discrepancy Modal Inputs
  const [isDiscrepancyModalOpen, setIsDiscrepancyModalOpen] = useState(false);
  const [discType, setDiscType] = useState<'MATERIAL_WASTE' | 'EXTRA_LABOR'>('MATERIAL_WASTE');
  const [discItemId, setDiscItemId] = useState<string>('');
  const [discQty, setDiscQty] = useState<string>('');
  const [discReason, setDiscReason] = useState<string>('');
  const [discAmount, setDiscAmount] = useState<string>('');

  // Release Checklist State
  const [releaseChecklist, setReleaseChecklist] = useState({ fitting: false, packaging: false });
  const [isAllocationModalOpen, setIsAllocationModalOpen] = useState(false);

  const STATUS_TABS = ['All', 'IN_PRODUCTION', 'READY_FOR_FITTING', 'ALTERATIONS'];

  const filteredOrders = jobOrders.filter(o => {
    const { productionStage } = resolveOrderState(o);
    const matchesStatus = statusFilter === 'All' || productionStage === statusFilter;
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (customers.find(c => c.id === o.customer_id)?.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const orderStatusLogs = selectedOrder
    ? globalLogs.filter(l => l.order_id === selectedOrder.id)
    : [];

  const closeDetailModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setPaymentAmount('');
    setCashReceived('');
    setPaymentRef('');
    setPaymentImage(null);
  };

  const handlePayment = () => {
    if (!selectedOrder || !paymentAmount) return;
    recordPayment(selectedOrder.id, parseFloat(String(paymentAmount)), 'STF-001', paymentMethod, paymentRef, paymentImage || undefined);
    setPaymentAmount('');
    setPaymentMethod('Cash');
    setPaymentRef('');
    setCashReceived('');
    setPaymentImage(null);
  };

  const handleInspection = (failed: boolean) => {
    if (!selectedOrder) return;
    recordInspection(selectedOrder.id, failed, 'STF-001', inspectionNote);
    setInspectionNote('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1450px] mx-auto pb-20">
      <main className="max-w-[1450px] mx-auto px-10 pt-8 space-y-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 mt-4">
          <div>
            <h1 className="text-[28px] font-black text-slate-900 tracking-tight flex items-center gap-3">
              Orders
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Precision management of bespoke tailoring lifecycles.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 shadow-inner">
                <button
                  onClick={() => setActiveView('table')}
                  className={`p-2 rounded-lg transition-all ${activeView === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  <LayoutList size={18} />
                </button>
                <button
                  onClick={() => setActiveView('kanban')}
                  className={`p-2 rounded-lg transition-all ${activeView === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                >
                  <KanbanSquare size={18} />
                </button>
             </div>
             <button 
               onClick={() => setIsCreateModalOpen(true)}
               className="h-10 px-5 bg-slate-900 text-white rounded-full flex items-center gap-2 text-[12px] font-bold hover:bg-indigo-600 transition-all shadow-md active:scale-95"
             >
               <Plus size={16} /> New Order
             </button>
          </div>
        </div>
        
        {/* KPI STATS GRID */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Orders', val: jobOrders.length, status: 'Active Pool', color: '#1E3A1F' },
            { label: 'In Tailoring', val: jobOrders.filter(o => { const s = resolveOrderState(o).productionStage; return s === 'IN_PRODUCTION' || s === 'ALTERATIONS'; }).length, status: 'Workshop', color: '#C9A84C' },
            { label: 'Ready for Release', val: jobOrders.filter(o => resolveOrderState(o).productionStage === 'READY_FOR_RELEASE').length, status: 'Storefront', color: '#2D5016' },
            { label: 'At Risk / Revision', val: jobOrders.filter(o => resolveOrderState(o).isAtRisk).length, status: 'Action Needed', color: '#DC2626' },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: stat.color }} />
              </div>
              <div className="text-[24px] font-black text-slate-900 tracking-tight">{stat.val}</div>
              <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-60">{stat.status}</div>
            </div>
          ))}
        </div>

        {/* MASTER CONTAINER */}
        <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden flex flex-col">
          {/* INTEGRATED HEADER: SEARCH & TABS */}
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between gap-8 shrink-0">
            {/* SEARCH (LEFT) */}
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, customers..." 
                className="h-10 w-full pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-[13px] font-bold outline-none focus:border-slate-900 transition-all shadow-sm"
              />
            </div>

            {/* TABS (RIGHT) */}
            <div className="flex items-center gap-1.5 bg-slate-200/50 p-1 rounded-xl w-fit border border-slate-200/60 shadow-inner">
              {[
                { id: 'All', label: 'All Orders' },
                { id: 'IN_PRODUCTION', label: 'In Workshop' },
                { id: 'READY_FOR_FITTING', label: 'Quality Control' },
                { id: 'ALTERATIONS', label: 'Revisions' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-6 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${statusFilter === tab.id ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' : 'text-slate-400 hover:text-slate-600 hover:bg-white/40'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className={activeView === 'kanban' ? "p-8 overflow-x-auto bg-slate-50/30" : ""}>
            {activeView === 'table' ? (
              <>
                <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                    <th className="px-10 py-5">Order Reference</th>
                    <th className="px-10 py-5">Production Track</th>
                    <th className="px-10 py-5">Garment Description</th>
                    <th className="px-10 py-5">Current Stage</th>
                    <th className="px-10 py-5 text-right pr-12">Commercial Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredOrders.map((order) => {
                    const engine = resolveOrderState(order);
                    const { productionStage, balance } = engine;
                    return (
                      <tr 
                        key={order.id} 
                        className="hover:bg-slate-50/50 transition-all group cursor-pointer"
                        onClick={() => {
                          setSelectedOrder(order);
                          setReleaseChecklist({ fitting: false, packaging: false });
                          setPaymentAmount(resolveOrderState(order).balance);
                          setIsModalOpen(true);
                        }}
                      >
                        <td className="px-10 py-6">
                          <div className="text-[14px] font-bold text-slate-900 tracking-tight">#{order.id}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                            {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'May 10, 2026'}
                          </div>
                        </td>
                        <td className="px-10 py-6">
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 px-3 py-1 rounded-lg bg-slate-50">
                            {order.order_type === 'BESPOKE' ? 'Bespoke Workshop' : order.order_type === 'BULK' ? 'Bulk Production' : 'Alteration Hub'}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-[15px] font-bold text-slate-900 font-sans">
                          {order.order_type === 'ALTERATION' 
                             ? order.alteration_details?.item_description || 'Repair Item'
                             : order.items?.[0]?.garment_name || 'Custom Garment'}
                        </td>
                        <td className="px-10 py-6">
                          <span className={`w-fit px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm ${getStatusColor(productionStage)}`}>
                            {getDisplayLabel(productionStage)}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right pr-12">
                          <div className="text-[16px] font-black text-slate-900">₱{order.total_amount.toLocaleString()}</div>
                          <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {balance > 0 ? `₱${balance.toLocaleString()} Due` : 'Paid in Full'}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="text-[12px] font-medium text-slate-500">
              Showing {filteredOrders.length > 0 ? 1 : 0} to {Math.min(8, filteredOrders.length)} of {filteredOrders.length} orders
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-[12px] font-bold bg-white text-slate-400 cursor-not-allowed">
                Previous
              </button>
              <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-[12px] font-bold bg-white text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-10 custom-scrollbar min-h-[600px]">
          {STATUS_TABS.filter(s => s !== 'All').map((stage, i) => {
            const stageOrders = jobOrders.filter((o) => resolveOrderState(o).productionStage === stage);
            return (
              <div key={i} className="flex flex-col gap-4 min-w-[320px] w-[320px]">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
                    <h3 className="text-[15px] font-black text-slate-900 tracking-tight">{getDisplayLabel(stage as ProductionStage)}</h3>
                  </div>
                  <span className="bg-slate-100 text-slate-400 px-2.5 py-0.5 rounded-full text-[11px] font-black">
                    {stageOrders.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {stageOrders.map((order) => {
                    const { paymentStatus } = resolveOrderState(order);
                    return (
                      <div
                        key={order.id}
                        className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer"
                        onClick={() => {
                          setSelectedOrder(order);
                          setReleaseChecklist({ fitting: false, packaging: false });
                          setPaymentAmount(resolveOrderState(order).balance);
                          setIsModalOpen(true);
                        }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {order.id}
                          </span>
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full ${getPriorityColor(
                              order.priority
                            )}`}
                          >
                            {order.priority}
                          </span>
                        </div>
                        <h4 className="text-[14px] font-bold text-slate-900 leading-tight mb-1 flex flex-col gap-1.5">
                          <span>{order.items?.[0]?.garment_name || 'Custom Garment'}</span>
                          {order.inspection_failed && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const lastInspection = orderInspections.filter(i => i.job_order_id === order.id && !i.passed).at(-1);
                                setFeedbackContent(lastInspection?.notes || 'No specific feedback provided.');
                                setIsFeedbackModalOpen(true);
                              }}
                              className="w-fit px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-wider bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-all flex items-center gap-1.5 mt-1"
                            >
                              <MessageCircle size={10} /> REVISION: Check Feedback
                            </button>
                          )}
                          {order.actual_production_cost && order.actual_production_cost > ((order.total_bom_cost || 0) + (order.total_labor_cost || 0)) ? (
                            <span className="w-max px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-50 border border-amber-200 text-amber-700 flex items-center gap-1">
                              <AlertTriangle size={10} /> PROFIT WARNING
                            </span>
                          ) : null}
                        </h4>
                        <p className="text-[12px] text-slate-500 font-medium mb-4">{customers.find(c => c.id === order.customer_id)?.name || 'Unknown'}</p>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                            <CreditCard size={14} />
                            {getDisplayLabel(paymentStatus)}
                          </div>
                          <div className="w-7 h-7 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[9px] font-black text-slate-500">
                            {(staff.find(s => s.id === order.assigned_staff_id)?.name || 'U').charAt(0)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
          </div>
        </div>
      </main>

      {/* ORDER DETAILS MODAL */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-[#1C1917]/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[1200px] h-[90vh] rounded-[48px] shadow-2xl border border-[#E2DDD7] overflow-hidden animate-in zoom-in-95 duration-500 flex">
            <div className="w-[420px] border-r border-[#F0EDE8] flex flex-col bg-[#FAF8F5]">
              <div className="p-8 border-b border-slate-100 bg-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Order Lifecycle
                  </div>
                  <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-widest">
                    {selectedOrder.id}
                  </div>
                </div>

                {/* STEPPER UI */}
                <div className="relative mt-4 px-2">
                  {/* Background Line */}
                  <div className="absolute top-5 left-10 right-10 h-[2px] bg-[#E2DDD7] z-0" />
                  
                  <div className="relative flex items-start justify-between">
                    {(() => {
                      const engine = resolveOrderState(selectedOrder);
                      const steps = [
                        { id: 'pay', label: 'Payment', done: engine.paymentStatus !== 'UNPAID', active: engine.paymentStatus === 'PARTIAL' },
                        { id: 'prod', label: 'Workshop', done: engine.progress === 100, active: engine.paymentStatus !== 'UNPAID' && engine.progress < 100 },
                        { id: 'qual', label: 'QC', done: !!selectedOrder.inspection_passed, active: engine.canBeInspected && !selectedOrder.inspection_passed && !selectedOrder.inspection_failed },
                        { id: 'done', label: 'Store', done: !!selectedOrder.inspection_passed && engine.isFullyPaid, active: !!selectedOrder.inspection_passed && !engine.isFullyPaid }
                      ];

                      return steps.map((step, idx) => (
                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-3 w-[64px]">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 bg-white ${
                            step.done ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/20' :
                            step.active ? 'border-indigo-600 text-slate-900 bg-[#FAF8F5]' :
                            'border-[#E2DDD7] text-[#78716C]'
                          }`}>
                            {step.done ? <CheckCircle2 size={20} /> : <span className="text-[14px] font-bold">{idx + 1}</span>}
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-[0.05em] text-center leading-tight ${
                            step.done ? 'text-slate-900' :
                            step.active ? 'text-white' :
                            'text-[#78716C]'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              <div className="p-8 border-b border-[#F0EDE8]">
                <h2 className="text-[26px] font-bold font-sans text-[#1C1917] leading-tight mb-3">
                  {selectedOrder.items?.[0]?.garment_name || 'Custom Garment'}
                </h2>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(
                        resolveOrderState(selectedOrder).productionStage
                      )}`}
                    >
                      {getDisplayLabel(resolveOrderState(selectedOrder).productionStage)}
                    </span>
                  </div>
                  <div className="text-[12px] text-[#78716C] font-bold bg-[#FAF8F5] px-4 py-3 rounded-2xl border border-[#E2DDD7]/50 italic">
                    “{getStageExplanation(resolveOrderState(selectedOrder).productionStage)}”
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6 overflow-y-auto">
                <div className="space-y-3">
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Customer Information
                  </div>
                  {(() => {
                    const customer = customers.find(c => c.id === selectedOrder.customer_id);
                    return (
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black shadow-lg shadow-slate-900/20">
                            {customer?.name.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="text-[14px] font-bold text-slate-900">{customer?.name || 'Unknown'}</div>
                            <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{customer?.id}</div>
                          </div>
                        </div>
                        <div className="space-y-1.5 pt-2">
                          <div className="flex items-center gap-2 text-[12px] text-slate-600">
                             <CreditCard size={14} className="text-slate-400"/>
                             <span className="font-bold">{customer?.phone || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="space-y-4 pt-2">
                  <div className="text-[11px] font-bold text-[#78716C] uppercase tracking-[0.1em] ml-1">
                    Workshopedger Snapshot
                  </div>
                  <div className="bg-white border border-[#E2DDD7] rounded-[24px] p-6 space-y-4 shadow-sm">
                    <div className="flex justify-between text-[14px]">
                      <span className="text-[#78716C] font-medium">Bespoke Contract Value</span>
                      <span className="text-[#1C1917] font-bold">
                        ₱{selectedOrder.total_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[14px]">
                       <span className="text-[#78716C] font-medium">Recorded Remittance</span>
                       <span className="text-slate-900 font-bold">
                         ₱{(selectedOrder.amount_paid ?? 0).toLocaleString()}
                       </span>
                     </div>
                    <div className="h-px bg-[#F0EDE8]" />
                    <div className="flex justify-between text-[15px]">
                      <span className="text-[#78716C] font-bold">Outstanding Balance</span>
                      <span
                        className={
                          resolveOrderState(selectedOrder).balance > 0 ? 'text-rose-600 font-bold' : 'text-slate-900 font-bold'
                        }
                      >
                        ₱{resolveOrderState(selectedOrder).balance.toLocaleString()}
                      </span>
                    </div>
                    <div className={`text-center py-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] border shadow-inner ${
                      resolveOrderState(selectedOrder).paymentStatus === 'PAID_FULL' 
                        ? 'bg-slate-900/5 text-slate-900 border-slate-900/10'
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {getDisplayLabel(resolveOrderState(selectedOrder).paymentStatus)}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Deadlines
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Calendar size={18} className="text-slate-400" />
                    <span className="text-[14px] font-bold">
                      {new Date(selectedOrder.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock size={18} className="text-slate-400" />
                    <span className="text-[14px] font-medium text-rose-500 italic">12 days remaining</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-white">
              <div className="h-20 px-10 border-b border-[#E2DDD7] flex items-center justify-between">
                <div className="flex gap-10 h-full">
                  {([
                    { id: 'jobs', label: 'Artisan Workflow', icon: <ClipboardList size={18} /> },
                    { id: 'measurements', label: 'Bespoke Specs', icon: <User size={18} /> },
                    { id: 'timeline', label: 'Workshop History', icon: <History size={18} /> },
                    { id: 'discrepancies', label: 'Resource Variance', icon: <AlertTriangle size={18} /> },
                  ] as { id: DetailTab; label: string; icon: React.ReactNode }[]).map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setDetailTab(tab.id)}
                      className={`h-full flex items-center gap-3 text-[14px] font-bold border-b-2 transition-all ${
                        detailTab === tab.id
                          ? 'border-slate-900 text-slate-900'
                          : 'border-transparent text-[#78716C] hover:text-slate-900'
                      }`}
                    >
                      <span className={detailTab === tab.id ? 'text-white' : ''}>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={closeDetailModal}
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#F0EDE8] rounded-xl text-[#78716C] transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 p-8 overflow-y-auto space-y-6">

                {/* ── TAB: PRODUCTION JOBS ── */}
                {detailTab === 'jobs' && (
                  <>
                    {/* Fabric & Swatch Section */}
                    {(selectedOrder.fabric_name || (selectedOrder.swatch_images && selectedOrder.swatch_images.length > 0)) && (
                      <div className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Scissors size={16} className="text-indigo-600" /> Fabric & Swatch Detail
                          </h3>
                          {selectedOrder.is_customer_provided_fabric && (
                            <span className="text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-2 py-1 rounded-md border border-amber-200">
                              CMT (Customer Provided Fabric)
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div>
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fabric Name</div>
                              <div className="text-[14px] font-bold text-slate-900">{selectedOrder.fabric_name || 'Not Specified'}</div>
                            </div>
                            <div>
                              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Width</div>
                              <div className="text-[14px] font-bold text-slate-900">{selectedOrder.fabric_width ? `${selectedOrder.fabric_width}"` : 'Standard (60")'}</div>
                            </div>
                          </div>
                          
                          {selectedOrder.swatch_images && selectedOrder.swatch_images.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                              {selectedOrder.swatch_images.map((img, idx) => (
                                <div key={idx} className="aspect-square rounded-lg border border-slate-200 overflow-hidden shadow-sm bg-white cursor-pointer hover:scale-105 transition-transform" onClick={() => window.open(img, '_blank')}>
                                  <Image 
                                    src={img} 
                                    alt={`Swatch ${idx + 1}`} 
                                    width={200}
                                    height={200}
                                    unoptimized
                                    className="w-full h-full object-cover" 
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Tailoring Workflow</h3>
                      <div className="text-[12px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                        {resolveOrderState(selectedOrder).taskStats.label} ({resolveOrderState(selectedOrder).progress}%)
                      </div>
                      <button
                        onClick={() => setIsAllocationModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-200 h-9 px-4 rounded-xl text-[12px] font-black hover:bg-indigo-100 transition-all shadow-sm active:scale-95"
                      >
                        <PackageOpen size={16} /> Allocate Materials
                      </button>
                    </div>
                    {(resolveOrderState(selectedOrder).productionStage === 'ON_HOLD' || resolveOrderState(selectedOrder).productionStage === 'WAITING_FOR_DP') && (
                      <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                        <div>
                          <h4 className="text-[12px] font-black text-amber-800 uppercase tracking-widest">Production Locked</h4>
                          <p className="text-[13px] text-amber-700 font-medium">This order cannot enter the cutting phase until an initial downpayment is recorded in the financials tab.</p>
                        </div>
                      </div>
                    )}
                    <div className="space-y-3">
                       {(selectedOrder.tasks || []).map((task) => {
                        const stage = resolveOrderState(selectedOrder).productionStage;
                        const isLocked = stage === 'ON_HOLD' || stage === 'WAITING_FOR_DP';
                        return (
                          <div 
                            key={task.id} 
                            className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${ 
                              task.status === 'Completed' ? 'bg-slate-50/50 border-slate-100' : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm' 
                            } ${isLocked ? 'opacity-60 grayscale' : ''}`}
                          >
                            <div className="flex items-center gap-4">
                              <button 
                                onClick={() => !isLocked && updateTaskStatus(selectedOrder.id, task.id, task.status === 'Completed' ? 'Pending' : 'Completed')}
                                disabled={isLocked}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${ 
                                  task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200' 
                                } ${isLocked ? 'cursor-not-allowed' : ''}`}
                              >
                                {task.status === 'Completed' ? <Check size={20} /> : <Scissors size={20} />}
                              </button>
                              <div>
                                <div className={`text-[14px] font-bold ${ task.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-900' }`}>
                                  {task.title}
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                  <div className="text-[11px] text-slate-400 font-medium">
                                    Assignee: <span className="font-bold text-slate-600">{staff.find(s => s.id === task.assigned_staff_id)?.name || 'Unassigned'}</span>
                                  </div>
                                  <div className="text-[11px] text-slate-400 font-medium border-l border-slate-200 pl-3">
                                    Status: <span className={`font-bold ${task.status === 'In Progress' ? 'text-indigo-600' : task.status === 'For Revision' ? 'text-rose-600' : 'text-slate-600'}`}>{task.status}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <select 
                              value={task.status}
                              onChange={(e) => updateTaskStatus(selectedOrder.id, task.id, e.target.value as ProductionTask['status'])}
                              disabled={isLocked}
                              className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg outline-none border transition-all ${ 
                                task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                task.status === 'In Progress' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 animate-pulse' : 
                              task.status === 'Delayed' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                              task.status === 'For Revision' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                              'bg-white text-slate-400 border-slate-200' 
                            } ${isLocked ? 'cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400' : ''}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Assigned">Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Delayed">Delayed</option>
                            <option value="For Revision">For Revision</option>
                          </select>
                          </div>
                        );
                      })}
                    </div>
                    {resolveOrderState(selectedOrder).productionStage === 'ALTERATIONS' && (
                      <button
                        onClick={() => {
                          const title = window.prompt('Enter alteration/rework task details:');
                          if (title) {
                            addProductionTask(selectedOrder.id, `Rework: ${title}`, selectedOrder.assigned_staff_id || 'STF-001');
                            pushNotification('Order returned to production for rework.', 'success');
                          }
                        }}
                        className="w-full mt-4 p-3 border border-dashed border-slate-300 bg-white rounded-xl text-slate-500 font-bold text-[12px] hover:border-slate-400 hover:text-slate-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Return to Production (Add Rework Task)
                      </button>
                    )}
                  </>
                )}

                {/* ── TAB: MEASUREMENTS ── */}
                {detailTab === 'measurements' && (() => {
                  const profile = measurementProfiles.find(p => p.id === selectedOrder?.measurement_profile_id);
                  const unit = profile?.measurement_unit === 'Centimeters' ? 'cm' : '"';
                  
                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Measurement Profile</h3>
                        {profile && (
                          <span className="text-[11px] font-black bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg border border-indigo-100">
                            {profile.profile_name} ({profile.version_no})
                          </span>
                        )}
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Profile ID</span>
                          <span className="text-[13px] font-bold text-slate-900">{selectedOrder?.measurement_profile_id || 'N/A'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Garment</span>
                          <span className="text-[13px] font-bold text-slate-900">{selectedOrder?.items?.[0]?.garment_name || 'Custom Garment'}</span>
                        </div>
                        
                        {profile ? (
                          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                            {[
                              ['Neck', profile.jacket_neck || profile.neck],
                              ['Shoulder', profile.jacket_shoulder || profile.shoulder_width],
                              ['Chest', profile.jacket_chest || profile.chest],
                              ['Waist', profile.jacket_waist || profile.waist],
                              ['Hips', profile.jacket_hip || profile.hip],
                              ['Sleeve', profile.jacket_sleeve || profile.sleeve_length],
                            ].map(([label, val]) => (
                              <div key={label as string} className="text-center">
                                <div className="text-[11px] font-black text-slate-400 uppercase">{label as string}</div>
                                <div className="text-[18px] font-black text-slate-900 mt-1">
                                  {val ? `${val}${unit}` : '—'}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-8 text-center border-t border-slate-200">
                            <AlertTriangle className="mx-auto text-amber-500 mb-2" size={24} />
                            <p className="text-[13px] font-bold text-slate-500">No profile data linked to this order.</p>
                          </div>
                        )}
                        
                        {profile?.special_instructions && (
                          <div className="pt-4 border-t border-slate-200">
                            <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Special Instructions</div>
                            <p className="text-[12px] text-slate-600 font-medium italic">{profile.special_instructions}</p>
                          </div>
                        )}
                        
                        <p className="text-[11px] text-slate-400 italic pt-2">⚠ Measurements are snapshots taken at order creation to prevent production drift.</p>
                      </div>
                    </>
                  );
                })()}

                {/* ── TAB: ORDER TIMELINE (AUDIT TRAIL) ── */}
                {detailTab === 'timeline' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Order Timeline</h3>
                        <p className="text-[12px] font-medium text-slate-500">Chronological history of status changes and actions.</p>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{orderStatusLogs.length} Events</span>
                    </div>
                    <div className="relative mt-8">
                      <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />
                      <div className="space-y-8 pl-10">
                        {orderStatusLogs.length > 0 ? orderStatusLogs.sort((a,b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()).map((log) => (
                          <div key={log.id} className="relative group">
                            <div className="absolute -left-10 top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm bg-indigo-500 group-hover:scale-125 transition-transform" />
                            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-indigo-200 transition-all">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 uppercase tracking-tight">{log.previous_status || 'INIT'}</span>
                                  <ChevronRight size={12} className="text-slate-300" />
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 uppercase tracking-tight">{log.new_status}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-400">
                                  <Clock size={12} />
                                  <span className="text-[11px] font-bold">{new Date(log.changed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </div>
                              <p className="text-[14px] text-slate-800 font-bold leading-tight">{log.remarks}</p>
                              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                                    {log.changed_by.substring(0,2)}
                                  </div>
                                  <span className="text-[11px] text-slate-600 font-black">{log.changed_by === 'SYSTEM' ? 'Automated Action' : `Processed by ${log.changed_by}`}</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(log.changed_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-12 text-slate-400">
                            <History size={32} className="mx-auto mb-3 opacity-30" />
                            <p className="text-[13px] font-bold">No history recorded for this order.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* ── TAB: DISCREPANCIES ── */}
                {detailTab === 'discrepancies' && (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Production Issues & Adjustments</h3>
                        <p className="text-[12px] font-medium text-slate-500">Log material waste or unplanned extra labor costs.</p>
                      </div>
                      <button 
                        onClick={() => setIsDiscrepancyModalOpen(true)}
                        className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[12px] font-black hover:bg-slate-800 transition-all flex items-center gap-2"
                      >
                        <Plus size={14} /> Log Issue
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-4 rounded-xl border border-rose-100 bg-rose-50">
                        <div className="text-[10px] font-black text-rose-500 uppercase">Total Material Cost</div>
                        <div className="text-[20px] font-black text-rose-900 mt-1">₱{(selectedOrder.actual_bom_cost ?? selectedOrder.total_bom_cost ?? 0).toLocaleString()}</div>
                        {selectedOrder.actual_bom_cost && selectedOrder.actual_bom_cost > (selectedOrder.total_bom_cost ?? 0) && (
                          <div className="text-[11px] font-bold text-rose-600 mt-1">
                            (+₱{(selectedOrder.actual_bom_cost - (selectedOrder.total_bom_cost ?? 0)).toLocaleString()} overrun)
                          </div>
                        )}
                      </div>
                      <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50">
                        <div className="text-[10px] font-black text-indigo-500 uppercase">Total Labor & Rework Cost</div>
                        <div className="text-[20px] font-black text-indigo-900 mt-1">₱{(selectedOrder.actual_labor_cost ?? selectedOrder.total_labor_cost ?? 0).toLocaleString()}</div>
                        {selectedOrder.actual_labor_cost && selectedOrder.actual_labor_cost > (selectedOrder.total_labor_cost ?? 0) && (
                          <div className="text-[11px] font-bold text-indigo-600 mt-1">
                            (+₱{(selectedOrder.actual_labor_cost - (selectedOrder.total_labor_cost ?? 0)).toLocaleString()} overrun)
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {selectedOrder.discrepancies?.length && selectedOrder.discrepancies.length > 0 ? selectedOrder.discrepancies.map((d) => (
                        <div key={d.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${d.discrepancy_type === 'MATERIAL_WASTE' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            {d.discrepancy_type === 'MATERIAL_WASTE' ? <Scissors size={20} /> : <User size={20} />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-[14px] font-bold text-slate-900">{d.discrepancy_type === 'MATERIAL_WASTE' ? 'Extra Fabric Used' : 'Rework Labor'}</h4>
                              <span className="text-[14px] font-black text-slate-900">₱{d.financial_impact.toLocaleString()}</span>
                            </div>
                            <p className="text-[12px] font-medium text-slate-600 mt-1">{d.reason}</p>
                            <div className="flex items-center gap-4 mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              <span>Reported By: {d.reported_by_user_id}</span>
                              <span>•</span>
                              <span>{new Date(d.logged_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                          <CheckCircle2 size={32} className="mx-auto mb-3 opacity-30 text-emerald-500" />
                          <p className="text-[13px] font-bold">No issues logged.</p>
                          <p className="text-[11px] font-medium mt-1">Production is matching estimates perfectly.</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50/50 space-y-6">
                {/* TRANSACTIONAL ACTIONS */}
                {resolveOrderState(selectedOrder).productionStage === 'RELEASED' ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shadow-sm">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <h4 className="text-[16px] font-black text-slate-900 tracking-tight">Order Completed</h4>
                        <p className="text-[12px] font-medium text-slate-500">Garment successfully handed over.</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <button 
                        onClick={() => window.location.href = `sms:${customers.find(c => c.id === selectedOrder.customer_id)?.phone}`}
                        className="flex flex-col items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all shadow-sm group"
                      >
                        <MessageCircle size={18} className="text-slate-600 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-slate-800">Message</span>
                      </button>
                      <button 
                        onClick={() => window.location.href = `tel:${customers.find(c => c.id === selectedOrder.customer_id)?.phone}`}
                        className="flex flex-col items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all shadow-sm group"
                      >
                        <Phone size={18} className="text-slate-600 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-slate-800">Call</span>
                      </button>
                      <button 
                        onClick={handlePrint}
                        className="flex flex-col items-center gap-2 p-3 bg-slate-900 text-white border border-slate-800 rounded-xl hover:bg-slate-800 transition-all shadow-sm shadow-slate-900/20 group"
                      >
                        <Printer size={18} className="text-white group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-white">Print Receipt</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    {/* Payment Form */}
                    <div className="space-y-4 pr-6 border-r border-slate-100">
                      <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Receipt size={14}/> Record Payment
                      </div>
                      {resolveOrderState(selectedOrder).balance > 0 ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-3">
                            <div className="flex gap-2">
                              <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[13px]">₱</span>
                                  <input 
                                    type="number" 
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    placeholder="Amount to Pay" 
                                    className="h-11 w-full pl-7 pr-3 bg-white border border-slate-200 rounded-xl text-[15px] font-black outline-none focus:border-slate-900 transition-all shadow-sm"
                                  />
                                </div>
                              <select 
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="h-11 px-3 bg-white border border-slate-200 rounded-xl text-[12px] font-bold outline-none focus:border-indigo-500 transition-all shadow-sm cursor-pointer"
                              >
                                <option value="Cash">Cash</option>
                                <option value="GCash">GCash</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                              </select>
                            </div>

                            {paymentMethod === 'Cash' && (
                              <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2">
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[13px]">₱</span>
                                  <input 
                                    type="number" 
                                    value={cashReceived}
                                    onChange={(e) => setCashReceived(e.target.value)}
                                    placeholder="Cash Tendered" 
                                    className="h-11 w-full pl-7 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] font-black outline-none focus:border-indigo-500 transition-all shadow-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                  />
                                </div>
                                <div className="h-11 flex flex-col justify-center px-4 bg-slate-900 rounded-xl border border-slate-800 shadow-lg shadow-slate-900/10">
                                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Change</span>
                                  <span className="text-[15px] font-black text-indigo-400 tracking-tight leading-none truncate">
                                    ₱{Math.max(0, (parseFloat(cashReceived) || 0) - (parseFloat(String(paymentAmount)) || 0)).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {(paymentMethod === 'GCash' || paymentMethod === 'Bank Transfer') && (
                            <div className="flex flex-col gap-3">
                              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex gap-3 animate-in slide-in-from-top-2">
                                <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                  <div className="text-[11px] font-black text-amber-900 uppercase tracking-tight">Audit-Ready</div>
                                  <p className="text-[10px] text-amber-700 font-medium leading-tight">
                                    Digital payments require <b>Ref #</b> or <b>Receipt Photo</b> for auditing.
                                  </p>
                                </div>
                              </div>
                              <input 
                                type="text" 
                                value={paymentRef}
                                onChange={(e) => setPaymentRef(e.target.value)}
                                placeholder="Ref Number (Optional)" 
                                className="h-10 w-full px-3 bg-white border border-slate-200 rounded-xl text-[12px] font-medium outline-none focus:border-indigo-500 transition-all shadow-sm" 
                              />
                              <div className="relative">
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onloadend = () => setPaymentImage(reader.result as string);
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="h-10 border border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 bg-white text-[11px] font-bold text-slate-500">
                                  {paymentImage ? 'Receipt Attached ✓' : 'Upload Receipt Photo'}
                                </div>
                              </div>
                            </div>
                          )}

                          <button 
                            onClick={handlePayment}
                            disabled={!paymentAmount || parseFloat(String(paymentAmount)) <= 0}
                            className="w-full h-11 bg-slate-900 text-white rounded-xl text-[13px] font-black hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all shadow-md shadow-slate-900/10 active:scale-95"
                          >
                            Post Payment
                          </button>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100 border-dashed">
                          <CheckCircle2 size={32} className="text-emerald-500 mb-2" />
                          <div className="text-[13px] font-black text-emerald-700">Order Fully Paid</div>
                          <div className="text-[11px] text-emerald-600/70 font-medium">No balance remaining</div>
                        </div>
                      )}
                    </div>

                    {resolveOrderState(selectedOrder).productionStage === 'READY_FOR_RELEASE' ? (
                      <div className="space-y-4">
                        <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Package size={14}/> Handover Checklist
                        </div>
                        <div className="bg-white rounded-xl border border-indigo-100 overflow-hidden divide-y divide-slate-50 shadow-sm">
                          <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 transition-colors">
                            <input 
                              type="checkbox" 
                              checked={releaseChecklist.fitting}
                              onChange={(e) => setReleaseChecklist(p => ({ ...p, fitting: e.target.checked }))}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                            />
                            <div>
                              <div className="text-[12px] font-bold text-slate-900">Final Fitting Approved</div>
                              <div className="text-[10px] text-slate-500">Customer accepted the fit.</div>
                            </div>
                          </label>
                          <label className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 transition-colors">
                            <input 
                              type="checkbox" 
                              checked={releaseChecklist.packaging}
                              onChange={(e) => setReleaseChecklist(p => ({ ...p, packaging: e.target.checked }))}
                              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                            />
                            <div>
                              <div className="text-[12px] font-bold text-slate-900">Packaging Included</div>
                              <div className="text-[10px] text-slate-500">Garment properly packed.</div>
                            </div>
                          </label>
                        </div>

                        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                          {resolveOrderState(selectedOrder).balance > 0 ? (
                            <button 
                              disabled
                              className="w-full h-11 bg-slate-100 text-slate-400 rounded-xl text-[12px] font-black cursor-not-allowed border border-slate-200 flex items-center justify-center gap-2"
                            >
                              <Lock size={14} /> Final Payment Required
                            </button>
                          ) : (
                            <button 
                              disabled={!releaseChecklist.fitting}
                              onClick={() => {
                                // 1. Finalize Inventory (Convert reservation to deduction)
                                const reservations = inventoryReservations.filter(r => r.job_order_id === selectedOrder.id && r.status !== 'RELEASED');
                                reservations.forEach(res => {
                                  releaseStock(res.id, res.qty_reserved);
                                });

                                // 2. Finalize Status
                                updateOrderStatus(selectedOrder.id, 'RELEASED');
                                setIsModalOpen(false);
                                pushNotification('Garment released and inventory updated.', 'success');
                              }}
                              className="w-full h-11 bg-indigo-600 text-white rounded-xl text-[12px] font-black hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 size={16} /> Release Garment
                            </button>
                          )}
                          <button 
                            onClick={() => {
                               updateOrderStatus(selectedOrder.id, 'ALTERATIONS');
                               setIsModalOpen(false);
                               pushNotification('Order sent back for rework.', 'warning');
                            }}
                            className="w-full py-2 bg-white text-rose-600 rounded-xl text-[11px] font-black hover:bg-rose-50 transition-colors"
                          >
                            Send to Rework
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col h-full">
                        <div className={`space-y-3 pt-2 ${!resolveOrderState(selectedOrder).canBeInspected ? 'opacity-40 cursor-not-allowed' : ''}`}>
                          <div className="flex items-center justify-between">
                            <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <ShieldCheck size={14}/> Quality Check
                            </div>
                            {!resolveOrderState(selectedOrder).canBeInspected && (
                              <span className="text-[9px] font-black bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded border border-amber-100 flex items-center gap-1">
                                <Clock size={10} /> TASKS PENDING
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => resolveOrderState(selectedOrder).canBeInspected && handleInspection(false)}
                              disabled={!resolveOrderState(selectedOrder).canBeInspected}
                              className={`h-11 flex-1 bg-white border border-slate-200 text-emerald-600 rounded-xl text-[12px] font-black transition-all shadow-sm flex items-center justify-center gap-2 ${
                                resolveOrderState(selectedOrder).canBeInspected ? 'hover:bg-emerald-50' : 'cursor-not-allowed'
                              }`}
                            >
                              <CheckCircle2 size={16}/> PASS
                            </button>
                            <button 
                              onClick={() => resolveOrderState(selectedOrder).canBeInspected && handleInspection(true)}
                              disabled={!resolveOrderState(selectedOrder).canBeInspected}
                              className={`h-11 flex-1 bg-white border border-slate-200 text-rose-600 rounded-xl text-[12px] font-black transition-all shadow-sm flex items-center justify-center gap-2 ${
                                resolveOrderState(selectedOrder).canBeInspected ? 'hover:bg-rose-50' : 'cursor-not-allowed'
                              }`}
                            >
                              <AlertTriangle size={16}/> FAIL
                            </button>
                          </div>
                        </div>
                        {/* Inspection Notes */}
                        <div className="mt-auto pt-4">
                          <input 
                            type="text" 
                            value={inspectionNote}
                            onChange={(e) => setInspectionNote(e.target.value)}
                            placeholder="Inspection remarks / revision notes..." 
                            className="h-10 w-full px-4 bg-white/50 border border-slate-100 rounded-xl text-[12px] font-medium italic outline-none focus:bg-white focus:border-slate-200 transition-all"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* PRINTABLE SALES ORDER RECEIPT */}
      {selectedOrder && (
        <>
          <style>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #printable-receipt, #printable-receipt * {
                visibility: visible;
              }
              #printable-receipt {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                margin: 0;
                padding: 20px;
                background: white;
              }
              @page { margin: 0; }
            }
          `}</style>
          <div id="printable-receipt" className="hidden print:block w-full bg-white text-black font-sans">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-tight">Davao Tailoring Shop</h1>
                <p className="text-sm font-medium mt-1">123 Fashion Blvd, Manila</p>
                <p className="text-sm font-medium">contact@sutura.com | (02) 1234-5678</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-black uppercase tracking-widest text-gray-500">Sales Order</h2>
                <div className="mt-4 flex flex-col gap-1 text-sm font-medium">
                  <div className="flex justify-between gap-8">
                    <span className="text-gray-500">Order No.</span>
                    <span className="font-bold">{selectedOrder.id}</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="text-gray-500">Date</span>
                    <span className="font-bold">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-xs font-bold uppercase text-gray-400 mb-2 border-b border-gray-200 pb-1">Billed To</h3>
              <p className="font-bold text-lg">{customers.find(c => c.id === selectedOrder.customer_id)?.name || 'Unknown'}</p>
              <p className="text-sm">{customers.find(c => c.id === selectedOrder.customer_id)?.phone || 'N/A'}</p>
            </div>

            <table className="w-full text-left border-collapse mb-12">
              <thead>
                <tr className="border-b-2 border-black text-sm uppercase tracking-wider">
                  <th className="py-3 font-bold">Qty</th>
                  <th className="py-3 font-bold">Description</th>
                  <th className="py-3 font-bold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-200">
                  <td className="py-4 font-medium">1</td>
                  <td className="py-4 font-bold">{selectedOrder.items?.[0]?.garment_name || 'Custom Garment'}</td>
                  <td className="py-4 text-right font-medium">₱{selectedOrder.total_amount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end mb-16">
              <div className="w-64">
                <div className="flex justify-between py-2 border-b border-gray-200 text-sm">
                  <span className="font-bold text-gray-500">Subtotal</span>
                  <span className="font-bold">₱{selectedOrder.total_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 text-sm">
                  <span className="font-bold text-gray-500">Amount Paid</span>
                  <span className="font-bold">₱{(selectedOrder.amount_paid || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-3 text-lg">
                  <span className="font-black uppercase">Total Due</span>
                  <span className="font-black">₱{resolveOrderState(selectedOrder).balance.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end mt-24 pt-8 border-t border-gray-200">
              <div className="w-64">
                <div className="border-b border-black mb-2"></div>
                <p className="text-xs font-bold text-center text-gray-500 uppercase">Authorized Signature</p>
              </div>
              <div className="w-64">
                <div className="border-b border-black mb-2"></div>
                <p className="text-xs font-bold text-center text-gray-500 uppercase">Customer Signature</p>
              </div>
            </div>
            
            <div className="mt-12 text-center text-xs text-gray-500">
              <p>Thank you for your business. All custom garments are final sale.</p>
            </div>
          </div>
        </>
      )}
      {/* CREATE ORDER MODAL */}
      <CreateOrderModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      {/* DISCREPANCY MODAL */}
      {isDiscrepancyModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[32px] w-[500px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h2 className="text-[18px] font-black text-slate-900">Log Production Issue</h2>
                  <p className="text-[12px] font-medium text-slate-500">Record overruns or wasted materials.</p>
                </div>
              </div>
              <button onClick={() => setIsDiscrepancyModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Type</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setDiscType('MATERIAL_WASTE')}
                    className={`flex-1 py-3 px-4 rounded-xl text-[12px] font-bold border transition-all ${discType === 'MATERIAL_WASTE' ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  >
                    Extra Fabric/Material
                  </button>
                  <button 
                    onClick={() => setDiscType('EXTRA_LABOR')}
                    className={`flex-1 py-3 px-4 rounded-xl text-[12px] font-bold border transition-all ${discType === 'EXTRA_LABOR' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  >
                    Rework Labor
                  </button>
                </div>
              </div>

              {discType === 'MATERIAL_WASTE' && (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Material Used</label>
                    <select 
                      value={discItemId} 
                      onChange={(e) => setDiscItemId(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 text-[13px] font-bold outline-none bg-white focus:border-slate-400"
                    >
                      <option value="">Select Material...</option>
                      {inventory.filter(i => i.item_type !== 'FINISHED_GOOD').map(i => (
                        <option key={i.id} value={i.id}>{i.item_name} (₱{i.unit_cost}/{i.unit_of_measure})</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Extra Quantity Needed</label>
                    <input 
                      type="number" 
                      value={discQty} 
                      onChange={(e) => setDiscQty(e.target.value)}
                      placeholder="e.g. 1.5"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 text-[13px] font-bold outline-none bg-white focus:border-slate-400"
                    />
                  </div>
                </>
              )}

              {discType === 'EXTRA_LABOR' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Extra Tailor Fee (₱)</label>
                  <input 
                    type="number" 
                    value={discAmount} 
                    onChange={(e) => setDiscAmount(e.target.value)}
                    placeholder="e.g. 250"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 text-[13px] font-bold outline-none bg-white focus:border-slate-400"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Reason / Notes</label>
                <textarea 
                  value={discReason} 
                  onChange={(e) => setDiscReason(e.target.value)}
                  placeholder={discType === 'MATERIAL_WASTE' ? "e.g. Tailor cut the sleeve incorrectly." : "e.g. Customer requested a tighter fit during fitting."}
                  className="w-full h-24 p-4 rounded-xl border border-slate-200 text-[13px] font-medium outline-none bg-white focus:border-slate-400 resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button 
                onClick={() => setIsDiscrepancyModalOpen(false)}
                className="flex-1 py-3 bg-white text-slate-600 rounded-xl text-[13px] font-black border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  let impact = 0;
                  if (discType === 'MATERIAL_WASTE') {
                    const item = inventory.find(i => i.id === discItemId);
                    if (item && discQty) impact = (item.unit_cost || 0) * parseFloat(discQty);
                  } else {
                    impact = parseFloat(discAmount) || 0;
                  }
                  
                  logProductionDiscrepancy({
                    job_order_id: selectedOrder.id,
                    reported_by_user_id: 'STAFF-001',
                    discrepancy_type: discType,
                    inventory_item_id: discItemId || undefined,
                    qty_wasted: parseFloat(discQty) || undefined,
                    financial_impact: impact,
                    reason: discReason
                  });
                  
                  pushNotification('Issue logged successfully.', 'success');
                  setIsDiscrepancyModalOpen(false);
                  setDiscReason('');
                  setDiscQty('');
                  setDiscAmount('');
                }}
                disabled={!discReason || (discType === 'MATERIAL_WASTE' ? (!discItemId || !discQty) : !discAmount)}
                className="flex-2 py-3 bg-slate-900 text-white rounded-xl text-[13px] font-black hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-colors"
              >
                Log Issue
              </button>
            </div>
          </div>
        </div>
      )}

      <AllocateMaterialsModal 
        isOpen={isAllocationModalOpen}
        onClose={() => setIsAllocationModalOpen(false)}
        order={selectedOrder ? {
          id: selectedOrder.id,
          garment: selectedOrder.items?.[0]?.garment_name || 'Custom Garment',
          customer: customers.find(c => c.id === selectedOrder.customer_id)?.name || 'Unknown',
          due: selectedOrder.due_date
        } : null}
      />

      {/* CHECK FEEDBACK MODAL */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-[32px] w-full max-w-[450px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-rose-50/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h2 className="text-[18px] font-black text-slate-900">Revision Feedback</h2>
                  <p className="text-[12px] font-medium text-slate-500">Quality Check Remarks</p>
                </div>
              </div>
              <button 
                onClick={() => setIsFeedbackModalOpen(false)} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-8">
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-rose-100 rounded-full" />
                <div className="space-y-4">
                  <div className="text-[11px] font-black text-rose-600 uppercase tracking-widest">Feedback from Inspector</div>
                  <p className="text-[15px] text-slate-700 font-bold leading-relaxed italic">
                    &quot;{feedbackContent}&quot;
                  </p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 text-slate-500">
                  <Clock size={14} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Awaiting Alterations</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
              <button 
                onClick={() => setIsFeedbackModalOpen(false)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[13px] font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98]"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
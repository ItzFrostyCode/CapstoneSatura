'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useERPStore, JobOrder } from '../../store/useERPStore';
import { resolveOrderState, getDisplayLabel, getStageExplanation, ProductionStage, ProductionTask } from '../../logic/orderEngine';
import {
  Search,
  Plus,
  LayoutList,
  KanbanSquare,
  Clock,
  CheckCircle2,
  ChevronRight,
  X,
  Scissors,
  Calendar,
  Filter,
  MoreVertical,
  ClipboardList,
  Zap,
  ShieldCheck,
  Package,
  History,
  User,
  CreditCard,
  AlertTriangle,
  Receipt,
  Check,
  ChevronDown,
  Activity,
  Phone,
  MessageCircle,
  Printer
} from 'lucide-react';

type OrderStatus = 'All' | 'Pending' | 'Cutting' | 'Sewing' | 'Inspection' | 'Ready' | 'Delivered' | 'Cancelled';
type DetailTab = 'jobs' | 'measurements' | 'tasks' | 'status-log';

const kanbanStages = ['Pending', 'Cutting', 'Sewing', 'Inspection', 'Ready', 'Delivered'];

function getStatusColor(status: string) {
  switch (status) {
    case 'ON_HOLD':
      return 'bg-slate-50 text-slate-600 border-slate-200';
    case 'IN_PRODUCTION':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'QUALITY_CHECK':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'REVISION_REQUIRED':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'Ready': // Legacy support
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Delivered': // Legacy support
      return 'bg-slate-100 text-slate-700 border-slate-200';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200';
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'High':
      return 'bg-rose-50 text-rose-600';
    case 'Medium':
      return 'bg-amber-50 text-amber-700';
    case 'Low':
      return 'bg-emerald-50 text-emerald-700';
    default:
      return 'bg-slate-50 text-slate-600';
  }
}

export default function JobOrdersPage() {
  const { 
    orders: jobOrders, 
    orderStatusLogs: globalLogs, 
    customers,
    recordPayment,
    recordInspection,
    updateTaskStatus
  } = useERPStore();
  
  const [activeView, setActiveView] = useState<'table' | 'kanban'>('table');
  const [selectedOrder, setSelectedOrder] = useState<JobOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [detailTab, setDetailTab] = useState<DetailTab>('jobs');

  // Transaction Inputs for the modal
  const [paymentAmount, setPaymentAmount] = useState<string | number>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Cash');
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [paymentImage, setPaymentImage] = useState<string | null>(null);
  const [cashReceived, setCashReceived] = useState<string>('');
  const [inspectionNote, setInspectionNote] = useState<string>('');

  const STATUS_TABS = ['All', 'ON_HOLD', 'IN_PRODUCTION', 'QUALITY_CHECK', 'REVISION_REQUIRED'];

  const filteredOrders = statusFilter === 'All'
    ? jobOrders
    : jobOrders.filter(o => {
        const { productionStage } = resolveOrderState(o);
        return productionStage === statusFilter;
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
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">Job Orders</h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">Manage production cycles and delivery schedules.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setActiveView('table')}
              className={`p-2 rounded-lg transition-all ${
                activeView === 'table'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              <LayoutList size={18} />
            </button>
            <button
              onClick={() => setActiveView('kanban')}
              className={`p-2 rounded-lg transition-all ${
                activeView === 'kanban'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-400 hover:text-slate-900'
              }`}
            >
              <KanbanSquare size={18} />
            </button>
          </div>

          <Link href="/owner/orders/new" className="h-10 px-4 bg-slate-900 text-white rounded-xl flex items-center gap-2 text-[13px] font-bold hover:bg-indigo-600 transition-all shadow-sm">
            <Plus size={16} />
            New Order
          </Link>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', val: '2,401', trend: '+12%' },
          { label: 'In Production', val: '1,701', trend: 'Active' },
          { label: 'Ready / Completed', val: '1,405', trend: '+5%' },
          { label: 'Cancelled / Void', val: '99', trend: '-2%' },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[12px] font-bold text-slate-500">{stat.label}</span>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  stat.trend.startsWith('+')
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-slate-50 text-slate-500'
                }`}
              >
                {stat.trend}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-[28px] font-black text-slate-900 tracking-tight">{stat.val}</div>
              <div className="text-[11px] text-slate-400 font-medium">this year</div>
            </div>
          </div>
        ))}
      </div>

      {/* STATUS FILTER TABS & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-1 md:pb-0 md:border-b-0">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-3 text-[13px] font-bold whitespace-nowrap border-b-2 md:border-b-0 md:rounded-lg transition-all ${
                statusFilter === tab
                   ? 'border-slate-900 text-slate-900 md:bg-slate-100 md:text-slate-900'
                   : 'border-transparent text-slate-400 hover:text-slate-700 md:hover:bg-slate-50'
              }`}
            >
              {tab === 'All' ? 'All' : getDisplayLabel(tab as ProductionStage)}
              {tab !== 'All' && (
                <span className="ml-2 text-[10px] bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full font-black shadow-sm">
                  {jobOrders.filter(o => resolveOrderState(o).productionStage === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>
        
        {activeView === 'table' && (
          <div className="flex items-center gap-3">
            <div className="relative group w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={14} />
              <input type="text" placeholder="Search orders..." className="h-10 w-full pl-9 pr-3 bg-white border border-slate-200 rounded-xl text-[13px] font-medium outline-none focus:border-slate-900 transition-all shadow-sm" />
            </div>
            <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Calendar size={16} /> Date
            </button>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      {activeView === 'table' ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                  <th className="px-6 py-4">Garment & Progress</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Production Stage</th>
                  <th className="px-6 py-4">Value & Balance</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map((order) => {
                  const engine = resolveOrderState(order);
                  const { paymentStatus, productionStage, balance, progress } = engine;
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-6 py-5">
                        <div>
                          <div className="text-[15px] font-bold text-slate-900 leading-none mb-1">
                            {order.garment}
                          </div>
                          <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            {order.id} · <span className={progress === 100 ? 'text-emerald-500' : 'text-slate-900'}>{progress}%</span>
                          </div>
                          <div className="mt-2 w-24 bg-slate-100 h-1 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${progress === 100 ? 'bg-emerald-500' : 'bg-slate-900'}`} 
                              style={{ width: `${progress}%` }} 
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-[14px] font-medium text-slate-700">{order.customer}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border w-max ${getStatusColor(
                                productionStage
                              )}`}
                            >
                              <div className="w-1 h-1 rounded-full bg-current"></div>
                              {getDisplayLabel(productionStage)}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium italic">
                            {getStageExplanation(productionStage)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-[14px] font-black text-slate-900">
                          ₱{order.totalValue.toLocaleString()}
                        </div>
                        <div
                          className={`text-[10px] font-bold ${
                            balance > 0
                              ? 'text-rose-500'
                              : 'text-emerald-500 uppercase tracking-widest'
                          }`}
                        >
                          {balance > 0 ? `₱${balance.toLocaleString()} Due` : 'Paid Full'}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setPaymentAmount(resolveOrderState(order).balance);
                              setIsModalOpen(true);
                            }}
                            className="h-9 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 text-[12px] font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
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

          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="text-[12px] font-medium text-slate-500">Showing 1 to 8 of 42 orders</div>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-[12px] font-bold bg-white text-slate-400 cursor-not-allowed">
                Previous
              </button>
              <button className="px-4 py-1.5 rounded-lg border border-slate-200 text-[12px] font-bold bg-white text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
                Next
              </button>
            </div>
          </div>
        </div>
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
                          <span>{order.garment}</span>
                          {order.inspectionFailed && (
                            <span className="w-max px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-rose-50 border border-rose-200 text-rose-600">
                              REVISION REQUIRED
                            </span>
                          )}
                        </h4>
                        <p className="text-[12px] text-slate-500 font-medium mb-4">{order.customer}</p>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                            <CreditCard size={14} />
                            {getDisplayLabel(paymentStatus)}
                          </div>
                          <div className="w-7 h-7 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[9px] font-black text-slate-500">
                            {order.staff.charAt(0)}
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

      {/* ORDER DETAILS MODAL */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[1050px] h-[90vh] rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex">
            <div className="w-[400px] border-r border-slate-100 flex flex-col bg-slate-50/30">
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
                <div className="relative mt-2">
                  {/* Background Line */}
                  <div className="absolute top-4 left-6 right-6 h-[2px] bg-slate-200 z-0" />
                  
                  <div className="relative flex items-start justify-between">
                    {(() => {
                      const engine = resolveOrderState(selectedOrder);
                      const steps = [
                        { id: 'pay', label: 'Payment', done: engine.paymentStatus !== 'UNPAID', active: engine.paymentStatus === 'PARTIAL' },
                        { id: 'prod', label: 'Production', done: engine.progress === 100, active: engine.paymentStatus !== 'UNPAID' && engine.progress < 100 },
                        { id: 'qual', label: 'Quality', done: !!selectedOrder.inspectionPassed, active: engine.canBeInspected && !selectedOrder.inspectionPassed && !selectedOrder.inspectionFailed },
                        { id: 'done', label: 'Ready', done: !!selectedOrder.inspectionPassed && engine.isFullyPaid, active: !!selectedOrder.inspectionPassed && !engine.isFullyPaid }
                      ];

                      return steps.map((step, idx) => (
                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 w-[60px]">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white ${
                            step.done ? 'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-200' :
                            step.active ? 'border-slate-900 text-slate-900 animate-pulse' :
                            'border-slate-200 text-slate-300'
                          }`}>
                            {idx + 1}
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-tight text-center leading-tight ${
                            step.done ? 'text-emerald-600' :
                            step.active ? 'text-slate-900' :
                            'text-slate-300'
                          }`}>
                            {step.label}
                          </span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              <div className="p-8 border-b border-slate-100">
                <h2 className="text-[22px] font-black text-slate-900 leading-tight mb-2">
                  {selectedOrder.garment}
                </h2>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border ${getStatusColor(
                        resolveOrderState(selectedOrder).productionStage
                      )}`}
                    >
                      {getDisplayLabel(resolveOrderState(selectedOrder).productionStage)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-bold bg-slate-100 px-3 py-2 rounded-xl border border-slate-200/50">
                    {getStageExplanation(resolveOrderState(selectedOrder).productionStage)}
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
                            {customer?.name.charAt(0) || selectedOrder.customer.charAt(0)}
                          </div>
                          <div>
                            <div className="text-[14px] font-bold text-slate-900">{customer?.name || selectedOrder.customer}</div>
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

                <div className="space-y-3 pt-2">
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Financial Snapshot
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-slate-500 font-medium">Total Contract Value</span>
                      <span className="text-slate-900 font-black">
                        ₱{selectedOrder.totalValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-slate-500 font-medium">Amount Paid</span>
                      <span className="text-emerald-600 font-black">
                        ₱{selectedOrder.amountPaid.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-px bg-slate-100 mx-1" />
                    <div className="flex justify-between text-[13px]">
                      <span className="text-slate-500 font-medium">Remaining Balance</span>
                      <span
                        className={
                          resolveOrderState(selectedOrder).balance > 0 ? 'text-rose-600 font-black' : 'text-emerald-600 font-black'
                        }
                      >
                        ₱{resolveOrderState(selectedOrder).balance.toLocaleString()}
                      </span>
                    </div>
                    <div className={`text-center py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      resolveOrderState(selectedOrder).paymentStatus === 'PAID_FULL' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
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
                    <span className="text-[14px] font-bold">{selectedOrder.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock size={18} className="text-slate-400" />
                    <span className="text-[14px] font-medium text-rose-500 italic">12 days remaining</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-white">
              <div className="h-16 px-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex gap-8 h-full">
                  {([
                    { id: 'jobs', label: 'Production Jobs', icon: <ClipboardList size={14} /> },
                    { id: 'measurements', label: 'Measurements', icon: <User size={14} /> },
                    { id: 'status-log', label: 'Status Log', icon: <History size={14} /> },
                  ] as { id: DetailTab; label: string; icon: React.ReactNode }[]).map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setDetailTab(tab.id)}
                      className={`h-full flex items-center gap-2 text-[13px] font-bold border-b-2 transition-all ${
                        detailTab === tab.id
                          ? 'border-slate-900 text-slate-900'
                          : 'border-transparent text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      {tab.icon}{tab.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={closeDetailModal}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all"
                >
                  <X size={20} />
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
                                  <img src={img} alt={`Swatch ${idx + 1}`} className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Production Tasks</h3>
                      <div className="text-[12px] font-bold text-slate-400">{resolveOrderState(selectedOrder).progress}% Complete</div>
                    </div>
                    <div className="space-y-3">
                      {selectedOrder.tasks.map((task) => (
                        <div 
                          key={task.id} 
                          className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${ 
                            task.status === 'Completed' ? 'bg-slate-50/50 border-slate-100' : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm' 
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={() => updateTaskStatus(selectedOrder.id, task.id, task.status === 'Completed' ? 'Pending' : 'Completed')}
                              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${ 
                                task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200' 
                              }`}
                            >
                              {task.status === 'Completed' ? <Check size={20} /> : <Scissors size={20} />}
                            </button>
                            <div>
                              <div className={`text-[14px] font-bold ${ task.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-900' }`}>
                                {task.title}
                              </div>
                              <div className="text-[11px] text-slate-500 font-medium">
                                Status: <span className="font-bold">{task.status}</span>
                              </div>
                            </div>
                          </div>
                          
                          <select 
                            value={task.status}
                            onChange={(e) => updateTaskStatus(selectedOrder.id, task.id, e.target.value as 'Pending' | 'In Progress' | 'Completed')}
                            className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg outline-none border transition-all ${ 
                              task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                              task.status === 'In Progress' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 animate-pulse' : 
                              'bg-white text-slate-400 border-slate-200' 
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* ── TAB: MEASUREMENTS ── */}
                {detailTab === 'measurements' && (
                  <>
                    <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Measurement Profile</h3>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Profile ID</span>
                        <span className="text-[13px] font-bold text-slate-900">{selectedOrder?.measurement_profile_id || 'MEAS-002'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Garment</span>
                        <span className="text-[13px] font-bold text-slate-900">{selectedOrder?.garment}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                        {[['Neck', '16"'], ['Chest', '42"'], ['Waist', '34"'], ['Hips', '40"'], ['Sleeve', '25"'], ['Shoulder', '18"']].map(([label, val]) => (
                          <div key={label} className="text-center">
                            <div className="text-[11px] font-black text-slate-400 uppercase">{label}</div>
                            <div className="text-[18px] font-black text-slate-900 mt-1">{val}</div>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-400 italic pt-2">⚠ Measurements are locked at order creation. Changes to the client profile will not affect this order.</p>
                    </div>
                  </>
                )}

                {/* ── TAB: STATUS LOG (AUDIT TRAIL) ── */}
                {detailTab === 'status-log' && (
                  <>
                    <div className="flex items-center justify-between">
                      <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Status Log</h3>
                      <span className="text-[11px] font-bold text-slate-400">{orderStatusLogs.length} entries</span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200" />
                      <div className="space-y-6 pl-10">
                        {orderStatusLogs.length > 0 ? orderStatusLogs.map((log, i) => (
                          <div key={log.id} className="relative">
                            <div className="absolute -left-10 top-1 w-3 h-3 rounded-full border-2 border-white shadow-sm bg-indigo-500" />
                            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">{log.previous_status || '—'}</span>
                                <ChevronRight size={12} className="text-slate-300" />
                                <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">{log.new_status}</span>
                              </div>
                              <p className="text-[13px] text-slate-700 font-medium leading-snug">{log.remarks}</p>
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                                <span className="text-[11px] text-slate-500 font-bold">{log.changed_by}</span>
                                <span className="text-[11px] text-slate-400">{log.changed_at}</span>
                              </div>
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-12 text-slate-400">
                            <History size={32} className="mx-auto mb-3 opacity-30" />
                            <p className="text-[13px] font-bold">No status changes logged yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50/50 space-y-6">
                {/* TRANSACTIONAL ACTIONS */}
                {resolveOrderState(selectedOrder).productionStage === 'COMPLETED' ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                        <Package size={20} />
                      </div>
                      <div>
                        <h4 className="text-[16px] font-black text-emerald-900 tracking-tight">Ready for Release</h4>
                        <p className="text-[12px] font-medium text-emerald-700">Fully paid and quality check passed.</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <button 
                        onClick={() => window.location.href = `sms:${customers.find(c => c.id === selectedOrder.customer_id)?.phone}`}
                        className="flex flex-col items-center gap-2 p-3 bg-white border border-emerald-100 rounded-xl hover:border-emerald-300 transition-all shadow-sm group"
                      >
                        <MessageCircle size={18} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-emerald-800">Message</span>
                      </button>
                      <button 
                        onClick={() => window.location.href = `tel:${customers.find(c => c.id === selectedOrder.customer_id)?.phone}`}
                        className="flex flex-col items-center gap-2 p-3 bg-white border border-emerald-100 rounded-xl hover:border-emerald-300 transition-all shadow-sm group"
                      >
                        <Phone size={18} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-bold text-emerald-800">Call</span>
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
                                  className="h-11 w-full pl-7 pr-3 bg-white border border-slate-200 rounded-xl text-[14px] font-bold outline-none focus:border-slate-900 transition-all shadow-sm"
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
                                    placeholder="Cash Received" 
                                    className="h-11 w-full pl-7 pr-3 bg-emerald-50 border border-emerald-100 rounded-xl text-[14px] font-black outline-none focus:border-emerald-500 transition-all shadow-sm" 
                                  />
                                </div>
                                <div className="h-11 flex items-center justify-between px-4 bg-slate-900 rounded-xl border border-slate-800">
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Change:</span>
                                  <span className="text-[14px] font-black text-emerald-400">
                                    ₱{Math.max(0, (parseFloat(cashReceived) || 0) - (parseFloat(String(paymentAmount)) || 0)).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {(paymentMethod === 'GCash' || paymentMethod === 'Bank Transfer') && (
                            <div className="flex flex-col gap-2">
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

                    {/* Quality Inspection Form */}
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
                  </div>
                )}
                
                {/* Inspection Notes */}
                <div className="space-y-2">
                  <input 
                    type="text" 
                    value={inspectionNote}
                    onChange={(e) => setInspectionNote(e.target.value)}
                    placeholder="Inspection remarks / revision notes..." 
                    className="h-10 w-full px-4 bg-white/50 border border-slate-100 rounded-xl text-[12px] font-medium italic outline-none focus:bg-white focus:border-slate-200 transition-all"
                  />
                </div>
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
              <p className="font-bold text-lg">{customers.find(c => c.id === selectedOrder.customer_id)?.name || selectedOrder.customer}</p>
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
                  <td className="py-4 font-bold">{selectedOrder.garment}</td>
                  <td className="py-4 text-right font-medium">₱{selectedOrder.totalValue.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end mb-16">
              <div className="w-64">
                <div className="flex justify-between py-2 border-b border-gray-200 text-sm">
                  <span className="font-bold text-gray-500">Subtotal</span>
                  <span className="font-bold">₱{selectedOrder.totalValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 text-sm">
                  <span className="font-bold text-gray-500">Amount Paid</span>
                  <span className="font-bold">₱{selectedOrder.amountPaid.toLocaleString()}</span>
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
    </div>
  );
}
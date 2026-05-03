'use client';

import { useState } from 'react';
import jobOrdersData from '@/data/orders.json';
import {
  Search,
  Plus,
  LayoutList,
  KanbanSquare,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  Scissors,
  Calendar,
  Filter,
  MoreVertical,
  ClipboardList,
  Zap,
  ShieldCheck,
  Package,
} from 'lucide-react';

interface JobOrder {
  id: string;
  customer: string;
  garment: string;
  price: number;
  balance: number;
  dueDate: string;
  staff: string;
  status: string;
  priority: string;
  progress: number;
}

const kanbanStages = ['Pending', 'Cutting', 'Sewing', 'Inspection', 'Ready', 'Delivered'];

function getStatusColor(status: string) {
  switch (status) {
    case 'Pending':
      return 'bg-slate-50 text-slate-600 border-slate-200';
    case 'Cutting':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Sewing':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'Inspection':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Ready':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Delivered':
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
  const [activeView, setActiveView] = useState<'table' | 'kanban'>('table');
  const [selectedOrder, setSelectedOrder] = useState<JobOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobOrders] = useState<JobOrder[]>(jobOrdersData as JobOrder[]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-none">
            Production Orders
          </h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">
            Track and manage active tailoring jobs across your workshop.
          </p>
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

          <button className="h-10 px-4 bg-slate-900 text-white rounded-xl flex items-center gap-2 text-[13px] font-bold hover:bg-indigo-600 transition-all shadow-sm">
            <Plus size={16} />
            New Order
          </button>
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

      {/* MAIN CONTENT */}
      {activeView === 'table' ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative group flex-1 max-w-md">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors"
                size={16}
              />
              <input
                type="text"
                placeholder="Search by name, Order ID..."
                className="h-10 w-full pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-[14px] font-medium outline-none focus:bg-white focus:border-slate-900 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                <Filter size={16} />
                All Status
              </button>
              <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[13px] font-bold text-slate-600 hover:bg-slate-50 transition-all">
                <Calendar size={16} />
                Date Range
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                  <th className="px-6 py-4">Garment & Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Production Stage</th>
                  <th className="px-6 py-4">Value & Balance</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {jobOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-5">
                      <div>
                        <div className="text-[15px] font-bold text-slate-900 leading-none mb-1">
                          {order.garment}
                        </div>
                        <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                          {order.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[14px] font-medium text-slate-700">{order.customer}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border w-max ${getStatusColor(
                            order.status
                          )}`}
                        >
                          <div className="w-1 h-1 rounded-full bg-current"></div>
                          {order.status}
                        </span>
                        <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${order.progress}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-[14px] font-black text-slate-900">
                        ₱{order.price.toLocaleString()}
                      </div>
                      <div
                        className={`text-[10px] font-bold ${
                          order.balance > 0
                            ? 'text-rose-500'
                            : 'text-emerald-500 uppercase tracking-widest'
                        }`}
                      >
                        {order.balance > 0 ? `₱${order.balance.toLocaleString()} Due` : 'Paid Full'}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsModalOpen(true);
                          }}
                          className="h-9 px-4 rounded-lg bg-white border border-slate-200 text-slate-900 text-[12px] font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                        >
                          Details
                        </button>
                        <button className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors shadow-sm">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
          {kanbanStages.map((stage, i) => {
            const stageOrders = jobOrders.filter((o) => o.status === stage);
            return (
              <div key={i} className="flex flex-col gap-4 min-w-[320px] w-[320px]">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-slate-900 rounded-full" />
                    <h3 className="text-[15px] font-black text-slate-900 tracking-tight">{stage}</h3>
                  </div>
                  <span className="bg-slate-100 text-slate-400 px-2.5 py-0.5 rounded-full text-[11px] font-black">
                    {stageOrders.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {stageOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group cursor-pointer"
                      onClick={() => {
                        setSelectedOrder(order);
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
                      <h4 className="text-[14px] font-bold text-slate-900 leading-tight mb-1">
                        {order.garment}
                      </h4>
                      <p className="text-[12px] text-slate-500 font-medium mb-4">{order.customer}</p>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                          <Clock size={14} />
                          {order.dueDate}
                        </div>
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[9px] font-black text-slate-500">
                          {order.staff.charAt(0)}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button className="w-full h-12 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 text-[12px] font-bold hover:border-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                    <Plus size={16} />
                    Add Order
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-[850px] h-[90vh] rounded-[24px] shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 flex">
            <div className="w-[320px] border-r border-slate-100 flex flex-col bg-slate-50/30">
              <div className="p-8 border-b border-slate-100">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  {selectedOrder.id}
                </div>
                <h2 className="text-[22px] font-black text-slate-900 leading-tight mb-2">
                  {selectedOrder.garment}
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </div>

              <div className="p-8 space-y-6 overflow-y-auto">
                <div className="space-y-3">
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Customer Details
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black">
                      {selectedOrder.customer.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-slate-900">{selectedOrder.customer}</div>
                      <div className="text-[12px] text-slate-500 font-medium">Premium Client</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Financials
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 shadow-sm">
                    <div className="flex justify-between text-[13px]">
                      <span className="text-slate-500 font-medium">Total Value</span>
                      <span className="text-slate-900 font-black">
                        ₱{selectedOrder.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-slate-500 font-medium">Balance Due</span>
                      <span
                        className={
                          selectedOrder.balance > 0 ? 'text-rose-600 font-black' : 'text-emerald-600 font-black'
                        }
                      >
                        ₱{selectedOrder.balance.toLocaleString()}
                      </span>
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
                  <button className="h-full border-b-2 border-slate-900 text-[13px] font-black text-slate-900 flex items-center">
                    Production Jobs
                  </button>
                  <button className="h-full text-[13px] font-bold text-slate-400 hover:text-slate-900 flex items-center transition-colors">
                    Measurements
                  </button>
                  <button className="h-full text-[13px] font-bold text-slate-400 hover:text-slate-900 flex items-center transition-colors">
                    History
                  </button>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 p-8 overflow-y-auto space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[18px] font-black text-slate-900 tracking-tight">Order Jobs</h3>
                  <button className="text-[12px] font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5">
                    <Plus size={14} />
                    Add Task
                  </button>
                </div>

                <div className="space-y-3">
                  {[
                    { job: 'Initial Measurement', status: 'Completed', date: 'Oct 24', icon: <ClipboardList size={16} />, done: true },
                    { job: 'Pattern Drafting', status: 'Completed', date: 'Oct 25', icon: <Scissors size={16} />, done: true },
                    { job: 'Fabric Cutting', status: 'Completed', date: 'Oct 26', icon: <Scissors size={16} />, done: true },
                    { job: 'Main Sewing Phase', status: 'In Progress', date: 'Oct 28', icon: <Zap size={16} />, done: false },
                    { job: 'Quality Inspection', status: 'Pending', date: 'Oct 30', icon: <ShieldCheck size={16} />, done: false },
                    { job: 'Final Ironing & Prep', status: 'Pending', date: 'Nov 02', icon: <Package size={16} />, done: false },
                  ].map((step, si) => (
                    <div
                      key={si}
                      className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
                        step.done
                          ? 'bg-slate-50/50 border-slate-100'
                          : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            step.done ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {step.done ? <CheckCircle2 size={20} /> : step.icon}
                        </div>
                        <div>
                          <div
                            className={`text-[14px] font-bold ${
                              step.done ? 'text-slate-400 line-through' : 'text-slate-900'
                            }`}
                          >
                            {step.job}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            Estimated Completion: {step.date}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                            step.status === 'Completed'
                              ? 'text-emerald-600'
                              : step.status === 'In Progress'
                                ? 'text-indigo-600 bg-indigo-50 animate-pulse'
                                : 'text-slate-400'
                          }`}
                        >
                          {step.status}
                        </span>
                        <ChevronRight size={16} className="text-slate-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  <span className="text-[13px] font-bold text-slate-900">Next Step: Main Sewing Phase</span>
                </div>
                <button className="h-11 px-8 bg-slate-900 text-white rounded-xl text-[13px] font-black hover:bg-indigo-600 transition-all shadow-lg shadow-slate-900/10">
                  Process Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
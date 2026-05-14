"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag, Clock, CheckCircle, XCircle, AlertCircle,
  ChevronRight, Search, Filter, Scissors, Calendar, ChevronLeft, Package
} from 'lucide-react';

type OrderStatus =
  | 'PENDING_QUOTE' | 'WAITING_FOR_DOWN_PAYMENT' | 'IN_PRODUCTION'
  | 'READY_FOR_FITTING' | 'ALTERATIONS' | 'READY_FOR_RELEASE'
  | 'RELEASED' | 'CANCELLED' | 'ON_HOLD';

interface MockOrder {
  id: string;
  orderNo: string;
  shop: string;
  garment: string;
  orderType: string;
  status: OrderStatus;
  totalAmount: number;
  balance: number;
  dueDate: string;
  createdAt: string;
}

const MOCK_ORDERS: MockOrder[] = [
  {
    id: 'ord-001',
    orderNo: 'ORD-2026-1024',
    shop: 'Davao Famous Tailoring',
    garment: 'Bespoke 3-Piece Suit',
    orderType: 'BESPOKE',
    status: 'IN_PRODUCTION',
    totalAmount: 18500,
    balance: 11500,
    dueDate: '2026-06-15',
    createdAt: '2026-05-10',
  },
  {
    id: 'ord-002',
    orderNo: 'ORD-2026-0987',
    shop: "Chard's Tailoring",
    garment: 'Barong Tagalog (Formal)',
    orderType: 'BESPOKE',
    status: 'READY_FOR_FITTING',
    totalAmount: 4800,
    balance: 2400,
    dueDate: '2026-05-20',
    createdAt: '2026-05-01',
  },
  {
    id: 'ord-003',
    orderNo: 'ORD-2026-0851',
    shop: 'Golden Needle Tailoring',
    garment: 'Trouser Alteration (2 pcs)',
    orderType: 'ALTERATION',
    status: 'RELEASED',
    totalAmount: 850,
    balance: 0,
    dueDate: '2026-04-30',
    createdAt: '2026-04-25',
  },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PENDING_QUOTE:            { label: 'Pending Quote',        color: 'text-[#C9A84C]',  bg: 'bg-[#C9A84C]/5',   icon: Clock },
  WAITING_FOR_DOWN_PAYMENT: { label: 'Awaiting Payment',    color: 'text-orange-600', bg: 'bg-orange-50',  icon: AlertCircle },
  IN_PRODUCTION:            { label: 'In Production',       color: 'text-[#1E3A1F]', bg: 'bg-[#1E3A1F]/5',  icon: Scissors },
  READY_FOR_FITTING:        { label: 'Ready for Fitting',   color: 'text-blue-600',   bg: 'bg-blue-50',    icon: Calendar },
  ALTERATIONS:              { label: 'Alterations',         color: 'text-violet-600', bg: 'bg-violet-50',  icon: Scissors },
  READY_FOR_RELEASE:        { label: 'Ready for Pickup',    color: 'text-emerald-600',bg: 'bg-emerald-50', icon: CheckCircle },
  RELEASED:                 { label: 'Completed',           color: 'text-[#78716C]',  bg: 'bg-[#F0EDE8]',  icon: CheckCircle },
  CANCELLED:                { label: 'Cancelled',           color: 'text-red-600',    bg: 'bg-red-50',     icon: XCircle },
  ON_HOLD:                  { label: 'On Hold',             color: 'text-gray-500',   bg: 'bg-gray-100',   icon: AlertCircle },
};

export default function CustomerOrdersPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filtered = MOCK_ORDERS.filter((o) => {
    const matchesSearch =
      o.orderNo.toLowerCase().includes(search.toLowerCase()) ||
      o.shop.toLowerCase().includes(search.toLowerCase()) ||
      o.garment.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !['RELEASED', 'CANCELLED'].includes(o.status)) ||
      (filter === 'completed' && ['RELEASED', 'CANCELLED'].includes(o.status));

    return matchesSearch && matchesFilter;
  });

  const formatPHP = (n: number) =>
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(n);

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <section className="bg-[#1E3A1F] pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#C9A84C] via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
           <Link href="/customer/dashboard" className="inline-flex items-center gap-2 text-[#C9A84C] text-[12px] font-bold uppercase tracking-widest mb-6 hover:opacity-80 transition-opacity">
              <ChevronLeft size={16} /> Back to Dashboard
           </Link>
           <h1 className="text-5xl font-bold font-serif text-[#FAF8F5] tracking-tight mb-4">Your Garment Portfolio</h1>
           <p className="text-[#FAF8F5]/60 font-medium max-w-xl mx-auto">Tracking the progress and details of your bespoke commissions.</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-10 pb-24">
        {/* Search + Filter Bar */}
        <div className="bg-white rounded-[32px] border border-[#E2DDD7] shadow-xl p-6 mb-10 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#78716C]" size={18} />
            <input
              type="text"
              placeholder="Search by order number, shop, or garment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-14 pr-6 rounded-2xl bg-[#FAF8F5] border border-[#E2DDD7] text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:ring-4 focus:ring-[#1E3A1F]/5 focus:border-[#1E3A1F] transition-all text-[14px] font-medium"
            />
          </div>
          <div className="flex gap-2 p-1.5 bg-[#FAF8F5] rounded-2xl border border-[#E2DDD7] w-full md:w-auto">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`h-10 px-6 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-all flex-1 md:flex-none ${
                  filter === f
                    ? 'bg-[#1E3A1F] text-[#C9A84C] shadow-md shadow-[#1E3A1F]/20'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Order List */}
        <div className="space-y-6">
          {filtered.length === 0 && (
            <div className="bg-white rounded-[40px] border border-[#E2DDD7] p-24 text-center">
              <Package size={56} className="mx-auto text-[#E2DDD7] mb-6" />
              <p className="text-[#78716C] font-bold text-[14px] uppercase tracking-widest">No matching orders found</p>
            </div>
          )}

          {filtered.map((order) => {
            const cfg = STATUS_CONFIG[order.status];
            const StatusIcon = cfg.icon;
            const isActive = !['RELEASED', 'CANCELLED'].includes(order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-[40px] border border-[#E2DDD7] hover:shadow-2xl hover:shadow-[#1E3A1F]/5 transition-all duration-500 overflow-hidden group"
              >
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-8">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[11px] font-bold text-[#1E3A1F] bg-[#1E3A1F]/5 px-3 py-1 rounded-full uppercase tracking-widest">{order.orderNo}</span>
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${cfg.bg} ${cfg.color} border-current/10`}>
                          <StatusIcon size={12} />
                          {cfg.label}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-[24px] font-bold font-serif text-[#1C1917] tracking-tight group-hover:text-[#1E3A1F] transition-colors">{order.garment}</h3>
                        <p className="text-[15px] text-[#78716C] font-bold mt-1 uppercase tracking-wider">{order.shop}</p>
                      </div>
                    </div>
                    <div className="md:text-right shrink-0 border-t md:border-t-0 pt-6 md:pt-0">
                      <div className="text-[32px] font-bold text-[#1C1917]">{formatPHP(order.totalAmount)}</div>
                      {order.balance > 0 && (
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[11px] font-bold uppercase tracking-widest mt-2 border border-rose-100">
                           Outstanding: {formatPHP(order.balance)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-8 border-t border-[#F0EDE8]">
                    <div className="flex flex-wrap gap-8 text-[13px] font-medium text-[#78716C]">
                      <div className="flex flex-col gap-1">
                         <span className="text-[11px] font-bold uppercase tracking-widest opacity-60">Initiated On</span>
                         <span className="text-[#1C1917] font-bold">{new Date(order.createdAt).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                         <span className="text-[11px] font-bold uppercase tracking-widest opacity-60">Estimated Release</span>
                         <span className={`font-bold ${isActive && new Date(order.dueDate) < new Date() ? 'text-rose-600' : 'text-[#1C1917]'}`}>{new Date(order.dueDate).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <Link
                      href={`/customer/orders/${order.id}`}
                      className="h-12 px-8 bg-[#1E3A1F] text-[#C9A84C] rounded-xl flex items-center gap-2 text-[14px] font-bold shadow-lg hover:shadow-[#1E3A1F]/20 transition-all active:scale-95 group"
                    >
                      Audit Journey <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

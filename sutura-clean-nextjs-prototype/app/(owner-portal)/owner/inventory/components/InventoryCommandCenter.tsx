'use client';

import React, { useState } from 'react';
import {
  AlertTriangle, Package, Users, Calendar, ShoppingBag,
  Truck, TrendingUp, Clock, ChevronRight, ArrowUpRight,
  Zap, CheckCircle2, XCircle, BarChart3, Link2
} from 'lucide-react';
import { InventoryItem, Order, JobOrderItem, Customer, Appointment, Supplier, PurchaseOrder } from '@/store/useERPStore';

interface InventoryCommandCenterProps {
  inventory: InventoryItem[];
  orders: Order[];
  jobOrderItems: JobOrderItem[];
  customers: Customer[];
  appointments: Appointment[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  onTabChange: (tab: 'materials' | 'finished' | 'assembly' | 'history' | 'low_stock') => void;
}

export function InventoryCommandCenter({
  inventory, orders, jobOrderItems, customers,
  appointments, suppliers, purchaseOrders, onTabChange
}: InventoryCommandCenterProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  // ── Number formatter: prevents large numbers from breaking UI ──
  const fmt = (n: number): string => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 10_000)    return `${(n / 1_000).toFixed(0)}k`;
    if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`;
    return n.toString();
  };

  // ── Cross-module computations ──────────────────────────────────
  const lowStockItems = inventory.filter(i => {
    const s = i.stock || 0;
    return s <= (i.reorder_level || 0) || s === 0;
  });

  const activeJOs = orders.filter(o => o.status === 'IN_PRODUCTION' || o.status === 'ALTERATIONS');

  const totalInventoryValue = inventory.reduce((sum, i) => sum + (i.stock || 0) * (i.unit_cost || 0), 0);

  const finishedGoods = inventory.filter(i => i.cat === 'Finished Goods' || i.item_type === 'FINISHED_GOOD');

  // Appointments in next 7 days that are Scheduled (need materials prepped)
  const upcomingFittings = appointments.filter(a => {
    if (a.status !== 'Scheduled' && a.status !== 'Pending Review') return false;
    const d = new Date(a.date);
    const now = new Date();
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });

  // Customers with READY_FOR_PICKUP orders
  const readyForPickup = orders.filter(o => o.status === 'READY_FOR_RELEASE');

  // Overdue POs
  const overduePOs = purchaseOrders.filter(po => {
    if (po.status === 'RECEIVED' || po.status === 'CANCELLED') return false;
    const deliveryDate = po.expected_delivery_date || po.requested_at;
    return deliveryDate ? new Date(deliveryDate) < new Date() : false;
  });

  const cards = [
    {
      id: 'orders',
      icon: <Zap size={20} />,
      label: 'Active Production',
      value: activeJOs.length,
      sub: 'orders in progress',
      color: 'indigo',
      tab: 'assembly' as const,
      alert: activeJOs.some(o => new Date(o.due_date) < new Date()),
      detail: activeJOs.slice(0, 4).map(jo => {
        const c = customers.find(c => c.id === jo.customer_id);
        const items = jobOrderItems.filter(i => i.job_order_id === jo.id);
        const overdue = new Date(jo.due_date) < new Date();
        return { id: jo.id, label: c?.name || jo.customer_id, sub: items[0]?.garment_name || jo.id, overdue };
      }),
    },
    {
      id: 'lowstock',
      icon: <AlertTriangle size={20} />,
      label: 'Low Stock',
      value: lowStockItems.length,
      sub: 'items need restocking',
      color: 'amber',
      tab: 'low_stock' as const,
      alert: lowStockItems.some(i => (i.stock || 0) === 0),
      detail: lowStockItems.slice(0, 4).map(i => ({
        id: i.sku, label: i.item_name || i.item || i.sku,
        sub: `${i.stock || 0} ${i.unit || 'units'} left`,
        overdue: (i.stock || 0) === 0,
      })),
    },
    {
      id: 'customers',
      icon: <Users size={20} />,
      label: 'Ready for Pickup',
      value: readyForPickup.length,
      sub: 'orders awaiting customer',
      color: 'emerald',
      tab: 'finished' as const,
      alert: false,
      detail: readyForPickup.slice(0, 4).map(o => {
        const c = customers.find(c => c.id === o.customer_id);
        return { id: o.id, label: c?.name || o.customer_id, sub: o.id, overdue: false };
      }),
    },
    {
      id: 'appointments',
      icon: <Calendar size={20} />,
      label: 'Upcoming Fittings',
      value: upcomingFittings.length,
      sub: 'in next 7 days',
      color: 'sky',
      tab: 'materials' as const,
      alert: false,
      detail: upcomingFittings.slice(0, 4).map(a => ({
        id: a.id, label: a.customer,
        sub: new Date(a.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        overdue: false,
      })),
    },
    {
      id: 'suppliers',
      icon: <Truck size={20} />,
      label: 'Supplier POs',
      value: overduePOs.length,
      sub: overduePOs.length > 0 ? 'overdue deliveries' : 'all deliveries on time',
      color: overduePOs.length > 0 ? 'rose' : 'slate',
      tab: 'materials' as const,
      alert: overduePOs.length > 0,
      detail: purchaseOrders.filter(p => p.status !== 'RECEIVED' && p.status !== 'CANCELLED').slice(0, 4).map(po => {
        const s = suppliers.find(s => s.id === po.supplier_id);
        const deliveryDate = po.expected_delivery_date || po.requested_at;
        const overdue = deliveryDate ? new Date(deliveryDate) < new Date() : false;
        return { id: po.id, label: s?.name || po.supplier_id, sub: po.id, overdue };
      }),
    },
  ];

  const colorMap: Record<string, { bg: string; text: string; badge: string; dot: string }> = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-500' },
    amber:  { bg: 'bg-amber-50',  text: 'text-amber-600',  badge: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-500'  },
    emerald:{ bg: 'bg-emerald-50',text: 'text-emerald-600',badge: 'bg-emerald-100 text-emerald-700',dot:'bg-emerald-500'},
    sky:    { bg: 'bg-sky-50',    text: 'text-sky-600',    badge: 'bg-sky-100 text-sky-700',       dot: 'bg-sky-500'    },
    rose:   { bg: 'bg-rose-50',   text: 'text-rose-600',   badge: 'bg-rose-100 text-rose-700',     dot: 'bg-rose-500'   },
    slate:  { bg: 'bg-slate-50',  text: 'text-slate-600',  badge: 'bg-slate-100 text-slate-600',   dot: 'bg-slate-400'  },
  };

  return (
    <div className="px-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">System Connections</span>
        <span className="text-[12px] font-bold text-slate-500">
          Total Inventory Value: <span className="font-black text-slate-900">₱{totalInventoryValue.toLocaleString()}</span>
        </span>
      </div>

      {/* Connected Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {cards.map(card => {
          const c = colorMap[card.color];
          const isOpen = expanded === card.id;
          return (
            <div key={card.id} className="relative">
              <button
                onClick={() => { setExpanded(isOpen ? null : card.id); onTabChange(card.tab); }}
                className={`w-full p-4 rounded-2xl border transition-all text-left group ${
                  isOpen
                    ? `border-slate-900 bg-white shadow-xl`
                    : `border-slate-200 bg-white hover:border-slate-300 hover:shadow-md`
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>
                    {card.icon}
                  </div>
                  {card.alert && (
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse mt-1" />
                  )}
                </div>
                <p className="text-[22px] font-black text-slate-900 leading-none tabular-nums">{fmt(card.value)}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{card.label}</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">{card.sub}</p>
                <div className={`flex items-center gap-1 mt-3 text-[10px] font-black uppercase tracking-widest transition-all ${c.text}`}>
                  <span>{isOpen ? 'Close' : 'View'}</span>
                  <ChevronRight size={10} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {/* Dropdown Detail Panel */}
              {isOpen && card.detail.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200" style={{ minWidth: '240px' }}>
                  <div className={`px-4 py-2 ${c.bg} border-b border-slate-100`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${c.text}`}>{card.label}</p>
                  </div>
                  {card.detail.map(d => (
                    <div key={d.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 border-b border-slate-50 last:border-0">
                      <div>
                        <p className="text-[12px] font-black text-slate-900">{d.label}</p>
                        <p className="text-[10px] font-medium text-slate-400">{d.sub}</p>
                      </div>
                      {d.overdue
                        ? <XCircle size={14} className="text-rose-500 shrink-0" />
                        : <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      }
                    </div>
                  ))}
                  {card.detail.length === 0 && (
                    <div className="px-4 py-6 text-center text-[11px] text-slate-400 font-medium">Nothing to show</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mini Production Flow Indicator */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-hide">
        {[
          { label: 'Raw Materials', icon: <Package size={12} /> },
          { label: 'In Production',  icon: <Zap size={12} /> },
          { label: 'Finished Goods', icon: <ShoppingBag size={12} /> },
          { label: 'Ready Pickup',   icon: <Users size={12} /> },
          { label: 'Audit Log',      icon: <BarChart3 size={12} /> },
        ].map((step, i, arr) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg shrink-0">
              <span className="text-slate-400">{step.icon}</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">{step.label}</span>
            </div>
            {i < arr.length - 1 && <ArrowUpRight size={12} className="text-slate-300 shrink-0" />}
          </React.Fragment>
        ))}
      </div>

    </div>
  );
}

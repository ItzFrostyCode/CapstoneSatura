'use client';

import React, { useState } from 'react';
import {
  AlertTriangle, Package, Users, Calendar, ShoppingBag,
  Truck, ChevronRight, ArrowUpRight,
  Zap, CheckCircle2, XCircle, BarChart3, ChevronDown
} from 'lucide-react';
import { InventoryItem, Order, JobOrderItem, Customer, Appointment, Supplier, PurchaseOrder } from '@/types/erp';

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

  const fmt = (n: number): string => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 10_000)    return `${(n / 1_000).toFixed(0)}k`;
    if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}k`;
    return n.toString();
  };

  const lowStockItems = inventory.filter(i => {
    const available = (i.stock || 0) - (i.reserved || 0);
    return available <= (i.reorder_level || 0) || available === 0;
  });

  const activeJOs = orders.filter(o => o.status === 'IN_PRODUCTION' || o.status === 'ALTERATIONS');
  const totalInventoryValue = inventory.reduce((sum, i) => sum + (i.stock || 0) * (i.unit_cost || 0), 0);

  const readyForPickup = orders.filter(o => o.status === 'READY_FOR_RELEASE');
  const upcomingFittings = appointments?.filter(a => {
    if (a.status !== 'Scheduled' && a.status !== 'Pending Review') return false;
    const d = new Date(a.date);
    const now = new Date();
    const diff = (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  }) || [];

  const overduePOs = purchaseOrders.filter(po => {
    if (po.status === 'DELIVERED' || po.status === 'CANCELLED') return false;
    const deliveryDate = po.expected_delivery_date || po.requested_at;
    return deliveryDate ? new Date(deliveryDate) < new Date() : false;
  });

  const cards = [
    {
      id: 'orders',
      icon: <Zap size={18} />,
      label: 'Production',
      value: activeJOs.length,
      sub: 'orders in progress',
      color: 'indigo',
      tab: 'assembly' as const,
      alert: activeJOs.some(o => new Date(o.due_date) < new Date()),
      detail: activeJOs.slice(0, 4).map(jo => {
        const c = customers.find(c => c.id === jo.customer_id);
        const overdue = new Date(jo.due_date) < new Date();
        return { id: jo.id, label: c?.name || jo.customer_id, sub: jo.id, overdue };
      }),
    },
    {
      id: 'lowstock',
      icon: <AlertTriangle size={18} />,
      label: 'Inventory Alerts',
      value: lowStockItems.length,
      sub: 'restock required',
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
      icon: <Users size={18} />,
      label: 'Ready Pickup',
      value: readyForPickup.length,
      sub: 'awaiting release',
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
      icon: <Calendar size={18} />,
      label: 'Fittings',
      value: upcomingFittings.length,
      sub: 'next 7 days',
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
      icon: <Truck size={18} />,
      label: 'Overdue POs',
      value: overduePOs.length,
      sub: 'delayed deliveries',
      color: overduePOs.length > 0 ? 'rose' : 'slate',
      tab: 'materials' as const,
      alert: overduePOs.length > 0,
      detail: purchaseOrders.filter(p => p.status !== 'DELIVERED' && p.status !== 'CANCELLED').slice(0, 4).map(po => {
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
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Real-time Operational Intelligence</span>
        </div>
        <div className="px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mr-2">Valuation:</span>
          <span className="text-[13px] font-black text-slate-900">₱{totalInventoryValue.toLocaleString()}</span>
        </div>
      </div>

      {/* Connected Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {cards.map(card => {
          const c = colorMap[card.color];
          const isOpen = expanded === card.id;
          return (
            <div key={card.id} className="relative">
              <button
                onClick={() => { setExpanded(isOpen ? null : card.id); onTabChange(card.tab); }}
                className={`w-full p-6 rounded-[32px] border transition-all text-left group overflow-hidden ${
                  isOpen
                    ? `border-slate-900 bg-slate-900 text-white shadow-xl scale-[1.02]`
                    : `border-slate-200 bg-white hover:border-slate-400 hover:shadow-md`
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-[14px] flex items-center justify-center transition-colors ${isOpen ? 'bg-white/10 text-white' : `${c.bg} ${c.text}`}`}>
                    {card.icon}
                  </div>
                  {card.alert && (
                    <div className="px-2 py-0.5 bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest rounded-full animate-pulse">Alert</div>
                  )}
                </div>
                <p className={`text-[28px] font-black tracking-tight leading-none tabular-nums ${isOpen ? 'text-white' : 'text-slate-900'}`}>{fmt(card.value)}</p>
                <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${isOpen ? 'text-slate-400' : 'text-slate-400'}`}>{card.label}</p>
                
                <div className={`flex items-center gap-1.5 mt-4 text-[9px] font-black uppercase tracking-widest transition-all ${isOpen ? 'text-indigo-400' : c.text}`}>
                  <span>{isOpen ? 'Close Intelligence' : 'Inspect Module'}</span>
                  <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Dropdown Detail Panel */}
              {isOpen && card.detail.length > 0 && (
                <div className="absolute top-[calc(100%+12px)] left-0 right-0 z-[100] bg-white border-2 border-slate-900 rounded-[28px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" style={{ minWidth: '280px' }}>
                  <div className="px-5 py-3 bg-slate-900 border-b border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Queue</p>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
                    {card.detail.map(d => (
                      <div key={d.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
                        <div>
                          <p className="text-[13px] font-black text-slate-900 tracking-tight">{d.label}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.sub}</p>
                        </div>
                        {d.overdue
                          ? <XCircle size={16} className="text-rose-500 shrink-0" />
                          : <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        }
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => onTabChange(card.tab)}
                    className="w-full py-4 bg-slate-50 text-[11px] font-black text-slate-900 uppercase tracking-widest hover:bg-slate-100 border-t border-slate-100 flex items-center justify-center gap-2"
                  >
                    View All in {card.label} <ArrowUpRight size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Production Flow Breadcrumbs */}
      <div className="bg-white border border-slate-200 rounded-[24px] p-2 flex items-center gap-1 overflow-x-auto scrollbar-hide shadow-sm">
        {[
          { label: 'Sourcing', icon: <Truck size={14} /> },
          { label: 'Raw Inventory', icon: <Package size={14} /> },
          { label: 'Production Line',  icon: <Zap size={14} /> },
          { label: 'Quality Audit', icon: <CheckCircle2 size={14} /> },
          { label: 'Final Release', icon: <ShoppingBag size={14} /> },
        ].map((step, i, arr) => (
          <React.Fragment key={i}>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-default group shrink-0">
              <span className="text-slate-300 group-hover:text-indigo-500 transition-colors">{step.icon}</span>
              <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-900 uppercase tracking-widest whitespace-nowrap transition-colors">{step.label}</span>
            </div>
            {i < arr.length - 1 && <ChevronRight size={14} className="text-slate-200 shrink-0" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

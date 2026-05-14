'use client';

import Link from 'next/link';
import { History, CheckCircle, XCircle, ChevronRight, Scissors } from 'lucide-react';

const HISTORY = [
  {
    id: 'ord-h01',
    orderNo: 'ORD-2026-0851',
    shop: 'Golden Needle Tailoring',
    garment: 'Trouser Alteration (2 pcs)',
    orderType: 'ALTERATION',
    status: 'RELEASED',
    totalAmount: 850,
    completedAt: '2026-04-30',
  },
  {
    id: 'ord-h02',
    orderNo: 'ORD-2025-3312',
    shop: 'Davao Famous Tailoring',
    garment: 'Barong Tagalog — Wedding',
    orderType: 'BESPOKE',
    status: 'RELEASED',
    totalAmount: 5200,
    completedAt: '2025-12-18',
  },
  {
    id: 'ord-h03',
    orderNo: 'ORD-2025-2100',
    shop: "Chard's Tailoring",
    garment: 'Casual Chino Pants',
    orderType: 'BESPOKE',
    status: 'CANCELLED',
    totalAmount: 1800,
    completedAt: '2025-10-05',
  },
];

const formatPHP = (n: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(n);

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-900 pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-violet-400 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <History size={20} className="text-violet-400" />
            <span className="text-violet-400 text-[12px] font-black uppercase tracking-widest">Order History</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Completed Orders</h1>
          <p className="text-slate-400 font-medium">A record of all your completed and cancelled tailoring orders.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 -mt-6 pb-24 relative z-10">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/30 p-4 mb-8 flex items-center justify-between">
          <span className="text-[13px] font-bold text-slate-500">{HISTORY.length} total past orders</span>
          <div className="flex gap-3 text-[12px] font-black text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1"><CheckCircle size={12} className="text-emerald-500" /> {HISTORY.filter(o => o.status === 'RELEASED').length} completed</span>
            <span className="flex items-center gap-1"><XCircle size={12} className="text-red-400" /> {HISTORY.filter(o => o.status === 'CANCELLED').length} cancelled</span>
          </div>
        </div>

        <div className="space-y-4">
          {HISTORY.map((order) => (
            <div key={order.id} className={`bg-white rounded-3xl border hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300 p-6 ${
              order.status === 'CANCELLED' ? 'border-slate-100 opacity-70' : 'border-slate-100'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{order.orderNo}</span>
                    {order.status === 'RELEASED'
                      ? <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full"><CheckCircle size={10} /> Completed</span>
                      : <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full"><XCircle size={10} /> Cancelled</span>
                    }
                  </div>
                  <h3 className="text-[16px] font-black text-slate-900">{order.garment}</h3>
                  <p className="text-[13px] text-slate-500 font-medium">{order.shop}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-[18px] font-black text-slate-900">{formatPHP(order.totalAmount)}</div>
                    <div className="text-[12px] text-slate-400 font-medium">
                      {new Date(order.completedAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <Link href={`/customer/orders/${order.id}`} className="text-slate-300 hover:text-indigo-500 transition-colors">
                    <ChevronRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

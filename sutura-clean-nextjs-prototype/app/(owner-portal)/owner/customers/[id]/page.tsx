'use client';

import Link from 'next/link';
import { ArrowLeft, Users, ShoppingBag, Ruler, Calendar, ChevronRight } from 'lucide-react';

const CUSTOMER = {
  id: 'c01',
  name: 'Juan dela Cruz',
  email: 'juan@email.com',
  phone: '09171234567',
  address: 'Blk 3 Lot 5, Ma-a, Davao City',
  type: 'Individual',
  totalOrders: 3,
  totalSpent: 24350,
  joinedAt: '2025-08-15',
  isActive: true,
  orders: [
    { id: 'ord-001', orderNo: 'ORD-2026-1024', garment: '3-Piece Suit', status: 'IN_PRODUCTION', amount: 18500, date: '2026-05-10' },
    { id: 'ord-h02', orderNo: 'ORD-2025-3312', garment: 'Barong Tagalog', status: 'RELEASED', amount: 5200, date: '2025-12-10' },
    { id: 'ord-h03', orderNo: 'ORD-2025-1100', garment: 'Casual Trousers', status: 'RELEASED', amount: 650, date: '2025-08-20' },
  ],
  measurements: [
    { id: 'meas-001', name: 'Formal Suit Profile', garmentType: 'Business Suit', version: 'V2', date: '2026-05-11' },
    { id: 'meas-002', name: 'Casual Pants', garmentType: 'Chino Pants', version: 'V1', date: '2025-08-20' },
  ],
  appointments: [
    { id: 'apt-001', type: 'Fitting Session', date: '2026-05-25', status: 'Scheduled' },
    { id: 'apt-003', type: 'Consultation', date: '2025-08-18', status: 'Completed' },
  ],
};

const STATUS_COLOR: Record<string, string> = {
  IN_PRODUCTION: 'text-indigo-600 bg-indigo-50',
  RELEASED: 'text-emerald-600 bg-emerald-50',
  CANCELLED: 'text-red-500 bg-red-50',
  READY_FOR_FITTING: 'text-blue-600 bg-blue-50',
};

const formatPHP = (n: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(n);

export default function CustomerDetailPage() {
  return (
    <div className="relative min-h-full pb-20 pt-6">
      <Link href="/owner/customers" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-[13px] font-bold mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Customers
      </Link>

      {/* Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${CUSTOMER.name}`}
            alt={CUSTOMER.name}
            className="w-20 h-20 rounded-2xl"
          />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-[24px] font-black text-slate-900">{CUSTOMER.name}</h1>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${CUSTOMER.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {CUSTOMER.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 text-[13px] text-slate-500 font-medium">
              <span>{CUSTOMER.email}</span>
              <span>{CUSTOMER.phone}</span>
              <span>{CUSTOMER.address}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            {[
              { label: 'Orders', val: CUSTOMER.totalOrders },
              { label: 'Spent', val: formatPHP(CUSTOMER.totalSpent) },
            ].map((s) => (
              <div key={s.label} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="text-[20px] font-black text-slate-900">{s.val}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag size={16} className="text-indigo-600" />
            <h2 className="text-[15px] font-black text-slate-900 uppercase tracking-widest">Order History</h2>
          </div>
          <div className="space-y-3">
            {CUSTOMER.orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <div className="text-[11px] font-black text-slate-400 uppercase">{o.orderNo}</div>
                  <div className="text-[14px] font-black text-slate-900">{o.garment}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${STATUS_COLOR[o.status] ?? 'bg-slate-100 text-slate-500'}`}>
                    {o.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[14px] font-black text-slate-900">{formatPHP(o.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Measurements */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Ruler size={14} className="text-emerald-600" />
              <h2 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Measurements</h2>
            </div>
            {CUSTOMER.measurements.map((m) => (
              <div key={m.id} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                <div>
                  <div className="text-[13px] font-black text-slate-900">{m.name}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{m.garmentType} · {m.version}</div>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{new Date(m.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}</span>
              </div>
            ))}
          </div>

          {/* Appointments */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={14} className="text-blue-600" />
              <h2 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">Appointments</h2>
            </div>
            {CUSTOMER.appointments.map((a) => (
              <div key={a.id} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                <div>
                  <div className="text-[13px] font-black text-slate-900">{a.type}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{new Date(a.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${a.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

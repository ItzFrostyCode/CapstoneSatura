'use client';

import Link from 'next/link';
import {
  ArrowLeft, Scissors, Clock, CheckCircle,
  CreditCard, MapPin
} from 'lucide-react';

const ORDER = {
  id: 'ord-001',
  orderNo: 'ORD-2026-1024',
  shop: 'Davao Famous Tailoring',
  shopAddress: 'San Pedro St., Davao City',
  garment: 'Bespoke 3-Piece Suit',
  totalAmount: 18500,
  downPayment: 7000,
  balance: 11500,
  assignedStaff: 'Carlos Reyes',
  items: [
    { name: 'Custom Suit Jacket', qty: 1, price: 12000 },
    { name: 'Suit Trousers', qty: 1, price: 4000 },
    { name: 'Vest / Waistcoat', qty: 1, price: 2500 },
  ],
  payments: [
    { date: '2026-05-10', amount: 7000, method: 'GCash', ref: 'GC-20260510-001' },
  ],
  timeline: [
    { stage: 'Order Intake',      date: '2026-05-10', note: 'Order confirmed. Down payment received.', done: true, current: false },
    { stage: 'Measuring',         date: '2026-05-11', note: 'Measurements taken at shop.',             done: true, current: false },
    { stage: 'Material Sourcing', date: '2026-05-13', note: 'Italian wool fabric confirmed.',           done: true, current: false },
    { stage: 'Cutting',           date: '2026-05-14', note: 'Fabric cutting completed.',               done: true, current: false },
    { stage: 'Sewing',            date: null,         note: 'Currently in sewing phase.',              done: false, current: true },
    { stage: 'First Fitting',     date: null,         note: 'Appointment TBD.',                       done: false, current: false },
    { stage: 'Alterations',       date: null,         note: '',                                        done: false, current: false },
    { stage: 'Finishing',         date: null,         note: '',                                        done: false, current: false },
    { stage: 'Ready for Pickup',  date: null,         note: '',                                        done: false, current: false },
  ],
};

const formatPHP = (n: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(n);

export default function OrderDetailPage() {
  const done = ORDER.timeline.filter((t) => t.done).length;
  const progressPercent = Math.round((done / ORDER.timeline.length) * 100);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-900 pt-28 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/customer/orders" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-[13px] font-bold mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Orders
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-indigo-400 text-[11px] font-black uppercase tracking-widest">{ORDER.orderNo}</span>
              <h1 className="text-3xl font-black text-white tracking-tight mt-1">{ORDER.garment}</h1>
              <div className="flex items-center gap-2 mt-2 text-slate-400 text-[14px] font-medium">
                <MapPin size={14} /> {ORDER.shop} — {ORDER.shopAddress}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1">Progress</div>
              <div className="text-[36px] font-black text-white">{progressPercent}%</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 -mt-4 pb-24 space-y-6">
        {/* Progress bar */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xl shadow-slate-200/30">
          <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
            <span>Intake</span><span>Pickup Ready</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-8 shadow-xl shadow-slate-200/30">
            <h2 className="text-[18px] font-black text-slate-900 mb-8">Production Timeline</h2>
            <div className="space-y-0">
              {ORDER.timeline.map((step, i) => (
                <div key={i} className="relative flex gap-4">
                  {i < ORDER.timeline.length - 1 && (
                    <div className={`absolute left-[15px] top-8 w-0.5 h-full -translate-x-px ${step.done ? 'bg-indigo-200' : 'bg-slate-100'}`} />
                  )}
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                    step.done ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : step.current ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-300'
                  }`}>
                    {step.done ? <CheckCircle size={14} /> : step.current ? <Clock size={14} /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                  </div>
                  <div className="pb-8 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[14px] font-black ${step.done ? 'text-slate-900' : step.current ? 'text-amber-600' : 'text-slate-400'}`}>
                        {step.stage}
                      </span>
                      {step.current && <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest rounded-full">Current</span>}
                    </div>
                    {step.date && <div className="text-[11px] text-slate-400 font-bold mt-0.5">{new Date(step.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}</div>}
                    {step.note && <div className="text-[12px] text-slate-500 font-medium mt-1">{step.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Summary + Payments + Staff */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xl shadow-slate-200/30">
              <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-4">Order Summary</h3>
              <div className="space-y-2">
                {ORDER.items.map((item, i) => (
                  <div key={i} className="flex justify-between gap-2">
                    <span className="text-[13px] font-medium text-slate-600">{item.name}</span>
                    <span className="text-[13px] font-black text-slate-900 shrink-0">{formatPHP(item.price)}</span>
                  </div>
                ))}
                <div className="h-px bg-slate-100 my-2" />
                <div className="flex justify-between">
                  <span className="text-[13px] font-black">Total</span>
                  <span className="text-[16px] font-black">{formatPHP(ORDER.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-[12px]">
                  <span className="text-slate-500 font-medium">Down Payment</span>
                  <span className="font-bold text-emerald-600">−{formatPHP(ORDER.downPayment)}</span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="font-black">Balance Due</span>
                  <span className="font-black text-rose-600">{formatPHP(ORDER.balance)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xl shadow-slate-200/30">
              <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-4">Payments</h3>
              {ORDER.payments.map((p, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <CreditCard size={14} className="text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-[13px] font-black text-slate-900">{formatPHP(p.amount)} — {p.method}</div>
                    <div className="text-[11px] text-slate-400 font-bold">{new Date(p.date).toLocaleDateString('en-PH')} · {p.ref}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xl shadow-slate-200/30">
              <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-4">Assigned Tailor</h3>
              <div className="flex items-center gap-3">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ORDER.assignedStaff}`} alt={ORDER.assignedStaff} className="w-10 h-10 rounded-xl" />
                <div>
                  <div className="text-[14px] font-black text-slate-900">{ORDER.assignedStaff}</div>
                  <div className="text-[11px] text-indigo-500 font-bold uppercase tracking-widest">Master Tailor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

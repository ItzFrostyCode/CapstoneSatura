'use client';

import { BarChart3, TrendingUp, Users, ShoppingBag, Store, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

const PLATFORM_DATA = {
  totalShops:       12,
  activeShops:      9,
  pendingApproval:  2,
  totalUsers:       87,
  totalOrders:      342,
  ordersThisMonth:  47,
  platformRevenue:  34488,
  premiumShops:     5,
  basicShops:       7,
  shopsByStatus: [
    { label: 'Active',    count: 9,  color: 'bg-emerald-500' },
    { label: 'Pending',   count: 2,  color: 'bg-amber-500'   },
    { label: 'Suspended', count: 1,  color: 'bg-red-400'     },
  ],
  recentActivity: [
    { type: 'SHOP_REGISTERED',   label: 'New shop registered',          sub: 'Royal Cut Tailoring Shops — Pending verification', time: '2h ago' },
    { type: 'SUBSCRIPTION',      label: 'Subscription upgraded to PRO', sub: "Chard's Tailoring — ₱1,499/mo",            time: '5h ago' },
    { type: 'ORDER_MILESTONE',   label: '300th order on the platform',  sub: 'Davao Famous Tailoring · ORD-2026-0987',   time: '1d ago' },
    { type: 'USER_JOINED',       label: '5 new customers joined',       sub: 'Platform signups this week',                time: '2d ago' },
  ],
  monthlyGrowth: [
    { month: 'Jan', shops: 5,  users: 32, orders: 21 },
    { month: 'Feb', shops: 6,  users: 41, orders: 28 },
    { month: 'Mar', shops: 7,  users: 50, orders: 35 },
    { month: 'Apr', shops: 9,  users: 65, orders: 48 },
    { month: 'May', shops: 12, users: 87, orders: 57 },
  ],
};

const formatPHP = (n: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(n);

const maxOrders = Math.max(...PLATFORM_DATA.monthlyGrowth.map((m) => m.orders));

export default function AdminReportsPage() {
  return (
    <div className="relative min-h-full pb-20 pt-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center text-white">
          <BarChart3 size={16} />
        </div>
        <div>
          <h1 className="text-[22px] font-black text-slate-900 tracking-tight">Platform Analytics</h1>
          <p className="text-[13px] text-slate-500 font-medium">System-wide metrics across all shops and users</p>
        </div>
      </div>

      {/* Platform KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Shops',       val: PLATFORM_DATA.totalShops,      icon: Store,       color: 'text-indigo-600', bg: 'bg-indigo-50',  sub: `${PLATFORM_DATA.activeShops} active` },
          { label: 'Registered Users',  val: PLATFORM_DATA.totalUsers,      icon: Users,       color: 'text-emerald-600',bg: 'bg-emerald-50', sub: 'Across all roles' },
          { label: 'Total Orders',      val: PLATFORM_DATA.totalOrders,     icon: ShoppingBag, color: 'text-blue-600',   bg: 'bg-blue-50',    sub: `${PLATFORM_DATA.ordersThisMonth} this month` },
          { label: 'Platform Revenue',  val: formatPHP(PLATFORM_DATA.platformRevenue), icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50', sub: 'Subscription MRR' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center mb-3`}>
              <kpi.icon size={18} className={kpi.color} />
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</div>
            <div className={`text-[24px] font-black ${kpi.color}`}>{kpi.val}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {PLATFORM_DATA.pendingApproval > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <AlertCircle size={18} className="text-amber-600" />
          </div>
          <div>
            <div className="text-[14px] font-black text-amber-900">{PLATFORM_DATA.pendingApproval} shops pending verification</div>
            <div className="text-[12px] text-amber-600 font-medium">Review and approve or reject pending shop registrations.</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly Growth Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-widest mb-6">Monthly Platform Growth</h2>
          <div className="flex items-end gap-4 h-40">
            {PLATFORM_DATA.monthlyGrowth.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-black text-indigo-600">{m.orders}</span>
                <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: `${(m.orders / maxOrders) * 100}%` }}>
                  <div className="w-full bg-indigo-600 rounded-t-xl h-full" />
                </div>
                <span className="text-[11px] font-black text-slate-400 uppercase">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-6 mt-4 text-[11px] font-bold text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-indigo-500 inline-block" /> Orders</span>
          </div>
        </div>

        {/* Shop Status Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-widest mb-6">Shops by Status</h2>
          <div className="space-y-4 mb-6">
            {PLATFORM_DATA.shopsByStatus.map((s) => {
              const pct = Math.round((s.count / PLATFORM_DATA.totalShops) * 100);
              return (
                <div key={s.label}>
                  <div className="flex justify-between text-[12px] font-black text-slate-700 mb-1">
                    <span>{s.label}</span>
                    <span>{s.count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="h-px bg-slate-100 my-4" />
          <div className="space-y-2">
            {[
              { label: 'Premium Shops', val: PLATFORM_DATA.premiumShops, color: 'text-amber-600' },
              { label: 'Basic Shops',   val: PLATFORM_DATA.basicShops,   color: 'text-slate-600' },
            ].map((s) => (
              <div key={s.label} className="flex justify-between text-[13px]">
                <span className="font-medium text-slate-500">{s.label}</span>
                <span className={`font-black ${s.color}`}>{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Platform Activity */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
        <h2 className="text-[14px] font-black text-slate-900 uppercase tracking-widest mb-4">Recent Platform Activity</h2>
        <div className="space-y-3">
          {PLATFORM_DATA.recentActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center shrink-0">
                {a.type === 'SHOP_REGISTERED' && <Store size={16} className="text-indigo-500" />}
                {a.type === 'SUBSCRIPTION' && <CreditCard size={16} className="text-amber-500" />}
                {a.type === 'ORDER_MILESTONE' && <CheckCircle size={16} className="text-emerald-500" />}
                {a.type === 'USER_JOINED' && <Users size={16} className="text-blue-500" />}
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-black text-slate-900">{a.label}</div>
                <div className="text-[12px] text-slate-400 font-medium">{a.sub}</div>
              </div>
              <div className="text-[12px] font-bold text-slate-400 shrink-0">{a.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

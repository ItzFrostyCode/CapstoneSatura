'use client';

import { useState } from 'react';
import {
  CreditCard, CheckCircle, AlertCircle, Clock, TrendingUp,
  ArrowUpRight, Sparkles, RotateCcw, X
} from 'lucide-react';
import {
  INITIAL_SHOP_SUBSCRIPTIONS,
  PLATFORM_REVENUE_MAY_2026,
} from '@/mocks/subscriptions';
import { SHOP_PLAN_CONFIG } from '@/types/erp';
import type { SubscriptionStatus, PlanLevel } from '@/types/erp';

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatPHP = (n: number) =>
  new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 }).format(n);

const daysLeft = (endDate: string) =>
  Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000);

const STATUS_CFG: Record<SubscriptionStatus, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  ACTIVE:    { color: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-200', icon: CheckCircle  },
  TRIAL:     { color: 'text-indigo-700',  bg: 'bg-indigo-50',   border: 'border-indigo-200',  icon: Sparkles     },
  EXPIRED:   { color: 'text-red-700',     bg: 'bg-red-50',      border: 'border-red-200',     icon: AlertCircle  },
  CANCELLED: { color: 'text-slate-500',   bg: 'bg-slate-100',   border: 'border-slate-200',   icon: X            },
  PENDING:   { color: 'text-amber-700',   bg: 'bg-amber-50',    border: 'border-amber-200',   icon: Clock        },
};

const SHOP_PLAN_CFG: Record<PlanLevel, { color: string; bg: string; badge: string }> = {
  STARTER:      { color: 'text-slate-600',  bg: 'bg-slate-50',   badge: '🌱' },
  PROFESSIONAL: { color: 'text-indigo-700', bg: 'bg-indigo-50',  badge: '✂️' },
  Workshop:      { color: 'text-amber-700',  bg: 'bg-amber-50',   badge: '👑' },
};

// Augmented shop demo data (name, owner, email not in Subscription type — overlay for display)
const SHOP_META: Record<string, { shopName: string; ownerName: string; email: string }> = {
  'SHOP-001': { shopName: 'SUTURA',       ownerName: 'John Clock',       email: 'johncloc@sutura.ph'    },
  'SHOP-002': { shopName: 'Santos Bridal Gallery',      ownerName: 'Maria Santos',     email: 'msantos@sutura.ph'     },
  'SHOP-003': { shopName: 'Reyes Alterations Corner',   ownerName: 'Pedro Reyes',      email: 'preyes@sutura.ph'      },
  'SHOP-004': { shopName: 'Dela Cruz Bespoke',          ownerName: 'Elena Dela Cruz',  email: 'edelacruz@sutura.ph'   },
  'SHOP-005': { shopName: 'Mariposa Fashion Studio',    ownerName: 'Sofia Mariposa',   email: 'smariposa@sutura.ph'   },
};

// ── Component ─────────────────────────────────────────────────────────────────

type StatusFilter = 'all' | SubscriptionStatus;

export default function AdminSubscriptionsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const rev = PLATFORM_REVENUE_MAY_2026;

  const shopSubs = statusFilter === 'all'
    ? INITIAL_SHOP_SUBSCRIPTIONS
    : INITIAL_SHOP_SUBSCRIPTIONS.filter(s => s.status === statusFilter);

  return (
    <div className="relative min-h-full pb-20 pt-6 space-y-8">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
            <CreditCard size={22} />
          </div>
          <div>
            <h1 className="text-[26px] font-black text-slate-900 tracking-tight leading-none">
              Subscription Management
            </h1>
            <p className="text-[13px] text-slate-500 font-medium mt-1">
              {rev.period} · {rev.activeShopSubscriptions} shops
            </p>
          </div>
        </div>
      </div>

      {/* ── Revenue KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Monthly Revenue',
            val: formatPHP(rev.mrr),
            sub: `ARR ${formatPHP(rev.arr)}`,
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
          },
          {
            label: 'Active Plans',
            val: rev.activeShopSubscriptions,
            sub: `${rev.activeShopSubscriptions} shops active`,
            icon: CheckCircle,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            border: 'border-indigo-100',
          },
          {
            label: 'Consultation Fees',
            val: formatPHP(rev.totalConsultationFees),
            sub: '7% platform fee',
            icon: ArrowUpRight,
            color: 'text-violet-600',
            bg: 'bg-violet-50',
            border: 'border-violet-100',
          },
          {
            label: 'Churn Rate',
            val: `${rev.churnRate}%`,
            sub: `${rev.trialConversionRate}% trial → paid`,
            icon: RotateCcw,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            border: 'border-rose-100',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-white rounded-2xl border ${stat.border} p-5 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className={`w-9 h-9 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={16} className={stat.color} />
            </div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              {stat.label}
            </div>
            <div className={`text-[22px] font-black ${stat.color} leading-none`}>{stat.val}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Plan Breakdown Pills ── */}
      <div className="flex flex-wrap gap-3">
        <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest self-center mr-2">
          Plan Mix
        </div>
        {(Object.keys(SHOP_PLAN_CONFIG) as PlanLevel[]).map(plan => {
          const count = rev.planBreakdown[plan];
          const cfg = SHOP_PLAN_CFG[plan];
          return (
            <div
              key={plan}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-black ${cfg.bg} ${cfg.color} border-current/20`}
            >
              <span>{cfg.badge}</span>
              <span>{SHOP_PLAN_CONFIG[plan].name}</span>
              <span className="opacity-60">({count})</span>
            </div>
          );
        })}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 flex-wrap">
          {(['all', 'ACTIVE', 'TRIAL', 'EXPIRED', 'PENDING', 'CANCELLED'] as const).map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                statusFilter === f
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Shops Table ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <span>Shop</span>
          <span>Plan</span>
          <span>Status</span>
          <span>Billing</span>
          <span>Renews</span>
          <span>MRR</span>
        </div>

        {shopSubs.map((sub) => {
          const meta = SHOP_META[sub.shop_id] ?? { shopName: sub.shop_id, ownerName: '—', email: '—' };
          const planCfg = SHOP_PLAN_CFG[sub.planLevel];
          const statusCfg = STATUS_CFG[sub.status];
          const StatusIcon = statusCfg.icon;
          const remaining = daysLeft(sub.endDate);
          const planPrice = sub.billing_cycle === 'ANNUAL'
            ? SHOP_PLAN_CONFIG[sub.planLevel].annualPrice / 12
            : SHOP_PLAN_CONFIG[sub.planLevel].monthlyPrice;

          return (
            <div
              key={sub.id}
              className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-slate-50 last:border-0 items-center hover:bg-slate-50/40 transition-colors"
            >
              <div>
                <div className="text-[14px] font-black text-slate-900">{meta.shopName}</div>
                <div className="text-[11px] text-slate-400 font-medium">
                  {meta.ownerName} · {meta.email}
                </div>
                {sub.upgraded_from && (
                  <div className="text-[10px] text-indigo-500 font-bold mt-0.5">
                    ↑ Upgraded from {sub.upgraded_from}
                  </div>
                )}
              </div>

              <div>
                <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${planCfg.bg} ${planCfg.color}`}>
                  {SHOP_PLAN_CFG[sub.planLevel].badge} {sub.planName}
                </span>
              </div>

              <div>
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}>
                  <StatusIcon size={10} /> {sub.status}
                </span>
              </div>

              <div className="text-[12px] font-bold text-slate-600 uppercase tracking-wide">
                {sub.billing_cycle}
              </div>

              <div>
                <div className="text-[12px] font-bold text-slate-900">
                  {new Date(sub.endDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                {sub.status === 'ACTIVE' && remaining <= 30 && (
                  <div className="text-[11px] font-bold text-amber-600">{remaining}d left</div>
                )}
                {sub.status === 'TRIAL' && (
                  <div className="text-[11px] font-bold text-indigo-500">{remaining}d trial</div>
                )}
              </div>

              <div className="text-right">
                <div className="text-[14px] font-black text-slate-900">
                  {sub.price === 0 ? 'Free' : formatPHP(planPrice)}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">/mo equiv</div>
              </div>
            </div>
          );
        })}

        {shopSubs.length === 0 && (
          <div className="py-16 text-center">
            <CreditCard size={32} className="mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 font-bold text-[13px] uppercase tracking-widest">No subscriptions</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// SUTURA — Subscription Mock Data
// Source: Business Strategy (sutura_business_strategy.md)
// Tier Config: SHOP_PLAN_CONFIG / DESIGNER_PLAN_CONFIG in erp.ts
// ============================================================

import {
  Subscription,
  PlatformRevenueSummary,
} from '@/types/erp';

// ── SHOP SUBSCRIPTIONS ────────────────────────────────────────────────────────

/**
 * Demo shop subscriptions tied to the mock shop roster.
 * SHOP-001 = Davao Tailors PH (Workshop — top tier, annual)
 * SHOP-002 = Santos Bridal Gallery (Professional — monthly)
 * SHOP-003 = Reyes Alterations (Starter — free, upsell candidate)
 */
export const INITIAL_SHOP_SUBSCRIPTIONS: Subscription[] = [
  // ── SHOP-001 · Davao Tailors PH ──────────────────────
  // Annual Workshop subscriber. Upgraded from Professional.
  // Represents a mature, fully digitized Workshop on the platform.
  {
    id: 'SUB-SHOP-001',
    shop_id: 'SHOP-001',
    planName: 'Workshop',
    planLevel: 'Workshop',
    status: 'ACTIVE',
    billing_cycle: 'ANNUAL',
    maxBranches: 3,
    maxStaff: 20,
    startDate: new Date('2026-01-01').toISOString(),
    endDate: new Date('2026-12-31').toISOString(),
    price: 19990,
    payment_method: 'GCASH',
    auto_renew: true,
    upgraded_from: 'PROFESSIONAL',
    upgraded_at: new Date('2026-01-01').toISOString(),
  },

  // ── SHOP-002 · Santos Bridal Gallery ─────────────────────
  // Monthly Professional subscriber. Active bookings, no collaboration.
  // Represents a growing bridal shop with an active consultation calendar.
  {
    id: 'SUB-SHOP-002',
    shop_id: 'SHOP-002',
    planName: 'Professional',
    planLevel: 'PROFESSIONAL',
    status: 'ACTIVE',
    billing_cycle: 'MONTHLY',
    maxBranches: 1,
    maxStaff: 5,
    startDate: new Date('2026-05-01').toISOString(),
    endDate: new Date('2026-05-31').toISOString(),
    price: 799,
    payment_method: 'BANK_TRANSFER',
    auto_renew: true,
  },

  // ── SHOP-003 · Reyes Alterations Corner ──────────────────
  // Free Starter plan. Has 9 of 10 allowed customers — at the upsell cliff.
  // Used in demo to show upgrade prompt trigger.
  {
    id: 'SUB-SHOP-003',
    shop_id: 'SHOP-003',
    planName: 'Starter',
    planLevel: 'STARTER',
    status: 'ACTIVE',
    billing_cycle: 'MONTHLY',
    maxBranches: 1,
    maxStaff: 1,
    startDate: new Date('2026-04-15').toISOString(),
    endDate: new Date('2026-05-15').toISOString(),
    price: 0,
    payment_method: 'NONE',
    auto_renew: false,
  },

  // ── SHOP-004 · Dela Cruz Bespoke ─────────────────────────
  // Expired Professional — lapsed renewal. Shown in Admin churn view.
  {
    id: 'SUB-SHOP-004',
    shop_id: 'SHOP-004',
    planName: 'Professional',
    planLevel: 'PROFESSIONAL',
    status: 'EXPIRED',
    billing_cycle: 'MONTHLY',
    maxBranches: 1,
    maxStaff: 5,
    startDate: new Date('2026-04-01').toISOString(),
    endDate: new Date('2026-04-30').toISOString(),
    price: 799,
    payment_method: 'GCASH',
    auto_renew: false,
  },

  // ── SHOP-005 · Mariposa Fashion Studio ───────────────────
  // Trial — recently onboarded via white-glove. Conversion pending.
  {
    id: 'SUB-SHOP-005',
    shop_id: 'SHOP-005',
    planName: 'Professional (Trial)',
    planLevel: 'PROFESSIONAL',
    status: 'TRIAL',
    billing_cycle: 'MONTHLY',
    maxBranches: 1,
    maxStaff: 5,
    startDate: new Date('2026-05-10').toISOString(),
    endDate: new Date('2026-05-24').toISOString(),    // 14-day trial window
    price: 0,
    payment_method: 'NONE',
    auto_renew: false,
  },
];


// ── PLATFORM REVENUE SUMMARY (Admin Dashboard) ────────────────────────────────

/**
 * Current-month platform revenue summary.
 * Used by the Admin analytics dashboard to surface business health KPIs.
 *
 * Breakdown:
 *   Shop MRR:        SHOP-001 (Workshop annual ÷12 ≈ 1,666) + SHOP-002 (799) + SHOP-005 (trial = 0) = ≈ 2,465
 *   Designer MRR:    DSN-001 (Maison annual ÷12 ≈ 999) + DSN-002 (499) = ≈ 1,498
 *   Platform fees:   7% of ₱45,000 in confirmed consultation bookings this month = ₱3,150
 *   Featured rev:    2 shops paying ₱500/month boost = ₱1,000
 *   Total MRR:       ≈ ₱8,113
 */
export const PLATFORM_REVENUE_MAY_2026: PlatformRevenueSummary = {
  period: 'May 2026',
  mrr: 8113,
  arr: 97356,                       // MRR × 12
  activeShopSubscriptions: 4,       // SHOP-001, 002, 003, 005 (SHOP-004 expired)
  churnRate: 4.2,                   // SHOP-004 lapsed this period
  trialConversionRate: 18.5,        // Historical: 18.5% of Starter → Professional
  planBreakdown: {
    STARTER: 1,                     // SHOP-003
    PROFESSIONAL: 2,                // SHOP-002 + SHOP-005 (trial)
    Workshop: 1,                     // SHOP-001
  },
  totalConsultationFees: 3150,      // 7% of ₱45,000 in bookings
  totalFeaturedRevenue: 1000,       // 2 × ₱500 featured boost
};

// ── UPSELL TRIGGER THRESHOLDS ─────────────────────────────────────────────────

/**
 * Usage-limit thresholds that trigger upgrade prompts in the UI.
 * Import in shop dashboard components to conditionally render upsell banners.
 */
export const UPSELL_TRIGGERS = {
  /** Show upgrade banner when customer count reaches this % of plan limit */
  customerUtilizationWarning: 0.80,   // 80% of maxCustomers
  /** Show upgrade banner at exactly this count (Starter = 9/10) */
  starterCustomerWarningAt: 9,
  /** Show consultation booking upsell if shop has received this many walk-in inquiries */
  consultationUpsellThreshold: 5,
} as const;

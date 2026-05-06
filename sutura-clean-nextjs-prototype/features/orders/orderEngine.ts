/**
 * Sutura ERP — Order Domain Engine
 * Pure logic for resolving order states from normalized data.
 * No side effects. No store imports. All functions are deterministic.
 */

import { Payment, ProductionTask, TaskStatus } from '@/types/erp';

export type PaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID_FULL';
export type ProductionStage =
  | 'ON_HOLD'
  | 'IN_PRODUCTION'
  | 'QUALITY_CHECK'
  | 'REVISION_REQUIRED'
  | 'COMPLETED'
  | 'DELIVERED';

// Re-export so consumers can use from engine or types
export type { TaskStatus };

export interface OrderEngineInput {
  total_amount?: number;
  totalValue?: number;            // Legacy alias
  tasks?: ProductionTask[];
  inspection_passed?: boolean;
  inspection_failed?: boolean;
  inspectionPassed?: boolean;     // Legacy alias
  inspectionFailed?: boolean;     // Legacy alias
  // Normalized: pass payments array for accurate balance
  payments?: Payment[];
  // Legacy: pass amount_paid directly (still supported for backward compat)
  amount_paid?: number;
  amountPaid?: number;            // Legacy alias
}

// ── PAYMENT LOGIC ─────────────────────────────────────────────

/**
 * Computes the total amount paid from the normalized Payments table.
 * Falls back to amount_paid field if no payments array given (legacy).
 */
export function computeAmountPaid(input: OrderEngineInput): number {
  if (input.payments && input.payments.length > 0) {
    return input.payments
      .filter(p => p.status === 'CONFIRMED')
      .reduce((sum: number, p) => sum + (p.amount || p.amount_paid || 0), 0);
  }
  return input.amount_paid ?? input.amountPaid ?? 0;
}

/**
 * Resolves payment status from normalized payment data.
 */
export function getPaymentStatus(input: OrderEngineInput): PaymentStatus {
  const paid = computeAmountPaid(input);
  const total = input.total_amount ?? input.totalValue ?? 0;
  if (paid <= 0) return 'UNPAID';
  if (paid < total) return 'PARTIAL';
  return 'PAID_FULL';
}

/**
 * Computes the outstanding balance.
 */
export function computeBalance(input: OrderEngineInput): number {
  const total = input.total_amount ?? input.totalValue ?? 0;
  return Math.max(0, total - computeAmountPaid(input));
}


// ── PRODUCTION LOGIC ──────────────────────────────────────────

/**
 * Resolves the production stage.
 * Gate rules (in priority order):
 * 1. UNPAID → ON_HOLD
 * 2. inspection_failed → REVISION_REQUIRED
 * 3. inspection_passed + PAID_FULL → COMPLETED
 * 4. inspection_passed (partial) → QUALITY_CHECK
 * 5. All tasks complete → QUALITY_CHECK
 * 6. Default → IN_PRODUCTION
 */
export function getProductionStage(input: OrderEngineInput): ProductionStage {
  const paymentStatus = getPaymentStatus(input);
  const tasks = input.tasks ?? [];
  const allTasksDone = tasks.length > 0 && tasks.every(t => t.status === 'Completed' || (t.status as string) === 'Completed');
  const failed = input.inspection_failed || input.inspectionFailed;
  const passed = input.inspection_passed || input.inspectionPassed;

  if (paymentStatus === 'UNPAID') return 'ON_HOLD';
  if (failed) return 'REVISION_REQUIRED';
  if (passed) {
    return paymentStatus === 'PAID_FULL' ? 'COMPLETED' : 'QUALITY_CHECK';
  }
  if (allTasksDone) return 'QUALITY_CHECK';
  return 'IN_PRODUCTION';
}


// ── MASTER RESOLVER ───────────────────────────────────────────

/**
 * Master resolver — computes all derived order state in one call.
 * Use this in components instead of computing individual fields.
 */
export function resolveOrderState(input: OrderEngineInput) {
  const paymentStatus = getPaymentStatus(input);
  const productionStage = getProductionStage(input);
  const amountPaid = computeAmountPaid(input);
  const balance = computeBalance(input);

  const tasks = input.tasks ?? [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    paymentStatus,
    productionStage,
    amountPaid,
    balance,
    progress,
    taskStats: {
      completed: completedTasks,
      total: totalTasks,
      percent: progress,
      label: `${completedTasks}/${totalTasks} tasks complete`,
    },
    isFullyPaid: paymentStatus === 'PAID_FULL',
    isAtRisk:
      !!input.inspection_failed ||
      tasks.some(t => t.status === 'Blocked' || t.status === 'For Revision'),
    canBeInspected: totalTasks > 0 && tasks.every(t => t.status === 'Completed'),
  };
}


// ── DISPLAY HELPERS ───────────────────────────────────────────

export function getStageExplanation(stage: ProductionStage): string {
  const explanations: Record<ProductionStage, string> = {
    ON_HOLD: 'Waiting for initial downpayment to begin production.',
    IN_PRODUCTION: 'Order is currently in the tailoring phase.',
    QUALITY_CHECK: 'Production tasks complete. Final quality inspection ongoing.',
    REVISION_REQUIRED: 'Issues detected during inspection. Order is back for revision.',
    COMPLETED: 'Order ready for release and delivery.',
    DELIVERED: 'Order successfully handed over to customer.',
  };
  return explanations[stage];
}

export function getDisplayLabel(state: PaymentStatus | ProductionStage | string): string {
  const labels: Record<string, string> = {
    UNPAID: 'Unpaid',
    PARTIAL: 'Partial Payment',
    PAID_FULL: 'Paid Full',
    ON_HOLD: 'On Hold',
    IN_PRODUCTION: 'In Production',
    QUALITY_CHECK: 'Inspection',
    REVISION_REQUIRED: 'For Revision',
    COMPLETED: 'Completed',
    DELIVERED: 'Delivered',
  };
  return labels[state] ?? state;
}

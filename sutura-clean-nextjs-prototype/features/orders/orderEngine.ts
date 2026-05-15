/**
 * Sutura ERP — Order Domain Engine
 * Pure logic for resolving order states from normalized data.
 * No side effects. No store imports. All functions are deterministic.
 */

import { Payment, ProductionTask, TaskStatus } from '@/types/erp';

export type PaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID_FULL';
export type ProductionStage =
  | 'INTAKE'
  | 'MEASUREMENT'
  | 'MATERIAL_PREP'
  | 'CUTTING'
  | 'SEWING'
  | 'FITTING'
  | 'ALTERATIONS'
  | 'FINISHING'
  | 'QUALITY_CHECK'
  | 'READY_FOR_PICKUP'
  | 'RELEASED'
  | 'CANCELLED'
  | 'ON_HOLD'
  // Legacy milestones
  | 'PENDING_QUOTE' | 'WAITING_FOR_DP' | 'IN_PRODUCTION' | 'READY_FOR_FITTING';

// ── CUSTOMER VISIBILITY LAYER ──────────────────────────────────

export type CustomerMilestone = 
  | 'Request Sent'
  | 'Appointment Approved'
  | 'Measurement Scheduled'
  | 'In Production'
  | 'Ready for Fitting'
  | 'Under Alteration'
  | 'Ready for Pickup'
  | 'Released'
  | 'On Hold'
  | 'Cancelled';

/**
 * Maps granular internal stages to simplified customer milestones.
 */
export function getCustomerMilestone(stage: ProductionStage | string): CustomerMilestone {
  const mapping: Record<string, CustomerMilestone> = {
    INTAKE: 'Request Sent',
    PENDING_QUOTE: 'Request Sent',
    WAITING_FOR_DP: 'Appointment Approved',
    MEASUREMENT: 'Measurement Scheduled',
    MATERIAL_PREP: 'In Production',
    CUTTING: 'In Production',
    SEWING: 'In Production',
    FINISHING: 'In Production',
    QUALITY_CHECK: 'In Production',
    IN_PRODUCTION: 'In Production',
    FITTING: 'Ready for Fitting',
    READY_FOR_FITTING: 'Ready for Fitting',
    ALTERATIONS: 'Under Alteration',
    READY_FOR_PICKUP: 'Ready for Pickup',
    RELEASED: 'Released',
    ON_HOLD: 'On Hold',
    CANCELLED: 'Cancelled',
  };
  return mapping[stage] || 'In Production';
}

// ── STAFF VISIBILITY LAYER ─────────────────────────────────────

export function getStaffLabel(stage: ProductionStage | string): string {
  const labels: Record<string, string> = {
    INTAKE: 'Intake / Agreement',
    MEASUREMENT: 'Measurement',
    MATERIAL_PREP: 'Material Prep',
    CUTTING: 'Cutting',
    SEWING: 'Sewing',
    FITTING: 'First Fitting',
    ALTERATIONS: 'Alteration / Adjustment',
    FINISHING: 'Finishing',
    QUALITY_CHECK: 'Quality Check',
    READY_FOR_PICKUP: 'Ready for Pickup',
    RELEASED: 'Released',
    ON_HOLD: 'On Hold',
    CANCELLED: 'Cancelled',
  };
  return labels[stage] ?? stage;
}

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
  status?: string;                // Manual status from DB
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
 * Maps technical backend status to the ProductionStage type.
 */
export function getProductionStage(input: OrderEngineInput): ProductionStage {
  const status = input.status || 'INTAKE';
  
  // Direct mapping if it's already a valid ProductionStage
  const validStages: string[] = [
    'INTAKE', 'MEASUREMENT', 'MATERIAL_PREP', 'CUTTING', 'SEWING', 
    'FITTING', 'ALTERATIONS', 'FINISHING', 'QUALITY_CHECK', 
    'READY_FOR_PICKUP', 'RELEASED', 'CANCELLED', 'ON_HOLD'
  ];
  
  if (validStages.includes(status)) return status as ProductionStage;

  // Legacy fallback mapping
  const legacyMapping: Record<string, ProductionStage> = {
    'PENDING_QUOTE': 'INTAKE',
    'WAITING_FOR_DOWN_PAYMENT': 'INTAKE',
    'IN_PRODUCTION': 'SEWING',
    'READY_FOR_FITTING': 'FITTING',
    'READY_FOR_RELEASE': 'READY_FOR_PICKUP',
  };

  return legacyMapping[status] || 'INTAKE';
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
  const completedTasks = tasks.filter((t: ProductionTask) => t.status === 'Completed').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    paymentStatus,
    productionStage,
    customerMilestone: getCustomerMilestone(productionStage),
    staffLabel: getStaffLabel(productionStage),
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
      tasks.some((t: ProductionTask) => t.status === 'Delayed' || t.status === 'For Revision'),
    canBeInspected: totalTasks > 0 && tasks.every((t: ProductionTask) => t.status === 'Completed'),
  };
}


// ── DISPLAY HELPERS ───────────────────────────────────────────

export function getStageExplanation(stage: ProductionStage): string {
  const explanations: Record<string, string> = {
    INTAKE: 'Finalizing design agreement and intake details.',
    MEASUREMENT: 'Recording client measurements for pattern drafting.',
    MATERIAL_PREP: 'Preparing fabrics and notions for cutting.',
    CUTTING: 'Pattern drafting and fabric cutting in progress.',
    SEWING: 'Main construction and assembly phase.',
    FITTING: 'Garment is ready for the first fitting session.',
    ALTERATIONS: 'Adjustments being made based on fitting feedback.',
    FINISHING: 'Applying final details and detailing.',
    QUALITY_CHECK: 'Final inspection for quality assurance.',
    READY_FOR_PICKUP: 'Garment is complete and ready for release.',
    RELEASED: 'Order successfully handed over to customer.',
    CANCELLED: 'Order cancelled.',
    ON_HOLD: 'Order is on hold.',
  };
  return explanations[stage] ?? 'Order is in progress.';
}

export function getDisplayLabel(state: string, mode: 'customer' | 'staff' = 'staff'): string {
  if (mode === 'customer') return getCustomerMilestone(state);
  return getStaffLabel(state);
}

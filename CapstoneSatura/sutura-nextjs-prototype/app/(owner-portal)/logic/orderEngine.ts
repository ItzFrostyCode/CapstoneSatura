/**
 * Sutura ERP - Domain Rule Engine
 * This file contains the pure logic for resolving order states based on transactional data.
 * It ensures that production stages and payment statuses are deterministic and consistent.
 */

export type PaymentStatus = 'UNPAID' | 'PARTIAL' | 'PAID_FULL';
export type ProductionStage = 'ON_HOLD' | 'IN_PRODUCTION' | 'QUALITY_CHECK' | 'REVISION_REQUIRED' | 'COMPLETED' | 'DELIVERED';

export interface ProductionTask {
  id: string;
  title: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  estimatedDate?: string;
}

export interface OrderInput {
  totalValue: number;
  amountPaid: number;
  tasks?: ProductionTask[];
  inspectionFailed?: boolean;
  inspectionPassed?: boolean;
}

/**
 * Resolves the payment status based on amount paid vs total value.
 */
export function getPaymentStatus(order: OrderInput): PaymentStatus {
  if (order.amountPaid <= 0) return 'UNPAID';
  if (order.amountPaid < order.totalValue) return 'PARTIAL';
  return 'PAID_FULL';
}

/**
 * Resolves the production stage based on payment status and inspection results.
 * Logic:
 * - UNPAID -> ON_HOLD
 * - PARTIAL -> IN_PRODUCTION
 * - PAID_FULL -> QUALITY_CHECK (unless inspection failed)
 * - inspectionFailed == true -> REVISION_REQUIRED
 */
export function getProductionStage(order: OrderInput): ProductionStage {
  const paymentStatus = getPaymentStatus(order);
  const tasks = order.tasks || [];
  const allTasksCompleted = tasks.length > 0 && tasks.every(t => t.status === 'Completed');
  const progressPercent = tasks.length > 0 ? (tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100 : 0;

  // 1. GATE: ON_HOLD if unpaid (or below deposit, but for now UNPAID rule)
  if (paymentStatus === 'UNPAID') return 'ON_HOLD';

  // 2. GATE: REVISION_REQUIRED if inspection failed
  if (order.inspectionFailed) return 'REVISION_REQUIRED';
  
  // 3. GATE: COMPLETED/DELIVERED if inspection passed
  if (order.inspectionPassed) {
    return paymentStatus === 'PAID_FULL' ? 'COMPLETED' : 'QUALITY_CHECK'; // Still quality check until paid if you want to gate delivery
  }

  // 4. GATE: QUALITY_CHECK if production tasks are 100%
  if (allTasksCompleted) return 'QUALITY_CHECK';

  // 5. DEFAULT: IN_PRODUCTION
  return 'IN_PRODUCTION';
}

/**
 * Master resolver for all derived order states.
 */
export function resolveOrderState(order: OrderInput) {
  const paymentStatus = getPaymentStatus(order);
  const productionStage = getProductionStage(order);
  const balance = Math.max(0, order.totalValue - order.amountPaid);
  
  const tasks = order.tasks || [];
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return {
    paymentStatus,
    productionStage,
    balance,
    progress,
    isFullyPaid: paymentStatus === 'PAID_FULL',
    isAtRisk: order.inspectionFailed,
    canBeInspected: tasks.length > 0 && tasks.every(t => t.status === 'Completed'),
  };
}

/**
 * Returns a human-readable explanation for why an order is in its current stage.
 */
export function getStageExplanation(stage: ProductionStage): string {
  const explanations: Record<ProductionStage, string> = {
    ON_HOLD: "Waiting for initial downpayment to begin production.",
    IN_PRODUCTION: "Order is currently in the tailoring phase.",
    QUALITY_CHECK: "Production tasks complete. Final quality inspection ongoing.",
    REVISION_REQUIRED: "Issues detected during inspection. Order is back for revision.",
    COMPLETED: "Order ready for release and delivery.",
    DELIVERED: "Order successfully handed over to customer.",
  };

  return explanations[stage];
}

/**
 * Returns UI-friendly labels for the internal ERP-safe state names.
 */
export function getDisplayLabel(state: PaymentStatus | ProductionStage): string {
  const labels: Record<string, string> = {
    UNPAID: "Unpaid",
    PARTIAL: "Partial Payment",
    PAID_FULL: "Paid Full",
    ON_HOLD: "On Hold",
    IN_PRODUCTION: "In Production",
    QUALITY_CHECK: "Inspection",
    REVISION_REQUIRED: "For Revision",
    COMPLETED: "Completed",
    DELIVERED: "Delivered",
  };

  return labels[state] || state;
}

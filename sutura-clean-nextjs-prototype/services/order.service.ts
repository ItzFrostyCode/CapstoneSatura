import { resolveOrderState, ProductionStage } from '@/features/orders/orderEngine';
import { JobOrder } from '@/types/order';

export const OrderService = {
  /**
   * Calculates the current status of an order based on production and payment data.
   */
  getOrderSummary(order: JobOrder) {
    const state = resolveOrderState(order);
    return {
      ...state,
      isOverdue: new Date(order.dueDate || '').getTime() < new Date().getTime() && state.productionStage !== 'RELEASED',
      daysUntilDue: Math.ceil((new Date(order.dueDate || '').getTime() - new Date().getTime()) / (1000 * 3600 * 24)),
    };
  },

  /**
   * Filters orders by production stage.
   */
  filterByStage(orders: JobOrder[], stage: ProductionStage) {
    return orders.filter(o => resolveOrderState(o).productionStage === stage);
  },

  /**
   * Logic for can an order be released.
   */
  canRelease(order: JobOrder) {
    const state = resolveOrderState(order);
    return state.productionStage === 'READY_FOR_RELEASE' && state.isFullyPaid;
  },

  /**
   * Formats an order ID for display.
   */

  formatOrderId(id: string) {
    return `#${id.replace('ORD-', '')}`;
  }
};

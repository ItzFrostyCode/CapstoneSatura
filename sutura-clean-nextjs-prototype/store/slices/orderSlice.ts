import { StateCreator } from 'zustand';
import { Order, OrderStatus, OrderStatusLog, GarmentTemplate, JobOrderItem, ProductionTask, Payment, TaskStatus, OrderInspection, Invoice, ProductionDiscrepancy } from '@/types/erp';
import {
  INITIAL_ORDERS, INITIAL_TEMPLATES, INITIAL_JOB_ORDER_ITEMS,
  INITIAL_PRODUCTION_TASKS, INITIAL_PAYMENTS, INITIAL_INVOICES
} from '@/mocks/mockData';
import { ERPStore } from '../useERPStore';

export interface OrderSlice {
  // Normalized tables
  orders: Order[];
  jobOrderItems: JobOrderItem[];
  productionTasks: ProductionTask[];
  payments: Payment[];
  orderInspections: OrderInspection[];
  orderStatusLogs: OrderStatusLog[];
  garmentTemplates: GarmentTemplate[];
  invoices: Invoice[];
  productionDiscrepancies: ProductionDiscrepancy[];

  // Actions
  createNewOrder: (order: Partial<Order>, items?: Partial<JobOrderItem>[], tasks?: string[]) => void;
  logProductionDiscrepancy: (discrepancy: Omit<ProductionDiscrepancy, 'id' | 'logged_at'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => void;
  recordPayment: (orderId: string, amount: number, receivedBy: string, method?: string, ref?: string, image?: string) => void;
  recordInspection: (orderId: string, failed: boolean, staffId: string, notes?: string) => void;
  addGarmentTemplate: (template: Partial<GarmentTemplate>) => void;
  updateTaskStatus: (orderId: string, taskId: string, status: TaskStatus) => void;
  addProductionTask: (orderId: string, title: string, assignedTo: string) => void;
  createInvoice: (invoice: Partial<Invoice>) => void;
  recordInvoicePayment: (invoiceId: string, amount: number, method: string, receivedBy: string, ref?: string, notes?: string, image?: string, date?: string) => void;
  addPayment: (payment: { 
    order_id: string; 
    amount_paid: number; 
    payment_method: string; 
    received_by?: string; 
    paid_at?: string; 
    notes?: string; 
  }) => void;

  // Selector: returns Order with items/tasks/payments joined (for UI backward compat)
  getEnrichedOrder: (orderId: string) => Order | undefined;
  getEnrichedOrders: () => Order[];
  getOrderPayments: (orderId: string) => Payment[];
  getOrderAmountPaid: (orderId: string) => number;
}

export const createOrderSlice: StateCreator<ERPStore, [], [], OrderSlice> = (set, get) => ({
  orders: INITIAL_ORDERS,
  jobOrderItems: INITIAL_JOB_ORDER_ITEMS,
  productionTasks: INITIAL_PRODUCTION_TASKS,
  payments: INITIAL_PAYMENTS,
  orderInspections: [],
  orderStatusLogs: [],
  garmentTemplates: INITIAL_TEMPLATES,
  invoices: INITIAL_INVOICES,
  productionDiscrepancies: [],

  // ── Selector: join normalized tables onto Order for UI ──────
  getEnrichedOrder: (orderId) => {
    const state = get();
    const order = state.orders.find(o => o.id === orderId);
    if (!order) return undefined;
    const orderPayments = state.payments.filter(p => p.job_order_id === orderId);
    const amountPaid = orderPayments.filter(p => p.status === 'CONFIRMED').reduce((s, p) => s + p.amount, 0);
    const inspection = state.orderInspections.filter(i => i.job_order_id === orderId).at(-1);
    return {
      ...order,
      items: state.jobOrderItems.filter(i => i.job_order_id === orderId),
      tasks: state.productionTasks.filter(t => t.job_order_id === orderId),
      amount_paid: amountPaid,
      balance: Math.max(0, order.total_amount - amountPaid),
      inspection_passed: inspection?.passed === true,
      inspection_failed: inspection?.passed === false,
      discrepancies: state.productionDiscrepancies.filter(d => d.job_order_id === orderId),
    };
  },

  getEnrichedOrders: () => {
    const state = get();
    return state.orders.map(order => {
      const orderPayments = state.payments.filter(p => p.job_order_id === order.id);
      const amountPaid = orderPayments.filter(p => p.status === 'CONFIRMED').reduce((s, p) => s + p.amount, 0);
      const inspection = state.orderInspections.filter(i => i.job_order_id === order.id).at(-1);
      return {
        ...order,
        items: state.jobOrderItems.filter(i => i.job_order_id === order.id),
        tasks: state.productionTasks.filter(t => t.job_order_id === order.id),
        amount_paid: amountPaid,
        balance: Math.max(0, order.total_amount - amountPaid),
        inspection_passed: inspection?.passed === true,
        inspection_failed: inspection?.passed === false,
        discrepancies: state.productionDiscrepancies.filter(d => d.job_order_id === order.id),
      };
    });
  },

  getOrderPayments: (orderId) => get().payments.filter(p => p.job_order_id === orderId),

  getOrderAmountPaid: (orderId) =>
    get().payments
      .filter(p => p.job_order_id === orderId && p.status === 'CONFIRMED')
      .reduce((s, p) => s + p.amount, 0),

  // ── Actions ──────────────────────────────────────────────────
  createNewOrder: (orderData, itemInputs = [], taskTitles = []) => set((state) => {
    const newOrderId = `ORD-${Date.now()}`;

    const newOrder: Order = {
      shop_id: 'SHOP-001',
      branch_id: 'BRN-001',
      status: 'PENDING_QUOTE',
      priority: 'Normal',
      total_amount: 0,
      created_at: new Date().toISOString(),
      ...orderData,
      id: newOrderId,
    } as Order;

    const newItems: JobOrderItem[] = itemInputs.map((item, i) => ({
      id: `JOI-${Date.now()}-${i}`,
      job_order_id: newOrderId,
      garment_name: item.garment_name ?? 'Custom Garment',
      quantity: item.quantity ?? 1,
      unit_price: item.unit_price ?? 0,
      line_total: (item.quantity ?? 1) * (item.unit_price ?? 0),
      ...item,
    } as JobOrderItem));

    const newTasks: ProductionTask[] = taskTitles.map((title, i) => ({
      id: `TSK-${Date.now()}-${i}`,
      job_order_id: newOrderId,
      title,
      status: 'Pending' as TaskStatus,
    }));

    const initialLog: OrderStatusLog = {
      id: `LOG-${Date.now()}`,
      order_id: newOrderId,
      new_status: 'PENDING_QUOTE',
      changed_by: 'SYSTEM',
      changed_at: new Date().toISOString(),
      remarks: 'Order created via Job Order Wizard.',
    };

    return {
      orders: [newOrder, ...state.orders],
      jobOrderItems: [...state.jobOrderItems, ...newItems],
      productionTasks: [...state.productionTasks, ...newTasks],
      orderStatusLogs: [initialLog, ...state.orderStatusLogs],
    };
  }),

  logProductionDiscrepancy: (discrepancy) => {
    set((state) => {
      const newDiscrepancy: ProductionDiscrepancy = {
        ...discrepancy,
        id: `DISC-${Date.now()}`,
        logged_at: new Date().toISOString()
      };
      
      const order = state.orders.find(o => o.id === discrepancy.job_order_id);
      let updatedOrders = state.orders;
      if (order) {
        const actualBom = (order.actual_bom_cost ?? order.total_bom_cost ?? 0) + (discrepancy.discrepancy_type === 'MATERIAL_WASTE' || discrepancy.discrepancy_type === 'DEFECTIVE_MATERIAL' ? discrepancy.financial_impact : 0);
        const actualLabor = (order.actual_labor_cost ?? order.total_labor_cost ?? 0) + (discrepancy.discrepancy_type === 'EXTRA_LABOR' || discrepancy.discrepancy_type === 'UNPLANNED_ALTERATION' ? discrepancy.financial_impact : 0);
        const actualProd = actualBom + actualLabor;
        const actualMargin = order.total_amount > 0 ? ((order.total_amount - actualProd) / order.total_amount) * 100 : 0;
        
        updatedOrders = state.orders.map(o => o.id === order.id ? {
          ...o,
          actual_bom_cost: actualBom,
          actual_labor_cost: actualLabor,
          actual_production_cost: actualProd,
          actual_profit_margin: Number(actualMargin.toFixed(2))
        } : o);
      }

      return {
        productionDiscrepancies: [newDiscrepancy, ...state.productionDiscrepancies],
        orders: updatedOrders
      };
    });
    
    get().pushNotification(`Production issue logged. Production cost and margin updated.`, 'warning');
  },

  updateOrderStatus: (orderId, status, notes) => {
    set((state) => {
      const order = state.orders.find(o => o.id === orderId);
      const log: OrderStatusLog = {
        id: `LOG-${Date.now()}`,
        order_id: orderId,
        previous_status: order?.status,
        new_status: status,
        changed_by: 'SYSTEM',
        changed_at: new Date().toISOString(),
        remarks: notes ?? `Status updated to ${status}`,
      };
      return {
        orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o),
        orderStatusLogs: [log, ...state.orderStatusLogs],
      };
    });
  },

  recordPayment: (orderId, amount, receivedBy, method = 'CASH', ref, image) => {
    set((state) => {
      const payment: Payment = {
        id: `PAY-${Date.now()}`,
        job_order_id: orderId,
        received_by_user_id: receivedBy,
        amount,
        payment_method: method,
        reference_no: ref,
        receipt_image: image,
        paid_at: new Date().toISOString(),
        status: 'CONFIRMED',
      };
      return { payments: [payment, ...state.payments] };
    });
    
    get().pushNotification(`Payment of ₱${amount.toLocaleString()} posted successfully via ${method}.`, 'success');
  },

  recordInspection: (orderId, failed, staffId, notes) => {
    set((state) => {
      const inspection: OrderInspection = {
        id: `INS-${Date.now()}`,
        job_order_id: orderId,
        passed: !failed,
        inspected_by_user_id: staffId,
        inspected_at: new Date().toISOString(),
        notes,
      };
      const newStatus: OrderStatus = failed ? 'ALTERATIONS' : 'READY_FOR_RELEASE';
      const log: OrderStatusLog = {
        id: `LOG-${Date.now()}`,
        order_id: orderId,
        new_status: newStatus,
        changed_by: staffId,
        changed_at: new Date().toISOString(),
        remarks: failed ? `FAILED INSPECTION: ${notes}` : `PASSED INSPECTION: ${notes}`,
      };
      return {
        orderInspections: [inspection, ...state.orderInspections],
        orders: state.orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o),
        orderStatusLogs: [log, ...state.orderStatusLogs],
      };
    });
    
    if (failed) {
      get().pushNotification(`Quality Check FAILED. Order sent to Rework / Alterations.`, 'error');
    } else {
      get().pushNotification(`Quality Check PASSED. Order is now ready for Handover & Release.`, 'success');
    }
  },

  addGarmentTemplate: (template) => set((state) => ({
    garmentTemplates: [{ id: `TMP-${Date.now()}`, ...template } as GarmentTemplate, ...state.garmentTemplates],
  })),

  updateTaskStatus: (orderId, taskId, status) => set((state) => ({
    productionTasks: state.productionTasks.map(t =>
      t.id === taskId && t.job_order_id === orderId ? { ...t, status } : t
    ),
  })),

  addProductionTask: (orderId, title, assignedTo) => set((state) => {
    const newTask: ProductionTask = {
      id: `TSK-${Date.now()}`,
      job_order_id: orderId,
      title,
      status: 'Pending',
      assigned_staff_id: assignedTo,
    };
    return { productionTasks: [...state.productionTasks, newTask] };
  }),

  createInvoice: (invoice) => set((state) => ({
    invoices: [{
      id: `INV-${Date.now()}`,
      shop_id: 'SHOP-001',
      branch_id: 'BRN-001',
      status: 'UNPAID',
      issued_at: new Date().toISOString(),
      due_date: new Date().toISOString(),
      ...invoice
    } as Invoice, ...state.invoices]
  })),

  recordInvoicePayment: (invoiceId, amount, method, receivedBy, ref, notes, image, date) => set((state) => {
    const payment: Payment = {
      id: `PAY-${Date.now()}`,
      invoice_id: invoiceId,
      received_by_user_id: receivedBy,
      amount,
      amount_paid: amount,
      payment_method: method,
      reference_no: ref,
      receipt_image: image,
      remarks: notes,
      paid_at: date || new Date().toISOString(),
      status: 'CONFIRMED'
    };
    return { payments: [payment, ...state.payments] };
  }),

  addPayment: (payment) => set((state) => {
    const newPayment: Payment = {
      id: `PAY-${Date.now()}`,
      job_order_id: payment.order_id,
      received_by_user_id: payment.received_by || 'STF-001',
      amount: payment.amount_paid,
      amount_paid: payment.amount_paid,
      payment_method: payment.payment_method,
      paid_at: payment.paid_at || new Date().toISOString(),
      remarks: payment.notes,
      status: 'CONFIRMED'
    };
    return { payments: [newPayment, ...state.payments] };
  }),
});

import { create } from 'zustand';
import staffData from '../../../data/staff.json';
import inventoryData from '../../../data/inventory.json';
import suppliersData from '../../../data/suppliers.json';
import ordersData from '../../../data/orders.json';
import customersData from '../../../data/customers.json';
import billingData from '../../../data/billing.json';
import paymentsData from '../../../data/payments.json';
import measurementsData from '../../../data/measurements.json';
import orderStatusLogsData from '../../../data/order_status_logs.json';
import appointmentsData from '../../../data/appointments_extended.json';
import stockMovementsData from '../../../data/stock_movements.json';
import { resolveOrderState, getDisplayLabel, ProductionTask } from '../logic/orderEngine';

export type AppointmentStatus = 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No Show';

export interface Appointment {
  id: string;
  customer: string;
  email: string;
  phone: string;
  type: string;
  category: string;
  date: string;
  startTime: string;
  duration: number;
  status: AppointmentStatus;
  staff: string;
  reason: string;
}

export type StaffRole = 'Admin' | 'Sales' | 'Tailor' | 'Inventory';

export interface Staff {
  id: string;
  staffCode: string;
  name: string;
  roles: StaffRole[];
  hasSystemAccess: boolean;
  phone: string;
  email: string;
  status: 'Active' | 'Inactive';
}

export interface InventoryItem {
  sku: string;
  item: string;
  cat: string;
  stock: number;
  minStock: number;
  reserved: number;
  unit: string;
  price: number;
  cost: number;
  location: string;
  supplier_id?: string;
  image?: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  contact: string;
  phone: string;
  category: string;
  items: string[];
  leadTime: string;
  rating: string;
  status: string;
}

export interface POItem {
  sku: string;
  qty: number;
  cost: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  date: string;
  status: 'Ordered' | 'Partially Received' | 'Received' | 'Cancelled';
  amount: number;
  items: POItem[];
  eta: string;
  created_by: string; // staff_id FK
}

export interface StockMovement {
  id: string;
  date: string;
  type: 'Stock In' | 'Usage' | 'Stock Adjustment' | 'Production';
  itemSku: string;
  itemName: string;
  qty: number;
  unit: string;
  staff_id: string; // staff_id FK
  ref: string;
  supplierId?: string; // supplier_id FK (optional, present on Stock In)
}

export interface BOMRecipe {
  productId: string;
  materials: { sku: string; qty: number; }[];
}

export interface Payment {
  id: string;
  invoice_id?: string;
  order_id: string;
  customer_id: string;
  amount_paid: number;
  payment_method: string;
  reference_number?: string | null; // GCash ref, bank trace, check number
  receipt_image?: string | null;    // URL or base64 of the receipt image
  received_by: string; // staff_id FK
  paid_at: string;
  notes: string;
}

export interface MeasurementProfile {
  id: string;
  customer_id: string;
  neck: number;
  chest: number;
  waist: number;
  hips: number;
  shoulder: number;
  sleeve_length: number;
  inseam: number;
  recorded_by: string; // staff_id
  recorded_at: string;
  is_current: boolean;
  version_name?: string; // e.g. "Nov 2023 - Wedding Prep"
  fit_type?: 'Slim' | 'Regular' | 'Loose';
  garment_type: 'Upper Wear' | 'Lower Wear' | 'Custom';
}

export interface OrderStatusLog {
  id: string;
  order_id: string;
  changed_by: string; // staff_id
  previous_status: string;
  new_status: string;
  remarks: string;
  changed_at: string;
}

export interface SupplierBill {
  id: string;
  supplier_id: string;
  supplier_name: string;
  amount: number;
  balance: number;
  status: 'Paid' | 'Partial' | 'Unpaid' | 'Draft';
  bill_date: string;
  due_date: string;
  items: { description: string; qty: number; unit_price: number; total: number; }[];
  notes?: string;
}

export interface Settlement {
  id: string;
  bill_id: string;
  supplier_name: string;
  amount_paid: number;
  method: string;
  reference?: string;
  paid_at: string;
  recorded_by: string;
}

export interface InvoiceItem {
  description: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  order_id: string;
  customer_id: string;
  customer: string;
  email: string;
  date?: string; // legacy — prefer issueDate
  issueDate?: string;
  dueDate?: string;
  total_amount: number; // pre-computed: (lineSubtotal - discount) * (1 + tax_rate/100)
  discount_amount?: number; // flat amount or percentage value
  discount_type?: 'FLAT' | 'PERCENT';
  tax_rate?: number; // e.g. 12 for 12% VAT
  notes?: string;
  status?: string; // legacy — status is COMPUTED, not stored
  statusSnapshot?: 'Draft' | 'Open' | 'Paid' | 'Past Due'; // audit snapshot only
  subject: string;
  items?: InvoiceItem[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: string;
  is_active?: boolean;
  status?: string;
  style_preferences?: string;
  posture_tags?: string[];
}

export interface JobOrder {
  id: string;
  customer_id: string;
  garment: string;
  totalValue: number;
  amountPaid: number;
  dueDate: string;
  assigned_tailor_id: string;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  tasks: ProductionTask[];
  inspectionFailed?: boolean;
  inspectionPassed?: boolean;
  notes?: string;
  swatch_images?: string[];
  is_premade?: boolean;
  product_sku?: string;
  fabric_name?: string;
  fabric_width?: number; // In inches, for pattern analysis
  fit_preference?: string; // Specific fit notes for THIS order
  // Deprecated fields kept for compatibility during migration
  price: number; 
  balance: number;
  status: string; 
  customer: string;
  staff: string;
  measurement_profile_id?: string;
}

interface ERPState {
  staff: Staff[];
  inventory: InventoryItem[];
  movements: StockMovement[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  recipes: BOMRecipe[];
  customers: Customer[];
  orders: JobOrder[];
  invoices: Invoice[];
  payments: Payment[];
  measurementProfiles: MeasurementProfile[];
  orderStatusLogs: OrderStatusLog[];
  appointments: Appointment[];
  supplierBills: SupplierBill[];
  settlements: Settlement[];
  currentPlan: 'BASIC' | 'PRO' | 'PREMIUM',
  currentUser: {
    name: string;
    email: string;
    avatar: string;
  };

  addStaff: (staff: Omit<Staff, 'id' | 'staffCode'>) => void;
  updateStaff: (id: string, updates: Partial<Staff>) => void;

  addPayment: (payment: Omit<Payment, 'id'>) => void;
  addMeasurementProfile: (profile: Omit<MeasurementProfile, 'id'>) => void;
  addOrderStatusLog: (log: Omit<OrderStatusLog, 'id'>) => void;
  createInvoice: (invoice: Omit<Invoice, 'id'>) => void;

  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (id: string, newStatus: AppointmentStatus) => void;

  // New Event-Driven Actions
  recordInvoicePayment: (invoiceId: string, amount: number, method: string, staff_id: string, reference?: string, notes?: string, receiptImage?: string, paidAt?: string) => void;
  recordPayment: (orderId: string, amount: number, staff_id: string, method: string, reference?: string, receiptImage?: string) => void;
  recordInspection: (orderId: string, failed: boolean, staff_id: string, remarks?: string) => void;
  createNewOrder: (order: Omit<JobOrder, 'id' | 'status' | 'balance' | 'price' | 'customer' | 'staff' | 'tasks'>) => void;
  updateTaskStatus: (orderId: string, taskId: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => void;

  // Legacy (to be removed once UI is updated)
  updateOrderStatus: (orderId: string, newStatus: string, staff_id: string) => void;

  addMovement: (movement: Omit<StockMovement, 'id' | 'date'>) => void;
  receivePO: (poId: string, staff_id: string) => void;
  createPO: (po: Omit<PurchaseOrder, 'id'>) => void;
  addSupplier: (sup: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, updates: Partial<Supplier>) => void;
  executeAssembly: (productId: string, qty: number, staff_id: string) => void;
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (sku: string, updates: Partial<InventoryItem>) => void;
  saveRecipe: (recipe: BOMRecipe) => void;
  recordSettlement: (billId: string, amount: number, method: string, staff_id: string, reference?: string) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
}

// Initial Data from files (Type casting needed since JSON types might not exactly match)
// Stock movements loaded from seed file — append-only ledger per architecture spec
const initialMovements: StockMovement[] = stockMovementsData as StockMovement[];

const initialPOs: PurchaseOrder[] = [
  { 
    id: 'PO-2024-001', supplierId: 'SUP-001', date: '2024-05-01', status: 'Ordered', amount: 42500, 
    items: [{ sku: 'FAB-NAV-001', qty: 50, cost: 850 }], eta: '2024-05-05', created_by: 'STF-001'
  },
];

const initialRecipes: BOMRecipe[] = [
  {
    productId: 'UNF-POL-001',
    materials: [
      { sku: 'FAB-NAV-001', qty: 2.5 }, { sku: 'BTN-SIL-012', qty: 6 }, { sku: 'ZIP-BLK-005', qty: 1 }, { sku: 'THR-NAV-022', qty: 0.2 }, { sku: 'LBL-SUT-001', qty: 1 }
    ],
  }
];

export const useERPStore = create<ERPState>((set) => ({
  staff: staffData as Staff[],
  inventory: inventoryData as InventoryItem[],
  movements: initialMovements,
  suppliers: suppliersData as Supplier[],
  purchaseOrders: initialPOs,
  recipes: initialRecipes,
  customers: customersData as unknown as Customer[],
  orders: ordersData as JobOrder[],
  invoices: billingData as unknown as Invoice[],
  payments: paymentsData as unknown as Payment[],
  measurementProfiles: measurementsData as MeasurementProfile[],
  orderStatusLogs: orderStatusLogsData as OrderStatusLog[],
  appointments: appointmentsData as Appointment[],
  supplierBills: [
    {
      id: 'BILL-2026-001',
      supplier_id: 'SUP-001',
      supplier_name: 'Premium Fabrics Inc.',
      amount: 15000,
      balance: 0,
      status: 'Paid',
      bill_date: '2026-04-10',
      due_date: '2026-05-10',
      items: [{ description: 'Heavy Cotton Canvas (50m)', qty: 50, unit_price: 300, total: 15000 }]
    },
    {
      id: 'BILL-2026-002',
      supplier_id: 'SUP-002',
      supplier_name: 'QC Garment Supplies',
      amount: 4500,
      balance: 4500,
      status: 'Unpaid',
      bill_date: '2026-04-28',
      due_date: '2026-05-28',
      items: [{ description: 'Metallic Zippers (100pcs)', qty: 100, unit_price: 45, total: 4500 }]
    },
    {
      id: 'BILL-2026-003',
      supplier_id: 'SUP-003',
      supplier_name: 'Textile World Manila',
      amount: 8200,
      balance: 4200,
      status: 'Partial',
      bill_date: '2026-05-01',
      due_date: '2026-05-15',
      items: [{ description: 'Silk Lining Material (20m)', qty: 20, unit_price: 410, total: 8200 }]
    }
  ],
  settlements: [
    {
      id: 'SET-1001',
      bill_id: 'BILL-2026-001',
      supplier_name: 'Premium Fabrics Inc.',
      amount_paid: 15000,
      method: 'Bank Transfer',
      reference: 'TXN-882211',
      paid_at: '2026-04-12T10:00:00Z',
      recorded_by: 'STF-001'
    },
    {
      id: 'SET-1002',
      bill_id: 'BILL-2026-003',
      supplier_name: 'Textile World Manila',
      amount_paid: 4000,
      method: 'Cash',
      paid_at: '2026-05-02T14:30:00Z',
      recorded_by: 'STF-001'
    }
  ],
  currentPlan: 'PREMIUM',
  currentUser: {
    name: 'Joshua Arabejo',
    email: 'joshua@sutura.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joshua&backgroundColor=10b981'
  },

  addMovement: (movement) => {
    set((state) => ({
      movements: [
        {
          ...movement,
          id: `MOV-${1000 + state.movements.length + 1}`,
          date: new Date().toLocaleString('en-US')
        },
        ...state.movements
      ]
    }));
  },

  receivePO: (poId, staff_id) => {
    set((state) => {
      const po = state.purchaseOrders.find((p) => p.id === poId);
      if (!po || po.status === 'Received') return state;

      const newInventory = [...state.inventory];
      const newMovements = [...state.movements];

      po.items.forEach((item) => {
        const invIndex = newInventory.findIndex((i) => i.sku === item.sku);
        let itemName = item.sku;
        let unit = 'pcs';
        if (invIndex >= 0) {
          newInventory[invIndex] = { ...newInventory[invIndex], stock: newInventory[invIndex].stock + item.qty };
          itemName = newInventory[invIndex].item;
          unit = newInventory[invIndex].unit;
        }
        newMovements.unshift({
          id: `MOV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          date: new Date().toLocaleString('en-US'), type: 'Stock In', itemSku: item.sku, itemName, qty: item.qty, unit, staff_id, ref: po.id,
        });
      });

      return {
        inventory: newInventory,
        purchaseOrders: state.purchaseOrders.map((p) => p.id === poId ? { ...p, status: 'Received' as const } : p),
        movements: newMovements,
      };
    });
  },

  createPO: (po) => set((state) => ({ purchaseOrders: [{ ...po, id: `PO-${new Date().getFullYear()}-00${state.purchaseOrders.length + 1}` }, ...state.purchaseOrders] })),
  addSupplier: (sup) => set((state) => ({ suppliers: [{ ...sup, id: `SUP-00${state.suppliers.length + 1}` }, ...state.suppliers] })),
  updateSupplier: (id, updates) => set((state) => ({ suppliers: state.suppliers.map((s) => s.id === id ? { ...s, ...updates } : s) })),
  
  executeAssembly: (productId, qty, staff_id) => {
    set((state) => {
      const recipe = state.recipes.find((r) => r.productId === productId);
      const productIndex = state.inventory.findIndex((i) => i.sku === productId);
      if (!recipe || productIndex < 0) return state;

      const newInventory = [...state.inventory];
      const newMovements = [...state.movements];

      // Pre-validation: Check if ALL materials are sufficient
      let hasInsufficientMaterials = false;
      const missingMessages: string[] = [];

      recipe.materials.forEach((mat) => {
        const totalNeeded = mat.qty * qty;
        const matIndex = newInventory.findIndex((i) => i.sku === mat.sku);
        if (matIndex < 0 || newInventory[matIndex].stock < totalNeeded) {
          hasInsufficientMaterials = true;
          const itemName = matIndex >= 0 ? newInventory[matIndex].item : mat.sku;
          missingMessages.push(`Missing ${totalNeeded} units of ${itemName}`);
        }
      });

      if (hasInsufficientMaterials) {
        alert("Assembly blocked: Insufficient raw materials.\n" + missingMessages.join("\n"));
        return state;
      }

      recipe.materials.forEach((mat) => {
        const totalNeeded = mat.qty * qty;
        const matIndex = newInventory.findIndex((i) => i.sku === mat.sku);
        if (matIndex >= 0) {
          newInventory[matIndex] = { ...newInventory[matIndex], stock: newInventory[matIndex].stock - totalNeeded };
          newMovements.unshift({
            id: `MOV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            date: new Date().toLocaleString('en-US'), type: 'Usage', itemSku: mat.sku, itemName: newInventory[matIndex].item,
            qty: -totalNeeded, unit: newInventory[matIndex].unit, staff_id, ref: `ASSEMBLY-${productId}`,
          });
        }
      });

      newInventory[productIndex] = { ...newInventory[productIndex], stock: newInventory[productIndex].stock + qty };
      newMovements.unshift({
        id: `MOV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        date: new Date().toLocaleString('en-US'), type: 'Production', itemSku: productId, itemName: newInventory[productIndex].item,
        qty: qty, unit: newInventory[productIndex].unit, staff_id, ref: `ASSEMBLY-${productId}`,
      });

      return { inventory: newInventory, movements: newMovements };
    });
  },

  addInventoryItem: (item) => set((state) => ({ inventory: [item, ...state.inventory] })),
  updateInventoryItem: (sku, updates) => set((state) => ({ 
    inventory: state.inventory.map((i) => {
      if (i.sku === sku) {
        const updatedItem = { ...i, ...updates };
        // Clamp stock so it never goes negative
        if (updatedItem.stock < 0) updatedItem.stock = 0;
        return updatedItem;
      }
      return i;
    }) 
  })),
  saveRecipe: (recipe) => set((state) => ({ recipes: [...state.recipes.filter((r) => r.productId !== recipe.productId), recipe] })),
  addStaff: (staff) => set((state) => ({ staff: [...state.staff, { ...staff, id: `STF-00${state.staff.length + 1}`, staffCode: `STF-USR${state.staff.length + 1}` }] })),
  updateStaff: (id, updates) => set((state) => ({ staff: state.staff.map((s) => (s.id === id ? { ...s, ...updates } : s)) })),

  addPayment: (payment) => set((state) => ({ payments: [{ ...payment, id: `PAY-${Date.now()}` }, ...state.payments] })),
  addMeasurementProfile: (profile) => set((state) => ({ measurementProfiles: [{ ...profile, id: `MEAS-${Date.now()}` }, ...state.measurementProfiles] })),
  addOrderStatusLog: (log) => set((state) => ({ orderStatusLogs: [{ ...log, id: `OSL-${Date.now()}` }, ...state.orderStatusLogs] })),
  createInvoice: (invoice) => set((state) => ({ invoices: [{ ...invoice, id: `#CIV-${Date.now()}` }, ...state.invoices] })),

  addAppointment: (appointment) => set((state) => {
    // Validation: Check for past dates (using a simple string comparison for YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    if (appointment.date < today) {
      alert('Cannot schedule appointments in the past.');
      return state;
    }

    // Conflict detection: Same staff, date, and startTime
    const hasConflict = state.appointments.some(
      (apt) => apt.staff === appointment.staff && apt.date === appointment.date && apt.startTime === appointment.startTime && apt.status !== 'Cancelled'
    );

    if (hasConflict) {
      alert(`Conflict: ${appointment.staff} is already booked at ${appointment.startTime} on ${appointment.date}.`);
      return state;
    }

    return {
      appointments: [
        ...state.appointments,
        {
          ...appointment,
          id: `APT-${Date.now()}`,
        },
      ],
    };
  }),

  updateAppointmentStatus: (id, newStatus) =>
    set((state) => ({
      appointments: state.appointments.map((apt) =>
        apt.id === id ? { ...apt, status: newStatus } : apt
      ),
    })),

  recordInvoicePayment: (invoiceId, amount, method, staff_id, reference, notes, receiptImage, paidAt) => set((state) => {
    if (amount <= 0) return state;
    
    const invoice = state.invoices.find(i => i.id === invoiceId);
    if (!invoice) return state;

    if (invoice.statusSnapshot === 'Draft' || invoice.statusSnapshot === 'Paid') {
      return state; // Reject per rules
    }

    const currentPaid = state.payments.filter(p => p.invoice_id === invoiceId).reduce((sum, p) => sum + p.amount_paid, 0);
    const balance = invoice.total_amount - currentPaid;

    if (amount > balance) return state; // Reject overpayment

    const newPayment: Payment = {
      id: `PAY-${Date.now()}`,
      invoice_id: invoiceId,
      order_id: invoice.order_id,
      customer_id: invoice.customer_id,
      amount_paid: amount,
      payment_method: method,
      reference_number: reference || null,
      receipt_image: receiptImage || null,
      received_by: staff_id,
      paid_at: paidAt || new Date().toISOString(),
      notes: notes || `Payment ref: ${reference || 'N/A'}`
    };

    // Note: statusSnapshot updating is optional depending on if we want to snap immediately 
    // when balance hits 0. We'll leave it as computed in UI, but snap it for audit.
    const newPaidTotal = currentPaid + amount;
    const newBalance = invoice.total_amount - newPaidTotal;
    
    const newStatus: 'Draft' | 'Open' | 'Paid' | 'Past Due' | undefined = newBalance === 0 ? 'Paid' : invoice.statusSnapshot;

    return {
      payments: [newPayment, ...state.payments],
      invoices: state.invoices.map(i => i.id === invoiceId ? { ...i, statusSnapshot: newStatus } : i)
    };
  }),

  recordPayment: (orderId, amount, staff_id, method, reference, receiptImage) => set((state) => {
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return state;

    const newAmountPaid = order.amountPaid + amount;
    const { productionStage } = resolveOrderState({ ...order, amountPaid: newAmountPaid });

    const newInventory = [...state.inventory];
    const newMovements = [...state.movements];

    // ERP RULE: If this payment moves the order to IN_PRODUCTION for the first time, deduct materials
    const previousStage = resolveOrderState(order).productionStage;
    if (previousStage === 'ON_HOLD' && productionStage === 'IN_PRODUCTION') {
      const recipe = state.recipes.find((r) => r.productId === order.garment);
      if (recipe) {
        // Validate & Deduct
        let canProceed = true;
        recipe.materials.forEach((mat) => {
          const matIndex = newInventory.findIndex((i) => i.sku === mat.sku);
          if (matIndex < 0 || newInventory[matIndex].stock < mat.qty) canProceed = false;
        });

        if (canProceed) {
          recipe.materials.forEach((mat) => {
            const matIndex = newInventory.findIndex((i) => i.sku === mat.sku);
            newInventory[matIndex] = { ...newInventory[matIndex], stock: newInventory[matIndex].stock - mat.qty };
            newMovements.unshift({
              id: `MOV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              date: new Date().toLocaleString('en-US'), type: 'Usage', itemSku: mat.sku, itemName: newInventory[matIndex].item,
              qty: -mat.qty, unit: newInventory[matIndex].unit, staff_id, ref: `ORDER-${order.id}`,
            });
          });
        }
      }
    }

    const newPayment: Payment = {
      id: `PAY-${Date.now()}`,
      order_id: orderId,
      customer_id: order.customer_id,
      amount_paid: amount,
      payment_method: method,
      reference_number: reference || null,
      receipt_image: receiptImage || null,
      received_by: staff_id,
      paid_at: new Date().toISOString(),
      notes: `Order Payment ref: ${reference || 'N/A'}`
    };

    const newLog: OrderStatusLog = {
      id: `OSL-${Date.now()}`,
      order_id: orderId,
      changed_by: staff_id,
      previous_status: getDisplayLabel(previousStage),
      new_status: getDisplayLabel(productionStage),
      remarks: `Payment of ₱${amount.toLocaleString()} recorded. Total Paid: ₱${newAmountPaid.toLocaleString()}. Stage: ${getDisplayLabel(productionStage)}.`,
      changed_at: new Date().toLocaleString('en-US')
    };

    return {
      inventory: newInventory,
      movements: newMovements,
      payments: [newPayment, ...state.payments],
      orders: state.orders.map((o) => o.id === orderId ? { 
        ...o, 
        amountPaid: newAmountPaid, 
        balance: o.totalValue - newAmountPaid,
        status: getDisplayLabel(productionStage) 
      } : o),
      orderStatusLogs: [newLog, ...state.orderStatusLogs]
    };
  }),

  recordInspection: (orderId, failed, staff_id, remarks) => set((state) => {
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return state;

    const { productionStage } = resolveOrderState({ ...order, inspectionFailed: failed });

    const newLog: OrderStatusLog = {
      id: `OSL-${Date.now()}`,
      order_id: orderId,
      changed_by: staff_id,
      previous_status: order.status,
      new_status: getDisplayLabel(productionStage),
      remarks: remarks || `Quality Check: ${failed ? 'FAILED' : 'PASSED'}. Stage moved to ${getDisplayLabel(productionStage)}.`,
      changed_at: new Date().toLocaleString('en-US')
    };

    return {
      orders: state.orders.map((o) => o.id === orderId ? { 
        ...o, 
        inspectionFailed: failed, 
        inspectionPassed: !failed,
        status: getDisplayLabel(productionStage) 
      } : o),
      orderStatusLogs: [newLog, ...state.orderStatusLogs]
    };
  }),

  updateTaskStatus: (orderId, taskId, newStatus) => set((state) => {
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return state;

    const newTasks = order.tasks.map((t) => t.id === taskId ? { ...t, status: newStatus } : t);
    const { productionStage } = resolveOrderState({ ...order, tasks: newTasks });

    return {
      orders: state.orders.map((o) => o.id === orderId ? {
        ...o,
        tasks: newTasks,
        status: getDisplayLabel(productionStage)
      } : o)
    };
  }),

  createNewOrder: (orderData) => set((state) => {
    const newId = `ORD-${1000 + state.orders.length + 1}`;
    
    const defaultTasks: ProductionTask[] = orderData.is_premade ? [] : [
      { id: 'T1', title: 'Initial Measurement', status: 'Completed' },
      { id: 'T2', title: 'Pattern Drafting', status: 'Pending' },
      { id: 'T3', title: 'Fabric Cutting', status: 'Pending' },
      { id: 'T4', title: 'Main Sewing', status: 'Pending' },
      { id: 'T5', title: 'Final Ironing & Prep', status: 'Pending' }
    ];

    const { productionStage } = resolveOrderState({ ...orderData, tasks: defaultTasks });
    
    // Auto-fill legacy fields for backward compatibility
    const newOrder: JobOrder = {
      ...orderData,
      id: newId,
      tasks: defaultTasks,
      status: getDisplayLabel(productionStage),
      price: orderData.totalValue,
      balance: orderData.totalValue - orderData.amountPaid,
      customer: state.customers.find(c => c.id === orderData.customer_id)?.name || 'Unknown',
      staff: state.staff.find(s => s.id === orderData.assigned_tailor_id)?.name || 'Unassigned',
    };

    return {
      orders: [newOrder, ...state.orders]
    };
  }),

  updateOrderStatus: (orderId, newStatus, staff_id) => set((state) => {
    // This is now a legacy/manual override action.
    // Real flow uses recordPayment and recordInspection.
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return state;

    const newLog: OrderStatusLog = {
      id: `OSL-${Date.now()}`,
      order_id: order.id,
      changed_by: staff_id,
      previous_status: order.status,
      new_status: newStatus,
      remarks: `Manual status override to ${newStatus}`,
      changed_at: new Date().toLocaleString('en-US')
    };

    return {
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      orderStatusLogs: [newLog, ...state.orderStatusLogs]
    };
  }),

  recordSettlement: (billId, amount, method, staff_id, reference) => set((state) => {
    const bill = state.supplierBills.find(b => b.id === billId);
    if (!bill) return state;

    const newBalance = bill.balance - amount;
    const newStatus = newBalance <= 0 ? 'Paid' : 'Partial';

    const newSettlement: Settlement = {
      id: `SET-${Date.now()}`,
      bill_id: billId,
      supplier_name: bill.supplier_name,
      amount_paid: amount,
      method,
      reference,
      paid_at: new Date().toISOString(),
      recorded_by: staff_id
    };

    return {
      supplierBills: state.supplierBills.map(b => b.id === billId ? { ...b, balance: newBalance, status: newStatus } : b),
      settlements: [newSettlement, ...state.settlements]
    };
  }),
  updateCustomer: (id, updates) => set((state) => ({
    customers: state.customers.map(c => c.id === id ? { ...c, ...updates } : c)
  })),
}));

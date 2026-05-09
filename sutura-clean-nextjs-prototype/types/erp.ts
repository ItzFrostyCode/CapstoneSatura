// ============================================================
// SUTURA ERP — Normalized Domain Types (Phase 1–3)
// Schema source: NORMALIZED_DATABASE_SCHEMA.md + User Spec
// ============================================================

// ── ENUMS / SCALARS ─────────────────────────────────────────

export type UserRole = 'SALES' | 'TAILOR' | 'INVENTORY' | 'MANAGER' | 'ADMIN';

export type Permission = 
  | 'customers:modify'
  | 'orders:status_only'
  | 'inventory:modify'
  | 'billing:modify';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type PlanLevel = 'BASIC' | 'PRO' | 'PREMIUM';
export type SubscriptionStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
export type ShopStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
export type BranchStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
export type BranchType = 'MAIN' | 'SATELLITE' | 'WAREHOUSE';
export type BranchRole = 'MANAGER' | 'TAILOR' | 'HELPER' | 'CASHIER' | 'INVENTORY';

export type OrderType = 'BESPOKE' | 'BULK' | 'ALTERATION' | 'READY_MADE';
export type BulkSizingStrategy = 'STANDARD' | 'CUSTOM' | 'HYBRID';
export type SourceType = 'WALK_IN' | 'ONLINE';
export type OrderStatus =
  | 'PENDING_QUOTE' | 'WAITING_FOR_DOWN_PAYMENT' | 'IN_PRODUCTION'
  | 'READY_FOR_FITTING' | 'ALTERATIONS' | 'READY_FOR_RELEASE'
  | 'RELEASED' | 'CANCELLED' | 'ON_HOLD';

export type TaskStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Blocked' | 'For Revision';

export type InvoiceStatus = 'UNPAID' | 'PARTIAL' | 'PAID' | 'VOID';
export type PaymentMethod = 'CASH' | 'GCASH' | 'MAYA' | 'BANK_TRANSFER' | 'CHECK';
export type PaymentConfirmStatus = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'REFUNDED';
export type Priority = 'Normal' | 'High' | 'Urgent' | 'Low';
export type AssetType = 'FRONT_DESIGN' | 'BACK_DESIGN' | 'LOGO' | 'SPONSOR' | 'MOCKUP' | 'REFERENCE' | 'MEASUREMENT_SHEET' | 'ALTERATION_BEFORE' | 'ALTERATION_AFTER' | 'OTHER';

// Inventory
export type InventoryStatus = 'ACTIVE' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'ARCHIVED';
export type ItemType = 'FABRIC' | 'LINING' | 'BUTTON' | 'ZIPPER' | 'THREAD' | 'TRIM' | 'FINISHED_GOOD' | 'OTHER';
export type MovementType =
  | 'RECEIVE' | 'RESERVE' | 'RELEASE' | 'ISSUE'
  | 'TRANSFER_OUT' | 'TRANSFER_IN'
  | 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT'
  | 'DAMAGE' | 'PRODUCTION';
export type MovementReferenceType = 'PO' | 'JO' | 'Manual' | 'Transfer' | 'Damage Report' | 'Inventory Count' | 'Sale';
export type ReservationStatus = 'ACTIVE' | 'PARTIALLY_RELEASED' | 'RELEASED' | 'CANCELLED';

export interface InventoryAnalysis {
  available: number;
  needed: number;
  shortage: number;
  status: 'OK' | 'SHORTAGE' | 'ERROR';
  message?: string;
}

// Supplier / Procurement
export type POStatus = 'DRAFT' | 'FOR_APPROVAL' | 'APPROVED' | 'SENT' | 'PARTIAL_RECEIVED' | 'RECEIVED' | 'CANCELLED';


// ── A. SHOP INFRASTRUCTURE ───────────────────────────────────

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  avatar: string;
  status: AccountStatus;
  createdAt: string;
}

export interface Subscription {
  id: string;
  planName: string;
  planLevel: PlanLevel;
  status: SubscriptionStatus;
  maxBranches: number;
  maxStaff: number;
  startDate: string;
  endDate: string;
  price: number;
}

export interface Shop {
  id: string;
  ownerUserId: string;
  subscriptionId: string;
  shopName: string;
  businessName: string;
  businessType: string;
  status: ShopStatus;
  createdAt: string;
}

export interface ShopBranch {
  id: string;
  shopId: string;
  branchName: string;
  branchCode: string;
  address: string;
  contactNo: string;
  isMain: boolean;
  /** MAIN = receives supplier stock; SATELLITE = production; WAREHOUSE = storage */
  branch_type: BranchType;
  /** If true, this branch is the default source for stock transfers */
  is_default_source: boolean;
  managerUserId?: string;
  status: BranchStatus;
  created_at: string;
  updated_at: string;
  // Legacy
  manager_id?: string;
}

export type StaffRole = UserRole; // Aliased for backward compatibility

export interface Staff {
  id: string;
  name: string;
  roles: StaffRole[];
  status: 'Online' | 'Offline' | 'Active' | 'Inactive' | string;
  branch_id?: string;
  staffCode?: string;
  specialization?: string | string[];
  email?: string;
  phone?: string;
  hasSystemAccess?: boolean;
  avatar?: string;
}


// ── B. CUSTOMERS & MEASUREMENTS ──────────────────────────────

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  gender?: 'Male' | 'Female' | 'Other';
  type: 'Individual' | 'Corporate';
  is_active: boolean;
  style_preferences?: string;
  posture_tags?: string[];
  createdAt: string;
}

export type MeasurementStatus = 'DRAFT' | 'PENDING_FITTING' | 'CONFIRMED' | 'APPROVED' | 'SUPERSEDED' | 'ARCHIVED';
export type FitPreference = 'Slim' | 'Regular' | 'Loose' | 'Oversized';
export type GarmentCategory = 'Upper Wear' | 'Lower Wear' | 'Full Body';

export interface MeasurementProfile {
  id: string;
  customer_id: string;
  branch_id: string;
  profile_name: string;
  garment_category: GarmentCategory;
  garment_type: string;
  base_size?: string;
  fit_preference: FitPreference;
  measurement_unit: 'Inches' | 'Centimeters';
  version_no: string;
  status: MeasurementStatus;

  posture_notes?: string;
  fabric_allowance_notes?: string;
  special_instructions?: string;

  // Upper Wear
  neck?: number; shoulder_width?: number; chest?: number; bust?: number;
  waist?: number; hip?: number; front_length?: number; back_length?: number;
  sleeve_length?: number; armhole?: number; bicep?: number; elbow?: number;
  forearm?: number; cuff?: number; across_chest?: number; across_back?: number;
  shoulder_slope?: number; jacket_length?: number;

  // Lower Wear
  lower_waist?: number; lower_hip?: number; seat?: number; thigh?: number;
  knee?: number; calf?: number; rise?: number; front_rise?: number;
  back_rise?: number; inseam?: number; outseam?: number; leg_opening?: number;
  crotch_depth?: number; ankle?: number;

  // Full Body
  full_bust?: number; under_bust?: number; natural_waist?: number;
  dropped_waist?: number; full_hip?: number; shoulder_to_bust?: number;
  shoulder_to_waist?: number; shoulder_to_floor?: number; back_width?: number;
  nape_to_waist?: number; arm_circumference?: number; wrist?: number;

  recorded_by: string;
  recorded_at: string;
  is_current: boolean;
}

export interface FittingSession {
  id: string;
  measurement_profile_id: string;
  session_no: number;
  adjustment_notes: string;
  next_fitting_date?: string;
  handled_by_staff_id: string;
  status: 'Completed' | 'Pending';
  created_at: string;
}

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
  status: 'Pending Review' | 'Scheduled' | 'Rescheduled' | 'Completed' | 'Cancelled' | 'No Show';
  staff: string;
  source: 'Online' | 'Walk-in';
  branch_id?: string;
  reason?: string;
  notes?: string;
}


// ── C. JOB ORDERS (Normalized) ───────────────────────────────

/**
 * JOB ORDERS — The production header.
 * Removed: items[], tasks[], swatch_images[], design_assets[],
 *          amount_paid (source-of-truth), inspection_passed/failed.
 * These all live in their own normalized tables below.
 * balance is an optional cached value (derived from Payments).
 */
export interface Order {
  id: string;
  shop_id: string;
  branch_id: string;
  customer_id: string;
  organization_name?: string;       // For bulk orders (team/company name)
  created_by_user_id: string;
  assigned_staff_id?: string;
  order_type: OrderType;
  source_type: SourceType;
  status: OrderStatus;
  priority: Priority;

  // Garment context (order-level, not per-item)
  fabric_name?: string;
  fabric_width?: number;
  is_customer_provided_fabric?: boolean;
  measurement_profile_id?: string;

  // Alteration-specific details
  alteration_details?: {
    item_description: string;
    item_condition: 'Good' | 'Needs Repair' | 'Damaged';
    specific_issue: string;
    affected_areas: string[];
    measurements?: { area: string; current: number; desired: number; difference: number; }[];
    materials_needed?: { item_id: string; item_name: string; quantity: number; }[];
    tasks: { title: string; price: number }[];
    before_photos?: string[];
    after_photos?: string[];
  };

  // Bulk-specific
  bulk_sizing_strategy?: BulkSizingStrategy;
  bulk_members?: BulkOrderMember[];

  // -- PRICING & COSTING --
  base_amount?: number;
  rush_fee?: number;
  customization_fee?: number;
  discount?: number;
  
  total_bom_cost?: number;
  total_labor_cost?: number;
  total_production_cost?: number;
  profit_margin?: number; // Baseline expected margin

  // -- ACTUAL COSTING (Updates during production from Discrepancies) --
  actual_bom_cost?: number;
  actual_labor_cost?: number;
  actual_production_cost?: number;
  actual_profit_margin?: number;

  total_amount: number;
  balance?: number;                 // Cached derived value; source of truth = payments[]
  due_date: string;
  estimated_completion_date?: string;
  created_at: string;
  notes?: string;
  discrepancies?: ProductionDiscrepancy[];

  // ── DENORMALIZED ARRAYS (kept for UI layer compatibility)
  // These are populated by the store selector/derived state.
  // Do NOT mutate these directly — use the normalized slice actions.
  items?: JobOrderItem[];           // Derived from jobOrderItems[]
  tasks?: ProductionTask[];         // Derived from productionTasks[]
  swatch_images?: string[];         // Derived from orderSwatches[]
  design_assets?: OrderDesignAsset[];

  // Legacy payment fields (computed by engine from payments[])
  amount_paid?: number;             // Derived: sum(payments where order_id = this.id)
  inspection_passed?: boolean;      // Derived from orderInspections[]
  inspection_failed?: boolean;      // Derived from orderInspections[]

  // Misc UI fields
  payment_reference?: string;
  payment_receipt_image?: string;
  payment_method?: string;
  variant_id?: string;

  // Additional legacy fields for inventory page
  garment?: string;
  totalValue?: number;
  amountPaid?: number;
  assigned_tailor_id?: string;
  is_premade?: boolean;
  dueDate?: string;
}

/** One row per garment line within a Job Order */
export interface JobOrderItem {
  id: string;
  job_order_id: string;
  garment_template_id?: string;
  product_variant_id?: string;
  measurement_profile_id?: string;
  garment_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  size?: string;
  
  // -- COSTING per item --
  bom_cost?: number;
  labor_cost?: number;
  cmt_discount?: number;

  notes?: string;
}

/** One step in the production workflow */
export interface ProductionTask {
  id: string;
  job_order_id: string;
  job_order_item_id?: string;
  title: string;
  assigned_staff_id?: string;
  status: TaskStatus;
  started_at?: string;
  completed_at?: string;
  remarks?: string;
  estimatedDate?: string;
}

/** Swatch / reference images per order */
export interface OrderSwatch {
  id: string;
  job_order_id: string;
  image_url: string;
  label?: string;
  uploaded_at: string;
}

/** Design assets (logos, front/back designs) */
export interface OrderDesignAsset {
  id: string;
  order_id: string;
  asset_type: AssetType;
  file_url?: string;
  external_link?: string;
  notes?: string;
  uploaded_by?: string;
  created_at: string;
}

/** QC inspection record — replaces inspection_passed/failed on Order */
export interface OrderInspection {
  id: string;
  job_order_id: string;
  passed: boolean;
  inspected_by_user_id: string;
  inspected_at: string;
  notes?: string;
}

export interface OrderStatusLog {
  id: string;
  order_id: string;
  previous_status?: OrderStatus;
  new_status: OrderStatus;
  changed_by: string;
  changed_at: string;
  remarks?: string;
}

export interface BulkOrderMember {
  id: string;
  name: string;
  base_size?: string;
  jersey_number?: string;
  measurement_profile_id?: string;
  adjustment_notes?: string;
  status: 'PENDING' | 'IN_PRODUCTION' | 'COMPLETED';
}

export type DiscrepancyType = 'MATERIAL_WASTE' | 'DEFECTIVE_MATERIAL' | 'EXTRA_LABOR' | 'UNPLANNED_ALTERATION';

export interface ProductionDiscrepancy {
  id: string;
  job_order_id: string;
  reported_by_user_id: string;
  discrepancy_type: DiscrepancyType;
  
  // For Material Variances
  inventory_item_id?: string;
  qty_wasted?: number;
  financial_impact: number; // The computed loss
  
  // For Labor Variances
  task_id?: string;
  
  reason: string;
  logged_at: string;
}

export interface GarmentTemplate {
  id: string;
  name: string;
  category: string;
  base_price: number;
  cmt_price?: number;            // Price if customer provides fabric
  estimated_labor_cost?: number; // Standard piece-rate pay
  fabric_sku: string;
  fabric_per_unit: number;
  requires_measurement: boolean;
  default_tasks: string[];
}


// ── D. PAYMENTS & INVOICES ───────────────────────────────────

/**
 * PAYMENTS — Source of truth for money received.
 * Replaces amount_paid on the Order.
 * amount_paid on Order is now derived: SUM(payments where job_order_id = this.id)
 */
export interface Payment {
  id: string;
  job_order_id?: string;
  invoice_id?: string;
  received_by_user_id: string;
  amount: number;
  amount_paid?: number; // Alias for legacy billing page
  payment_method: PaymentMethod | string;
  reference_no?: string;
  receipt_image?: string;
  paid_at: string;
  remarks?: string;
  status: PaymentConfirmStatus;
}

export interface Invoice {
  id: string;
  shop_id: string;
  branch_id: string;
  job_order_id: string;
  invoice_no: string;
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  status: InvoiceStatus;
  issued_at: string;
  due_date: string;

  // ── Extended billing-page fields (optional for backward compat) ──
  order_id?: string;
  customer_id?: string;
  customer?: string;          // Denormalized name for display
  email?: string;             // Denormalized for display
  subject?: string;
  notes?: string;
  issueDate?: string;         // Alias for issued_at (old field name)
  dueDate?: string;           // Alias for due_date (old field name)
  date?: string;              // Legacy fallback
  discount_type?: 'FLAT' | 'PERCENT';
  discount_amount?: number;
  tax_rate?: number;
  statusSnapshot?: string;    // Legacy status label
  items?: Array<{
    description: string;
    qty: number;
    unitPrice: number;
    total: number;
  }>;
}

export interface InvoicePayment {
  id: string;
  invoice_id: string;
  payment_id: string;
  amount_applied: number;
}

/** Supplier bills (accounts payable) */
export interface SupplierBill {
  id: string;
  supplierId: string;
  supplier_name?: string;     // Denormalized for display
  amount: number;
  balance: number;
  status: 'UNPAID' | 'PARTIAL' | 'PAID' | 'VOID';
  dueDate: string;
  createdAt: string;
}

export interface Settlement {
  id: string;
  billId?: string;
  bill_id?: string;           // Alias
  amount: number;
  amount_paid?: number;       // Alias for legacy billing page
  method?: PaymentMethod;
  referenceNo?: string;
  date?: string;
  paid_at?: string;           // Alias
  supplier_name?: string;     // Denormalized
}


// ── E. INVENTORY (Normalized) ────────────────────────────────

/**
 * INVENTORY ITEMS — Master catalog. No stock here.
 * Stock lives in InventoryStock per branch.
 */
export interface InventoryItem {
  id: string;
  shop_id: string;
  sku: string;
  item_name: string;
  category: string;             // Human-readable category label
  item_type: ItemType;
  unit_of_measure: string;      // meters, pcs, rolls, yards
  fabric_width?: number;        // Only for fabrics
  reorder_level: number;        // Trigger for low-stock alert
  reorder_qty: number;          // How much to order when restocking
  is_active: boolean;
  image?: string;
  supplier_id?: string;
  status?: string;               // Legacy status string
  location?: string;            // Legacy location string

  // Legacy fields (kept for backward compat with pages not yet migrated)
  item?: string;                // Alias for item_name
  cat?: string;                 // Alias for category
  unit?: string;
  stock?: number;               // Deprecated: use InventoryStock
  minStock?: number;            // Alias for reorder_level
  reserved?: number;            // Optional cached value
  price?: number;               // Alias for unit_price
  unit_price?: number;
  cost?: number;                // Alias for unit_cost
  unit_cost?: number;
  variants?: ProductVariant[];
  branch_id?: string;
}

/**
 * INVENTORY STOCK — Live per-branch stock count.
 * available_qty = on_hand_qty - reserved_qty - damaged_qty
 */
export interface InventoryStock {
  id: string;
  branch_id: string;
  inventory_item_id: string;
  on_hand_qty: number;
  reserved_qty: number;
  available_qty: number;        // Computed: on_hand - reserved - damaged
  damaged_qty: number;
  updated_at: string;
}

/**
 * INVENTORY MOVEMENTS — The stock ledger. Immutable append-only log.
 * Every stock change must produce a movement row.
 */
export interface InventoryMovement {
  id: string;
  shop_id: string;
  branch_id: string;
  inventory_item_id: string;
  movement_type: MovementType;
  qty: number;
  unit_cost?: number;
  /** 'JOB_ORDER' | 'PURCHASE_ORDER' | 'GOODS_RECEIPT' | 'ADJUSTMENT' | 'TRANSFER' */
  reference_type: string;
  reference_id: string;
  supplier_id?: string;
  performed_by_user_id: string;
  created_at: string;
  notes?: string;
}

/**
 * INVENTORY RESERVATIONS — The missing link: Job Order → Inventory.
 * Created when materials are reserved for a production job.
 * Released when the job is completed or cancelled.
 */
export interface InventoryReservation {
  id: string;
  job_order_id: string;
  branch_id: string;
  inventory_item_id: string;
  qty_reserved: number;
  qty_released: number;
  status: ReservationStatus;
  created_at: string;
}

/** Product variant (size/color) — for READY_MADE orders */
export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color: string;
  fit?: string;
  stock: number;
  price_adjustment?: number;
}


// ── F. SUPPLIERS & PROCUREMENT ───────────────────────────────

/**
 * SUPPLIERS — Master supplier profile.
 * No embedded items[] — use SupplierItem junction.
 */
export interface Supplier {
  id: string;
  shop_id: string;
  supplier_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  payment_terms?: string;       // e.g. 'Net 30', 'Cash on Delivery'
  lead_time_days: number;
  is_active: boolean;
  status: 'Active' | 'Verified' | 'Preferred' | 'Inactive' | 'Blacklisted';

  // Legacy aliases
  name?: string;                // Alias for supplier_name
  contact?: string;             // Alias for contact_person
  rating?: number;
  leadTime?: string;            // Human readable lead time
  category?: string;
  supplierId?: string;          // Alias
  items?: string[];             // Legacy item SKUs
}

/**
 * SUPPLIER ITEMS — Which supplier can supply which material.
 * Junction table: Supplier ↔ InventoryItem
 */
export interface SupplierItem {
  id: string;
  supplier_id: string;
  inventory_item_id: string;
  supplier_sku?: string;
  unit_cost: number;
  moq: number;                  // Minimum Order Quantity
  lead_time_days?: number;
  is_preferred: boolean;        // Preferred supplier for this item
}

/** Purchase Order header */
export interface PurchaseOrder {
  id: string;
  shop_id: string;
  branch_id: string;            // Default: MAIN branch
  supplier_id: string;
  requested_by_user_id: string;
  status: POStatus;
  expected_delivery_date?: string;
  requested_at: string;
  // Cached totals (derived from PurchaseOrderItems)
  total_amount: number;
  amount_paid: number;
  
  // Legacy aliases / Denormalized
  amount?: number;              // Alias for total_amount
  supplierId?: string;          // Alias for supplier_id
  items?: PurchaseOrderItem[];
  eta?: string;                 // Alias for expected_delivery_date
}

/** One line item within a Purchase Order */
export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  inventory_item_id: string;
  qty_ordered: number;
  qty_received: number;
  unit_cost: number;
}

/** Goods Receipt header — records physical delivery from supplier */
export interface GoodsReceipt {
  id: string;
  purchase_order_id: string;
  branch_id: string;
  received_by_user_id: string;
  received_at: string;
  notes?: string;
}

/** One line item of a Goods Receipt */
export interface GoodsReceiptItem {
  id: string;
  goods_receipt_id: string;
  purchase_order_item_id: string;
  inventory_item_id: string;
  qty_received: number;
  qty_damaged: number;
  unit_cost: number;
}


/** Internal branch-to-branch stock transfers */
export interface StockTransfer {
  id: string;
  shop_id: string;
  source_branch_id: string;
  destination_branch_id: string;
  inventory_item_id: string;
  qty: number;
  status: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  reason: 'BRANCH_REQUISITION' | 'LOW_STOCK' | 'HQ_REBALANCING' | 'MANUAL_TRANSFER';
  notes?: string;
  performed_by_user_id: string;
  created_at: string;
  completed_at?: string;
}

// ── G. SHARED SYSTEM ─────────────────────────────────────────

export interface ERPNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
}

export interface AuditLog {
  id: string;
  user_id: string | undefined;
  action: 'SUCCESSFUL_BRANCH_SWITCH' | 'REJECTED_BRANCH_SWITCH' | string;
  module: string;
  details: string;
  previous_branch?: string;
  new_branch?: string;
  timestamp: string;
}

// ── H. SUPPORT SYSTEM ─────────────────────────────────────────

export type SupportTicketCategory = 'Technical Issue' | 'Billing Concern' | 'Inventory Problem' | 'Feature Request' | 'Complaint' | 'Branch Concern';
export type SupportTicketStatus = 'Open' | 'In Review' | 'Waiting Reply' | 'Resolved' | 'Closed';

export interface SupportTicketAttachment {
  id: string;
  url: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: 'image/png' | 'image/jpeg' | 'video/mp4' | 'video/quicktime' | 'application/pdf';
}

export interface SupportTicketMessage {
  id: string;
  sender: 'User' | 'HQ Admin';
  senderName: string;
  message: string;
  timestamp: string;
  attachments?: SupportTicketAttachment[];
}

export interface SupportTicket {
  id: string;
  shopId: string;
  branchId?: string;
  creatorId: string;
  subject: string;
  category: SupportTicketCategory;
  status: SupportTicketStatus;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  messages: SupportTicketMessage[];
}

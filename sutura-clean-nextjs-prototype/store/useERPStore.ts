import { create } from 'zustand';
import { createOrderSlice, OrderSlice } from './slices/orderSlice';
import { createInventorySlice, InventorySlice } from './slices/inventorySlice';
import { createCustomerSlice, CustomerSlice } from './slices/customerSlice';
import { createSessionSlice, SessionSlice } from './slices/sessionSlice';
import { createSupplierSlice, SupplierSlice } from './slices/supplierSlice';
import { Staff, Supplier, PurchaseOrder, InventoryItem } from '@/types/erp';

// Re-export all domain types so consumers can import from one place
export type {
  User, Shop, ShopBranch, Order, Staff, Customer,
  MeasurementProfile, Appointment, FittingSession,
  GarmentTemplate, OrderStatusLog, OrderInspection,
  JobOrderItem, ProductionTask,
  Payment, Invoice, InvoicePayment, SupplierBill, Settlement, PaymentMethod,
  InventoryItem, InventoryStock, InventoryMovement, InventoryReservation,
  ProductVariant,
  Supplier, SupplierItem, PurchaseOrder, PurchaseOrderItem,
  GoodsReceipt, GoodsReceiptItem,
  ERPNotification,
  OrderType, OrderStatus, TaskStatus, InvoiceStatus, POStatus,
  PaymentConfirmStatus, Priority, MovementType,
  ItemType, BranchType, ReservationStatus,
} from '@/types/erp';

// Legacy re-exports for files not yet migrated
// POItem is an alias for PurchaseOrderItem fields used in old suppliers page
export type POItem = { sku: string; qty: number; cost: number };
export type StockMovement = import('@/types/erp').InventoryMovement;
export type StaffRole = string;

// Combine all slices into a single Root Store (Zustand Slices Pattern)
export type ERPStore = OrderSlice & InventorySlice & CustomerSlice & SessionSlice & SupplierSlice & {
  addStaff: (staff: Omit<Staff, 'id' | 'staffCode'>) => void;
  updateAppointmentStatus: (id: string, status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No Show') => void;
  pushNotification: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
};

export const useERPStore = create<ERPStore>((...a) => ({
  ...createOrderSlice(...a),
  ...createInventorySlice(...a),
  ...createCustomerSlice(...a),
  ...createSessionSlice(...a),
  ...createSupplierSlice(...a),
}));

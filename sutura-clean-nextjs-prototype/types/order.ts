import * as ERP from './erp';

export type JobOrder = ERP.Order;
export type ProductionTask = ERP.ProductionTask;
export type OrderStatusLog = ERP.OrderStatusLog;
export type GarmentTemplate = ERP.GarmentTemplate;

export type ProductionTaskStatus = ERP.TaskStatus;
export type OrderPriority = ERP.Priority;

// Re-export constants if any, or just use ERP types
export type { 
  OrderType, OrderStatus, TaskStatus, InvoiceStatus, POStatus,
  Priority, PaymentMethod
} from './erp';

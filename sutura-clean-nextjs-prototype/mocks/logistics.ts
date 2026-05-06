import { Supplier, SupplierItem, PurchaseOrder, PurchaseOrderItem, GoodsReceipt, GoodsReceiptItem } from '@/types/erp';

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'SUPP-001',
    shop_id: 'SHOP-001',
    supplier_name: 'Italian Fabric Co.',
    name: 'Italian Fabric Co.',
    contact_person: 'Giovanni Rossi',
    contact: 'Giovanni Rossi',
    email: 'giovanni@italianfabric.it',
    phone: '+39 02 1234567',
    status: 'Preferred',
    category: 'Fabric',
    address: 'Milan, Italy',
    lead_time_days: 30,
    is_active: true
  },
  {
    id: 'SUPP-002',
    shop_id: 'SHOP-001',
    supplier_name: 'Precision Notion & Accessories',
    name: 'Precision Notion & Accessories',
    contact_person: 'Elena Smith',
    contact: 'Elena Smith',
    email: 'sales@precisionnotion.com',
    phone: '+1 212 555 0199',
    status: 'Verified',
    category: 'Accessories',
    address: 'New York, USA',
    lead_time_days: 14,
    is_active: true
  }
];

export const INITIAL_SUPPLIER_ITEMS: SupplierItem[] = [
  { id: 'SUP-ITM-001', supplier_id: 'SUPP-001', inventory_item_id: 'INV-001', unit_cost: 850,  moq: 5,  is_preferred: true  },
  { id: 'SUP-ITM-002', supplier_id: 'SUPP-001', inventory_item_id: 'INV-002', unit_cost: 1200, moq: 3,  is_preferred: true  },
  { id: 'SUP-ITM-003', supplier_id: 'SUPP-002', inventory_item_id: 'INV-004', unit_cost: 25,   moq: 50, is_preferred: true  },
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'PO-001', shop_id: 'SHOP-001', branch_id: 'BRN-001', supplier_id: 'SUPP-001', requested_by_user_id: 'STF-001', status: 'RECEIVED',     requested_at: new Date('2026-04-01').toISOString(), expected_delivery_date: new Date('2026-04-08').toISOString(), total_amount: 5100, amount_paid: 5100 },
  { id: 'PO-002', shop_id: 'SHOP-001', branch_id: 'BRN-001', supplier_id: 'SUPP-002', requested_by_user_id: 'STF-001', status: 'SENT',         requested_at: new Date('2026-05-01').toISOString(), expected_delivery_date: new Date('2026-05-10').toISOString(), total_amount: 1250, amount_paid: 0    },
];

export const INITIAL_PURCHASE_ORDER_ITEMS: PurchaseOrderItem[] = [
  { id: 'POI-001', purchase_order_id: 'PO-001', inventory_item_id: 'INV-001', qty_ordered: 5,  qty_received: 5,  unit_cost: 850  },
  { id: 'POI-002', purchase_order_id: 'PO-001', inventory_item_id: 'INV-002', qty_ordered: 3,  qty_received: 3,  unit_cost: 1200 },
  { id: 'POI-003', purchase_order_id: 'PO-002', inventory_item_id: 'INV-004', qty_ordered: 50, qty_received: 0,  unit_cost: 25   },
];

export const INITIAL_GOODS_RECEIPTS: GoodsReceipt[] = [
  { id: 'GR-001', purchase_order_id: 'PO-001', branch_id: 'BRN-001', received_by_user_id: 'STF-001', received_at: new Date('2026-04-08').toISOString(), notes: 'All items received in good condition.' },
];

export const INITIAL_GOODS_RECEIPT_ITEMS: GoodsReceiptItem[] = [
  { id: 'GRI-001', goods_receipt_id: 'GR-001', purchase_order_item_id: 'POI-001', inventory_item_id: 'INV-001', qty_received: 5, qty_damaged: 0, unit_cost: 850 },
  { id: 'GRI-002', goods_receipt_id: 'GR-001', purchase_order_item_id: 'POI-002', inventory_item_id: 'INV-002', qty_received: 3, qty_damaged: 0, unit_cost: 1200 },
];

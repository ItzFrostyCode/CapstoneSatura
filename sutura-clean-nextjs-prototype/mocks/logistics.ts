import { Supplier, SupplierItem, PurchaseOrder, PurchaseOrderItem, GoodsReceipt, GoodsReceiptItem } from '@/types/erp';

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'SUPP-LOCAL-001',
    shop_id: 'SHOP-001',
    supplier_name: 'WST Modern Commercial',
    name: 'WST Modern Commercial',
    contact_person: 'Local Manager',
    contact: 'Local Manager',
    email: 'contact@wstmodern.com',
    phone: '082-123-4567',
    status: 'Preferred',
    category: 'Fabric',
    address: 'Davao City',
    lead_time_days: 3,
    payment_terms: 'Net 30',
    is_active: true
  },
  {
    id: 'SUPP-LOCAL-002',
    shop_id: 'SHOP-001',
    supplier_name: 'Davao Kian Bee Trading',
    name: 'Davao Kian Bee Trading',
    contact_person: 'Sales Lead',
    contact: 'Sales Lead',
    email: 'sales@kianbee.com',
    phone: '082-234-5678',
    status: 'Verified',
    category: 'Accessories',
    address: 'Davao City',
    lead_time_days: 2,
    payment_terms: 'Cash on Delivery',
    is_active: true
  },
  {
    id: 'SUPP-LOCAL-003',
    shop_id: 'SHOP-001',
    supplier_name: 'JC Commercial',
    name: 'JC Commercial',
    contact_person: 'Store Manager',
    contact: 'Store Manager',
    email: 'info@jccommercial.ph',
    phone: '082-345-6789',
    status: 'Preferred',
    category: 'General Materials',
    address: 'Davao City',
    lead_time_days: 1,
    payment_terms: 'Net 15',
    is_active: true
  },
  {
    id: 'SUPP-LOCAL-004',
    shop_id: 'SHOP-001',
    supplier_name: 'NCCC',
    name: 'NCCC',
    contact_person: 'Procurement Dept',
    contact: 'Procurement Dept',
    email: 'suppliers@nccc.com.ph',
    phone: '082-456-7890',
    status: 'Verified',
    category: 'Packaging',
    address: 'Davao City',
    lead_time_days: 1,
    payment_terms: 'Cash',
    is_active: true
  },
  {
    id: 'SUPP-LOCAL-005',
    shop_id: 'SHOP-001',
    supplier_name: 'Thimbelberry',
    name: 'Thimbelberry',
    contact_person: 'Owner',
    contact: 'Owner',
    email: 'thimbelberry@gmail.com',
    phone: '0917-555-1111',
    status: 'Preferred',
    category: 'Tools',
    address: 'Davao City',
    lead_time_days: 5,
    payment_terms: 'Net 30',
    is_active: true
  },
  {
    id: 'SUPP-LOCAL-006',
    shop_id: 'SHOP-001',
    supplier_name: 'Johnny Commercial',
    name: 'Johnny Commercial',
    contact_person: 'Johnny',
    contact: 'Johnny',
    email: 'johnnycomm@yahoo.com',
    phone: '082-678-9012',
    status: 'Verified',
    category: 'Accessories',
    address: 'Davao City',
    lead_time_days: 2,
    payment_terms: 'Net 7',
    is_active: true
  },
  {
    id: 'SUPP-MNL-001',
    shop_id: 'SHOP-001',
    supplier_name: 'Happy Together Commercial',
    name: 'Happy Together Commercial',
    contact_person: 'Manila Agent',
    contact: 'Manila Agent',
    email: 'orders@happytogether.ph',
    phone: '02-8123-4567',
    status: 'Preferred',
    category: 'Fabric',
    address: 'Binondo, Manila',
    lead_time_days: 7,
    payment_terms: 'Net 60',
    is_active: true
  },
  {
    id: 'SUPP-MNL-002',
    shop_id: 'SHOP-001',
    supplier_name: 'JLCL Textile',
    name: 'JLCL Textile',
    contact_person: 'Liza',
    contact: 'Liza',
    email: 'sales@jlcltextile.com',
    phone: '02-8234-5678',
    status: 'Preferred',
    category: 'Premium Textile',
    address: 'Divisoria, Manila',
    lead_time_days: 10,
    payment_terms: 'Net 30',
    is_active: true
  },
  {
    id: 'SUPP-MNL-003',
    shop_id: 'SHOP-001',
    supplier_name: 'Ceratex Incorporated',
    name: 'Ceratex Incorporated',
    contact_person: 'Technical Sales',
    contact: 'Technical Sales',
    email: 'info@ceratex.com.ph',
    phone: '02-8345-6789',
    status: 'Verified',
    category: 'Industrial Fabric',
    address: 'Quezon City, Manila',
    lead_time_days: 14,
    payment_terms: 'Net 45',
    is_active: true
  }
];

export const INITIAL_SUPPLIER_ITEMS: SupplierItem[] = [
  { id: 'SUP-ITM-001', supplier_id: 'SUPP-001', inventory_item_id: 'INV-001', unit_cost: 850,  moq: 5,  is_preferred: true  },
  { id: 'SUP-ITM-002', supplier_id: 'SUPP-001', inventory_item_id: 'INV-002', unit_cost: 1200, moq: 3,  is_preferred: true  },
  { id: 'SUP-ITM-003', supplier_id: 'SUPP-002', inventory_item_id: 'INV-004', unit_cost: 25,   moq: 50, is_preferred: true  },
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  { id: 'PO-001', shop_id: 'SHOP-001', branch_id: 'BRN-001', supplier_id: 'SUPP-001', requested_by_user_id: 'STF-001', status: 'DELIVERED',   requested_at: new Date('2026-04-01').toISOString(), expected_delivery_date: new Date('2026-04-08').toISOString(), total_amount: 5100, amount_paid: 5100 },
  { id: 'PO-002', shop_id: 'SHOP-001', branch_id: 'BRN-001', supplier_id: 'SUPP-002', requested_by_user_id: 'STF-001', status: 'CONFIRMED',   requested_at: new Date('2026-05-01').toISOString(), expected_delivery_date: new Date('2026-05-10').toISOString(), total_amount: 1250, amount_paid: 0    },
  { id: 'PO-003', shop_id: 'SHOP-001', branch_id: 'BRN-001', supplier_id: 'SUPP-003', requested_by_user_id: 'STF-001', status: 'IN_TRANSIT',  requested_at: new Date('2026-05-05').toISOString(), expected_delivery_date: new Date('2026-05-12').toISOString(), total_amount: 3600, amount_paid: 0    },
  { id: 'PO-004', shop_id: 'SHOP-001', branch_id: 'BRN-001', supplier_id: 'SUPP-004', requested_by_user_id: 'STF-001', status: 'PENDING',     requested_at: new Date('2026-05-08').toISOString(), expected_delivery_date: new Date('2026-05-20').toISOString(), total_amount: 880,  amount_paid: 0    },
  { id: 'PO-005', shop_id: 'SHOP-001', branch_id: 'BRN-001', supplier_id: 'SUPP-001', requested_by_user_id: 'STF-001', status: 'DRAFT',       requested_at: new Date('2026-05-10').toISOString(), expected_delivery_date: new Date('2026-06-01').toISOString(), total_amount: 7200, amount_paid: 0    },
];

export const INITIAL_PURCHASE_ORDER_ITEMS: PurchaseOrderItem[] = [
  { id: 'POI-001', purchase_order_id: 'PO-001', inventory_item_id: 'INV-001', qty_ordered: 5,  qty_received: 5,  unit_cost: 850  },
  { id: 'POI-002', purchase_order_id: 'PO-001', inventory_item_id: 'INV-002', qty_ordered: 3,  qty_received: 3,  unit_cost: 1200 },
  { id: 'POI-003', purchase_order_id: 'PO-002', inventory_item_id: 'INV-004', qty_ordered: 50, qty_received: 0,  unit_cost: 25   },
  { id: 'POI-004', purchase_order_id: 'PO-003', inventory_item_id: 'INV-001', qty_ordered: 8,  qty_received: 0,  unit_cost: 950  },
  { id: 'POI-005', purchase_order_id: 'PO-003', inventory_item_id: 'INV-003', qty_ordered: 10, qty_received: 0,  unit_cost: 720  },
  { id: 'POI-006', purchase_order_id: 'PO-004', inventory_item_id: 'INV-004', qty_ordered: 20, qty_received: 0,  unit_cost: 22   },
  { id: 'POI-007', purchase_order_id: 'PO-004', inventory_item_id: 'INV-005', qty_ordered: 30, qty_received: 0,  unit_cost: 18   },
  { id: 'POI-008', purchase_order_id: 'PO-005', inventory_item_id: 'INV-001', qty_ordered: 12, qty_received: 0,  unit_cost: 850  },
  { id: 'POI-009', purchase_order_id: 'PO-005', inventory_item_id: 'INV-002', qty_ordered: 6,  qty_received: 0,  unit_cost: 1200 },
];

export const INITIAL_GOODS_RECEIPTS: GoodsReceipt[] = [
  { id: 'GR-001', purchase_order_id: 'PO-001', branch_id: 'BRN-001', received_by_user_id: 'STF-001', received_at: new Date('2026-04-08').toISOString(), notes: 'All items received in good condition.' },
];

export const INITIAL_GOODS_RECEIPT_ITEMS: GoodsReceiptItem[] = [
  { id: 'GRI-001', goods_receipt_id: 'GR-001', purchase_order_item_id: 'POI-001', inventory_item_id: 'INV-001', qty_received: 5, qty_damaged: 0, unit_cost: 850 },
  { id: 'GRI-002', goods_receipt_id: 'GR-001', purchase_order_item_id: 'POI-002', inventory_item_id: 'INV-002', qty_received: 3, qty_damaged: 0, unit_cost: 1200 },
];

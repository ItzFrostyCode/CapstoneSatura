import { Invoice, Payment, SupplierBill, Settlement } from '@/types/erp';

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-2024-001',
    shop_id: 'SHOP-001',
    branch_id: 'BRN-001',
    job_order_id: 'ORD-1045',
    invoice_no: 'INV-1045',
    customer: 'Isabella Garcia',
    email: 'isabella@garcia.com',
    subject: 'Wedding Gown Deposit',
    subtotal: 45000,
    discount: 0,
    tax: 0,
    total_amount: 45000,
    status: 'PAID',
    issued_at: new Date('2026-04-20').toISOString(),
    due_date: new Date('2026-04-20').toISOString(),
    items: [
      { description: 'Wedding Gown (Silk) - Partial Payment', qty: 1, unitPrice: 45000, total: 45000 }
    ]
  },
  {
    id: 'INV-2026-002',
    shop_id: 'SHOP-001',
    branch_id: 'BRN-001',
    job_order_id: 'ORD-1051',
    invoice_no: 'INV-1051',
    customer: 'Juan Dela Cruz',
    email: 'juan@example.com',
    subject: 'Bespoke Suit Balance',
    subtotal: 12500,
    discount: 0,
    tax: 0,
    total_amount: 12500,
    status: 'UNPAID',
    issued_at: new Date('2026-05-01').toISOString(),
    due_date: new Date('2026-05-15').toISOString(),
    items: [
      { description: 'Bespoke 3-Piece Suit', qty: 1, unitPrice: 12500, total: 12500 }
    ]
  },
  {
    id: 'INV-2026-003',
    shop_id: 'SHOP-001',
    branch_id: 'BRN-001',
    job_order_id: 'ORD-1052',
    invoice_no: 'INV-1052',
    customer: 'Maria Clara',
    email: 'maria@example.com',
    subject: 'Evening Gown Final Payment',
    subtotal: 8500,
    discount: 500,
    tax: 0,
    total_amount: 8000,
    status: 'PARTIAL',
    issued_at: new Date('2026-05-02').toISOString(),
    due_date: new Date('2026-05-10').toISOString(),
    items: [
      { description: 'Custom Evening Gown', qty: 1, unitPrice: 8500, total: 8500 }
    ]
  },
  {
    id: 'INV-2026-004',
    shop_id: 'SHOP-001',
    branch_id: 'BRN-002',
    job_order_id: 'ORD-1053',
    invoice_no: 'INV-1053',
    customer: 'Ricardo Dalisay',
    email: 'cardoz@example.com',
    subject: 'Corporate Uniform Bulk Order',
    subtotal: 25000,
    discount: 0,
    tax: 3000,
    total_amount: 28000,
    status: 'UNPAID',
    issued_at: new Date('2026-05-05').toISOString(),
    due_date: new Date('2026-05-20').toISOString(),
    items: [
      { description: 'Standard Corporate Uniforms', qty: 20, unitPrice: 1250, total: 25000 }
    ]
  },
  {
    id: 'INV-2026-005',
    shop_id: 'SHOP-001',
    branch_id: 'BRN-001',
    job_order_id: 'ORD-1040',
    invoice_no: 'INV-1040',
    customer: 'Ferdinand Marcos',
    email: 'ferdie@example.com',
    subject: 'Historical Restoration Project',
    subtotal: 150000,
    discount: 0,
    tax: 0,
    total_amount: 150000,
    status: 'UNPAID',
    issued_at: new Date('2026-03-15').toISOString(),
    due_date: new Date('2026-04-15').toISOString(),
    items: [
      { description: 'Royal Ceremonial Attire', qty: 1, unitPrice: 150000, total: 150000 }
    ]
  },
  {
    id: 'INV-2026-006',
    shop_id: 'SHOP-001',
    branch_id: 'BRN-001',
    job_order_id: 'ORD-1048',
    invoice_no: 'INV-1048',
    customer: 'Imelda Romualdez',
    email: 'meldy@example.com',
    subject: 'Shoe Collection Display Maintenance',
    subtotal: 75000,
    discount: 0,
    tax: 0,
    total_amount: 75000,
    status: 'PARTIAL',
    issued_at: new Date('2026-04-01').toISOString(),
    due_date: new Date('2026-05-01').toISOString(),
    items: [
      { description: 'Curated Display Case Fitting', qty: 1, unitPrice: 75000, total: 75000 }
    ]
  },
  {
    id: 'INV-DEMO-001',
    shop_id: 'SHOP-001',
    branch_id: 'BRN-001',
    job_order_id: 'ORD-DEMO-1',
    invoice_no: 'INV-ON-TRACK',
    customer: 'Elena Gilbert',
    email: 'elena@mystic.com',
    subject: 'Prom Gown Deposit [ON TRACK]',
    subtotal: 15000,
    discount: 0,
    tax: 0,
    total_amount: 15000,
    status: 'UNPAID',
    issued_at: new Date('2026-05-01').toISOString(),
    due_date: new Date('2026-05-25').toISOString(), // Far in future
    items: [
      { description: 'Custom Prom Gown (Silk)', qty: 1, unitPrice: 15000, total: 15000 }
    ]
  },
  {
    id: 'INV-DEMO-002',
    shop_id: 'SHOP-001',
    branch_id: 'BRN-001',
    job_order_id: 'ORD-DEMO-2',
    invoice_no: 'INV-DUE-SOON',
    customer: 'Stefan Salvatore',
    email: 'stefan@mystic.com',
    subject: 'Wedding Tuxedo [DUE SOON]',
    subtotal: 18000,
    discount: 0,
    tax: 0,
    total_amount: 18000,
    status: 'PARTIAL',
    issued_at: new Date('2026-04-25').toISOString(),
    due_date: new Date('2026-05-09').toISOString(), // 2 days from today (May 7)
    items: [
      { description: 'Tailored Wedding Tuxedo', qty: 1, unitPrice: 18000, total: 18000 }
    ]
  },
  {
    id: 'INV-DEMO-003',
    shop_id: 'SHOP-001',
    branch_id: 'BRN-002',
    job_order_id: 'ORD-DEMO-3',
    invoice_no: 'INV-OVERDUE',
    customer: 'Damon Salvatore',
    email: 'damon@mystic.com',
    subject: 'Leather Jacket Repair [OVERDUE]',
    subtotal: 5500,
    discount: 0,
    tax: 0,
    total_amount: 5500,
    status: 'UNPAID',
    issued_at: new Date('2026-04-01').toISOString(),
    due_date: new Date('2026-04-30').toISOString(), // Past due
    items: [
      { description: 'Vintage Leather Restoration', qty: 1, unitPrice: 5500, total: 5500 }
    ]
  },
  {
    id: 'INV-DEMO-004',
    shop_id: 'SHOP-001',
    branch_id: 'BRN-001',
    job_order_id: 'ORD-DEMO-4',
    invoice_no: 'INV-PAID',
    customer: 'Caroline Forbes',
    email: 'caroline@mystic.com',
    subject: 'Bridesmaid Gown [FULLY PAID]',
    subtotal: 12000,
    discount: 0,
    tax: 0,
    total_amount: 12000,
    status: 'PAID',
    issued_at: new Date('2026-04-20').toISOString(),
    due_date: new Date('2026-05-05').toISOString(),
    items: [
      { description: 'Bridesmaid Gown (Tulle)', qty: 1, unitPrice: 12000, total: 12000 }
    ]
  },
  {
    id: 'INV-HIST-001',
    shop_id: 'SHOP-001',
    branch_id: 'BRN-001',
    job_order_id: 'ORD-HIST-001',
    invoice_no: 'INV-H001',
    customer: 'James Brown',
    email: 'james@gmail.com',
    subject: 'Standard Suit Order',
    subtotal: 15000,
    discount: 0,
    tax: 0,
    total_amount: 15000,
    status: 'PAID',
    issued_at: '2025-11-20T10:00:00Z',
    due_date: '2025-11-20T10:00:00Z',
    items: [
      { description: 'Standard Suit', qty: 1, unitPrice: 15000, total: 15000 }
    ]
  },
  {
    id: 'INV-HIST-002',
    shop_id: 'SHOP-001',
    branch_id: 'BRN-001',
    job_order_id: 'ORD-HIST-002',
    invoice_no: 'INV-H002',
    customer: 'Arthur Taylor',
    email: 'arthur@gmail.com',
    subject: 'Cotton Shirt Bundle',
    subtotal: 12000,
    discount: 0,
    tax: 0,
    total_amount: 12000,
    status: 'PAID',
    issued_at: '2025-12-05T10:00:00Z',
    due_date: '2025-12-05T10:00:00Z',
    items: [
      { description: 'Premium Cotton Shirt', qty: 3, unitPrice: 4000, total: 12000 }
    ]
  },
  {
    id: 'INV-HIST-003',
    shop_id: 'SHOP-001',
    branch_id: 'BRN-001',
    job_order_id: 'ORD-HIST-003',
    invoice_no: 'INV-H003',
    customer: 'Matthew Johnson',
    email: 'matt@gmail.com',
    subject: 'Alteration Services',
    subtotal: 2500,
    discount: 0,
    tax: 0,
    total_amount: 2500,
    status: 'PAID',
    issued_at: '2026-02-01T10:00:00Z',
    due_date: '2026-02-01T10:00:00Z',
    items: [
      { description: 'Alteration Bundle', qty: 1, unitPrice: 2500, total: 2500 }
    ]
  },
  {
    id: 'INV-HIST-004',
    shop_id: 'SHOP-001',
    branch_id: 'BRN-001',
    job_order_id: 'ORD-HIST-004',
    invoice_no: 'INV-H004',
    customer: 'Alexander McQueen',
    email: 'alex@mcqueen.com',
    subject: 'Bespoke Gown Final',
    subtotal: 45000,
    discount: 0,
    tax: 0,
    total_amount: 45000,
    status: 'PAID',
    issued_at: '2026-02-25T10:00:00Z',
    due_date: '2026-02-25T10:00:00Z',
    items: [
      { description: 'Bespoke Silk Gown', qty: 1, unitPrice: 45000, total: 45000 }
    ]
  },
  {
    id: 'INV-HIST-005',
    shop_id: 'SHOP-001',
    branch_id: 'BRN-001',
    job_order_id: 'ORD-HIST-005',
    invoice_no: 'INV-H005',
    customer: 'Maria Clara',
    email: 'maria.clara@noli.ph',
    subject: 'Traditional Filipiniana Gown',
    subtotal: 28000,
    discount: 0,
    tax: 0,
    total_amount: 28000,
    status: 'PAID',
    issued_at: '2025-12-28T10:00:00Z',
    due_date: '2025-12-28T10:00:00Z',
    items: [
      { description: 'Traditional Filipiniana', qty: 1, unitPrice: 28000, total: 28000 }
    ]
  },
  {
    id: 'INV-HIST-006',
    shop_id: 'SHOP-001',
    branch_id: 'BRN-001',
    job_order_id: 'ORD-HIST-006',
    invoice_no: 'INV-H006',
    customer: 'Wei Chen',
    email: 'weichen@gmail.com',
    subject: 'Bulk Polo Order',
    subtotal: 8500,
    discount: 0,
    tax: 0,
    total_amount: 8500,
    status: 'PAID',
    issued_at: '2026-02-15T10:00:00Z',
    due_date: '2026-02-15T10:00:00Z',
    items: [
      { description: 'Event Polo T-Shirts', qty: 10, unitPrice: 850, total: 8500 }
    ]
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  { "id": "PAY-100", "job_order_id": "ORD-1051", "received_by_user_id": "STF-006", "amount": 29607, "payment_method": "CASH", "reference_no": "CSH-29607", "paid_at": "2026-05-02T16:11:14.659Z", "status": "CONFIRMED" },
  { "id": "PAY-101", "job_order_id": "ORD-1052", "received_by_user_id": "STF-002", "amount": 6800, "payment_method": "CASH", "reference_no": "CSH-6800", "paid_at": "2026-05-04T16:11:14.659Z", "status": "CONFIRMED" },
  { "id": "PAY-102", "job_order_id": "ORD-1053", "received_by_user_id": "STF-002", "amount": 500, "payment_method": "GCASH", "reference_no": "GCSH-500", "paid_at": "2026-05-02T16:11:14.659Z", "status": "CONFIRMED" },
  { "id": "PAY-115", "job_order_id": "ORD-1045", "invoice_id": "INV-2024-001", "received_by_user_id": "STF-001", "amount": 15000, "amount_paid": 15000, "payment_method": "BANK_TRANSFER", "reference_no": "BNK-TR-998877", "paid_at": "2026-05-06T10:00:00.000Z", "status": "CONFIRMED" },
  { "id": "PAY-116", "job_order_id": "ORD-1052", "invoice_id": "INV-2026-003", "received_by_user_id": "STF-002", "amount": 3000, "amount_paid": 3000, "payment_method": "CASH", "reference_no": "CSH-3000", "paid_at": "2026-05-06T11:00:00.000Z", "status": "CONFIRMED" },
  { "id": "PAY-117", "job_order_id": "ORD-1048", "invoice_id": "INV-2026-006", "received_by_user_id": "STF-001", "amount": 25000, "amount_paid": 25000, "payment_method": "BANK_TRANSFER", "reference_no": "BNK-PAY-117", "paid_at": "2026-05-02T10:00:00.000Z", "status": "CONFIRMED" },
  { "id": "PAY-109", "job_order_id": "ORD-1061", "received_by_user_id": "STF-002", "amount": 500, "payment_method": "GCASH", "reference_no": "GCSH-99221100", "paid_at": "2026-05-03T16:11:14.659Z", "status": "CONFIRMED" },
  { "id": "PAY-110", "job_order_id": "ORD-1062", "received_by_user_id": "STF-005", "amount": 1850, "payment_method": "GCASH", "reference_no": "GCSH-88334455", "paid_at": "2026-05-05T16:11:14.659Z", "status": "CONFIRMED" },
  { "id": "PAY-112", "job_order_id": "ORD-1065", "received_by_user_id": "STF-006", "amount": 250, "payment_method": "GCASH", "reference_no": "GCSH-77665544", "paid_at": "2026-05-04T16:11:14.659Z", "status": "CONFIRMED" },
  { "id": "PAY-HIST-001", "job_order_id": "ORD-HIST-001", "invoice_id": "INV-HIST-001", "received_by_user_id": "STF-001", "amount": 15000, "amount_paid": 15000, "payment_method": "CASH", "reference_no": "CSH-H001", "paid_at": "2025-11-20T11:00:00Z", "status": "CONFIRMED" },
  { "id": "PAY-HIST-002", "job_order_id": "ORD-HIST-002", "invoice_id": "INV-HIST-002", "received_by_user_id": "STF-002", "amount": 12000, "amount_paid": 12000, "payment_method": "BANK_TRANSFER", "reference_no": "BNK-H002", "paid_at": "2025-12-05T11:00:00Z", "status": "CONFIRMED" },
  { "id": "PAY-HIST-003", "job_order_id": "ORD-HIST-003", "invoice_id": "INV-HIST-003", "received_by_user_id": "STF-004", "amount": 2500, "amount_paid": 2500, "payment_method": "GCASH", "reference_no": "GCSH-H003", "paid_at": "2026-02-01T11:00:00Z", "status": "CONFIRMED" },
  { "id": "PAY-HIST-004", "job_order_id": "ORD-HIST-004", "invoice_id": "INV-HIST-004", "received_by_user_id": "STF-005", "amount": 45000, "amount_paid": 45000, "payment_method": "BANK_TRANSFER", "reference_no": "BNK-H004", "paid_at": "2026-02-25T11:00:00Z", "status": "CONFIRMED" },
  { "id": "PAY-HIST-005", "job_order_id": "ORD-HIST-005", "invoice_id": "INV-HIST-005", "received_by_user_id": "STF-006", "amount": 28000, "amount_paid": 28000, "payment_method": "CASH", "reference_no": "CSH-H005", "paid_at": "2025-12-28T11:00:00Z", "status": "CONFIRMED" },
  { "id": "PAY-HIST-006", "job_order_id": "ORD-HIST-006", "invoice_id": "INV-HIST-006", "received_by_user_id": "STF-001", "amount": 8500, "amount_paid": 8500, "payment_method": "GCASH", "reference_no": "GCSH-H006", "paid_at": "2026-02-15T11:00:00Z", "status": "CONFIRMED" }
];

export const INITIAL_SUPPLIER_BILLS: SupplierBill[] = [
  {
    id: 'BILL-001',
    supplierId: 'SUPP-001',
    supplier_name: 'Italian Fabric Co.',
    amount: 25000,
    balance: 5000,
    status: 'PARTIAL',
    dueDate: new Date('2026-05-15').toISOString(),
    createdAt: new Date('2026-05-01').toISOString()
  },
  {
    id: 'BILL-002',
    supplierId: 'SUPP-002',
    supplier_name: 'Precision Notion & Accessories',
    amount: 12500,
    balance: 12500,
    status: 'UNPAID',
    dueDate: new Date('2026-05-20').toISOString(),
    createdAt: new Date('2026-05-05').toISOString()
  }
];

export const INITIAL_SETTLEMENTS: Settlement[] = [
  {
    id: 'SET-001',
    billId: 'BILL-001',
    amount: 20000,
    method: 'BANK_TRANSFER',
    referenceNo: 'REF-987654',
    date: new Date('2026-05-10').toISOString(),
    supplier_name: 'Italian Fabric Co.'
  }
];

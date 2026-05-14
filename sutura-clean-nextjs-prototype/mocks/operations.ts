import { Order, JobOrderItem, ProductionTask, Appointment } from '@/types/erp';

export const INITIAL_ORDERS: Order[] = [
  {
    "id": "ORD-1070",
    "shop_id": "SHOP-001",
    "branch_id": "BRN-001",
    "customer_id": "CUST-004",
    "created_by_user_id": "STF-001",
    "order_type": "BESPOKE",
    "source_type": "WALK_IN",
    "status": "IN_PRODUCTION",
    "priority": "High",
    "total_amount": 42000,
    "balance": 21000,
    "due_date": "2026-06-15T10:00:00Z",
    "created_at": "2026-05-10T10:00:00Z",
    "measurement_profile_id": "MEAS-001",
    "inspection_passed": false
  },
  {
    "id": "ORD-1071",
    "shop_id": "SHOP-001",
    "branch_id": "BRN-001",
    "customer_id": "CUST-005",
    "created_by_user_id": "STF-001",
    "order_type": "BESPOKE",
    "source_type": "ONLINE",
    "status": "READY_FOR_FITTING",
    "priority": "Normal",
    "total_amount": 35000,
    "balance": 17500,
    "due_date": "2026-06-20T14:00:00Z",
    "created_at": "2026-05-11T11:00:00Z",
    "measurement_profile_id": "MEAS-005",
    "inspection_passed": false
  },
  {
    "id": "ORD-1072",
    "shop_id": "SHOP-001",
    "branch_id": "BRN-001",
    "customer_id": "CUST-001",
    "created_by_user_id": "STF-002",
    "order_type": "BESPOKE",
    "source_type": "WALK_IN",
    "status": "IN_PRODUCTION",
    "priority": "Normal",
    "total_amount": 18500,
    "balance": 9250,
    "due_date": "2026-05-28T10:00:00Z",
    "created_at": "2026-05-08T10:00:00Z",
    "measurement_profile_id": "MEAS-003",
    "inspection_passed": false
  },
  {
    "id": "ORD-1073",
    "shop_id": "SHOP-001",
    "branch_id": "BRN-001",
    "customer_id": "CUST-006",
    "created_by_user_id": "STF-004",
    "order_type": "ALTERATION",
    "source_type": "WALK_IN",
    "status": "READY_FOR_RELEASE",
    "priority": "High",
    "total_amount": 2500,
    "balance": 0,
    "due_date": "2026-05-14T10:00:00Z",
    "created_at": "2026-05-12T10:00:00Z",
    "inspection_passed": true
  },
  {
    "id": "ORD-1074",
    "shop_id": "SHOP-001",
    "branch_id": "BRN-001",
    "customer_id": "CUST-004",
    "created_by_user_id": "STF-001",
    "order_type": "BESPOKE",
    "source_type": "WALK_IN",
    "status": "RELEASED",
    "priority": "Normal",
    "total_amount": 15000,
    "balance": 0,
    "due_date": "2026-04-30T10:00:00Z",
    "created_at": "2026-04-01T10:00:00Z",
    "inspection_passed": true
  }
];

export const INITIAL_JOB_ORDER_ITEMS: JobOrderItem[] = [
  { "id": "JOI-1070", "job_order_id": "ORD-1070", "garment_name": "Midnight Navy Bespoke Tuxedo", "quantity": 1, "unit_price": 42000, "line_total": 42000 },
  { "id": "JOI-1071", "job_order_id": "ORD-1071", "garment_name": "Hand-Draped Silk Evening Gown", "quantity": 1, "unit_price": 35000, "line_total": 35000 },
  { "id": "JOI-1072", "job_order_id": "ORD-1072", "garment_name": "Italian Wool 3-Piece Suit", "quantity": 1, "unit_price": 18500, "line_total": 18500 },
  { "id": "JOI-1073", "job_order_id": "ORD-1073", "garment_name": "Bespoke Blazer Tapering", "quantity": 1, "unit_price": 2500, "line_total": 2500 },
  { "id": "JOI-1074", "job_order_id": "ORD-1074", "garment_name": "Classic White Oxford Shirt", "quantity": 1, "unit_price": 15000, "line_total": 15000 }
];

export const INITIAL_PRODUCTION_TASKS: ProductionTask[] = [
  { "id": "TSK-1070-1", "job_order_id": "ORD-1070", "title": "Bespoke Pattern Drafting", "status": "Completed", "assigned_staff_id": "STF-002" },
  { "id": "TSK-1070-2", "job_order_id": "ORD-1070", "title": "Canvas & Structure Prep", "status": "In Progress", "assigned_staff_id": "STF-003" },
  { "id": "TSK-1070-3", "job_order_id": "ORD-1070", "title": "Initial Basted Fitting", "status": "Pending", "assigned_staff_id": "STF-001" },
  { "id": "TSK-1071-1", "job_order_id": "ORD-1071", "title": "Fabric Selection & Analysis", "status": "Completed", "assigned_staff_id": "STF-004" },
  { "id": "TSK-1071-2", "job_order_id": "ORD-1071", "title": "Hand-Draping Process", "status": "In Progress", "assigned_staff_id": "STF-002" },
  { "id": "TSK-1072-1", "job_order_id": "ORD-1072", "title": "Main Body Sewing", "status": "In Progress", "assigned_staff_id": "STF-005" },
  { "id": "TSK-1072-2", "job_order_id": "ORD-1072", "title": "Shoulder Construction", "status": "Pending", "assigned_staff_id": "STF-002" }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APP-1024',
    customer: 'Alexander McQueen',
    email: 'alex@mcqueen.com',
    phone: '0918-123-4567',
    type: 'First Fitting',
    category: 'Fitting',
    date: '2026-05-07',
    startTime: '10:00',
    duration: 60,
    status: 'Scheduled',
    staff: 'John Clock',
    source: 'Online',
    branch_id: 'BRN-001',

    reason: 'Initial fitting for bespoke tuxedo. Needs adjustment on shoulders.'
  },
  {
    id: 'APP-1025',
    customer: 'Wei Chen',
    email: 'weichen@gmail.com',
    phone: '+63 905 777 8888',
    type: 'Initial Consultation',
    category: 'Consultation',
    date: '2026-05-07',
    startTime: '14:30',
    duration: 45,
    status: 'Pending Review',
    staff: 'Unassigned',
    source: 'Online',
    branch_id: 'BRN-001',

    reason: 'Wedding gown design consultation.'
  },
  {
    id: 'APP-1026',
    customer: 'Maria Clara',
    email: 'maria.clara@noli.ph',
    phone: '0919-777-1887',
    type: 'Measurement Session',
    category: 'Measurement',
    date: '2026-05-07',
    startTime: '15:30',
    duration: 30,
    status: 'Completed',
    staff: 'Maria Santos',
    source: 'Walk-in',
    branch_id: 'BRN-001',

    reason: 'Taking final measurements for the Filipiniana gown.'
  },
  {
    id: 'APP-1027',
    customer: 'James Brown',
    email: 'james@gmail.com',
    phone: '+63 917 111 2222',
    type: 'FITTING',
    category: 'Fitting',
    date: '2026-05-07',
    startTime: '11:30 AM',
    duration: 60,
    status: 'Scheduled',
    staff: 'Maria Santos',
    source: 'Walk-in',
    branch_id: 'BRN-001',
    reason: 'Sleeve adjustment and waist taper'
  },
  {
    id: 'APP-1031',
    customer: 'James Brown',
    email: 'james@gmail.com',
    phone: '+63 917 111 2222',
    type: 'CONSULTATION',
    category: 'Consultation',
    date: '2026-05-09',
    startTime: '2:00 PM',
    duration: 45,
    status: 'Scheduled',
    staff: 'Carlo Reyes',
    source: 'Walk-in',
    branch_id: 'BRN-001',
    reason: 'Initial wedding tuxedo discussion'
  },
  {
    id: 'APP-1036',
    customer: 'James Brown',
    email: 'james@gmail.com',
    phone: '+63 917 111 2222',
    type: 'PICKUP',
    category: 'Pickup',
    date: '2026-05-10',
    startTime: '4:30 PM',
    duration: 30,
    status: 'Completed',
    staff: 'Angela Cruz',
    source: 'Walk-in',
    branch_id: 'BRN-001',
    reason: 'Final garment release'
  },
  {
    id: 'APP-1028',
    customer: 'Arthur Taylor',
    email: 'arthur@gmail.com',
    phone: '+63 920 333 4444',
    type: 'Pick-up',
    category: 'Pickup',
    date: '2026-05-08',
    startTime: '11:00',
    duration: 30,
    status: 'Scheduled',
    staff: 'Juan Reyes',
    source: 'Online',
    branch_id: 'BRN-001',

    reason: 'Final check for the corporate blazer.'
  },
  {
    id: 'APP-1029',
    customer: 'Elena Gilbert',
    email: 'elena@mystic.com',
    phone: '0917-888-9999',
    type: 'Initial Consultation',
    category: 'Consultation',
    date: '2026-05-09',
    startTime: '09:00',
    duration: 45,
    status: 'Pending Review',
    staff: 'Unassigned',
    source: 'Online',
    branch_id: 'BRN-001',

    reason: 'Prom dress consultation.'
  }
];

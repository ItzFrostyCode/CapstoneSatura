const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const storeFile = path.join(__dirname, 'app/(owner-portal)/store/useERPStore.ts');

const billing = [
  { id: "#CIV-012001", order_id: "ORD-001", customer_id: "CUST-001", customer: "James Brown", email: "james@gmail.com", date: "Feb 05 - Feb 10, 2025", total_amount: 10213, status: "Open", subject: "Custom Suit Design" },
  { id: "#CIV-013005", order_id: "ORD-002", customer_id: "CUST-002", customer: "Arthur Taylor", email: "arthur@gmail.com", date: "Feb 08 - Feb 12, 2025", total_amount: 600, status: "Paid", subject: "Alterations & Repair" },
  { id: "#CIV-012010", order_id: "ORD-003", customer_id: "CUST-003", customer: "Matthew Johnson", email: "matt@gmail.com", date: "Feb 10 - Feb 16, 2025", total_amount: 1000, status: "Open", subject: "Barong Tagalog" },
  { id: "#CIV-014024", order_id: "ORD-004", customer_id: "CUST-004", customer: "Wei Chen", email: "weichen@gmail.com", date: "Feb 11 - Feb 18, 2025", total_amount: 8000, status: "Past Due", subject: "Wedding Gown Deposit" },
  { id: "#CIV-015049", order_id: "ORD-005", customer_id: "CUST-005", customer: "Jump Amend", email: "jump@gmail.com", date: "Feb 14 - Feb 22, 2025", total_amount: 300, status: "Draft", subject: "Product Design" },
  { id: "#CIV-014025", order_id: "ORD-006", customer_id: "CUST-006", customer: "Ravi Patel", email: "ravipatel@gmail.com", date: "Feb 15 - Feb 25, 2025", total_amount: 430, status: "Past Due", subject: "Pants Shortening" },
  { id: "#CIV-012002", order_id: "ORD-007", customer_id: "CUST-007", customer: "David Smith", email: "david@gmail.com", date: "Feb 16 - Feb 24, 2025", total_amount: 1250, status: "Paid", subject: "Office Uniforms" }
];
fs.writeFileSync(path.join(dataDir, 'billing.json'), JSON.stringify(billing, null, 2));

const payments = [
  { id: "PAY-001", invoice_id: "#CIV-013005", order_id: "ORD-002", customer_id: "CUST-002", amount_paid: 600, payment_method: "Cash", received_by: "STF-001", paid_at: "2025-02-12T10:00:00Z", notes: "Full payment" },
  { id: "PAY-002", invoice_id: "#CIV-012002", order_id: "ORD-007", customer_id: "CUST-007", amount_paid: 1250, payment_method: "GCash", received_by: "STF-002", paid_at: "2025-02-24T14:30:00Z", notes: "Full payment via GCash" },
  { id: "PAY-003", invoice_id: "#CIV-012001", order_id: "ORD-001", customer_id: "CUST-001", amount_paid: 5000, payment_method: "Bank Transfer", received_by: "STF-001", paid_at: "2025-02-06T09:00:00Z", notes: "50% Downpayment" }
];
fs.writeFileSync(path.join(dataDir, 'payments.json'), JSON.stringify(payments, null, 2));

const measurements = [
  { id: "MEAS-001", customer_id: "CUST-001", neck: 15.5, chest: 40, waist: 34, hips: 41, shoulder: 18, sleeve_length: 25, inseam: 30, recorded_by: "STF-002", recorded_at: "2025-02-05T09:00:00Z", is_current: true },
  { id: "MEAS-002", customer_id: "CUST-003", neck: 16, chest: 42, waist: 36, hips: 43, shoulder: 19, sleeve_length: 26, inseam: 31, recorded_by: "STF-003", recorded_at: "2025-02-10T10:30:00Z", is_current: true }
];
fs.writeFileSync(path.join(dataDir, 'measurements.json'), JSON.stringify(measurements, null, 2));

const orderStatusLogs = [
  { id: "OSL-001", order_id: "ORD-001", changed_by: "STF-001", previous_status: "Pending", new_status: "For Fitting", remarks: "Fabric arrived", changed_at: "2025-02-07T11:00:00Z" },
  { id: "OSL-002", order_id: "ORD-001", changed_by: "STF-002", previous_status: "For Fitting", new_status: "In Progress", remarks: "Client approved fit", changed_at: "2025-02-08T15:00:00Z" },
  { id: "OSL-003", order_id: "ORD-002", changed_by: "STF-003", previous_status: "Pending", new_status: "Completed", remarks: "Alterations done", changed_at: "2025-02-11T16:00:00Z" }
];
fs.writeFileSync(path.join(dataDir, 'order_status_logs.json'), JSON.stringify(orderStatusLogs, null, 2));

const rawOrders = JSON.parse(fs.readFileSync(path.join(dataDir, 'orders.json'), 'utf8'));
const orders = rawOrders.map(o => ({
  ...o,
  customer_id: o.customer_id || "CUST-001",
  assigned_tailor_id: o.assigned_tailor_id || "STF-003",
  measurement_profile_id: o.measurement_profile_id || "MEAS-001"
}));
fs.writeFileSync(path.join(dataDir, 'orders.json'), JSON.stringify(orders, null, 2));

const rawCustomers = JSON.parse(fs.readFileSync(path.join(dataDir, 'customers.json'), 'utf8'));
const customers = rawCustomers.map(c => {
  const { status, ordersCount, lastOrder, ...rest } = c;
  return { ...rest, id: rest.id || "CUST-00" + Math.floor(Math.random() * 9 + 1) };
});
fs.writeFileSync(path.join(dataDir, 'customers.json'), JSON.stringify(customers, null, 2));

const rawInventory = JSON.parse(fs.readFileSync(path.join(dataDir, 'inventory.json'), 'utf8'));
const inventory = rawInventory.map(i => {
  const { supplier_name, price, ...rest } = i;
  return { ...rest, price: typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price, supplier_id: i.supplier_id || "SUP-001" };
});
fs.writeFileSync(path.join(dataDir, 'inventory.json'), JSON.stringify(inventory, null, 2));

console.log("JSON seeds updated");

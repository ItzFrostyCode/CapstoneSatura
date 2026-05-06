Recommended normalized schema
A. Core shop tables
users
- id (PK)
- role (admin, owner, staff, customer, designer)
- name
- email
- password_hash
- status (active, inactive, suspended)
- created_at

subscriptions
- id (PK)
- plan_name
- plan_level (basic, pro, premium)
- status (pending, active, expired, cancelled)
- max_branches
- max_staff
- start_date
- end_date
- price

shops
- id (PK)
- owner_user_id (FK -> users.id)
- subscription_id (FK -> subscriptions.id)
- shop_name
- business_name
- business_type
- status (pending, active, suspended)
- created_at
B. Multi-branch tables
shop_branches
- id (PK)
- shop_id (FK -> shops.id)
- branch_name
- branch_code
- address
- contact_no
- is_main (boolean)
- manager_user_id (FK -> users.id, nullable)
- status (active, inactive, archived)
- created_at

branch_members
- id (PK)
- branch_id (FK -> shop_branches.id)
- user_id (FK -> users.id)
- branch_role (manager, tailor, helper, cashier, inventory)
- status (active, inactive)
- assigned_at

branch_permissions
- id (PK)
- branch_member_id (FK -> branch_members.id)
- permission_code
- can_view
- can_create
- can_update
- can_delete
C. Customer and measurement tables
customers
- id (PK)
- shop_id (FK -> shops.id)
- user_id (FK -> users.id, nullable if walk-in customer)
- full_name
- email
- phone
- address
- status (active, inactive)
- created_at

customer_measurements
- id (PK)
- customer_id (FK -> customers.id)
- branch_id (FK -> shop_branches.id)
- recorded_by_user_id (FK -> users.id)
- recorded_at
- neck
- chest
- waist
- hip
- shoulder
- sleeve
- length
- posture_notes
- status (draft, confirmed, superseded, archived)
- version_no
D. Orders and workflow tables
orders
- id (PK)
- shop_id (FK -> shops.id)
- branch_id (FK -> shop_branches.id)
- customer_id (FK -> customers.id)
- created_by_user_id (FK -> users.id)
- assigned_staff_id (FK -> users.id, nullable)
- order_type (bespoke, premade, alteration)
- source_type (walk_in, online)
- status (draft, pending, accepted, in_production, for_fitting, ready_for_pickup, completed, cancelled, on_hold)
- total_amount
- balance
- due_date
- created_at

order_items
- id (PK)
- order_id (FK -> orders.id)
- garment_name
- quantity
- unit_price
- notes

order_status_history
- id (PK)
- order_id (FK -> orders.id)
- status
- changed_by_user_id (FK -> users.id)
- changed_at
- notes
E. Inventory and supplier tables
inventory_items
- id (PK)
- shop_id (FK -> shops.id)
- sku
- item_name
- category
- unit
- reorder_level
- status (active, low_stock, out_of_stock, archived)

branch_inventory
- id (PK)
- branch_id (FK -> shop_branches.id)
- inventory_item_id (FK -> inventory_items.id)
- on_hand_qty
- reserved_qty
- available_qty
- low_stock_flag (boolean)
- last_updated

inventory_movements
- id (PK)
- branch_id (FK -> shop_branches.id)
- inventory_item_id (FK -> inventory_items.id)
- movement_type (in, out, reserve, release, adjust)
- quantity
- reference_type
- reference_id
- moved_by_user_id (FK -> users.id)
- created_at

suppliers
- id (PK)
- shop_id (FK -> shops.id)
- supplier_name
- contact_person
- phone
- email
- address
- status (active, inactive)

purchase_orders
- id (PK)
- shop_id (FK -> shops.id)
- branch_id (FK -> shop_branches.id, nullable)
- supplier_id (FK -> suppliers.id)
- requested_by_user_id (FK -> users.id)
- status (draft, for_approval, approved, sent, partial_received, received, cancelled)
- requested_at

purchase_order_items
- id (PK)
- purchase_order_id (FK -> purchase_orders.id)
- inventory_item_id (FK -> inventory_items.id)
- quantity
- unit_cost
- received_qty
F. Billing tables
invoices
- id (PK)
- shop_id (FK -> shops.id)
- branch_id (FK -> shop_branches.id)
- order_id (FK -> orders.id, unique)
- invoice_no
- subtotal
- discount
- tax
- total_amount
- status (unpaid, partial, paid, void)
- issued_at
- due_date

payments
- id (PK)
- invoice_id (FK -> invoices.id)
- amount
- method (cash, gcash, maya, bank_transfer)
- reference_no
- status (pending, confirmed, failed, refunded)
- paid_at
- received_by_user_id (FK -> users.id)
H. Appointments and Fittings
appointments
- id (PK)
- shop_id (FK -> shops.id)
- branch_id (FK -> shop_branches.id)
- customer_id (FK -> customers.id)
- assigned_staff_id (FK -> users.id)
- appointment_type (fitting, consultation, pickup, measurement)
- status (scheduled, confirmed, completed, cancelled, no_show)
- date (date)
- start_time (time)
- duration_minutes (integer)
- notes (text)
- created_at

fitting_sessions
- id (PK)
- appointment_id (FK -> appointments.id)
- measurement_profile_id (FK -> customer_measurements.id)
- adjustment_notes (text)
- revision_no (integer)
- next_fitting_date (date, nullable)
- created_at
G. Shared system tables
notifications
- id (PK)
- user_id (FK -> users.id)
- branch_id (FK -> shop_branches.id, nullable)
- type
- message
- status (unread, read, sent, failed)
- scheduled_at
- sent_at

audit_logs
- id (PK)
- user_id (FK -> users.id)
- action
- module
- entity_id
- created_at
Status arrays you can use in code

Use these as TypeScript enums/constants, not as messy database arrays.

SHOP_STATUS = ['pending', 'active', 'suspended', 'expired']
BRANCH_STATUS = ['active', 'inactive', 'archived']
BRANCH_ROLE = ['manager', 'tailor', 'helper', 'cashier', 'inventory']
ORDER_STATUS = ['draft', 'pending', 'accepted', 'in_production', 'for_fitting', 'ready_for_pickup', 'completed', 'cancelled', 'on_hold']
INVENTORY_STATUS = ['active', 'low_stock', 'out_of_stock', 'archived']
INVENTORY_MOVEMENT = ['in', 'out', 'reserve', 'release', 'adjust']
INVOICE_STATUS = ['unpaid', 'partial', 'paid', 'void']
PAYMENT_STATUS = ['pending', 'confirmed', 'failed', 'refunded']
SUBSCRIPTION_STATUS = ['pending', 'active', 'expired', 'cancelled']

Important: the schema review you shared already shows why arrays inside entities are a problem. It flags multi-valued fields like roles: StaffRole[] and items: string[] as normalization issues, so arrays should live in code constants or in junction tables, not as raw columns.

Branch logic in plain words
When the owner subscribes
insert into subscriptions
insert one main record into shops
When owner clicks “Create Branch”
insert into shop_branches
set shop_id = parent shop
set is_main = false
When owner assigns a manager
insert into branch_members
insert permissions into branch_permissions
When branch staff logs in
middleware checks role
staff sees only their branch workspace
When orders happen
order belongs to one branch
HQ still sees all branches in the same dashboard
When inventory changes
branch stock updates first
HQ report summarizes all branches

That gives you a real tailoring-shop structure that is digital, scalable, and still realistic for manual operations being converted into a system.
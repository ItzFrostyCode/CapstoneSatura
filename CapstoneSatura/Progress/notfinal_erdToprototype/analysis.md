Analysis Summary:
The system has 6 modules, multi-tenant architecture (multiple shops on one platform), 3 subscription tiers, 5 actor types, and complex workflows. The ERD needs to handle: business registration + approval, role hierarchy, subscription tiers, garment production lifecycle, supplier chain, billing, and designer portfolios.
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation-duration: 0.25s;
    animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
  }
VvisualizeVvisualize show_widget

SEE:satura_erd_complete.html

TASK 1 — Entity List with Justification
18 entities total, all derived strictly from source documents.
PLATFORM_ADMIN — Separate from shop users. Holds the admin who reviews and approves business registrations. Referenced in BUSINESS.approved_by.
SUBSCRIPTION_PLAN — Stores the three tiers (Basic, Pro, Premium) with their feature flags and pricing. Decoupled from BUSINESS so plans can be updated without altering shop records.
BUSINESS — The core registration entity. Holds business-level data (BIR tax ID, permit, proof document), not just credentials. status field = pending / approved / rejected. approved_by FK points to PLATFORM_ADMIN. This enforces the admin-gated activation flow.
USER_ACCOUNT — All human users inside a business (owner, manager, staff, sastre, designer) are rows here. The role column drives RBAC. Separated from BUSINESS because one business has many staff, and a designer is still a user inside a business subscription.
DESIGNER_PROFILE — One-to-one extension of USER_ACCOUNT for designer-role users only. Isolates designer-specific data (bio, slug, photo) so non-designer accounts are not polluted with null columns.
DESIGNER_POST — Premium feature. Posts created and published by a designer. Linked to DESIGNER_PROFILE, not directly to USER_ACCOUNT, to preserve the one-to-one constraint.
DESIGNER_PRODUCT — Premium feature. Product listings under a designer's portfolio. Separate from posts because products have a price and publishable status distinct from informational posts.
CUSTOMER — Client records belonging to a specific business. business_id FK ensures data isolation across tenants. One customer can have many measurements and many orders.
MEASUREMENT — Multi-point body measurement record. Linked to a customer and records who entered it (recorded_by FK to USER_ACCOUNT). Multiple measurement records per customer are supported to track fitting changes over time.
JOB_ORDER — The production record. Links customer + measurement + assigned staff. status field follows the lifecycle: pending / cutting / sewing / quality_check / done / ready_for_pickup. order_code is a human-readable reference.
ORDER_STATUS_LOG — Audit trail for every status transition on a job order. Records who changed the status, what it changed from, and when. Satisfies the audit trail requirement.
APPOINTMENT — Scheduling record for fittings, consultations, or release dates. Linked to a business, a customer, and optionally a specific job order. confirmed_by FK records which staff member confirmed it.
NOTIFICATION — System-generated alerts stored per user. reference_type + reference_id form a polymorphic pointer to the triggering entity (order, appointment, stock level).
SUPPLIER — External supplier records per business. Contains contact details. Referenced in procurement.
MATERIAL — Inventory items per business. low_stock_threshold enables automated low-stock detection. status = available / low / out_of_stock.
PROCUREMENT — The reorder transaction. Links a business to a supplier and material. Tracks both the requested quantity and the received quantity, plus unit price for cost tracking. requested_by and received_by are separate FKs to support the workflow where different staff handle requesting vs. receiving.
INVOICE — Generated per job order. Stores subtotal, discount, and total. status = draft / issued / paid / partial. One-to-one with JOB_ORDER enforced at application level.
PAYMENT — Individual payment installments against an invoice. running_balance records the balance after each payment, supporting partial payment workflow from the sequence diagrams. payment_type = cash / manual.
REPORT_LOG — Audit record of every report generated, by whom, for what date range, and where the output file is stored.

TASK 2 — Relationship Mapping
RelationshipCardinalityDescriptionPLATFORM_ADMIN → BUSINESS1 to manyOne admin approves many business registrationsSUBSCRIPTION_PLAN → BUSINESS1 to manyOne plan is selected by many businessesBUSINESS → USER_ACCOUNT1 to manyOne business employs many users with different rolesBUSINESS → CUSTOMER1 to manyOne business serves many customers (tenant isolation)BUSINESS → SUPPLIER1 to manyOne business maintains many supplier recordsBUSINESS → MATERIAL1 to manyOne business manages its own inventoryBUSINESS → JOB_ORDER1 to manyOne business has many job ordersBUSINESS → APPOINTMENT1 to manyOne business schedules many appointmentsBUSINESS → PROCUREMENT1 to manyOne business initiates many reorder requestsBUSINESS → INVOICE1 to manyOne business issues many invoicesBUSINESS → REPORT_LOG1 to manyOne business generates many reportsUSER_ACCOUNT → DESIGNER_PROFILE1 to 0-or-1Designer-role users have one profile extensionDESIGNER_PROFILE → DESIGNER_POST1 to manyOne designer publishes many postsDESIGNER_PROFILE → DESIGNER_PRODUCT1 to manyOne designer lists many productsCUSTOMER → MEASUREMENT1 to manyOne customer has many measurement records (over time)CUSTOMER → JOB_ORDER1 to manyOne customer places many ordersCUSTOMER → APPOINTMENT1 to manyOne customer books many appointmentsMEASUREMENT → JOB_ORDER1 to manyOne measurement snapshot is referenced by multiple ordersJOB_ORDER → ORDER_STATUS_LOG1 to manyOne order produces many status change log entriesJOB_ORDER → APPOINTMENT1 to manyOne order may have multiple fitting appointmentsJOB_ORDER → INVOICE1 to 1One order produces exactly one invoiceINVOICE → PAYMENT1 to manyOne invoice is settled through one or more paymentsSUPPLIER → PROCUREMENT1 to manyOne supplier fulfills many procurement requestsMATERIAL → PROCUREMENT1 to manyOne material is reordered in many procurement eventsUSER_ACCOUNT → MEASUREMENT1 to manyOne staff member records many measurementsUSER_ACCOUNT → ORDER_STATUS_LOG1 to manyOne user logs many status changesUSER_ACCOUNT → APPOINTMENT1 to manyOne manager confirms many appointmentsUSER_ACCOUNT → PROCUREMENT1 to manyOne user requests or receives many procurementsUSER_ACCOUNT → INVOICE1 to manyOne user generates many invoicesUSER_ACCOUNT → PAYMENT1 to manyOne user records many paymentsUSER_ACCOUNT → NOTIFICATION1 to manyOne user receives many notificationsUSER_ACCOUNT → REPORT_LOG1 to manyOne user runs many reports

TASK 3 — Role-Based Access Control Matrix
ActionPlatform AdminShop OwnerManagerStaffSastreDesignerApprove/reject business registrationYesNoNoNoNoNoManage subscription plansYesNoNoNoNoNoRegister business + select planNoYes (own)NoNoNoNoAdd/manage staff accountsNoYesNoNoNoNoAssign roles to staffNoYesNoNoNoNoManage customer profilesNoYesYesYesNoNoRecord body measurementsNoYesYesYesNoNoCreate job ordersNoYesYesYesNoNoUpdate order status (cutting/sewing)NoYesYesNoYesNoAssign orders to sastreNoYesYes (assign)NoNoNoPerform quality checkNoYesYesNoNoNoSchedule appointmentsNoYesYesYesNoNoConfirm appointmentsNoYesYesNoNoNoManage inventoryNoYesYesNoNoNoManage suppliersNoYesNoNoNoNoRecord stock deliveryNoYesYesNoNoNoGenerate invoicesNoYesYesNoNoNoRecord paymentsNoYesYesNoNoNoView financial reportsNoYesYesNoNoNoManage designer profile/posts/productsNoNoNoNoNoYesView own notificationsNoYesYesYesYesYes

TASK 4 — UI Screen Prototype Mapping
Screen 1 — Business Registration Form
Fields: Business Name, Owner Full Name, Business Address, Contact Number, Email, BIR/Tax ID, Permit Number, Proof Document Upload, Password, Confirm Password
Actions: Submit Registration (status set to pending)
Screen 2 — Subscription Plan Selection
Fields: Plan cards showing Basic / Pro / Premium with features list and pricing
Actions: Select Plan (linked to registration record before submission)
Screen 3 — Admin Approval Panel
Fields: Business Name, Owner Name, Submitted Date, Plan, Uploaded Document (viewable), Current Status
Actions: Approve (sets status = approved, records approved_by + approved_at), Reject (sets status = rejected, optional remarks)
Screen 4 — Login Page
Fields: Email, Password
Validation: Block login if business status is not approved; display "Account pending approval" message
Actions: Login
Screen 5 — Owner Dashboard
Fields: Active orders count, Low stock alerts, Upcoming appointments, Recent payments summary
Actions: Navigate to all modules
Screen 6 — Staff Management Screen
Fields: Staff Name, Email, Role (dropdown: manager / staff / sastre / designer), Status (active / inactive)
Actions: Add Staff Account, Assign Role, Deactivate Account
Screen 7 — Customer Profile Screen
Fields: Full Name, Contact Number, Email, Address, Measurement History (list), Order History (list)
Actions: Create Customer, Update Profile, Add Measurement, Create Job Order
Screen 8 — Measurement Entry Screen
Fields: Customer (linked), Chest, Waist, Hips, Shoulder, Sleeve Length, Inseam, Neck, Back Length, Notes
Actions: Save Measurement Record
Screen 9 — Job Order Screen
Fields: Order Code (auto), Customer, Measurement (select from history), Garment Type, Design Description, Target Completion Date, Assigned To (staff), Status
Actions: Create Order, Update Status, View Status History (ORDER_STATUS_LOG)
Screen 10 — Appointment Scheduler
Fields: Customer, Order (optional), Appointment Type (fitting / consultation / release), Date, Time, Notes
Actions: Request Appointment (customer-side), Confirm Appointment (staff-side)
Screen 11 — Inventory Management Screen
Fields: Material Name, Category, Unit, Current Stock, Low Stock Threshold, Status (auto-computed)
Actions: Add Material, Update Stock, View Low Stock Alerts
Screen 12 — Supplier Management Screen
Fields: Supplier Name, Contact Person, Contact Number, Email, Address
Actions: Add Supplier, Edit Supplier, View Procurement History
Screen 13 — Procurement / Reorder Screen
Fields: Material, Supplier, Quantity Ordered, Unit Price, Requested Date, Status
Actions: Create Reorder Request, Record Received Delivery (updates inventory stock)
Screen 14 — Invoice Generation Screen
Fields: Job Order reference, Subtotal, Discount, Total Amount, Status
Actions: Generate Invoice, View Invoice
Screen 15 — Payment Recording Screen
Fields: Invoice reference, Amount Paid, Running Balance (auto-computed), Payment Type, Reference Note, Date Paid
Actions: Record Payment (partial or full)
Screen 16 — Reports & Dashboard Screen
Fields: Report Type (sales / inventory / order status), Date Range From, Date Range To
Actions: Generate Report, View Dashboard (order volume, revenue, low stock summary)
Screen 17 — Designer Portfolio Screen (Premium)
Fields: Bio, Profile Photo, Posts (list), Products (list with price)
Actions: Update Profile, Create Post, Publish Product

TASK 5 — End-to-End System Flow
Business Registration Form
  → Subscription Plan Selection
    → Submission (BUSINESS.status = pending)
      → Admin Approval Panel
        [Rejected] → Notify Owner → End
        [Approved] → BUSINESS.status = approved
          → Login (validated against status)
            → Owner Dashboard
              ├── Staff Management → Add Staff → Assign Role
              ├── Customer Module → Create Customer → Record Measurements
              │     → Create Job Order → Assign to Sastre
              │           → Status Updates (cutting → sewing → quality check → done)
              │           → Appointment Scheduling (fitting sessions)
              │           → Invoice Generation → Payment Recording (partial/full)
              ├── Inventory Module → Monitor Stock → Low Stock Alert
              │     → Create Procurement → Contact Supplier → Record Delivery
              │           → Stock Updated
              ├── Designer Portfolio (Premium) → Create Post → Publish Product
              └── Reports & Dashboard → Generate Report → View Analytics

TASK 6 — Design Justifications
1. Business entity is separated from User_Account. A shop registers as a legal business entity with its own permit and tax data. Conflating this with a user account would violate the principle of entity separation and make multi-staff access impossible without duplicating business data.
2. Subscription_Plan is a separate table, not a column. Plan features and pricing are data that the admin manages. If stored as a hardcoded column (e.g., plan_type = "pro"), any pricing change would require a schema migration. As a referenced table, plans are updatable without touching business records.
3. ORDER_STATUS_LOG is a separate audit table. The sequence diagrams show multiple status transitions per order. Storing only the current status on JOB_ORDER would destroy the history. A log table captures every change with the actor and timestamp, satisfying the audit trail requirement and enabling order timeline views on the customer portal.
4. PROCUREMENT separates requested_by and received_by. The sequence diagram for Objective 4 shows that a user creates the reorder request, a supplier delivers, and a user records the receipt. These can be different staff members on different days. Two distinct FK columns reflect the real operational workflow without collapsing two separate events into one.
5. MEASUREMENT is versioned, not overwritten. Storing measurements as a separate table with a recorded_at timestamp means a customer's history of body changes is preserved. Job orders reference a specific measurement snapshot, ensuring that an old order still reflects the measurements at the time it was placed, not the customer's current measurements.
6. No SMS, no online payment, no hardware integration. These are explicitly excluded per Chapter 1 limitations. The NOTIFICATION table stores in-app/dashboard alerts only. The PAYMENT table records manual/offline payments only. No external API fields appear anywhere in the schema.
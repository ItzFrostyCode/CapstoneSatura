# SUTURA Sequence Diagrams

## Objective 1: Secure Registration, Subscription, and Role-Based User Management

To develop a secure registration and subscription module that enables tailoring businesses to manage role-based user accounts and allows fashion designers to curate profiles, showcase products, and publish design posts.

### Figure 1: Sequence Diagram – Registration, Subscription, and Role-Based Access

```mermaid
sequenceDiagram
    actor Owner as "Shop Owner"
    actor Designer as "Fashion Designer"
    actor Staff as "Staff Member"
    participant System as "System"
    participant Gateway as "Payment Gateway"
    actor Admin as "System Admin"
    participant DB as "Database"

    Note over Owner, DB: Shop Owner Registration and Subscription Flow
    Owner->>System: Submit Registration Form (Shop Name, BIR, Permits, Password)
    Owner->>System: Select Subscription Plan (Basic / Pro / Premium) and enter payment details
    System->>Gateway: Process subscription payment
    Gateway-->>System: Payment Confirmed
    System->>DB: Save shop account as "Pending Verification"
    System-->>Owner: Show "Account under review by Admin"
    System->>Admin: Notify of new pending shop registration

    Admin->>System: Review submitted documents in Verification Queue
    alt Documents Valid
        Admin->>System: Click Approve
        System->>DB: Set shop account status to "Active"
        System-->>Owner: Send email "Your shop is approved. You may now log in."
    else Documents Invalid
        Admin->>System: Click Reject and enter reason
        System->>Gateway: Initiate subscription refund
        System->>DB: Set account status to "Rejected"
        System-->>Owner: Send email with rejection reason
    end

    Note over Owner, DB: Staff Account Creation and First-Time Onboarding
    Owner->>System: Go to Staff Management and click Add Staff
    System->>System: Generate temporary password
    System->>DB: Save new staff account with role (Tailor / Sales / Inventory)
    System-->>Staff: Send welcome email with username and temporary password
    Staff->>System: Log in using temporary credentials
    System->>DB: Detect first-time login flag
    System-->>Staff: Redirect to Password Setup Page
    Staff->>System: Set new personal password
    System->>DB: Update password and mark onboarding complete
    System-->>Staff: Redirect to Staff Dashboard

    Note over Designer, DB: Designer Registration and Profile Publishing
    Designer->>System: Submit Designer Registration Form (Name, Portfolio, Skills)
    System->>DB: Save designer account as "Pending Verification"
    System-->>Designer: Show "Portfolio submitted. Review within 24–48 hours."
    System->>Admin: Notify of new pending designer application
    Admin->>System: Review portfolio in Verification Queue
    alt Portfolio Meets Standards
        Admin->>System: Click Approve
        System->>DB: Set designer account status to "Active"
        System-->>Designer: Send email "Your designer account is approved."
        Designer->>System: Log in and go to Designer Portal
        Designer->>System: Update profile (bio, specialization, contact)
        Designer->>System: Click Add New Design Post (title, description, images, tags)
        System->>DB: Save design post as "Published"
        System-->>Designer: Design post is now visible to Shop Owners on the platform
    else Portfolio Rejected
        Admin->>System: Click Reject and enter reason
        System->>DB: Set account status to "Rejected"
        System-->>Designer: Send email with rejection reason
    end
```

---

## Objective 2: Customer and Order Management System

To develop a comprehensive customer and order management system that stores body measurements with version history, digitizes the submission of tailoring requests, and tracks job order statuses in real time.

### Figure 2: Sequence Diagram – Customer Profile, Measurements, and Order Tracking

```mermaid
sequenceDiagram
    actor Staff as "Shop Staff / Sales"
    actor Tailor as "Assigned Tailor"
    actor Customer as "Customer"
    participant System as "System"
    participant DB as "Database"

    Note over Staff, DB: Customer Profile and Measurement Recording
    Customer->>Staff: Arrives at shop (walk-in or consultation request)
    Staff->>System: Go to Customers module and click Add Customer
    System-->>Staff: Display customer registration form
    Staff->>System: Enter customer name, contact, and address
    System->>DB: Save customer profile
    DB-->>System: Confirm customer saved
    System-->>Staff: Show customer profile (ready for measurements)

    Staff->>System: Open Customer Profile and go to Measurements tab
    System-->>Staff: Display measurement form (Chest, Waist, Hips, Sleeve, Inseam, etc.)
    Staff->>Customer: Take physical body measurements
    Staff->>System: Enter all measurements into the form
    System->>DB: Save measurements as a new version linked to customer profile
    DB-->>System: Confirm measurements saved with version timestamp
    System-->>Staff: Show measurement confirmation and version history

    Note over Staff, DB: Tailoring Order Creation
    Staff->>System: Go to Orders module and click Create New Order
    System-->>Staff: Display order form
    Staff->>System: Select Order Type (Bespoke / Bulk / Alteration / RTW)
    Staff->>System: Select Customer profile (auto-loads saved measurements)
    Staff->>System: Fill in garment details (fabric, style, design specs, quantity)
    Staff->>System: Set due date and assign to Tailor
    System->>DB: Save order with status "In Progress"
    DB-->>System: Confirm order saved with Order Number
    System-->>Staff: Show Job Order summary and Order Number
    System-->>Customer: Send SMS/Email with Order Number and estimated due date

    Note over Tailor, Customer: Real-Time Job Order Status Tracking
    Tailor->>System: Open assigned order and update production stage
    System->>DB: Update order status (Cutting → Sewing → Finishing → Ready for Pickup)
    DB-->>System: Confirm status updated
    System-->>Customer: Send automated SMS/Email update on order progress

    Customer->>System: Open Customer Portal and enter Order Number
    System->>DB: Retrieve current order status
    DB-->>System: Return status and stage details
    System-->>Customer: Display order stage and estimated completion date
```

---

## Objective 3: Automated Scheduling and Notification Engine

To develop an automated scheduling and notification engine for fittings, consultations, and release dates that alerts both staff and clients of upcoming deadlines and order updates.

### Figure 3: Sequence Diagram – Appointment Scheduling, Release Confirmation, and Deadline Alerts

```mermaid
sequenceDiagram
    actor Staff as "Shop Staff"
    actor Customer as "Customer"
    actor Designer as "Fashion Designer"
    participant System as "System"
    participant Scheduler as "System Scheduler"
    participant DB as "Database"

    Note over Staff, DB: Fitting Appointment Booking
    Customer->>Staff: Request fitting schedule (in-person or call)
    Staff->>System: Go to Appointments and click Add Appointment
    System-->>Staff: Display appointment form with available time slots
    Staff->>System: Select date and time, link to Customer and Order
    System->>System: Validate schedule for conflicts
    System->>DB: Save fitting appointment
    DB-->>System: Confirm appointment saved
    System-->>Customer: Send confirmation SMS/Email with fitting date and time
    System-->>Staff: Show appointment on calendar view

    Note over Staff, DB: Designer Consultation Booking
    Customer->>Staff: Request consultation with a specific designer
    Staff->>System: Go to Appointments and click Add Consultation
    Staff->>System: Enter customer details, select designer, and set date/time
    System->>DB: Save consultation schedule
    DB-->>System: Confirm saved
    System-->>Customer: Send confirmation SMS/Email with consultation details
    System-->>Designer: Send notification of upcoming consultation

    Note over System, Customer: Order Release and Pickup Confirmation
    System->>System: Detect order status changed to "Ready for Pickup"
    System-->>Customer: Send SMS/Email "Your order is ready for pickup!"
    Customer->>Staff: Arrives at shop to claim order
    Staff->>System: Open order and verify payment is settled
    alt Payment is Complete
        Staff->>System: Click "Mark as Released / Picked Up"
        System->>DB: Update order status to "Released"
        System-->>Customer: Issue digital release confirmation
    else Balance Remaining
        System-->>Staff: Show remaining balance due
        Staff->>Customer: Collect remaining payment
        Staff->>System: Record payment then click "Mark as Released"
        System->>DB: Update payment record and order status to "Released"
    end

    Note over Scheduler, Customer: Automated Deadline Reminder Notifications
    Scheduler->>System: Trigger daily check at midnight
    System->>DB: Query orders and appointments due within 2 days
    DB-->>System: Return list of upcoming deadlines
    System-->>Staff: Send internal dashboard notification (Urgent badges)
    System-->>Customer: Send SMS/Email reminder for upcoming fitting or order pickup
    System->>DB: Log notification records
```

---

## Objective 4: Integrated Inventory and Supplier Management

To develop an integrated inventory and supplier management module that monitors material availability and facilitates seamless coordination with textile providers to streamline reordering and prevent production delays.

### Figure 4: Sequence Diagram – Inventory Monitoring, Low-Stock Alerts, and Supplier Reordering

```mermaid
sequenceDiagram
    actor Staff as "Shop Staff / Inventory Staff"
    actor Manager as "Shop Manager / Owner"
    participant System as "System"
    participant DB as "Database"

    Note over Staff, DB: Inventory Stock Viewing and Material Deduction
    Staff->>System: Go to Inventory module
    System->>DB: Retrieve all inventory records (fabrics, threads, accessories)
    DB-->>System: Return inventory data with current stock quantities
    System-->>Staff: Display inventory list with stock levels and low-stock indicators

    Staff->>System: Open an active order and record materials used
    System->>System: Deduct used quantities from inventory stock
    System->>DB: Update inventory stock quantities
    DB-->>System: Confirm stock updated

    System->>System: Check updated stock levels against reorder threshold
    alt Stock Falls Below Reorder Threshold
        System->>DB: Save low-stock alert record
        System-->>Staff: Show low-stock warning notification on dashboard
        System-->>Manager: Send alert "Material is running low. Consider reordering."
    end

    Note over Manager, DB: Supplier Directory and Purchase Order Creation
    Manager->>System: Go to Suppliers module and select a supplier
    System-->>Manager: Display supplier profile and procurement history
    Manager->>System: Click Create Purchase Order
    System-->>Manager: Display reorder form (material, quantity, expected delivery date)
    Manager->>System: Fill in reorder details and submit
    System->>DB: Save Purchase Order with status "Ordered"
    DB-->>System: Confirm PO saved
    System-->>Manager: Show "Purchase order created and recorded."

    Note over Manager, DB: Delivery Confirmation and Stock Replenishment
    Manager->>System: Go to Suppliers and open the pending Purchase Order
    System-->>Manager: Display Purchase Order details and expected delivery
    Manager->>System: Confirm delivery received and enter actual received quantities
    System->>DB: Update inventory stock with received quantities
    DB-->>System: Confirm stock replenished
    System->>DB: Mark Purchase Order status as "Delivered"
    System-->>Manager: Show "Stock updated. Purchase order marked as complete."
```

---

## Objective 5: Financial Tracking and Digital Billing System

To develop a financial tracking system that automatically generates digital invoices and records payments to ensure billing accuracy and prevent deposit discrepancies.

### Figure 5: Sequence Diagram – Invoice Generation, Payment Processing, and Financial Records

```mermaid
sequenceDiagram
    actor Staff as "Shop Staff"
    actor Customer as "Customer"
    actor Owner as "Shop Owner / Manager"
    participant System as "System"
    participant Gateway as "Payment Gateway"
    participant DB as "Database"

    Note over Staff, DB: Downpayment Collection on Order Creation
    Staff->>System: Enter downpayment amount during Order creation
    Customer->>Staff: Pay downpayment (cash)
    Staff->>System: Record downpayment received
    System->>DB: Save downpayment record linked to order
    DB-->>System: Confirm saved
    System-->>Staff: Show "Downpayment recorded. Remaining balance reflected on final invoice."

    Note over Staff, DB: Invoice Generation on Order Completion
    Staff->>System: Open completed order in the Billing module
    System->>DB: Retrieve order details (items, quantities, garment prices, downpayment)
    DB-->>System: Return order data
    System->>System: Calculate subtotal, labor costs, and deduct downpayment
    System->>DB: Save invoice record linked to the order
    DB-->>System: Confirm invoice saved
    System-->>Staff: Display generated invoice with itemized breakdown and total amount due

    Note over Customer, DB: Customer Payment Processing
    Staff->>System: Open the invoice for the customer's order
    System-->>Staff: Display invoice with total due and payment options
    alt Customer Pays Cash (In-Store)
        Customer->>Staff: Hands over cash payment
        Staff->>System: Select Cash Payment and enter amount received
        System->>System: Calculate change if any
        System->>DB: Record payment and update invoice status to "Paid"
        System-->>Staff: Show receipt with payment details and change amount
    else Customer Pays Online (GCash / Credit Card)
        Staff->>System: Select Online Payment option
        System->>Gateway: Create payment link for invoice amount
        Gateway-->>System: Return payment URL
        System-->>Customer: Send payment link via SMS or Email
        Customer->>Gateway: Open link and complete payment
        Gateway->>System: Webhook callback – Payment Successful
        System->>DB: Record payment and update invoice status to "Paid"
        System-->>Staff: Show payment confirmed on invoice
        System-->>Customer: Send digital payment receipt via Email/SMS
    end

    Note over Owner, DB: Financial Records Review and Report Export
    Owner->>System: Go to Finance module
    System->>DB: Retrieve all payment transactions and invoice records
    DB-->>System: Return financial data
    System-->>Owner: Display payment history with filters (Date, Status, Order Type)
    Owner->>System: Click Export or Print Report
    System->>System: Generate summary report (total collected, outstanding balances)
    System-->>Owner: Download or print financial report
```

---

## Objective 6: Analytics Dashboard and Reporting

To develop an analytics dashboard and reporting tool that provides real-time insights into shop operations, inventory trends, and overall supply chain activity for informed decision-making.

### Figure 6: Sequence Diagram – Analytics Dashboard, Report Generation, and Admin Monitoring

```mermaid
sequenceDiagram
    actor Owner as "Shop Owner / Manager"
    actor Admin as "System Admin"
    participant System as "System"
    participant DB as "Database"

    Note over Owner, DB: Owner Dashboard – Real-Time Operational Insights
    Owner->>System: Log in and open Owner Dashboard
    System->>DB: Retrieve KPI data (active orders, pending fittings, low-stock alerts, daily revenue)
    DB-->>System: Return dashboard metrics
    System-->>Owner: Display KPI widgets (Orders, Revenue, Appointments, Inventory Alerts)

    Note over Owner, DB: Operational Report Generation
    Owner->>System: Go to Reports module
    System-->>Owner: Display report options (Sales Report, Order Summary, Tailor Performance)
    Owner->>System: Select report type and set date range filter
    System->>DB: Query aggregated data for selected report and filters
    DB-->>System: Return report data
    System-->>Owner: Display report with charts, tables, and KPI summaries
    Owner->>System: Click Export as PDF / Excel
    System-->>Owner: Download report file

    Note over Owner, DB: Inventory and Supply Chain Report
    Owner->>System: Go to Reports and select Inventory Report
    Owner->>System: Set filter (date range, material category)
    System->>DB: Query stock movements, current levels, and low-stock history
    DB-->>System: Return inventory report data
    System-->>Owner: Display stock valuation, usage trends, and reorder summary
    Owner->>System: Click Export
    System-->>Owner: Download inventory report

    Note over Admin, DB: Admin Dashboard – Platform-Wide Tenant Monitoring
    Admin->>System: Log in and open Admin Dashboard
    System->>DB: Retrieve platform-wide statistics (active shops, new registrations, subscriptions)
    DB-->>System: Return KPI data
    System-->>Admin: Display admin dashboard widgets (Active Tenants, Pending Verifications, Revenue)

    Admin->>System: Go to Tenants module
    System->>DB: Retrieve all registered shops and designers
    DB-->>System: Return tenant records with status (Active, Pending, Suspended)
    System-->>Admin: Display tenant list with subscription status and action buttons

    Note over Admin, DB: Audit Log and Supply Chain Activity Monitoring
    Admin->>System: Go to Audit Log module
    System->>DB: Retrieve activity logs (logins, data changes, deletions, PO activity)
    DB-->>System: Return activity records with timestamps and user info
    System-->>Admin: Display audit trail table with filters (user, date, action type)
    Admin->>System: Click on a specific log entry for details
    System->>DB: Retrieve full details of that activity
    DB-->>System: Return full log entry
    System-->>Admin: Display details (who acted, what changed, before and after values)
```
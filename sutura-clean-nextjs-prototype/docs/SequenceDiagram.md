# SUTURA Sequence Diagrams

Operational flows for SUTURA. 1 Objective = 1 Figure. Mermaid-compatible.

---

## Objective 1: Subscription and Admin Module
**Goal:** To develop a Subscription and Admin Module for managing platform oversight, tiered service plans, role-based user accounts, and professional business profiles.

### Figure 1: Platform Administration, Shop Onboarding, and Role Management

```mermaid
sequenceDiagram
    actor Owner as Shop Owner
    participant UI as User Interface
    participant System as System
    actor Admin as Platform Admin
    participant DB as Database

    Owner->>UI: Open Registration & Select Tiered Plan (Basic/Pro/Premium)
    UI->>System: Submit Shop Registration Form
    System->>DB: Create Shop Record & Subscription (PENDING)
    System-->>Admin: Notify: New Verification Request

    alt Documents Valid
        Admin->>System: Approve Business Identity
        System->>DB: Update Shop Status to ACTIVE
        System-->>UI: Notify Owner - Account Approved
    else Documents Invalid
        Admin->>System: Reject & Enter Reason
        System->>DB: Update Shop Status to REJECTED
        System-->>UI: Notify Owner - Account Rejected
    end

    Owner->>UI: Create Staff Accounts & Assign Roles (Sastre/Cutter/QC)
    UI->>System: Submit Staff Account Details
    System->>DB: Save User Credentials & Role-Based Permissions
    System-->>UI: Staff Account Activated
```

---

## Objective 2: Customer Job and Fulfillment Order Module
**Goal:** To develop a Customer Job and Fulfillment Order Module for digitizing garment orders, tracking production stages, and managing measurement version history.

### Figure 2: Fulfillment Order Lifecycle and Production Stage Tracking

```mermaid
sequenceDiagram
    actor Staff as Tailoring Staff
    participant UI as User Interface
    participant System as System
    participant DB as Database

    Staff->>UI: Open Customer Profile & View Measurement History
    UI->>System: Fetch Measurement Version History
    System->>DB: Query Previous Measurement Profiles
    DB-->>System: Return Version History
    System-->>UI: Display Measurement Versions

    Staff->>UI: Encode New Measurements (Manual Input)
    UI->>System: Submit New Measurement Entry
    System->>DB: Save Versioned Measurement & EAV Values

    Staff->>UI: Initialize Fulfillment Order & Specify Materials
    UI->>System: Submit Job Order Form
    System->>DB: Create Order Record & Production Tasks

    loop Production Stage Tracking
        Staff->>UI: Update Production Stage (Intake / Cutting / Sewing / QC)
        UI->>System: Update Stage Status
        System->>DB: Log ProductionTask & OrderStatusHistory
        System-->>UI: Confirm Stage Update
    end

    Staff->>UI: Final Quality Check & Release Order
    UI->>System: Mark Order as Completed
    System->>DB: Update Fulfillment Status to COMPLETED
    System-->>UI: Order Released Successfully
```

---

## Objective 3: Appointment Module
**Goal:** To develop an Appointment Module for scheduling fittings and consultations through a digital calendar with automated client and staff notifications.

### Figure 3: Digital Calendar Scheduling and Automated Notifications

```mermaid
sequenceDiagram
    actor Staff as Authorized Staff
    participant UI as User Interface
    participant System as System
    participant DB as Database
    participant Notify as Third-Party Notifier
    actor Client as Customer

    Staff->>UI: Open Calendar & Create Booking (Fitting/Consultation)
    UI->>System: Submit Appointment Details (Type, Date, Time, Staff)
    System->>System: Validate Appointment & Check Overbooking

    alt Slot Available
        System->>DB: Save Appointment Record
        System->>DB: Insert Notification Log
        par Automated Alerts
            System->>Notify: Trigger Client Notification
            Notify-->>Client: Send SMS/Email Alert
            System->>Notify: Trigger Staff Notification
            Notify-->>Staff: Send Workload Alert
        end
        System-->>UI: Appointment Confirmed on Digital Calendar
    else Slot Not Available
        System-->>UI: Notify: Slot Taken, Suggest New Time
    end

    Staff->>UI: Request Daily Schedule Summary
    UI->>System: Fetch Upcoming Appointments
    System->>DB: Aggregate Daily Workload Data
    System-->>UI: Display Calendar Overview & Daily Workload
```

---

## Objective 4: Inventory and Supplier Management Module
**Goal:** To develop an Inventory and Supplier Management Module for real-time stock monitoring of materials and maintaining internal procurement and supplier records.

### Figure 4: Real-Time Stock Monitoring and Internal Procurement Management

```mermaid
sequenceDiagram
    actor Manager as Shop Owner/Manager
    participant UI as User Interface
    participant System as System
    participant DB as Database

    System->>System: Monitor Stock Levels vs Minimum Thresholds
    alt Stock Below Threshold
        System-->>UI: Trigger Real-Time Low-Stock Alert (Fabrics/Threads/Accessories)
        UI-->>Manager: Display Low-Stock Notification
    end

    Manager->>UI: Access Supplier Records & Procurement History
    UI->>System: Fetch Supplier & Procurement Data
    System->>DB: Query Supplier Info & PO History
    DB-->>System: Return Procurement Records
    System-->>UI: Display Supplier & Inventory Logs

    Manager->>UI: Create Internal Purchase Order (PO)
    UI->>System: Submit PO Details
    System->>DB: Save PO & PurchaseOrderItem Records
    System-->>UI: PO Recorded Successfully

    Manager->>UI: Record Material Arrival (Manual Encoding)
    UI->>System: Submit Goods Receipt
    System->>DB: Update Stock Levels & Material Usage Logs
    System-->>UI: Inventory Updated
```

---

## Objective 5: Billing and Financial Tracking System
**Goal:** To develop a Billing and Financial Tracking System for recording transaction details and deposits to ensure accurate billing and financial transparency.

### Figure 5: Invoice Generation and Transaction Recording

```mermaid
sequenceDiagram
    actor Staff as Staff/Cashier
    participant UI as User Interface
    participant System as System
    participant DB as Database
    actor Client as Customer

    Staff->>UI: Finalize Order & Record Initial Deposit
    UI->>System: Submit Billing Details
    System->>DB: Generate Digital Invoice Record (UNPAID)
    System-->>UI: Display Invoice & Billing Statement
    UI-->>Client: Present Billing Statement

    Client->>Staff: Provide Payment (Cash or External Digital)
    Staff->>UI: Encode Transaction Details, Ref # & Amount
    UI->>System: Submit Payment Record (Manual)
    System->>DB: Save Payment Transaction & Update Invoice Status
    System-->>UI: Confirm Payment Recorded
    System-->>Client: Issue Receipt / Confirmation
```

---

## Objective 6: Centralized Analytics Dashboard
**Goal:** To implement a Centralized Analytics Dashboard for generating real-time reports on sales, inventory trends, and daily shop productivity.

### Figure 6: Centralized Operational Analytics and Reporting

```mermaid
sequenceDiagram
    actor Manager as Shop Owner/Manager
    participant UI as User Interface
    participant System as System
    participant DB as Database

    Manager->>UI: Access Analytics Dashboard
    UI->>System: Request Real-Time Performance Report
    System->>DB: Query Sales Transactions & Order History
    System->>DB: Query Inventory Usage Trends
    System->>DB: Query Tailor Productivity & Task Logs
    System->>System: Aggregate Operational Summaries
    DB-->>System: Return Report Data
    System-->>UI: Render Interactive Dashboard & Charts
    UI-->>Manager: Display Real-Time Reports
```
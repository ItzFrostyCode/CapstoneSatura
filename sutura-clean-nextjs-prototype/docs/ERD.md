erDiagram
    USERS {
        string id PK
        string role
        string name
        string email
        string password_hash
        string status
        datetime created_at
    }

    SUBSCRIPTIONS {
        string id PK
        string plan_name
        string plan_level
        string status
        int max_branches
        int max_staff
        date start_date
        date end_date
        decimal price
    }

    SHOPS {
        string id PK
        string owner_user_id FK
        string subscription_id FK
        string shop_name
        string business_name
        string business_type
        string status
        datetime created_at
    }

    SHOP_BRANCHES {
        string id PK
        string shop_id FK
        string branch_name
        string branch_code
        string address
        string contact_no
        boolean is_main
        string manager_user_id FK
        string status
        datetime created_at
    }

    BRANCH_MEMBERS {
        string id PK
        string branch_id FK
        string user_id FK
        string branch_role
        string status
        datetime assigned_at
    }

    BRANCH_PERMISSIONS {
        string id PK
        string branch_member_id FK
        string permission_code
        boolean can_view
        boolean can_create
        boolean can_update
        boolean can_delete
    }

    CUSTOMERS {
        string id PK
        string shop_id FK
        string user_id FK
        string full_name
        string email
        string phone
        string address
        string status
        datetime created_at
    }

    CUSTOMER_MEASUREMENTS {
        string id PK
        string customer_id FK
        string branch_id FK
        string recorded_by_user_id FK
        datetime recorded_at
        decimal neck
        decimal chest
        decimal waist
        decimal hip
        decimal shoulder
        decimal sleeve
        decimal length
        string posture_notes
        string status
        int version_no
    }

    ORDERS {
        string id PK
        string shop_id FK
        string branch_id FK
        string customer_id FK
        string created_by_user_id FK
        string assigned_staff_id FK
        string order_type
        string source_type
        string status
        decimal total_amount
        decimal balance
        date due_date
        datetime created_at
    }

    ORDER_ITEMS {
        string id PK
        string order_id FK
        string garment_name
        int quantity
        decimal unit_price
        string notes
    }

    ORDER_STATUS_HISTORY {
        string id PK
        string order_id FK
        string status
        string changed_by_user_id FK
        datetime changed_at
        string notes
    }

    INVENTORY_ITEMS {
        string id PK
        string shop_id FK
        string sku
        string item_name
        string category
        string unit
        decimal reorder_level
        string status
    }

    BRANCH_INVENTORY {
        string id PK
        string branch_id FK
        string inventory_item_id FK
        decimal on_hand_qty
        decimal reserved_qty
        decimal available_qty
        boolean low_stock_flag
        datetime last_updated
    }

    INVENTORY_MOVEMENTS {
        string id PK
        string branch_id FK
        string inventory_item_id FK
        string movement_type
        decimal quantity
        string reference_type
        string reference_id
        string moved_by_user_id FK
        datetime created_at
    }

    SUPPLIERS {
        string id PK
        string shop_id FK
        string supplier_name
        string contact_person
        string phone
        string email
        string address
        string status
    }

    PURCHASE_ORDERS {
        string id PK
        string shop_id FK
        string branch_id FK
        string supplier_id FK
        string requested_by_user_id FK
        string status
        datetime requested_at
    }

    PURCHASE_ORDER_ITEMS {
        string id PK
        string purchase_order_id FK
        string inventory_item_id FK
        decimal quantity
        decimal unit_cost
        decimal received_qty
    }

    INVOICES {
        string id PK
        string shop_id FK
        string branch_id FK
        string order_id FK
        string invoice_no
        decimal subtotal
        decimal discount
        decimal tax
        decimal total_amount
        string status
        datetime issued_at
        date due_date
    }

    PAYMENTS {
        string id PK
        string invoice_id FK
        decimal amount
        string method
        string reference_no
        string status
        datetime paid_at
        string received_by_user_id FK
    }

    NOTIFICATIONS {
        string id PK
        string user_id FK
        string branch_id FK
        string type
        string message
        string status
        datetime scheduled_at
        datetime sent_at
    }

    AUDIT_LOGS {
        string id PK
        string user_id FK
        string action
        string module
        string entity_id
        datetime created_at
    }

    APPOINTMENTS {
        string id PK
        string shop_id FK
        string branch_id FK
        string customer_id FK
        string assigned_staff_id FK
        string appointment_type
        string status
        date date
        time start_time
        int duration_minutes
        string notes
        datetime created_at
    }

    FITTING_SESSIONS {
        string id PK
        string appointment_id FK
        string measurement_profile_id FK
        string adjustment_notes
        int revision_no
        date next_fitting_date
        datetime created_at
    }

    USERS ||--o{ SHOPS : owns
    SUBSCRIPTIONS ||--|| SHOPS : activates
    SHOPS ||--o{ SHOP_BRANCHES : has
    USERS ||--o{ SHOP_BRANCHES : manages
    SHOP_BRANCHES ||--o{ BRANCH_MEMBERS : assigns
    USERS ||--o{ BRANCH_MEMBERS : joins
    BRANCH_MEMBERS ||--o{ BRANCH_PERMISSIONS : has

    SHOPS ||--o{ CUSTOMERS : serves
    USERS ||--o| CUSTOMERS : links
    CUSTOMERS ||--o{ CUSTOMER_MEASUREMENTS : has
    SHOP_BRANCHES ||--o{ CUSTOMER_MEASUREMENTS : records
    USERS ||--o{ CUSTOMER_MEASUREMENTS : recorded_by

    SHOPS ||--o{ ORDERS : receives
    SHOP_BRANCHES ||--o{ ORDERS : processes
    CUSTOMERS ||--o{ ORDERS : places
    USERS ||--o{ ORDERS : creates
    USERS ||--o{ ORDERS : assigned_to
    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDERS ||--o{ ORDER_STATUS_HISTORY : logs

    SHOPS ||--o{ INVENTORY_ITEMS : has
    SHOP_BRANCHES ||--o{ BRANCH_INVENTORY : tracks
    INVENTORY_ITEMS ||--o{ BRANCH_INVENTORY : allocated_as
    SHOP_BRANCHES ||--o{ INVENTORY_MOVEMENTS : records
    INVENTORY_ITEMS ||--o{ INVENTORY_MOVEMENTS : moved
    USERS ||--o{ INVENTORY_MOVEMENTS : moved_by

    SHOPS ||--o{ SUPPLIERS : works_with
    SUPPLIERS ||--o{ PURCHASE_ORDERS : receives
    SHOPS ||--o{ PURCHASE_ORDERS : creates
    SHOP_BRANCHES ||--o{ PURCHASE_ORDERS : requests
    PURCHASE_ORDERS ||--o{ PURCHASE_ORDER_ITEMS : contains
    INVENTORY_ITEMS ||--o{ PURCHASE_ORDER_ITEMS : ordered_item

    SHOPS ||--o{ INVOICES : issues
    SHOP_BRANCHES ||--o{ INVOICES : generates
    ORDERS ||--|| INVOICES : billed_by
    INVOICES ||--o{ PAYMENTS : paid_by
    USERS ||--o{ PAYMENTS : received_by

    USERS ||--o{ NOTIFICATIONS : gets
    SHOP_BRANCHES ||--o{ NOTIFICATIONS : scoped_to
    USERS ||--o{ AUDIT_LOGS : performs

    SHOPS ||--o{ APPOINTMENTS : has
    SHOP_BRANCHES ||--o{ APPOINTMENTS : hosts
    CUSTOMERS ||--o{ APPOINTMENTS : books
    USERS ||--o{ APPOINTMENTS : assigned_to
    APPOINTMENTS ||--o| FITTING_SESSIONS : triggers
    CUSTOMER_MEASUREMENTS ||--o{ FITTING_SESSIONS : used_in









    What this ERD gives you
1. One subscription, one parent shop

That is handled by:

subscriptions
shops.subscription_id
shops.owner_user_id
2. Multi-branch without separate subscriptions

That is handled by:

shop_branches.shop_id
branch_members
branch_permissions
3. Real tailoring-shop operations

That is handled by:

customer measurements
orders
inventory allocation
supplier orders
invoices and payments
4. Scalable digital logic

Your schema review specifically warns against arrays inside entities and missing FK links, so this ERD fixes those by separating members, permissions, inventory allocations, order history, and purchase order items into proper child tables.
-- SUTURA: Web-based Subscription Tailoring Business Management System
-- SQL Schema Definition

-- 1. PLATFORM LEVEL
CREATE TABLE platform_admins (
    admin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscription_plans (
    plan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_name TEXT NOT NULL,
    tier TEXT CHECK (tier IN ('basic', 'pro', 'premium')) NOT NULL,
    monthly_price DECIMAL(10,2) NOT NULL,
    yearly_price DECIMAL(10,2) NOT NULL,
    features_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. BUSINESS / TENANT LEVEL
CREATE TABLE businesses (
    business_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES subscription_plans(plan_id),
    business_name TEXT NOT NULL,
    owner_full_name TEXT NOT NULL,
    address TEXT,
    contact_number TEXT,
    email TEXT UNIQUE NOT NULL,
    bir_tax_id TEXT,
    permit_number TEXT,
    proof_document_path TEXT,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    approved_by UUID REFERENCES platform_admins(admin_id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. USER ACCOUNTS (Role-Based Access Control)
CREATE TABLE user_accounts (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(business_id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK (role IN ('owner', 'manager', 'staff', 'sastre', 'designer')) NOT NULL,
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. DESIGNER MODULE (Premium)
CREATE TABLE designer_profiles (
    designer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES user_accounts(user_id) ON DELETE CASCADE,
    bio TEXT,
    profile_photo_path TEXT,
    shop_url_slug TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE designer_posts (
    post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    designer_id UUID REFERENCES designer_profiles(designer_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    image_path TEXT,
    status TEXT DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE designer_products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    designer_id UUID REFERENCES designer_profiles(designer_id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_path TEXT,
    status TEXT DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. CUSTOMER & MEASUREMENT MODULE
CREATE TABLE customers (
    customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(business_id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    contact_number TEXT,
    email TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE measurements (
    measurement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(customer_id) ON DELETE CASCADE,
    recorded_by UUID REFERENCES user_accounts(user_id),
    chest_cm DECIMAL(5,2),
    waist_cm DECIMAL(5,2),
    hips_cm DECIMAL(5,2),
    shoulder_cm DECIMAL(5,2),
    sleeve_length_cm DECIMAL(5,2),
    inseam_cm DECIMAL(5,2),
    neck_cm DECIMAL(5,2),
    back_length_cm DECIMAL(5,2),
    notes TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. PRODUCTION & ORDER MODULE
CREATE TABLE job_orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(business_id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(customer_id),
    measurement_id UUID REFERENCES measurements(measurement_id),
    assigned_to UUID REFERENCES user_accounts(user_id),
    order_code TEXT UNIQUE NOT NULL,
    design_description TEXT,
    garment_type TEXT,
    target_completion_date DATE,
    status TEXT CHECK (status IN ('pending', 'cutting', 'sewing', 'quality_check', 'done', 'ready_for_pickup')) DEFAULT 'pending',
    total_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_status_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES job_orders(order_id) ON DELETE CASCADE,
    updated_by UUID REFERENCES user_accounts(user_id),
    previous_status TEXT,
    new_status TEXT NOT NULL,
    remarks TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
    appointment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(business_id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(customer_id),
    order_id UUID REFERENCES job_orders(order_id),
    confirmed_by UUID REFERENCES user_accounts(user_id),
    appointment_type TEXT CHECK (appointment_type IN ('fitting', 'consultation', 'release')),
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    status TEXT DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. NOTIFICATIONS
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(business_id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_accounts(user_id) ON DELETE CASCADE,
    notification_type TEXT,
    message TEXT NOT NULL,
    reference_type TEXT,
    reference_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. SUPPLY CHAIN MODULE
CREATE TABLE suppliers (
    supplier_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(business_id) ON DELETE CASCADE,
    supplier_name TEXT NOT NULL,
    contact_person TEXT,
    contact_number TEXT,
    email TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE materials (
    material_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(business_id) ON DELETE CASCADE,
    material_name TEXT NOT NULL,
    category TEXT,
    unit TEXT,
    current_stock DECIMAL(10,2) DEFAULT 0,
    low_stock_threshold DECIMAL(10,2) DEFAULT 0,
    status TEXT GENERATED ALWAYS AS (
        CASE 
            WHEN current_stock <= 0 THEN 'out_of_stock'
            WHEN current_stock <= low_stock_threshold THEN 'low'
            ELSE 'available'
        END
    ) STORED,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE procurement_requests (
    procurement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(business_id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES suppliers(supplier_id),
    material_id UUID REFERENCES materials(material_id),
    requested_by UUID REFERENCES user_accounts(user_id),
    received_by UUID REFERENCES user_accounts(user_id),
    quantity_ordered DECIMAL(10,2) NOT NULL,
    quantity_received DECIMAL(10,2) DEFAULT 0,
    unit_price DECIMAL(10,2),
    status TEXT DEFAULT 'requested',
    requested_date DATE DEFAULT CURRENT_DATE,
    received_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. FINANCE MODULE
CREATE TABLE invoices (
    invoice_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES job_orders(order_id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(business_id) ON DELETE CASCADE,
    generated_by UUID REFERENCES user_accounts(user_id),
    invoice_number TEXT UNIQUE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'unpaid',
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES invoices(invoice_id) ON DELETE CASCADE,
    recorded_by UUID REFERENCES user_accounts(user_id),
    amount_paid DECIMAL(10,2) NOT NULL,
    running_balance DECIMAL(10,2),
    payment_type TEXT,
    reference_note TEXT,
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE report_logs (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(business_id) ON DELETE CASCADE,
    generated_by UUID REFERENCES user_accounts(user_id),
    report_type TEXT NOT NULL,
    date_from DATE,
    date_to DATE,
    file_path TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


Table users {
  id uuid [pk]
  role text
  name text
  email text
  password_hash text
  status text
  created_at timestamp
}

Table subscriptions {
  id uuid [pk]
  plan_level text
  status text
  start_date date
  end_date date
  price decimal
}

Table shops {
  id uuid [pk]
  owner_user_id uuid [ref: > users.id]
  subscription_id uuid [ref: > subscriptions.id]
  shop_name text
  business_name text
  status text
  created_at timestamp
}

Table shop_branches {
  id uuid [pk]
  shop_id uuid [ref: > shops.id]
  branch_name text
  branch_code text
  address text
  contact_no text
  branch_type text
  manager_user_id uuid [ref: > users.id]
  status text
}

Table branch_members {
  id uuid [pk]
  branch_id uuid [ref: > shop_branches.id]
  user_id uuid [ref: > users.id]
  branch_role text
  specialization text
  status text
}

Table branch_permissions {
  id uuid [pk]
  branch_member_id uuid [ref: > branch_members.id]
  permission_code text
  can_view boolean
  can_create boolean
  can_update boolean
  can_delete boolean
}

Table customers {
  id uuid [pk]
  shop_id uuid [ref: > shops.id]
  user_id uuid [ref: > users.id]
  full_name text
  phone text
  email text
  address text
  source text
  status text
}

Table customer_measurements {
  id uuid [pk]
  customer_id uuid [ref: > customers.id]
  branch_id uuid [ref: > shop_branches.id]
  parent_profile_id uuid [ref: > customer_measurements.id]
  garment_category text
  garment_type text
  version_no int
  is_current boolean
  recorded_at timestamp
}

Table measurement_values {
  id uuid [pk]
  profile_id uuid [ref: > customer_measurements.id]
  field_name text
  value_inches decimal
}

Table appointments {
  id uuid [pk]
  shop_id uuid [ref: > shops.id]
  branch_id uuid [ref: > shop_branches.id]
  customer_id uuid [ref: > customers.id]
  assigned_staff_id uuid [ref: > users.id]
  order_id uuid [ref: > orders.id]
  appointment_type text
  source text
  status text
  date date
  start_time time
  duration_minutes int
  notes text
}

Table orders {
  id uuid [pk]
  shop_id uuid [ref: > shops.id]
  branch_id uuid [ref: > shop_branches.id]
  customer_id uuid [ref: > customers.id]
  created_by_user_id uuid [ref: > users.id]
  assigned_staff_id uuid [ref: > users.id]
  appointment_id uuid [ref: > appointments.id]
  measurement_profile_id uuid [ref: > customer_measurements.id]
  order_type text
  source_type text
  status text
  total_amount decimal
  due_date date
  created_at timestamp
}

Table order_items {
  id uuid [pk]
  order_id uuid [ref: > orders.id]
  garment_name text
  quantity int
  unit_price decimal
  notes text
}

Table production_tasks {
  id uuid [pk]
  order_id uuid [ref: > orders.id]
  task_name text
  assigned_to_user_id uuid [ref: > users.id]
  status text
  started_at timestamp
  completed_at timestamp
}

Table fitting_sessions {
  id uuid [pk]
  order_id uuid [ref: > orders.id]
  appointment_id uuid [ref: > appointments.id]
  measurement_profile_id uuid [ref: > customer_measurements.id]
  adjustment_notes text
  revision_no int
  next_fitting_date date
}

Table order_status_history {
  id uuid [pk]
  order_id uuid [ref: > orders.id]
  status text
  changed_by_user_id uuid [ref: > users.id]
  changed_at timestamp
  notes text
}

Table order_inspections {
  id uuid [pk]
  order_id uuid [ref: > orders.id]
  inspected_by_user_id uuid [ref: > users.id]
  status text
  findings text
  inspected_at timestamp
}

Table inventory_items {
  id uuid [pk]
  shop_id uuid [ref: > shops.id]
  sku text
  item_name text
  category text
  item_type text
  unit text
  reorder_level decimal
}

Table branch_inventory {
  id uuid [pk]
  branch_id uuid [ref: > shop_branches.id]
  inventory_item_id uuid [ref: > inventory_items.id]
  on_hand_qty decimal
  reserved_qty decimal
  available_qty decimal
}

Table inventory_movements {
  id uuid [pk]
  branch_id uuid [ref: > shop_branches.id]
  inventory_item_id uuid [ref: > inventory_items.id]
  movement_type text
  quantity decimal
  reference_type text
  reference_id text
  moved_by_user_id uuid [ref: > users.id]
  discrepancy_type text
  created_at timestamp
}

Table inventory_reservations {
  id uuid [pk]
  order_id uuid [ref: > orders.id]
  inventory_item_id uuid [ref: > inventory_items.id]
  branch_id uuid [ref: > shop_branches.id]
  quantity decimal
  status text
}

Table suppliers {
  id uuid [pk]
  shop_id uuid [ref: > shops.id]
  supplier_name text
  contact_person text
  phone text
  email text
  address text
  status text
}

Table supplier_items {
  id uuid [pk]
  supplier_id uuid [ref: > suppliers.id]
  inventory_item_id uuid [ref: > inventory_items.id]
  unit_cost decimal
  moq decimal
  lead_time_days int
}

Table purchase_orders {
  id uuid [pk]
  shop_id uuid [ref: > shops.id]
  branch_id uuid [ref: > shop_branches.id]
  supplier_id uuid [ref: > suppliers.id]
  requested_by_user_id uuid [ref: > users.id]
  status text
  requested_at timestamp
}

Table purchase_order_items {
  id uuid [pk]
  purchase_order_id uuid [ref: > purchase_orders.id]
  inventory_item_id uuid [ref: > inventory_items.id]
  quantity decimal
  unit_cost decimal
  received_qty decimal
}

Table goods_receipts {
  id uuid [pk]
  purchase_order_id uuid [ref: > purchase_orders.id]
  received_by_user_id uuid [ref: > users.id]
  received_at timestamp
}

Table goods_receipt_items {
  id uuid [pk]
  goods_receipt_id uuid [ref: > goods_receipts.id]
  inventory_item_id uuid [ref: > inventory_items.id]
  quantity_received decimal
  condition_notes text
}

Table stock_transfers {
  id uuid [pk]
  source_branch_id uuid [ref: > shop_branches.id]
  dest_branch_id uuid [ref: > shop_branches.id]
  inventory_item_id uuid [ref: > inventory_items.id]
  quantity decimal
  status text
  created_at timestamp
}

Table invoices {
  id uuid [pk]
  order_id uuid [ref: > orders.id]
  invoice_no text
  subtotal decimal
  discount decimal
  total_amount decimal
  status text
  issued_at timestamp
}

Table payments {
  id uuid [pk]
  invoice_id uuid [ref: > invoices.id]
  amount decimal
  method text
  reference_no text
  status text
  paid_at timestamp
  received_by_user_id uuid [ref: > users.id]
}

Table designer_profiles {
  id uuid [pk]
  user_id uuid [ref: > users.id]
  bio text
  specialization text
  rating decimal
}

Table designer_portfolio_items {
  id uuid [pk]
  designer_id uuid [ref: > designer_profiles.id]
  title text
  image_url text
  category text
  created_at timestamp
}

Table consultation_requests {
  id uuid [pk]
  customer_id uuid [ref: > customers.id]
  designer_id uuid [ref: > designer_profiles.id]
  shop_id uuid [ref: > shops.id]
  status text
  requested_at timestamp
}

Table design_proposals {
  id uuid [pk]
  consultation_id uuid [ref: > consultation_requests.id]
  designer_id uuid [ref: > designer_profiles.id]
  title text
  description text
  status text
  created_at timestamp
}

Table design_blueprint_assets {
  id uuid [pk]
  proposal_id uuid [ref: > design_proposals.id]
  asset_type text
  url text
  created_at timestamp
}

Table proposal_revisions {
  id uuid [pk]
  proposal_id uuid [ref: > design_proposals.id]
  notes text
  created_at timestamp
}

Table proposal_handoffs {
  id uuid [pk]
  proposal_id uuid [ref: > design_proposals.id]
  order_id uuid [ref: > orders.id]
  converted_by_user_id uuid [ref: > users.id]
  converted_at timestamp
}

Table tenant_verifications {
  id uuid [pk]
  shop_id uuid [ref: > shops.id]
  status text
  verified_at timestamp
}

Table support_tickets {
  id uuid [pk]
  shop_id uuid [ref: > shops.id]
  user_id uuid [ref: > users.id]
  subject text
  status text
  priority text
  created_at timestamp
}

Table support_ticket_messages {
  id uuid [pk]
  ticket_id uuid [ref: > support_tickets.id]
  sender_user_id uuid [ref: > users.id]
  message text
  created_at timestamp
}

Table support_ticket_attachments {
  id uuid [pk]
  message_id uuid [ref: > support_ticket_messages.id]
  url text
  file_type text
  file_size int
}

Table audit_logs {
  id uuid [pk]
  user_id uuid [ref: > users.id]
  action text
  module text
  entity_id text
  created_at timestamp
}

Table notifications {
  id uuid [pk]
  user_id uuid [ref: > users.id]
  branch_id uuid [ref: > shop_branches.id]
  type text
  message text
  status text
  sent_at timestamp
}

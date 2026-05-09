import { Staff, Customer, MeasurementProfile } from '@/types/erp';

export const INITIAL_STAFF: Staff[] = [
  { id: 'STF-001', name: 'Joshua Arabejo', roles: ['ADMIN'], phone: '0917-123-4567', email: 'joshua@sutura.com', hasSystemAccess: true, status: 'Online', branch_id: 'BRN-001', avatar: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Molang&backgroundColor=b6e3f4' },
  { id: 'STF-002', name: 'Maria Santos', roles: ['TAILOR', 'INVENTORY'], phone: '0918-234-5678', email: 'maria@sutura.com', hasSystemAccess: true, status: 'Online', branch_id: 'BRN-001', avatar: 'https://api.dicebear.com/7.x/big-smile/svg?seed=PiuPiu&backgroundColor=ffdfba' },
  { id: 'STF-003', name: 'Robert Chen', roles: ['TAILOR'], phone: '0919-345-6789', email: 'robert@sutura.com', hasSystemAccess: true, status: 'Offline', branch_id: 'BRN-002', avatar: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Brown&backgroundColor=dfccbe' },
  { id: 'STF-004', name: 'Elena Cruz', roles: ['SALES', 'TAILOR'], phone: '0920-456-7890', email: 'elena@sutura.com', hasSystemAccess: true, status: 'Online', branch_id: 'BRN-001', avatar: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Cony&backgroundColor=ffb3ba' },
  { id: 'STF-005', name: 'Juan Reyes', roles: ['TAILOR'], phone: '0921-567-8901', email: 'juan@sutura.com', hasSystemAccess: true, status: 'Online', branch_id: 'BRN-001', avatar: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Koda&backgroundColor=bae1ff' },
  { id: 'STF-006', name: 'Isabella Garcia', roles: ['SALES', 'INVENTORY'], phone: '0922-678-9012', email: 'isabella@sutura.com', hasSystemAccess: true, status: 'Online', branch_id: 'BRN-001', avatar: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Lilly&backgroundColor=fdfd96' },
  { id: 'STF-007', name: 'Michael Torres', roles: ['TAILOR'], phone: '0923-789-0123', email: 'michael@sutura.com', hasSystemAccess: true, status: 'Offline', branch_id: 'BRN-001', avatar: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Bear&backgroundColor=c5b9cd' },
  { id: 'STF-MGR-001', name: 'Ricardo Dalisay', roles: ['MANAGER'], phone: '0924-890-1234', email: 'ricardo@sutura.com', hasSystemAccess: true, status: 'Online', branch_id: 'BRN-001', avatar: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Ricardo&backgroundColor=b6e3f4' },
  { id: 'STF-INV-001', name: 'Isagani Cruz', roles: ['INVENTORY'], phone: '0925-901-2345', email: 'isagani@sutura.com', hasSystemAccess: true, status: 'Online', branch_id: 'BRN-001', avatar: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Isagani&backgroundColor=ffdfba' },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'James Brown',
    email: 'james@gmail.com',
    phone: '+63 917 111 2222',
    address: '123 Rizal St., Makati City',
    gender: 'Male',
    type: 'Individual',
    is_active: true,
    style_preferences: 'Prefers standard notched lapels and 2-button closure.',
    posture_tags: ['Sloping Shoulders', 'Prominent Chest'],
    createdAt: new Date('2025-02-15').toISOString()
  },
  {
    id: 'CUST-002',
    name: 'Arthur Taylor',
    email: 'arthur@gmail.com',
    phone: '+63 920 333 4444',
    address: '456 Bonifacio Ave., BGC, Taguig',
    gender: 'Male',
    type: 'Individual',
    is_active: true,
    createdAt: new Date('2025-03-10').toISOString()
  },
  {
    id: 'CUST-003',
    name: 'Matthew Johnson',
    email: 'matt@gmail.com',
    phone: '+63 918 555 6666',
    address: '789 Katipunan Ave., Quezon City',
    gender: 'Male',
    type: 'Individual',
    is_active: true,
    createdAt: new Date('2025-03-20').toISOString()
  },
  {
    id: 'CUST-004',
    name: 'Alexander McQueen',
    email: 'alex@mcqueen.com',
    phone: '0918-123-4567',
    address: 'Savile Row, London',
    gender: 'Male',
    type: 'Individual',
    is_active: true,
    style_preferences: 'High-end bespoke tailoring. Avant-garde elements.',
    posture_tags: ['Erect Posture', 'Broad Shoulders'],
    createdAt: new Date('2025-04-01').toISOString()
  },
  {
    id: 'CUST-005',
    name: 'Maria Clara',
    email: 'maria.clara@noli.ph',
    phone: '0919-777-1887',
    address: 'San Diego, Laguna',
    gender: 'Female',
    type: 'Individual',
    is_active: true,
    style_preferences: 'Traditional Filipiniana styles.',
    posture_tags: ['Petite Frame'],
    createdAt: new Date('2025-04-10').toISOString()
  },
  {
    id: 'CUST-006',
    name: 'Wei Chen',
    email: 'weichen@gmail.com',
    phone: '+63 905 777 8888',
    address: '22 China St., Binondo, Manila',
    gender: 'Female',
    type: 'Individual',
    is_active: true,
    createdAt: new Date('2025-04-15').toISOString()
  }
];

export const INITIAL_MEASUREMENTS: MeasurementProfile[] = [
  {
    id: 'MEAS-001',
    customer_id: 'CUST-004',
    branch_id: 'BRN-001',
    profile_name: 'Standard Suit Profile',
    garment_category: 'Upper Wear',
    garment_type: 'Suit',
    fit_preference: 'Slim',
    neck: 16,
    shoulder_width: 18.5,
    chest: 42,
    waist: 34,
    hip: 40,
    sleeve_length: 25.5,
    measurement_unit: 'Inches',
    status: 'APPROVED',
    is_current: true,
    version_no: 'V1',
    recorded_by: 'STF-001',
    recorded_at: new Date('2025-04-01').toISOString()
  },
  {
    id: 'MEAS-002',
    customer_id: 'CUST-001',
    branch_id: 'BRN-001',
    profile_name: 'Premium Suit Profile',
    garment_category: 'Upper Wear',
    garment_type: 'Suit',
    fit_preference: 'Slim',
    neck: 16.5,
    shoulder_width: 19,
    chest: 44,
    waist: 36,
    hip: 42,
    sleeve_length: 26,
    measurement_unit: 'Inches',
    status: 'APPROVED',
    is_current: true,
    version_no: 'V1',
    recorded_by: 'STF-002',
    recorded_at: new Date('2025-02-15').toISOString()
  }
];

import { Shop, ShopBranch } from '@/types/erp';

export const INITIAL_SHOPS: Shop[] = [
  {
    id: 'SHOP-001',
    ownerUserId: 'USR-001',
    subscriptionId: 'SUB-001',
    shopName: 'Davao Tailors PH',
    businessName: 'Sutura Tailoring Inc.',
    businessType: 'Tailoring & Design',
    status: 'ACTIVE',
    themeColor: '#1e3a8a',
    accentColor: '#10b981',
    createdAt: new Date('2025-01-01').toISOString()
  }
];

export const INITIAL_BRANCHES: ShopBranch[] = [
  {
    id: 'BRN-001',
    shopId: 'SHOP-001',
    branchName: 'Davao Tailors',
    branchCode: 'DVO-001',
    address: 'Abreeza Mall, Davao City',
    contactNo: '+63 988 123 4567',
    isMain: false,
    managerUserId: 'STF-MGR-001',
    status: 'ACTIVE',
    branch_type: 'SATELLITE',
    is_default_source: true,
    created_at: new Date('2025-01-01').toISOString(),
    updated_at: new Date('2025-01-01').toISOString()
  },
  {
    id: 'BRN-002',
    shopId: 'SHOP-001',
    branchName: 'Sutura QC Outlet',
    branchCode: 'QC-002',
    address: 'SM North EDSA, Quezon City',
    contactNo: '+63 918 765 4321',
    isMain: false,
    managerUserId: 'STF-001',
    status: 'ACTIVE',
    branch_type: 'SATELLITE',
    is_default_source: false,
    created_at: new Date('2025-02-15').toISOString(),
    updated_at: new Date('2025-02-15').toISOString()
  }
];

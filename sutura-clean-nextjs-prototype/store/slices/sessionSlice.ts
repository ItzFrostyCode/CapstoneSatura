import { StateCreator } from 'zustand';
import { User, Shop, ShopBranch, ERPNotification, Staff, PlanLevel, AuditLog, Subscription } from '@/types/erp';
import { INITIAL_SHOPS, INITIAL_BRANCHES, INITIAL_STAFF } from '@/mocks/mockData';
import { ERPStore } from '../useERPStore';

export interface SessionSlice {
  currentUser: User | null;
  currentShop: Shop | null;
  currentBranch: ShopBranch | null;
  currentPlan: PlanLevel;
  currentSubscription: Subscription | null;
  notifications: ERPNotification[];
  staff: Staff[];
  branches: ShopBranch[];
  auditLogs: AuditLog[];
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (val: boolean) => void;
  setCurrentUser: (user: User | null) => void;
  updateUserAvatar: (avatar: string) => void;
  setCurrentShop: (shop: Shop | null) => void;
  setCurrentBranch: (branch: ShopBranch | null) => void;
  canSwitchBranch: () => boolean;
  pushNotification: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
  addStaff: (staff: Omit<Staff, 'id' | 'staffCode'>) => void;
  addBranch: (branch: Omit<ShopBranch, 'id' | 'created_at' | 'updated_at'>) => void;
}

export const createSessionSlice: StateCreator<ERPStore, [], [], SessionSlice> = (set, get) => ({
  currentUser: { 
    id: 'USR-001', 
    name: 'Joshua Arabejo', 
    email: 'joshua@sutura.com', 
    avatar: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Molang&backgroundColor=b6e3f4', 
    role: 'OWNER', 
    status: 'ACTIVE', 
    createdAt: new Date().toISOString() 
  },
  currentShop: INITIAL_SHOPS[0],
  currentBranch: INITIAL_BRANCHES[0],
  currentPlan: 'PREMIUM',
  currentSubscription: {
    id: 'SUB-PREM-001',
    planName: 'Monthly Premium Plan',
    planLevel: 'PREMIUM',
    status: 'ACTIVE',
    maxBranches: 10,
    maxStaff: 50,
    startDate: '2026-05-01T00:00:00Z',
    endDate: '2026-06-01T00:00:00Z',
    price: 4999
  },
  branches: INITIAL_BRANCHES,
  auditLogs: [],
  hasUnsavedChanges: false,
  notifications: [],
  staff: INITIAL_STAFF,
  setHasUnsavedChanges: (val) => set({ hasUnsavedChanges: val }),
  setCurrentUser: (user) => set({ currentUser: user }),
  updateUserAvatar: (avatar) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, avatar } : null
  })),
  setCurrentShop: (shop) => set({ currentShop: shop }),
  setCurrentBranch: (branch) => set((state) => {
    const user = state.currentUser;
    const canSwitch = user?.role === 'OWNER' || user?.role === 'ADMIN';
    const prevBranch = state.currentBranch;
    
    // 1. Logic-layer permission check
    if (!canSwitch) {
      const log = {
        id: `LOG-${Date.now()}`,
        user_id: user?.id,
        action: 'REJECTED_BRANCH_SWITCH',
        module: 'SESSION',
        details: `Attempted switch to ${branch?.id} from ${prevBranch?.id}`,
        timestamp: new Date().toISOString()
      };
      return { auditLogs: [log, ...state.auditLogs] };
    }

    // 2. Unsaved changes guard (Handled in UI, but added here for logic-layer safety)
    if (state.hasUnsavedChanges) {
      return state; 
    }

    // 3. Successful branch switch logging
    const successLog = {
      id: `LOG-${Date.now()}`,
      user_id: user?.id,
      action: 'SUCCESSFUL_BRANCH_SWITCH',
      module: 'SESSION',
      details: `Switched from ${prevBranch?.branchName} to ${branch?.branchName}`,
      previous_branch: prevBranch?.id,
      new_branch: branch?.id,
      timestamp: new Date().toISOString()
    };
    
    return { 
      currentBranch: branch,
      auditLogs: [successLog, ...state.auditLogs]
    };
  }),
  canSwitchBranch: () => {
    const user = get().currentUser;
    return user?.role === 'OWNER' || user?.role === 'ADMIN';
  },
  pushNotification: (message, type) => set((state) => ({
    notifications: [{ id: Date.now().toString(), message, type, timestamp: new Date().toISOString(), read: false }, ...state.notifications]
  })),
  addStaff: (staffData) => set((state) => {
    const newStaff: Staff = {
      ...staffData,
      id: `STF-${Date.now().toString().slice(-4)}`,
      staffCode: `SUT-${Math.floor(Math.random() * 900) + 100}`,
      // 4. Inherit current branch automatically
      branch_id: state.currentBranch?.id,
      // 5. Explicit pending status if no user linked
      status: staffData.hasSystemAccess ? 'Online' : 'invited'
    } as Staff;
    return { staff: [...state.staff, newStaff] };
  }),
  addBranch: (branchData) => set((state) => {
    const newBranch: ShopBranch = {
      ...branchData,
      id: `BRN-${Date.now().toString().slice(-4)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as ShopBranch;
    return { branches: [...state.branches, newBranch] };
  }),
});

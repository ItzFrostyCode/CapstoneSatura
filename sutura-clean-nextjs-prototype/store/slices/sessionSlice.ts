import { StateCreator } from 'zustand';
import { User, Shop, ShopBranch, ERPNotification, Staff, PlanLevel, AuditLog, Subscription, SHOP_PLAN_CONFIG } from '@/types/erp';
import { INITIAL_SHOPS, INITIAL_BRANCHES, INITIAL_STAFF, INITIAL_SHOP_SUBSCRIPTIONS } from '@/mocks/mockData';
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
  pushAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  /** Upgrade or downgrade the current shop subscription */
  updateSubscription: (plan: PlanLevel, billingCycle: 'MONTHLY' | 'ANNUAL') => void;
  updateShopBranding: (data: Partial<Shop>) => void;
  // Persistence initialization
  initializeSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const createSessionSlice: StateCreator<ERPStore, [], [], SessionSlice> = (set, get) => ({
  currentUser: {
    id: 'STF-001',
    name: 'John Clock',
    role: 'SHOP_OWNER',
    email: 'john@sutura.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John%20Clock&backgroundColor=b6e3f4',
    status: 'ACTIVE',
    createdAt: new Date('2025-01-01').toISOString(),
  },
  currentShop: INITIAL_SHOPS[0],
  currentBranch: INITIAL_BRANCHES[0],
  currentPlan: 'Workshop',
  // Seed from subscriptions mock — SHOP-001 is an annual Workshop subscriber
  currentSubscription: INITIAL_SHOP_SUBSCRIPTIONS[0],
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
    const canSwitch = user?.role === 'SHOP_OWNER' || user?.role === 'ADMIN';
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
    return user?.role === 'SHOP_OWNER' || user?.role === 'ADMIN';
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
  pushAuditLog: (logData) => set((state) => {
    const newLog: AuditLog = {
      ...logData,
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    return { auditLogs: [newLog, ...state.auditLogs] };
  }),

  updateSubscription: (plan, billingCycle) => set((state) => {
    const config = SHOP_PLAN_CONFIG[plan];
    const now = new Date();
    const end = new Date(now);
    end.setMonth(end.getMonth() + (billingCycle === 'ANNUAL' ? 12 : 1));
    const price = billingCycle === 'ANNUAL' ? config.annualPrice : config.monthlyPrice;
    const updated: Subscription = {
      id: state.currentSubscription?.id || `SUB-${Date.now()}`,
      shop_id: state.currentShop?.id || 'SHOP-001',
      planName: config.name,
      planLevel: plan,
      status: 'ACTIVE',
      billing_cycle: billingCycle,
      maxBranches: config.features.maxBranches,
      maxStaff: config.features.maxStaffAccounts,
      startDate: now.toISOString(),
      endDate: end.toISOString(),
      price,
      auto_renew: true,
      upgraded_from: state.currentPlan !== plan ? state.currentPlan : undefined,
      upgraded_at: state.currentPlan !== plan ? now.toISOString() : undefined,
    };
    return { currentSubscription: updated, currentPlan: plan };
  }),
  updateShopBranding: (data) => set((state) => ({
    currentShop: state.currentShop ? { ...state.currentShop, ...data } : null
  })),

  initializeSession: async () => {
    const { getAuthSession } = await import('@/lib/actions/auth');
    const result = await getAuthSession();
    if (result.success && result.data) {
      set({
        currentUser: result.data.user as any,
        currentShop: result.data.shop as any,
        currentBranch: result.data.branch as any,
      });
    }
  },

  logout: async () => {
    const { logoutUser } = await import('@/lib/actions/auth');
    await logoutUser();
    set({ currentUser: null, currentShop: null, currentBranch: null });
    window.location.href = '/login';
  }
});

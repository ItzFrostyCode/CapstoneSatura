import { StateCreator } from 'zustand';
import {
  InventoryItem, InventoryMovement, InventoryStock, InventoryReservation, StockTransfer
} from '@/types/erp';
import {
  INITIAL_INVENTORY,
  INITIAL_INVENTORY_STOCK,
  INITIAL_INVENTORY_MOVEMENTS,
  INITIAL_INVENTORY_RESERVATIONS,
} from '@/mocks/mockData';
import { ERPStore } from '../useERPStore';

interface BOMRecipe {
  productId: string;
  materials: { sku: string; qty: number }[];
}

interface LegacyMovement {
  itemSku: string;
  type: 'Stock In' | 'Stock Out' | 'Adjustment' | 'Production';
  qty: number;
  ref: string;
  staff_id?: string;
}

export interface InventorySlice {
  // Normalized tables
  inventory: InventoryItem[];
  inventoryStock: InventoryStock[];
  inventoryMovements: InventoryMovement[];
  inventoryReservations: InventoryReservation[];
  stockTransfers: StockTransfer[];

  // Legacy aliases (kept for old consumers like inventory/page.tsx)
  inventoryTransactions: InventoryMovement[];
  movements: InventoryMovement[];
  recipes: BOMRecipe[]; // BOM Recipes
  
  // Actions
  addInventoryItem: (item: Partial<InventoryItem>) => void;
  updateInventoryItem: (skuOrId: string, updates: Partial<InventoryItem>) => void;
  addMovement: (mov: LegacyMovement) => void;
  saveRecipe: (recipe: BOMRecipe) => void;
  executeAssembly: (productId: string, qty: number, performedBy: string) => void;

  // Actions
  recordInventoryTransaction: (
    item_id: string,
    type: 'IN' | 'OUT' | 'ADJUST' | 'RESERVE' | 'RELEASE',
    quantity: number,
    reason: string,
    reference_id: string,
    variant_id?: string
  ) => void;

  adjustStock: (branchId: string, itemId: string, qty: number, type: 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT', performedBy: string) => void;

  reserveStock: (
    jobOrderId: string, branchId: string, itemId: string, qty: number, performedBy?: string
  ) => void;

  releaseStock: (reservationId: string, qty: number, performedBy?: string) => void;

  receiveStock: (branchId: string, itemId: string, qty: number, unitCost: number, referenceId: string, supplierId?: string, performedBy?: string) => void;
  recordBatchRelease: (customerId: string, jobOrderId: string, items: InventoryItem[], paymentStatus: string) => void;
  transferStock: (transfer: Omit<StockTransfer, "id" | "status" | "created_at">) => void;
}

export const createInventorySlice: StateCreator<ERPStore, [], [], InventorySlice> = (set, get) => ({
  inventory: INITIAL_INVENTORY,
  inventoryStock: INITIAL_INVENTORY_STOCK,
  inventoryMovements: INITIAL_INVENTORY_MOVEMENTS,
  inventoryReservations: INITIAL_INVENTORY_RESERVATIONS,
  stockTransfers: [],
  // Legacy aliases — same array as inventoryMovements for backward compat
  inventoryTransactions: INITIAL_INVENTORY_MOVEMENTS,
  movements: INITIAL_INVENTORY_MOVEMENTS,
  recipes: [
    {
      productId: 'FG-SLIM-NVY',
      materials: [
        { sku: 'FAB-WOOL-IT-001', qty: 3.5 },
        { sku: 'BTN-PERL-01', qty: 8 },
        { sku: 'THRD-SLV-01', qty: 0.1 }
      ]
    },
    {
      productId: 'SHRT-WHT',
      materials: [
        { sku: 'FAB-LINEN-WHT', qty: 2.5 },
        { sku: 'BTN-PERL-01', qty: 10 },
        { sku: 'THRD-SLV-01', qty: 0.05 }
      ]
    }
  ],

  // ── Legacy action kept for old inventory/page.tsx ────────────
  recordInventoryTransaction: (item_id, type, quantity, reason, reference_id) => set((state) => {
    const movType = type === 'IN' ? 'RECEIVE' : type === 'OUT' ? 'ISSUE' : 'ADJUSTMENT_IN';
    const movement: InventoryMovement = {
      id: `MOV-${Date.now()}`,
      shop_id: 'SHOP-001',
      branch_id: 'BRN-001',
      inventory_item_id: item_id,
      movement_type: movType as InventoryMovement['movement_type'],
      qty: quantity,
      reference_type: reason,
      reference_id,
      performed_by_user_id: 'STF-001',
      created_at: new Date().toISOString(),
      notes: reason,
    };
    // Also update legacy stock field on the item for pages not yet migrated
    const newInventory = state.inventory.map(item => {
      if (item.id === item_id) {
        const delta = type === 'OUT' ? -quantity : type === 'IN' ? quantity : 0;
        return { ...item, stock: (item.stock ?? 0) + delta };
      }
      return item;
    });
    return {
      inventory: newInventory,
      inventoryMovements: [...state.inventoryMovements, movement],
      inventoryTransactions: [...state.inventoryMovements, movement],
      movements: [...state.inventoryMovements, movement],
    };
  }),

  // ── Normalized actions ─────────────────────────────────────────
  adjustStock: (branchId, itemId, qty, type, performedBy) => set((state) => {
    const movement: InventoryMovement = {
      id: `MOV-${Date.now()}`,
      shop_id: 'SHOP-001', branch_id: branchId, inventory_item_id: itemId,
      movement_type: type, qty,
      reference_type: 'ADJUSTMENT', reference_id: `ADJ-${Date.now()}`,
      performed_by_user_id: performedBy ?? 'STF-001',
      created_at: new Date().toISOString(),
    };
    const delta = type === 'ADJUSTMENT_IN' ? qty : -qty;
    const updatedStock = state.inventoryStock.map(s =>
      s.branch_id === branchId && s.inventory_item_id === itemId
        ? { ...s, on_hand_qty: s.on_hand_qty + delta, available_qty: s.available_qty + delta, updated_at: new Date().toISOString() }
        : s
    );
    const newMovements = [...state.inventoryMovements, movement];
    return { 
      inventoryMovements: newMovements, 
      inventoryTransactions: newMovements,
      movements: newMovements,
      inventoryStock: updatedStock 
    };
  }),

  // ── Legacy / Page-specific Actions ─────────────────────────────
  addInventoryItem: (item) => set((state) => ({
    inventory: [{
      id: `INV-${Date.now()}`,
      shop_id: 'SHOP-001',
      sku: item.sku || `SKU-${Date.now()}`,
      item_name: item.item || item.item_name || '',
      category: item.cat || item.category || 'Fabric',
      item_type: 'MATERIAL',
      unit_of_measure: item.unit || 'meters',
      reorder_level: item.minStock || item.reorder_level || 0,
      reorder_qty: 0,
      is_active: true,
      stock: item.stock || 0,
      minStock: item.minStock || 0,
      unit: item.unit || 'meters',
      cat: item.cat || 'Fabric',
      item: item.item || '',
      ...item
    } as InventoryItem, ...state.inventory]
  })),

  updateInventoryItem: (skuOrId, updates) => set((state) => ({
    inventory: state.inventory.map(item => 
      (item.sku === skuOrId || item.id === skuOrId) ? { ...item, ...updates } : item
    )
  })),

  addMovement: (mov) => set((state) => {
    const item = state.inventory.find(i => i.sku === mov.itemSku || i.id === mov.itemSku);
    const movement: InventoryMovement = {
      id: `MOV-${Date.now()}`,
      shop_id: 'SHOP-001',
      branch_id: 'BRN-001',
      inventory_item_id: item?.id || mov.itemSku,
      movement_type: mov.type === 'Stock In' ? 'RECEIVE' : 'ISSUE',
      qty: Math.abs(mov.qty),
      reference_type: mov.type,
      reference_id: mov.ref,
      performed_by_user_id: mov.staff_id || 'STF-001',
      created_at: new Date().toISOString(),
      notes: mov.ref,
    };
    const newMovements = [movement, ...state.inventoryMovements];
    return { 
      inventoryMovements: newMovements,
      inventoryTransactions: newMovements,
      movements: newMovements
    };
  }),

  saveRecipe: (recipe) => set((state) => ({
    recipes: [recipe, ...state.recipes.filter(r => r.productId !== recipe.productId)]
  })),

  executeAssembly: (productId, qty, performedBy) => set((state) => {
    // Logic for assembly (deduct materials, add finished good)
    const recipe = state.recipes.find(r => r.productId === productId);
    if (!recipe) return state;

    // This is a simplified version for the prototype UI
    const updatedInventory = state.inventory.map(item => {
      // Add to finished good
      if (item.sku === productId) return { ...item, stock: (item.stock || 0) + qty };
      // Deduct from materials
      const material = recipe.materials.find((m) => m.sku === item.sku);
      if (material) return { ...item, stock: (item.stock || 0) - (material.qty * qty) };
      return item;
    });

    return { inventory: updatedInventory };
  }),

  reserveStock: (jobOrderId, branchId, itemId, qty, performedBy) => set((state) => {
    const movement: InventoryMovement = {
      id: `MOV-${Date.now()}`,
      shop_id: 'SHOP-001', branch_id: branchId, inventory_item_id: itemId,
      movement_type: 'RESERVE', qty,
      reference_type: 'JOB_ORDER', reference_id: jobOrderId,
      performed_by_user_id: performedBy ?? 'STF-001',
      created_at: new Date().toISOString(),
    };
    const reservation: InventoryReservation = {
      id: `RES-${Date.now()}`,
      job_order_id: jobOrderId, branch_id: branchId, inventory_item_id: itemId,
      qty_reserved: qty, qty_released: 0, status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };
    const updatedStock = state.inventoryStock.map(s =>
      s.branch_id === branchId && s.inventory_item_id === itemId
        ? { ...s, reserved_qty: s.reserved_qty + qty, available_qty: s.available_qty - qty, updated_at: new Date().toISOString() }
        : s
    );
    const newMovements = [...state.inventoryMovements, movement];
    return {
      inventoryMovements: newMovements,
      inventoryTransactions: newMovements,
      movements: newMovements,
      inventoryReservations: [...state.inventoryReservations, reservation],
      inventoryStock: updatedStock,
    };
  }),

  releaseStock: (reservationId, qty, performedBy) => set((state) => {
    const reservation = state.inventoryReservations.find(r => r.id === reservationId);
    if (!reservation) return {};
    const movement: InventoryMovement = {
      id: `MOV-${Date.now()}`,
      shop_id: 'SHOP-001', branch_id: reservation.branch_id, inventory_item_id: reservation.inventory_item_id,
      movement_type: 'RELEASE', qty,
      reference_type: 'JOB_ORDER', reference_id: reservation.job_order_id,
      performed_by_user_id: performedBy ?? 'STF-001',
      created_at: new Date().toISOString(),
    };
    const newReleased = reservation.qty_released + qty;
    const updatedReservations = state.inventoryReservations.map(r =>
      r.id === reservationId
        ? { ...r, qty_released: newReleased, status: newReleased >= r.qty_reserved ? 'RELEASED' as const : 'PARTIALLY_RELEASED' as const }
        : r
    );
    const updatedStock = state.inventoryStock.map(s =>
      s.branch_id === reservation.branch_id && s.inventory_item_id === reservation.inventory_item_id
        ? { ...s, reserved_qty: Math.max(0, s.reserved_qty - qty), on_hand_qty: s.on_hand_qty - qty, updated_at: new Date().toISOString() }
        : s
    );
    const newMovements = [...state.inventoryMovements, movement];
    return {
      inventoryMovements: newMovements,
      inventoryTransactions: newMovements,
      movements: newMovements,
      inventoryReservations: updatedReservations,
      inventoryStock: updatedStock,
    };
  }),

  receiveStock: (branchId, itemId, qty, unitCost, referenceId, supplierId, performedBy) => set((state) => {
    const movement: InventoryMovement = {
      id: `MOV-${Date.now()}`,
      shop_id: 'SHOP-001', branch_id: branchId, inventory_item_id: itemId,
      movement_type: 'RECEIVE', qty, unit_cost: unitCost,
      reference_type: 'GOODS_RECEIPT', reference_id: referenceId,
      supplier_id: supplierId,
      performed_by_user_id: performedBy ?? 'STF-001',
      created_at: new Date().toISOString(),
    };
    const updatedStock = state.inventoryStock.map(s =>
      s.branch_id === branchId && s.inventory_item_id === itemId
        ? { ...s, on_hand_qty: s.on_hand_qty + qty, available_qty: s.available_qty + qty, updated_at: new Date().toISOString() }
        : s
    );
    // Also update legacy stock field
    const updatedInventory = state.inventory.map(item =>
      item.id === itemId ? { ...item, stock: (item.stock ?? 0) + qty } : item
    );
    const newMovements = [...state.inventoryMovements, movement];
    return {
      inventoryMovements: newMovements,
      inventoryTransactions: newMovements,
      movements: newMovements,
      inventoryStock: updatedStock,
      inventory: updatedInventory,
    };
  }),
  
  transferStock: (transferData) => set((state) => {
    const transferId = `TRSF-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();
    
    const transfer: StockTransfer = {
      id: transferId,
      status: 'COMPLETED',
      created_at: now,
      completed_at: now,
      ...transferData
    };

    // 1. Log TRANSFER_OUT from source
    const outMovement: InventoryMovement = {
      id: `MOV-OUT-${Date.now()}`,
      shop_id: transfer.shop_id,
      branch_id: transfer.source_branch_id,
      inventory_item_id: transfer.inventory_item_id,
      movement_type: 'TRANSFER_OUT',
      qty: transfer.qty,
      reference_type: 'STOCK_TRANSFER',
      reference_id: transferId,
      performed_by_user_id: transfer.performed_by_user_id,
      created_at: now
    };

    // 2. Log TRANSFER_IN to destination
    const inMovement: InventoryMovement = {
      id: `MOV-IN-${Date.now() + 1}`,
      shop_id: transfer.shop_id,
      branch_id: transfer.destination_branch_id,
      inventory_item_id: transfer.inventory_item_id,
      movement_type: 'TRANSFER_IN',
      qty: transfer.qty,
      reference_type: 'STOCK_TRANSFER',
      reference_id: transferId,
      performed_by_user_id: transfer.performed_by_user_id,
      created_at: now
    };

    // 3. Update Stocks
    const updatedStock = state.inventoryStock.map(s => {
      // Deduct from source
      if (s.branch_id === transfer.source_branch_id && s.inventory_item_id === transfer.inventory_item_id) {
        return { ...s, on_hand_qty: s.on_hand_qty - transfer.qty, available_qty: s.available_qty - transfer.qty, updated_at: now };
      }
      // Add to destination
      if (s.branch_id === transfer.destination_branch_id && s.inventory_item_id === transfer.inventory_item_id) {
        return { ...s, on_hand_qty: s.on_hand_qty + transfer.qty, available_qty: s.available_qty + transfer.qty, updated_at: now };
      }
      return s;
    });

    const newMovements = [...state.inventoryMovements, outMovement, inMovement];

    return {
      stockTransfers: [transfer, ...state.stockTransfers],
      inventoryMovements: newMovements,
      inventoryStock: updatedStock,
      // Update legacy aliases
      movements: newMovements,
      inventoryTransactions: newMovements
    };
  }),
  
  recordBatchRelease: (customerId, jobOrderId, items, paymentStatus) => set((state) => {
    // 1. Deduct stock from each item in the batch
    const updatedInventory = state.inventory.map(invItem => {
      const releaseItem = items.find(i => i.sku === invItem.sku);
      if (releaseItem) {
        return { ...invItem, stock: Math.max(0, (invItem.stock || 0) - (releaseItem.stock || 0)) };
      }
      return invItem;
    });

    // 2. Log movements for each item
    const newMovements: InventoryMovement[] = items.map(item => ({
      id: `MOV-${Date.now()}-${item.sku}`,
      shop_id: 'SHOP-001',
      branch_id: 'BRN-001',
      inventory_item_id: item.id || item.sku,
      movement_type: 'ISSUE',
      qty: Math.abs(item.stock || 0),
      reference_type: 'BATCH_RELEASE',
      reference_id: jobOrderId,
      performed_by_user_id: 'STF-001',
      created_at: new Date().toISOString(),
      notes: `Batch Release to Customer ${customerId}. Payment: ${paymentStatus}`,
    }));

    // 3. (Mock) Create a job order/invoice link if needed
    // For the prototype, we just update the inventory and movements
    const allMovements = [...newMovements, ...state.inventoryMovements];
    return {
      inventory: updatedInventory,
      inventoryMovements: allMovements,
      inventoryTransactions: allMovements,
      movements: allMovements,
    };
  }),
});

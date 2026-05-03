import { create } from 'zustand';

export interface InventoryItem {
  sku: string;
  item: string;
  cat: string;
  stock: number;
  minStock: number;
  reserved: number;
  unit: string;
  price: number;
  cost: number;
  location: string;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  contact: string;
  phone: string;
  category: string;
  items: string[];
  leadTime: string;
  rating: string;
  status: string;
}

export interface POItem {
  sku: string;
  qty: number;
  cost: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  amount: number;
  items: POItem[];
  eta: string;
}

export interface StockMovement {
  id: string;
  date: string;
  type: 'Stock In' | 'Usage' | 'Stock Adjustment' | 'Production';
  itemSku: string;
  itemName: string;
  qty: number;
  unit: string;
  staff: string;
  ref: string;
}

export interface BOMRecipe {
  productId: string;
  materials: {
    sku: string;
    qty: number;
  }[];
}

interface ERPState {
  inventory: InventoryItem[];
  movements: StockMovement[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  recipes: BOMRecipe[];

  addMovement: (movement: Omit<StockMovement, 'id' | 'date'>) => void;
  receivePO: (poId: string, staff: string) => void;
  createPO: (po: Omit<PurchaseOrder, 'id'>) => void;
  addSupplier: (sup: Omit<Supplier, 'id'>) => void;
  executeAssembly: (productId: string, qty: number, staff: string) => void;
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (sku: string, updates: Partial<InventoryItem>) => void;
  saveRecipe: (recipe: BOMRecipe) => void;
}

const initialInventory: InventoryItem[] = [
  { sku: 'FAB-NAV-001', item: 'Premium Navy Wool', cat: 'Fabric', stock: 45, minStock: 20, reserved: 0, unit: 'm', price: 1200, cost: 850, location: 'Shelf A-1' },
  { sku: 'BTN-SIL-012', item: 'Metallic Silver Buttons', cat: 'Buttons', stock: 500, minStock: 100, reserved: 0, unit: 'pcs', price: 15, cost: 5, location: 'Bin B-4' },
  { sku: 'ZIP-BLK-005', item: 'YKK 8-inch Zipper', cat: 'Zipper', stock: 12, minStock: 20, reserved: 0, unit: 'pcs', price: 45, cost: 25, location: 'Bin C-2' },
  { sku: 'THR-NAV-022', item: 'Indigo Industrial Thread', cat: 'Thread', stock: 5, minStock: 10, reserved: 0, unit: 'cones', price: 120, cost: 80, location: 'Shelf D-1' },
  { sku: 'FAB-WHT-002', item: 'Oxford Cotton White', cat: 'Fabric', stock: 120, minStock: 50, reserved: 0, unit: 'm', price: 450, cost: 300, location: 'Shelf A-5' },
  { sku: 'UNF-POL-001', item: 'Police Service Uniform', cat: 'Finished Goods', stock: 15, minStock: 5, reserved: 0, unit: 'sets', price: 3500, cost: 2100, location: 'Rack 1-A' },
  { sku: 'UNF-SEC-002', item: 'Security Guard Upper', cat: 'Finished Goods', stock: 4, minStock: 10, reserved: 0, unit: 'pcs', price: 1800, cost: 950, location: 'Rack 2-B' },
  { sku: 'LBL-SUT-001', item: 'Sutura Brand Label', cat: 'Label', stock: 1000, minStock: 200, reserved: 0, unit: 'pcs', price: 2, cost: 0.5, location: 'Bin E-1' },
];

const initialRecipes: BOMRecipe[] = [
  {
    productId: 'UNF-POL-001',
    materials: [
      { sku: 'FAB-NAV-001', qty: 2.5 },
      { sku: 'BTN-SIL-012', qty: 6 },
      { sku: 'ZIP-BLK-005', qty: 1 },
      { sku: 'THR-NAV-022', qty: 0.2 },
      { sku: 'LBL-SUT-001', qty: 1 },
    ],
  },
  {
    productId: 'UNF-SEC-002',
    materials: [
      { sku: 'FAB-WHT-002', qty: 2.0 },
      { sku: 'BTN-SIL-012', qty: 4 },
      { sku: 'THR-NAV-022', qty: 0.1 },
      { sku: 'LBL-SUT-001', qty: 1 },
    ],
  }
];

const initialSuppliers: Supplier[] = [
  { 
    id: 'SUP-001',
    name: "Premium Fabrics Inc.", 
    email: "orders@premiumfabrics.com", 
    contact: "Elena Cruz", 
    phone: "+63 917 555 8888", 
    category: "Wholesale Fabrics", 
    items: ['FAB-NAV-001', 'FAB-WHT-002'],
    leadTime: '3-5 days',
    rating: "4.9",
    status: "Verified",
  },
  { 
    id: 'SUP-002',
    name: "QC Garment Supplies", 
    email: "wholesale@qcgarments.com", 
    contact: "Ricardo Santos", 
    phone: "+63 920 123 4567", 
    category: "Buttons & Zippers", 
    items: ['ZIP-BLK-005', 'BTN-SIL-012'],
    leadTime: '1-2 days',
    rating: "4.5",
    status: "Active",
  },
  { 
    id: 'SUP-003',
    name: "Textile World Manila", 
    email: "sales@textileworld.ph", 
    contact: "Maria Clara", 
    phone: "+63 918 765 4321", 
    category: "Premium Silk", 
    items: ['THR-NAV-022', 'LBL-SUT-001'],
    leadTime: '5-7 days',
    rating: "4.9",
    status: "Preferred",
  }
];

const initialPOs: PurchaseOrder[] = [
  { 
    id: 'PO-2024-001', 
    supplierId: 'SUP-001', 
    date: '2024-05-01', 
    status: 'Shipped', 
    amount: 42500, 
    items: [
      { sku: 'FAB-NAV-001', qty: 50, cost: 850 }
    ],
    eta: '2024-05-05' 
  },
  { 
    id: 'PO-2024-002', 
    supplierId: 'SUP-002', 
    date: '2024-05-02', 
    status: 'Pending', 
    amount: 12500, 
    items: [
      { sku: 'BTN-SIL-012', qty: 1000, cost: 5 },
      { sku: 'ZIP-BLK-005', qty: 300, cost: 25 }
    ],
    eta: '2024-05-07' 
  },
];

const initialMovements: StockMovement[] = [
  { id: 'MOV-1001', date: '2024-05-03 09:15 AM', type: 'Stock Adjustment', itemSku: 'FAB-WHT-002', itemName: 'Oxford Cotton White', qty: -2, unit: 'm', staff: 'Admin', ref: 'Damage' },
  { id: 'MOV-1002', date: '2024-05-02 03:00 PM', type: 'Usage', itemSku: 'BTN-SIL-012', itemName: 'Metallic Silver Buttons', qty: -6, unit: 'pcs', staff: 'Sewer', ref: 'JO-102' },
  { id: 'MOV-1003', date: '2024-05-02 02:30 PM', type: 'Usage', itemSku: 'FAB-NAV-001', itemName: 'Premium Navy Wool', qty: -2.5, unit: 'm', staff: 'Cutter', ref: 'JO-102' },
];

export const useERPStore = create<ERPState>((set, get) => ({
  inventory: initialInventory,
  movements: initialMovements,
  suppliers: initialSuppliers,
  purchaseOrders: initialPOs,
  recipes: initialRecipes,

  addMovement: (movement) => {
    set((state) => ({
      movements: [
        {
          ...movement,
          id: `MOV-${1000 + state.movements.length + 1}`,
          date: new Date().toLocaleString('en-US', { hour12: true, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
        },
        ...state.movements
      ]
    }));
  },

  receivePO: (poId, staff) => {
    set((state) => {
      const po = state.purchaseOrders.find((p) => p.id === poId);
      if (!po || po.status === 'Delivered') return state;

      const newInventory = [...state.inventory];
      const newMovements = [...state.movements];

      // Update inventory based on PO items and create movements
      po.items.forEach((item) => {
        const invIndex = newInventory.findIndex((i) => i.sku === item.sku);
        let itemName = item.sku;
        let unit = 'pcs';

        if (invIndex >= 0) {
          newInventory[invIndex] = {
            ...newInventory[invIndex],
            stock: newInventory[invIndex].stock + item.qty,
          };
          itemName = newInventory[invIndex].item;
          unit = newInventory[invIndex].unit;
        }

        newMovements.unshift({
          id: `MOV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          date: new Date().toLocaleString('en-US', { hour12: true, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
          type: 'Stock In',
          itemSku: item.sku,
          itemName,
          qty: item.qty,
          unit,
          staff,
          ref: po.id,
        });
      });

      const newPOs = state.purchaseOrders.map((p) =>
        p.id === poId ? { ...p, status: 'Delivered' as const } : p
      );

      return {
        inventory: newInventory,
        purchaseOrders: newPOs,
        movements: newMovements,
      };
    });
  },

  createPO: (po) => {
    set((state) => ({
      purchaseOrders: [
        {
          ...po,
          id: `PO-${new Date().getFullYear()}-00${state.purchaseOrders.length + 1}`,
        },
        ...state.purchaseOrders,
      ],
    }));
  },

  addSupplier: (sup) => {
    set((state) => ({
      suppliers: [
        {
          ...sup,
          id: `SUP-00${state.suppliers.length + 1}`,
        },
        ...state.suppliers,
      ],
    }));
  },

  executeAssembly: (productId, qty, staff) => {
    set((state) => {
      const recipe = state.recipes.find((r) => r.productId === productId);
      const productIndex = state.inventory.findIndex((i) => i.sku === productId);
      if (!recipe || productIndex < 0) return state;

      const newInventory = [...state.inventory];
      const newMovements = [...state.movements];

      // Deduct materials
      recipe.materials.forEach((mat) => {
        const totalNeeded = mat.qty * qty;
        const matIndex = newInventory.findIndex((i) => i.sku === mat.sku);
        if (matIndex >= 0) {
          newInventory[matIndex] = {
            ...newInventory[matIndex],
            stock: newInventory[matIndex].stock - totalNeeded,
          };
          newMovements.unshift({
            id: `MOV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            date: new Date().toLocaleString('en-US', { hour12: true, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
            type: 'Usage',
            itemSku: mat.sku,
            itemName: newInventory[matIndex].item,
            qty: -totalNeeded,
            unit: newInventory[matIndex].unit,
            staff,
            ref: `ASSEMBLY-${productId}`,
          });
        }
      });

      // Add finished product
      newInventory[productIndex] = {
        ...newInventory[productIndex],
        stock: newInventory[productIndex].stock + qty,
      };
      
      newMovements.unshift({
        id: `MOV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        date: new Date().toLocaleString('en-US', { hour12: true, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        type: 'Production',
        itemSku: productId,
        itemName: newInventory[productIndex].item,
        qty: qty,
        unit: newInventory[productIndex].unit,
        staff,
        ref: `ASSEMBLY-${productId}`,
      });

      return {
        inventory: newInventory,
        movements: newMovements,
      };
    });
  },

  addInventoryItem: (item) => {
    set((state) => ({
      inventory: [item, ...state.inventory],
    }));
  },

  updateInventoryItem: (sku, updates) => {
    set((state) => ({
      inventory: state.inventory.map((i) => (i.sku === sku ? { ...i, ...updates } : i)),
    }));
  },

  saveRecipe: (recipe) => {
    set((state) => {
      const filtered = state.recipes.filter((r) => r.productId !== recipe.productId);
      return {
        recipes: [...filtered, recipe],
      };
    });
  },
}));

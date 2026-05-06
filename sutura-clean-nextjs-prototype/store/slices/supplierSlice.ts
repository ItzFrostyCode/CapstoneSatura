import { StateCreator } from 'zustand';
import { Supplier, PurchaseOrder, PurchaseOrderItem, SupplierBill, Settlement, PaymentMethod, GoodsReceipt, GoodsReceiptItem, SupplierItem } from '@/types/erp';
import { 
  INITIAL_SUPPLIERS, INITIAL_PURCHASE_ORDERS, 
  INITIAL_PURCHASE_ORDER_ITEMS,
  INITIAL_SUPPLIER_BILLS,
  INITIAL_SETTLEMENTS,
  INITIAL_GOODS_RECEIPTS,
  INITIAL_GOODS_RECEIPT_ITEMS,
  INITIAL_SUPPLIER_ITEMS
} from '@/mocks/mockData';
import { ERPStore } from '../useERPStore';

export interface SupplierSlice {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  purchaseOrderItems: PurchaseOrderItem[];
  supplierBills: SupplierBill[];
  settlements: Settlement[];
  goodsReceipts: GoodsReceipt[];
  goodsReceiptItems: GoodsReceiptItem[];
  supplierItems: SupplierItem[];
  
  recordSettlement: (billId: string, amount: number, method: PaymentMethod, performedBy: string, ref?: string) => void;
  addSupplier: (supplier: Partial<Supplier>) => void;
  updateSupplier: (id: string, data: Partial<Supplier>) => void;
  createPO: (po: Partial<PurchaseOrder>) => void;
  recordGoodsReceipt: (receipt: Omit<GoodsReceipt, 'id'>, items: Omit<GoodsReceiptItem, 'id' | 'goods_receipt_id'>[]) => void;
  receivePO: (poId: string, userId: string) => void;
}

export const createSupplierSlice: StateCreator<ERPStore, [], [], SupplierSlice> = (set, get) => ({
  suppliers: INITIAL_SUPPLIERS,
  purchaseOrders: INITIAL_PURCHASE_ORDERS,
  purchaseOrderItems: INITIAL_PURCHASE_ORDER_ITEMS,
  supplierBills: INITIAL_SUPPLIER_BILLS,
  settlements: INITIAL_SETTLEMENTS,
  goodsReceipts: INITIAL_GOODS_RECEIPTS,
  goodsReceiptItems: INITIAL_GOODS_RECEIPT_ITEMS,
  supplierItems: INITIAL_SUPPLIER_ITEMS,
  
  recordSettlement: (billId, amount, method, performedBy, ref) => set((state) => {
    const settlement: Settlement = {
      id: `SET-${Date.now()}`,
      bill_id: billId,
      amount,
      amount_paid: amount, // Alias for legacy support
      method,
      referenceNo: ref,
      date: new Date().toISOString(),
      paid_at: new Date().toISOString(),
    };
    
    return {
      settlements: [settlement, ...state.settlements],
      supplierBills: state.supplierBills.map(b => 
        b.id === billId ? { ...b, balance: Math.max(0, b.balance - amount) } : b
      )
    };
  }),
  addSupplier: (supplier) => set((state) => ({
    suppliers: [{
      id: `SUPP-${Date.now().toString().slice(-4)}`,
      shop_id: 'SHOP-001',
      supplier_name: supplier.name || supplier.supplier_name || '',
      contact_person: supplier.contact || supplier.contact_person || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      status: supplier.status || 'Active',
      is_active: true,
      lead_time_days: 7,
      ...supplier
    } as Supplier, ...state.suppliers]
  })),
  updateSupplier: (id, data) => set((state) => ({
    suppliers: state.suppliers.map(s => s.id === id ? { ...s, ...data } : s)
  })),
  createPO: (poData) => set((state) => ({
    purchaseOrders: [{
      id: `PO-${Date.now().toString().slice(-4)}`,
      shop_id: 'SHOP-001',
      branch_id: 'BRN-001',
      status: 'SENT',
      requested_at: new Date().toISOString(),
      total_amount: poData.amount || 0,
      amount_paid: 0,
      ...poData
    } as PurchaseOrder, ...state.purchaseOrders]
  })),
  recordGoodsReceipt: (receiptData, itemsData) => set((state) => {
    const receiptId = `GR-${Date.now().toString().slice(-4)}`;
    const newReceipt: GoodsReceipt = {
      id: receiptId,
      ...receiptData
    };

    const newItems: GoodsReceiptItem[] = itemsData.map((item, idx) => ({
      id: `GRI-${Date.now()}-${idx}`,
      goods_receipt_id: receiptId,
      ...item
    }));

    // Update PO items received qty
    const updatedPOItems = state.purchaseOrderItems.map(poi => {
      const received = itemsData.find(i => i.purchase_order_item_id === poi.id);
      if (received) {
        return { ...poi, qty_received: (poi.qty_received || 0) + received.qty_received };
      }
      return poi;
    });

    // Update PO status
    const updatedPOs = state.purchaseOrders.map(po => {
      if (po.id === receiptData.purchase_order_id) {
        const poItems = updatedPOItems.filter(poi => poi.purchase_order_id === po.id);
        const allReceived = poItems.every(poi => poi.qty_received >= poi.qty_ordered);
        const someReceived = poItems.some(poi => (poi.qty_received || 0) > 0);
        return { 
          ...po, 
          status: allReceived ? 'RECEIVED' : someReceived ? 'PARTIAL_RECEIVED' : po.status 
        } as PurchaseOrder;
      }
      return po;
    });

    // Trigger inventory updates (only for non-damaged stock)
    itemsData.forEach(item => {
      const effectiveQty = item.qty_received - (item.qty_damaged || 0);
      if (effectiveQty > 0) {
        state.receiveStock(
          receiptData.branch_id,
          item.inventory_item_id,
          effectiveQty,
          item.unit_cost,
          receiptId,
          state.purchaseOrders.find(p => p.id === receiptData.purchase_order_id)?.supplier_id,
          receiptData.received_by_user_id
        );
      }
    });

    return {
      goodsReceipts: [newReceipt, ...state.goodsReceipts],
      goodsReceiptItems: [...newItems, ...state.goodsReceiptItems],
      purchaseOrderItems: updatedPOItems,
      purchaseOrders: updatedPOs
    };
  }),
  receivePO: (poId, userId) => {
    // Legacy receivePO now just calls recordGoodsReceipt for the full PO
    const state = get() as ERPStore;
    const po = state.purchaseOrders.find(p => p.id === poId);
    if (!po) return;

    const poItems = state.purchaseOrderItems.filter(poi => poi.purchase_order_id === poId);
    const receiptItems = poItems.map(poi => ({
      purchase_order_item_id: poi.id,
      inventory_item_id: poi.inventory_item_id,
      qty_received: poi.qty_ordered - (poi.qty_received || 0),
      qty_damaged: 0,
      unit_cost: poi.unit_cost
    }));

    state.recordGoodsReceipt({
      purchase_order_id: poId,
      branch_id: po.branch_id || 'BRN-001',
      received_by_user_id: userId,
      received_at: new Date().toISOString(),
      notes: 'Full receipt'
    }, receiptItems);
  },
});

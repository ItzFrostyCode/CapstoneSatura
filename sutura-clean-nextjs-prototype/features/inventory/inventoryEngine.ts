/**
 * Sutura ERP — Inventory Engine
 * Pure logic for stock calculations, reorder alerts, and value estimations.
 * Works with both legacy InventoryItem fields and new normalized InventoryStock.
 */

import { InventoryItem, InventoryStock } from '@/types/erp';

// ── Normalized: InventoryStock-based ─────────────────────────

export function computeAvailableQty(stock: InventoryStock): number {
  return Math.max(0, stock.on_hand_qty - stock.reserved_qty - stock.damaged_qty);
}

export function isReservable(stock: InventoryStock, requestedQty: number): boolean {
  return computeAvailableQty(stock) >= requestedQty;
}

export function getStockStatusFromRecord(stock: InventoryStock, reorderLevel: number) {
  if (stock.on_hand_qty <= 0) return 'OUT_OF_STOCK';
  if (stock.available_qty <= reorderLevel) return 'LOW_STOCK';
  return 'IN_STOCK';
}

// ── Legacy: InventoryItem flat-field based (backward compat) ──

export function calculateStockValue(items: InventoryItem[]) {
  return items.reduce((total, item) => {
    const qty = item.stock ?? 0;
    const price = item.unit_price ?? 0;
    return total + (qty * price);
  }, 0);
}

export function getLowStockItems(items: InventoryItem[]) {
  return items.filter(item => (item.stock ?? 0) <= item.reorder_level);
}

export function isItemAvailable(item: InventoryItem, requestedQty: number) {
  const available = (item.stock ?? 0) - (item.reserved ?? 0);
  return available >= requestedQty;
}

export function getStockStatus(item: InventoryItem) {
  const stock = item.stock ?? 0;
  if (stock <= 0) return 'OUT_OF_STOCK';
  if (stock <= item.reorder_level) return 'LOW_STOCK';
  return 'IN_STOCK';
}

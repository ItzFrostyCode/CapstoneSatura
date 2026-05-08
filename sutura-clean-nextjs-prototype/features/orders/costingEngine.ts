/**
 * Sutura ERP — Costing & Pricing Engine
 * Pure logic for resolving order financials.
 * No side effects. All functions are deterministic.
 */

import { Order, JobOrderItem, GarmentTemplate, InventoryItem, InventoryReservation } from '@/types/erp';

export interface CostingEngineInput {
  order: Partial<Order>;
  items: JobOrderItem[];
  templates: GarmentTemplate[];
  reservations: InventoryReservation[];
  inventory: InventoryItem[];
}

export interface CostingResult {
  // Pricing
  baseAmount: number;
  rushFee: number;
  customizationFee: number;
  discount: number;
  totalSellingPrice: number;
  
  // Costing
  totalBomCost: number;
  totalLaborCost: number;
  totalProductionCost: number;
  
  // Profitability
  profitMarginAmount: number;
  profitMarginPercent: number;
}

/**
 * Calculates the BOM (Bill of Materials) cost based on reservations.
 */
export function computeBomCost(
  reservations: InventoryReservation[],
  inventory: InventoryItem[]
): number {
  return reservations.reduce((total, res) => {
    const item = inventory.find(i => i.id === res.inventory_item_id);
    const unitCost = item?.unit_cost || 0;
    return total + (res.qty_reserved * unitCost);
  }, 0);
}

/**
 * Calculates labor costs based on templates used in the order items.
 * (In a fully mature system, this would sum up piece-rates from ProductionTasks).
 */
export function computeLaborCost(
  items: JobOrderItem[],
  templates: GarmentTemplate[]
): number {
  return items.reduce((total, item) => {
    const template = templates.find(t => t.id === item.garment_template_id);
    const labor = template?.estimated_labor_cost || 0;
    return total + (labor * item.quantity);
  }, 0);
}

/**
 * Master resolver for all costing and pricing financials for an order.
 */
export function resolveOrderFinancials(input: CostingEngineInput): CostingResult {
  const { order, items, templates, reservations, inventory } = input;

  // 1. Calculate Costs (COGS)
  const totalBomCost = computeBomCost(reservations, inventory);
  const totalLaborCost = computeLaborCost(items, templates);
  const totalProductionCost = totalBomCost + totalLaborCost;

  // 2. Calculate Pricing Elements
  const baseAmount = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
  
  // Rush fee logic (e.g. 20% markup if Urgent)
  let rushFee = order.rush_fee || 0;
  if (order.priority === 'Urgent' && rushFee === 0) {
    rushFee = baseAmount * 0.20; // Default 20% surcharge
  }

  const customizationFee = order.customization_fee || 0;
  const discount = order.discount || 0;

  // 3. Final Selling Price
  const totalSellingPrice = (baseAmount + rushFee + customizationFee) - discount;

  // 4. Profitability
  const profitMarginAmount = totalSellingPrice - totalProductionCost;
  const profitMarginPercent = totalSellingPrice > 0 
    ? (profitMarginAmount / totalSellingPrice) * 100 
    : 0;

  return {
    baseAmount,
    rushFee,
    customizationFee,
    discount,
    totalSellingPrice,
    totalBomCost,
    totalLaborCost,
    totalProductionCost,
    profitMarginAmount,
    profitMarginPercent: Number(profitMarginPercent.toFixed(2))
  };
}

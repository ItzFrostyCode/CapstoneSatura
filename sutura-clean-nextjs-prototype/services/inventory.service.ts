import { useERPStore } from '@/store/useERPStore';
import { getLowStockItems, calculateStockValue } from '@/features/inventory/inventoryEngine';

export const InventoryService = {
  getInventoryStats() {
    const { inventory } = useERPStore.getState();
    return {
      totalValue: calculateStockValue(inventory),
      lowStockCount: getLowStockItems(inventory).length,
      outOfStockCount: inventory.filter(i => i.stock === 0).length,
    };
  }
};

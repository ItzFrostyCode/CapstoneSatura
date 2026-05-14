'use server';

import prisma from '@/lib/prisma';
import { MovementType, ItemType, InventoryStatus } from '@/types/erp';
import { revalidatePath } from 'next/cache';

/**
 * Fetches the inventory catalog with per-branch stock counts.
 */
export async function getInventory(shopId: string) {
  try {
    const items = await prisma.inventoryItem.findMany({
      where: { shopId },
      include: {
        branchInventory: true,
      }
    });
    return { success: true, data: items };
  } catch (error) {
    console.error('Failed to fetch inventory:', error);
    return { success: false, error: 'Failed to fetch inventory' };
  }
}

/**
 * Records a stock movement and updates the branch inventory balance.
 */
export async function recordStockMovement(data: {
  branchId: string;
  inventoryItemId: string;
  movementType: MovementType;
  quantity: number;
  userId: string;
  referenceType?: string;
  referenceId?: string;
  notes?: string;
}) {
  try {
    // 1. Create the movement record (audit trail)
    // Map domain MovementType to Prisma MovementType
    const prismaMovementType = 
      data.movementType === 'RECEIVE' || data.movementType === 'ADJUSTMENT_IN' || data.movementType === 'TRANSFER_IN' ? 'IN' :
      data.movementType === 'RESERVE' ? 'RESERVE' :
      data.movementType === 'RELEASE' ? 'RELEASE' :
      data.movementType === 'PRODUCTION' ? 'OUT' : 'OUT'; // Default to OUT for ISSUE, TRANSFER_OUT, etc.

    const movement = await prisma.inventoryMovement.create({
      data: {
        branchId: data.branchId,
        inventoryItemId: data.inventoryItemId,
        movementType: prismaMovementType as any, // Cast to any to avoid Prisma enum mismatch if they diverged
        quantity: data.quantity,
        movedByUserId: data.userId,
        referenceType: data.referenceType,
        referenceId: data.referenceId,
      }
    });

    // 2. Update the branch inventory balance
    const multiplier = (data.movementType === 'RECEIVE' || data.movementType === 'ADJUSTMENT_IN' || data.movementType === 'TRANSFER_IN') ? 1 : -1;
    const change = data.quantity * multiplier;

    await prisma.branchInventory.upsert({
      where: {
        branchId_inventoryItemId: {
          branchId: data.branchId,
          inventoryItemId: data.inventoryItemId
        }
      },
      update: {
        onHandQty: { increment: change },
        availableQty: { increment: change },
      },
      create: {
        branchId: data.branchId,
        inventoryItemId: data.inventoryItemId,
        onHandQty: data.quantity,
        reservedQty: 0,
        availableQty: data.quantity,
      }
    });

    revalidatePath('/owner/inventory');
    revalidatePath('/owner/supply-chain');
    return { success: true, data: movement };
  } catch (error) {
    console.error('Stock movement failed:', error);
    return { success: false, error: 'Failed to record stock movement' };
  }
}

'use server';

import prisma from '@/lib/prisma';
import { Order, OrderStatus, Priority, OrderType, SourceType } from '@/types/erp';
import { revalidatePath } from 'next/cache';

/**
 * ActionResult interface for consistent response handling
 */
export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Fetches all orders with their items, tasks, history, and invoices joined.
 * Used for the owner and staff portals.
 */
export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        tasks: true,
        history: {
          orderBy: { changedAt: 'desc' }
        },
        invoice: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: orders };
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return { success: false, error: 'Failed to fetch orders' };
  }
}

/**
 * Creates a new order with items and initial status log.
 */
export async function createOrder(data: {
  shopId: string;
  branchId: string;
  customerId: string;
  creatorId: string;
  orderType: OrderType;
  sourceType: SourceType;
  items: Array<{
    garmentName: string;
    quantity: number;
    unitPrice: number;
  }>;
  dueDate: string;
  totalAmount: number;
  notes?: string;
}) {
  try {
    const order = await prisma.order.create({
      data: {
        shopId: data.shopId,
        branchId: data.branchId,
        customerId: data.customerId,
        createdByUserId: data.creatorId,
        orderType: data.orderType,
        sourceType: data.sourceType,
        totalAmount: data.totalAmount,
        dueDate: new Date(data.dueDate),
        status: 'PENDING',
        notes: data.notes,
        items: {
          create: data.items.map(item => ({
            garmentName: item.garmentName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          }))
        },
        history: {
          create: {
            status: 'PENDING',
            changedByUserId: data.creatorId,
            notes: 'Order initialized via system.'
          }
        }
      },
      include: {
        items: true,
        history: true
      }
    });

    revalidatePath('/owner/orders');
    revalidatePath('/owner/production');
    revalidatePath('/customer/dashboard');
    return { success: true, data: order };
  } catch (error) {
    console.error('Order creation failed:', error);
    return { success: false, error: 'Failed to create order' };
  }
}

/**
 * Updates an order status and logs the history.
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus, userId: string, notes?: string) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        history: {
          create: {
            status,
            changedByUserId: userId,
            notes: notes || `Status updated to ${status}`
          }
        }
      }
    });

    revalidatePath('/owner/production');
    revalidatePath('/owner/orders');
    revalidatePath('/staff/tasks');
    revalidatePath('/customer/dashboard');
    return { success: true, data: order };
  } catch (error) {
    console.error('Status update failed:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

/**
 * Assigns staff to an order.
 */
export async function assignStaffToOrder(orderId: string, staffId: string, userId: string) {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        assignedStaffId: staffId,
        history: {
          create: {
            status: 'IN_PRODUCTION', // Automatically move to in production if assigned?
            changedByUserId: userId,
            notes: `Assigned to staff ID: ${staffId}`
          }
        }
      }
    });

    revalidatePath('/owner/orders');
    revalidatePath('/staff/tasks');
    return { success: true, data: order };
  } catch (error) {
    console.error('Staff assignment failed:', error);
    return { success: false, error: 'Failed to assign staff' };
  }
}

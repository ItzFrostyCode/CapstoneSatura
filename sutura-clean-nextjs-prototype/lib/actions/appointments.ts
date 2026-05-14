'use server';

import prisma from '@/lib/prisma';
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
 * Fetches all appointments for a shop with their associated users.
 */
export async function getAppointments(shopId: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { shopId },
      include: {
        customer: true,
        staff: true,
        order: true,
      },
      orderBy: { date: 'asc' }
    });
    return { success: true, data: appointments };
  } catch (error) {
    console.error('Failed to fetch appointments:', error);
    return { success: false, error: 'Failed to fetch appointments' };
  }
}

/**
 * Books a new appointment.
 */
export async function bookAppointment(data: {
  shopId: string;
  branchId: string;
  customerId: string;
  staffId?: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  type: string;
  category: string;
  notes?: string;
  orderId?: string;
}) {
  try {
    const appointment = await prisma.appointment.create({
      data: {
        shopId: data.shopId,
        branchId: data.branchId,
        customerId: data.customerId,
        staffId: data.staffId,
        orderId: data.orderId,
        date: new Date(data.date),
        startTime: data.startTime,
        duration: data.durationMinutes,
        type: data.type,
        category: data.category,
        notes: data.notes,
        status: 'PENDING_REVIEW'
      }
    });

    revalidatePath('/owner/appointments');
    revalidatePath('/customer/dashboard');
    return { success: true, data: appointment };
  } catch (error) {
    console.error('Appointment creation failed:', error);
    return { success: false, error: 'Failed to create appointment' };
  }
}

/**
 * Confirms a pending appointment.
 */
export async function confirmAppointment(appointmentId: string, userId: string) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: 'SCHEDULED' }
    });

    revalidatePath('/owner/appointments');
    revalidatePath('/customer/dashboard');
    return { success: true, data: appointment };
  } catch (error) {
    console.error('Appointment confirmation failed:', error);
    return { success: false, error: 'Failed to confirm appointment' };
  }
}

/**
 * Cancels an appointment.
 */
export async function cancelAppointment(appointmentId: string, reason: string, userId: string) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { 
        status: 'CANCELLED',
        notes: reason 
      }
    });

    revalidatePath('/owner/appointments');
    revalidatePath('/customer/dashboard');
    return { success: true, data: appointment };
  } catch (error) {
    console.error('Appointment cancellation failed:', error);
    return { success: false, error: 'Failed to cancel appointment' };
  }
}

/**
 * Marks an appointment as completed.
 */
export async function completeAppointment(appointmentId: string, notes?: string) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { 
        status: 'COMPLETED',
        notes: notes 
      }
    });

    revalidatePath('/owner/appointments');
    revalidatePath('/customer/dashboard');
    return { success: true, data: appointment };
  } catch (error) {
    console.error('Appointment completion failed:', error);
    return { success: false, error: 'Failed to complete appointment' };
  }
}

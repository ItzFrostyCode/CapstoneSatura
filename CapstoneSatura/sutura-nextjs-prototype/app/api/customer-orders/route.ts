import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, designId, sizeType, bodyMeasurements, appointmentDate } = body;

    // Validate Input
    if (!customerName || !designId || !sizeType || !appointmentDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (sizeType === 'custom' && !bodyMeasurements) {
      return NextResponse.json({ error: 'Custom sizing requires body measurements' }, { status: 400 });
    }

    const orders = await readData('customer_orders');
    const appointments = await readData('appointments');

    // Save Order
    const newOrder = {
      id: crypto.randomUUID(),
      customerName,
      designId,
      sizeType,
      bodyMeasurements: sizeType === 'custom' ? bodyMeasurements : null,
      status: 'processing',
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    await writeData('customer_orders', orders);

    // Save Appointment for Pickup/Fitting
    const newAppointment = {
      id: crypto.randomUUID(),
      orderId: newOrder.id,
      customerName,
      date: appointmentDate,
      type: 'pickup_or_fitting',
      status: 'scheduled'
    };
    appointments.push(newAppointment);
    await writeData('appointments', appointments);

    // Confirm Save & Display Status
    return NextResponse.json({ message: 'Order placed successfully. Appointment confirmed for pickup.', orderId: newOrder.id }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('id');

  const orders = await readData('customer_orders');
  
  if (orderId) {
    const order = orders.find((o: { id: string }) => o.id === orderId);
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json(order);
  }

  return NextResponse.json(orders);
}

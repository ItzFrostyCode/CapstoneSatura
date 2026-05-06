import { NextResponse } from 'next/server';
import { readData, writeData } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessName, ownerName, email, password, subscriptionPlan } = body;

    // Validate Input
    if (!businessName || !ownerName || !email || !password || !subscriptionPlan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const users = await readData('users');

    // Check if email exists
    if (users.find((u: { email: string }) => u.email === email)) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Save Registration (Pending Admin Approval)
    const newUser = {
      id: crypto.randomUUID(),
      businessName,
      ownerName,
      email,
      password, // In a real app, hash this
      subscriptionPlan,
      role: 'shop_owner',
      status: 'pending_approval',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeData('users', users);

    // Confirm Save
    return NextResponse.json({ message: 'Registration submitted successfully. Pending Admin Approval.', user: { id: newUser.id, email: newUser.email } }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

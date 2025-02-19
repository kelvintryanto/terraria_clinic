import {
  createCustomer,
  Customer,
  getAllCustomers,
} from '@/app/models/customer';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const customers = await getAllCustomers();
    return NextResponse.json(customers);
  } catch (error: unknown) {
    console.error('Failed to fetch customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body, 'body di route');

    const result = await createCustomer(body as Customer);
    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to create customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}

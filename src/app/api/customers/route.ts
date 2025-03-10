import { withCreateCustomerAccess } from '@/app/api/middleware';
import redis from '@/app/config/redis';
import { createCustomer, getAllCustomers } from '@/app/models/customer';
import { NextRequest, NextResponse } from 'next/server';

// GET: List all customers (requires authentication)
export async function GET() {
  try {
    const customers = await getAllCustomers();

    const cachedCustomers = await redis.get('customers');

    if (cachedCustomers) {
      return NextResponse.json(JSON.parse(cachedCustomers));
    }

    await redis.set('customers', JSON.stringify(customers));

    return NextResponse.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST: Create a new customer (requires CMS access - admin or super_admin)
export async function POST(request: NextRequest) {
  return withCreateCustomerAccess(request, async () => {
    try {
      const data = await request.json();

      await redis.del('customers');

      const result = await createCustomer(data);
      return NextResponse.json(result);
    } catch (error) {
      console.error('Error creating customer:', error);
      return NextResponse.json(
        { error: 'Failed to create customer' },
        { status: 500 }
      );
    }
  });
}

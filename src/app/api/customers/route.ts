import { withAuth, withCmsAccess } from '@/app/api/middleware';
import redis from '@/app/config/redis';
import { createCustomer, getAllCustomers } from '@/app/models/customer';
import { NextRequest, NextResponse } from 'next/server';

// GET: List all customers (requires authentication)
export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    try {
      const cachedCustomers = await redis.get('customers');

      if (cachedCustomers) {
        return NextResponse.json(JSON.parse(cachedCustomers));
      }

      const customers = await getAllCustomers();

      await redis.set('customers', JSON.stringify(customers));

      return NextResponse.json(customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch customers' },
        { status: 500 }
      );
    }
  });
}

// POST: Create a new customer (requires CMS access - admin or super_admin)
export async function POST(request: NextRequest) {
  return withCmsAccess(request, async () => {
    try {
      const body = await request.json();

      // Validate required fields
      if (!body.name || !body.email || !body.phone || !body.address) {
        return NextResponse.json(
          { error: 'Name, email, phone, and address are required' },
          { status: 400 }
        );
      }

      // Add joinDate if not provided
      if (!body.joinDate) {
        body.joinDate = new Date().toISOString();
      }

      // Initialize empty dogs array if not provided
      if (!body.dogs) {
        body.dogs = [];
      }

      await redis.del('customers');

      const result = await createCustomer(body);

      return NextResponse.json({
        success: true,
        message: 'Customer created successfully',
        customerId: result.insertedId,
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      return NextResponse.json(
        { error: 'Failed to create customer' },
        { status: 500 }
      );
    }
  });
}
